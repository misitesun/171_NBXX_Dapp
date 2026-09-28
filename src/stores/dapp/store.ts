import { create } from 'zustand'

import { DAPP_PROVIDER_STATUS } from '../../services/dapp/config.ts'
import {
    getWalletAddress,
    removeWalletAddress,
    setWalletAddress,
} from '../../services/storage/common.ts'
import type { DappStoreState } from './types.ts'

export const useDappStore = create<DappStoreState>()((set) => ({
    providerStatus: DAPP_PROVIDER_STATUS.checking,
    walletAddress: getWalletAddress(),
    chainId: undefined,
    dappLoading: false,
    setProviderStatus: (providerStatus) => set({ providerStatus }),
    setWalletAddress: (walletAddress) => {
        setWalletAddress(walletAddress)
        set({ walletAddress })
    },
    clearWalletAddress: () => {
        removeWalletAddress()
        set({ walletAddress: '' })
    },
    setChainId: (chainId) => set({ chainId }),
    setDappLoading: (dappLoading) => set({ dappLoading }),
    resetDappState: () => {
        removeWalletAddress()
        set({
            providerStatus: DAPP_PROVIDER_STATUS.checking,
            walletAddress: '',
            chainId: undefined,
            dappLoading: false,
        })
    },
}))
