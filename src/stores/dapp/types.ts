import type { DappProviderStatus } from '../../services/dapp/config.ts'

export interface DappStoreState {
    providerStatus: DappProviderStatus
    walletAddress: string
    chainId?: number
    dappLoading: boolean
    setProviderStatus: (providerStatus: DappProviderStatus) => void
    setWalletAddress: (walletAddress: string) => void
    clearWalletAddress: () => void
    setChainId: (chainId: number | undefined) => void
    setDappLoading: (dappLoading: boolean) => void
    resetDappState: () => void
}
