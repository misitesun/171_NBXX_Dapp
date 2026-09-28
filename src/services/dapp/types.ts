import type {
    Abi,
    Address,
    Chain,
    Hash,
    TransactionReceipt,
} from 'viem'

export type DappEthereumProvider = NonNullable<Window['ethereum']>

export interface DappWalletConnection {
    address: Address
    chainId?: number
}

export interface DappSignResult {
    signature: Hash
    message: string
}

export interface DappEnsureChainOptions {
    skipInDevelopment?: boolean
}

export interface DappInitializeWalletOptions {
    skipChainInDevelopment?: boolean
    attachListeners?: boolean
}

export interface DappWalletListenerOptions {
    onAccountsChanged?: (address: Address | undefined) => void
    onChainChanged?: (chainId: number | undefined) => void
}

export interface DappContractBaseParams<TAbi extends Abi = Abi> {
    address: Address
    abi: TAbi
    functionName: string
    args?: readonly unknown[]
}

export interface DappContractReadOptions {
    account?: Address
}

export interface DappContractReadParams<TAbi extends Abi = Abi>
    extends DappContractBaseParams<TAbi>,
        DappContractReadOptions {}

export interface DappContractWriteOptions {
    gas?: bigint
    gasPrice?: bigint
    value?: bigint
}

export interface DappContractWriteParams<TAbi extends Abi = Abi>
    extends DappContractBaseParams<TAbi>,
        DappContractWriteOptions {}

export interface DappContractActions {
    read<TResult = unknown>(
        functionName: string,
        args?: readonly unknown[],
        options?: DappContractReadOptions,
    ): Promise<TResult>
    write(
        functionName: string,
        args?: readonly unknown[],
        options?: DappContractWriteOptions,
    ): Promise<TransactionReceipt>
    writeWithGas(
        functionName: string,
        args?: readonly unknown[],
        options?: Omit<DappContractWriteOptions, 'gas'>,
    ): Promise<TransactionReceipt>
    estimateGas(
        functionName: string,
        args?: readonly unknown[],
    ): Promise<bigint>
}

export interface DappBatchCall<TAbi extends Abi = Abi> {
    to: Address
    abi: TAbi
    functionName: string
    args?: readonly unknown[]
    value?: `0x${string}`
}

export interface DappBatchOptions {
    chain?: Chain
    from?: Address
    atomicRequired?: boolean
}
