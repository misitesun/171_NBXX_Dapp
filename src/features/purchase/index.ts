import {
    DAPP_CURRENT_CHAIN, checkErc20Balance, getErc20ApproveAmount, readErc20Allowance, writeErc20Approve,
    formatDappAmountUnits, getConnectedDappAddress, getDappChainId, readErc20Decimals,
} from '@/services/dapp'
import { getNbxxContractAddresses, readNbxxNodeHasPurchased, readNbxxNodePrices, readNbxxNodeUsdt, writeNbxxNodeBuy } from '@/services/contracts'
import { getAuthRequestSignal } from '@/features/auth/session.ts'
import { useAuthStore } from '@/stores/auth/store.ts'
import { useDappStore } from '@/stores/dapp'

export type PurchaseTier = 'basic' | 'premium'
export interface PurchasePrices { basic: string; premium: string }

// Mapping explicitly confirmed by the developer, not inferred from the ABI.
const NODE_TYPE = { basic: 1, premium: 2 } as const
let purchaseInProgress = false

async function assertPurchaseNetwork(): Promise<void> {
    // Reuse the project's configured local/production chain; no implicit wallet switch.
    if (await getDappChainId() !== DAPP_CURRENT_CHAIN.id) throw new Error('purchase.wrongNetwork')
}

async function readPurchaseConfig() {
    const addresses = getNbxxContractAddresses()
    await assertPurchaseNetwork()
    const [prices, paymentToken, decimals] = await Promise.all([
        readNbxxNodePrices(addresses.node), readNbxxNodeUsdt(addresses.node), readErc20Decimals(addresses.usdt),
    ])
    if (paymentToken.toLowerCase() !== addresses.usdt.toLowerCase()) throw new Error('purchase.tokenMismatch')
    return { ...addresses, prices, decimals }
}

export async function getPurchasePrices(): Promise<PurchasePrices> {
    const { prices, decimals } = await readPurchaseConfig()
    return {
        basic: formatDappAmountUnits(prices.type1, { decimals }),
        premium: formatDappAmountUnits(prices.type2, { decimals }),
    }
}

export function getHasPurchased(owner: `0x${string}`): Promise<boolean> {
    return readNbxxNodeHasPurchased(owner)
}

export async function purchaseNft(tier: PurchaseTier): Promise<void> {
    if (purchaseInProgress) throw new Error('purchase.busy')
    if (tier !== 'basic' && tier !== 'premium') throw new Error('purchase.unavailable')
    purchaseInProgress = true
    const signal = getAuthRequestSignal()
    const owner = useDappStore.getState().walletAddress
    const assertSession = () => {
        if (signal.aborted || useAuthStore.getState().status !== 'signedIn'
            || !owner || owner.toLowerCase() !== useDappStore.getState().walletAddress.toLowerCase()) {
            throw new Error('auth.sessionChanged')
        }
    }
    const assertWallet = async () => {
        assertSession()
        const address = await getConnectedDappAddress()
        assertSession()
        if (address.toLowerCase() !== owner.toLowerCase()) throw new Error('auth.sessionChanged')
        await assertPurchaseNetwork()
        assertSession()
    }
    try {
        await assertWallet()
        const { node, usdt, prices } = await readPurchaseConfig()
        if (await readNbxxNodeHasPurchased(owner as `0x${string}`, node)) throw new Error('purchase.alreadyPurchased')
        await assertWallet()
        // Raw uint256 stays bigint. Display prices never become transaction inputs.
        const amount = tier === 'basic' ? prices.type1 : prices.type2
        await checkErc20Balance(amount, usdt, owner as `0x${string}`)
        await assertWallet()
        const allowance = await readErc20Allowance(node, usdt, owner as `0x${string}`)
        await assertWallet()
        if (allowance < amount) await writeErc20Approve(node, getErc20ApproveAmount(amount), usdt)
        await assertWallet()
        // Shared write waits for a successful receipt before resolving.
        await writeNbxxNodeBuy(NODE_TYPE[tier], node)
    } finally {
        purchaseInProgress = false
    }
}
