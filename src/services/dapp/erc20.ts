import type {
    Address,
    TransactionReceipt,
} from 'viem'

import { getWalletAddress } from '../storage/common.ts'
import {
    DAPP_ERROR_MESSAGE,
    getErc20ApproveAmount,
} from './config.ts'
import {
    createDappContractActions,
    readDappContract,
} from './contract.ts'
import { getConnectedDappAddress } from './wallet.ts'

export const ERC20_ABI = [
    {
        type: 'function',
        name: 'name',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
    },
    {
        type: 'function',
        name: 'symbol',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
    },
    {
        type: 'function',
        name: 'decimals',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
    },
    {
        type: 'function',
        name: 'totalSupply',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'allowance',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        type: 'function',
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
] as const

export function getErc20Address(tokenAddress: Address | undefined): Address {
    if (!tokenAddress) {
        throw new Error(DAPP_ERROR_MESSAGE.tokenAddressUnavailable)
    }

    return tokenAddress
}

export async function getErc20OwnerAddress(owner?: Address): Promise<Address> {
    const storedWalletAddress = getWalletAddress()

    if (owner) return owner
    if (storedWalletAddress) return storedWalletAddress as Address
    return getConnectedDappAddress()
}

export async function readErc20Name(tokenAddress: Address): Promise<string> {
    return readDappContract<string>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'name',
    })
}

export async function readErc20Symbol(tokenAddress: Address): Promise<string> {
    return readDappContract<string>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'symbol',
    })
}

export async function readErc20Decimals(tokenAddress: Address): Promise<number> {
    return readDappContract<number>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'decimals',
    })
}

export async function readErc20TotalSupply(tokenAddress: Address): Promise<bigint> {
    return readDappContract<bigint>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'totalSupply',
    })
}

export async function readErc20Balance(
    tokenAddress: Address,
    owner?: Address,
): Promise<bigint> {
    return readDappContract<bigint>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [await getErc20OwnerAddress(owner)],
    })
}

export async function readErc20Allowance(
    spender: Address,
    tokenAddress: Address,
    owner?: Address,
): Promise<bigint> {
    return readDappContract<bigint>({
        address: getErc20Address(tokenAddress),
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [await getErc20OwnerAddress(owner), spender],
    })
}

export async function checkErc20Balance(
    amount: bigint,
    tokenAddress: Address,
    owner?: Address,
): Promise<void> {
    const balance = await readErc20Balance(tokenAddress, owner)

    if (balance < amount) {
        throw new Error(DAPP_ERROR_MESSAGE.erc20BalanceInsufficient)
    }
}

export async function writeErc20Approve(
    spender: Address,
    amount: bigint,
    tokenAddress: Address,
): Promise<TransactionReceipt> {
    const contract = createDappContractActions(getErc20Address(tokenAddress), ERC20_ABI)
    return contract.writeWithGas('approve', [spender, amount])
}

export async function ensureErc20Allowance(
    spender: Address,
    amount: bigint,
    tokenAddress: Address,
    owner?: Address,
): Promise<TransactionReceipt | undefined> {
    const allowance = await readErc20Allowance(spender, tokenAddress, owner)

    if (allowance >= amount) return undefined

    const approveAmount = getErc20ApproveAmount(amount)
    return writeErc20Approve(spender, approveAmount, tokenAddress)
}

export async function writeErc20Transfer(
    to: Address,
    amount: bigint,
    tokenAddress: Address,
): Promise<TransactionReceipt> {
    await checkErc20Balance(amount, tokenAddress)

    const contract = createDappContractActions(getErc20Address(tokenAddress), ERC20_ABI)
    return contract.writeWithGas('transfer', [to, amount])
}

export async function writeErc20TransferFrom(
    from: Address,
    to: Address,
    amount: bigint,
    tokenAddress: Address,
): Promise<TransactionReceipt> {
    const contract = createDappContractActions(getErc20Address(tokenAddress), ERC20_ABI)
    return contract.writeWithGas('transferFrom', [from, to, amount])
}

export function createErc20Actions(tokenAddress: Address) {
    const address = getErc20Address(tokenAddress)

    return {
        readName() {
            return readErc20Name(address)
        },
        readSymbol() {
            return readErc20Symbol(address)
        },
        readDecimals() {
            return readErc20Decimals(address)
        },
        readTotalSupply() {
            return readErc20TotalSupply(address)
        },
        readBalanceOf(owner?: Address) {
            return readErc20Balance(address, owner)
        },
        readAllowance(spender: Address, owner?: Address) {
            return readErc20Allowance(spender, address, owner)
        },
        async checkBalance(amount: bigint, owner?: Address) {
            await checkErc20Balance(amount, address, owner)
        },
        ensureAllowance(spender: Address, amount: bigint, owner?: Address) {
            return ensureErc20Allowance(spender, amount, address, owner)
        },
        writeTransfer(to: Address, amount: bigint) {
            return writeErc20Transfer(to, amount, address)
        },
        writeApprove(spender: Address, amount: bigint) {
            return writeErc20Approve(spender, amount, address)
        },
        writeTransferFrom(from: Address, to: Address, amount: bigint) {
            return writeErc20TransferFrom(from, to, amount, address)
        },
    }
}
