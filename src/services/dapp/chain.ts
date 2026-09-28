import type { Chain } from 'viem'

import { DAPP_CURRENT_CHAIN } from './config.ts'
import {
    clearControlledDappChainChange,
    markControlledDappChainChange,
} from './listenerGuard.ts'
import { getDappProvider } from './provider.ts'
import type { DappEnsureChainOptions } from './types.ts'

function toHexChainId(chainId: number): `0x${string}` {
    return `0x${chainId.toString(16)}`
}

function parseDappChainId(chainId: unknown): number | undefined {
    if (typeof chainId === 'number' && Number.isFinite(chainId)) return chainId
    if (typeof chainId !== 'string') return undefined
    if (!chainId) return undefined

    const parsed = chainId.startsWith('0x')
        ? Number.parseInt(chainId, 16)
        : Number(chainId)

    return Number.isFinite(parsed) ? parsed : undefined
}

function getProviderErrorCode(error: unknown): number | string | undefined {
    if (!error || typeof error !== 'object') return undefined
    return (error as { code?: number | string }).code
}

export async function getDappChainId(): Promise<number | undefined> {
    const chainId = await getDappProvider().request({ method: 'eth_chainId' })
    return parseDappChainId(chainId)
}

export async function addDappChain(chain: Chain = DAPP_CURRENT_CHAIN): Promise<void> {
    const rpcUrl = chain.rpcUrls.default.http[0]
    const blockExplorerUrl = chain.blockExplorers?.default.url

    await getDappProvider().request({
        method: 'wallet_addEthereumChain',
        params: [{
            chainId: toHexChainId(chain.id),
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [rpcUrl],
            blockExplorerUrls: blockExplorerUrl ? [blockExplorerUrl] : undefined,
        }],
    })
}

export async function switchDappChain(chain: Chain = DAPP_CURRENT_CHAIN): Promise<void> {
    const isControlledChange = markControlledDappChainChange(chain.id)

    try {
        await getDappProvider().request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHexChainId(chain.id) }],
        })
    } catch (error) {
        if (isControlledChange) {
            clearControlledDappChainChange()
        }

        throw error
    }
}

export async function ensureDappChain(
    chain: Chain = DAPP_CURRENT_CHAIN,
    options: DappEnsureChainOptions = {},
): Promise<boolean> {
    if (options.skipInDevelopment !== false && !import.meta.env?.PROD) {
        return true
    }

    const currentChainId = await getDappChainId()

    if (currentChainId === chain.id) {
        return true
    }

    try {
        await switchDappChain(chain)
        return true
    } catch (error) {
        if (getProviderErrorCode(error) !== 4902) throw error
        await addDappChain(chain)
        await switchDappChain(chain)
        return true
    }
}
