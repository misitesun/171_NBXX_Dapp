import type { Address } from 'viem'

import { useDappStore } from '../../stores/dapp/store.ts'
import {
    DAPP_CURRENT_CHAIN,
    DAPP_ERROR_MESSAGE,
    DAPP_PROVIDER_STATUS,
} from './config.ts'
import {
    ensureDappChain,
    getDappChainId,
} from './chain.ts'
import {
    consumeControlledDappChainChange,
    setDappWalletListenerActive,
} from './listenerGuard.ts'
import {
    detectDappProvider,
    getDappProvider,
    getDappWalletClient,
    resetDappProviderCache,
} from './provider.ts'
import type {
    DappEthereumProvider,
    DappInitializeWalletOptions,
    DappSignResult,
    DappWalletListenerOptions,
    DappWalletConnection,
} from './types.ts'

function normalizeAddress(address: Address | undefined): Address {
    if (!address) throw new Error(DAPP_ERROR_MESSAGE.walletAddressUnavailable)
    return address
}

function getListenerRemover(provider: DappEthereumProvider) {
    return provider.removeListener ?? provider.off
}

let removeDappWalletListeners: (() => void) | undefined

function parseDappChainId(chainId: unknown): number | undefined {
    if (typeof chainId === 'number' && Number.isFinite(chainId)) return chainId
    if (typeof chainId !== 'string' || !chainId) return undefined

    const parsed = chainId.startsWith('0x')
        ? Number.parseInt(chainId, 16)
        : Number(chainId)

    return Number.isFinite(parsed) ? parsed : undefined
}

export async function detectDappWallet(): Promise<boolean> {
    useDappStore.getState().setProviderStatus(DAPP_PROVIDER_STATUS.checking)

    const provider = await detectDappProvider()
    const providerStatus = provider
        ? DAPP_PROVIDER_STATUS.available
        : DAPP_PROVIDER_STATUS.unavailable

    useDappStore.getState().setProviderStatus(providerStatus)
    return Boolean(provider)
}

export async function initializeDappWallet(
    options: DappInitializeWalletOptions = {},
): Promise<boolean> {
    const hasProvider = await detectDappWallet()

    if (!hasProvider) return false

    const chainId = await getDappChainId()
    useDappStore.getState().setChainId(chainId)

    await ensureDappChain(DAPP_CURRENT_CHAIN, {
        skipInDevelopment: options.skipChainInDevelopment,
    })

    if (options.skipChainInDevelopment === false || import.meta.env?.PROD) {
        useDappStore.getState().setChainId(DAPP_CURRENT_CHAIN.id)
    }

    if (options.attachListeners === true) {
        startDappWalletListeners()
    }

    return true
}

export async function getConnectedDappAddress(): Promise<Address> {
    const walletClient = getDappWalletClient()
    const [address] = await walletClient.getAddresses()

    if (address) return address

    const [requestedAddress] = await walletClient.requestAddresses()
    return normalizeAddress(requestedAddress)
}

export async function connectDappWallet(): Promise<DappWalletConnection> {
    const address = await getConnectedDappAddress()
    const chainId = await getDappChainId()

    useDappStore.getState().setProviderStatus(DAPP_PROVIDER_STATUS.available)
    useDappStore.getState().setWalletAddress(address)
    useDappStore.getState().setChainId(chainId)

    return { address, chainId }
}

export function disconnectDappWallet(): void {
    useDappStore.getState().clearWalletAddress()
    useDappStore.getState().setChainId(undefined)
    stopDappWalletListeners()
    resetDappProviderCache()
}

export async function signDappMessage(
    message: string,
): Promise<DappSignResult> {
    const walletClient = getDappWalletClient()
    const address = await getConnectedDappAddress()
    const signature = await walletClient.signMessage({
        account: address,
        message,
    })

    return {
        signature,
        message,
    }
}

export function stopDappWalletListeners(): void {
    removeDappWalletListeners?.()
    removeDappWalletListeners = undefined
    setDappWalletListenerActive(false)
}

export function startDappWalletListeners(
    options: DappWalletListenerOptions = {},
): () => void {
    stopDappWalletListeners()

    const provider = getDappProvider()

    const handleAccountsChanged = (accounts: unknown) => {
        const [address] = Array.isArray(accounts) ? accounts : []

        if (typeof address === 'string' && address) {
            useDappStore.getState().setWalletAddress(address as Address)
            options.onAccountsChanged?.(address as Address)
            return
        }

        useDappStore.getState().clearWalletAddress()
        options.onAccountsChanged?.(undefined)
    }

    const handleChainChanged = (chainId: unknown) => {
        const parsedChainId = parseDappChainId(chainId)

        useDappStore.getState().setChainId(
            parsedChainId,
        )

        if (consumeControlledDappChainChange(parsedChainId)) return

        options.onChainChanged?.(parsedChainId)
    }

    provider.on?.('accountsChanged', handleAccountsChanged)
    provider.on?.('chainChanged', handleChainChanged)

    const removeListeners = () => {
        const removeListener = getListenerRemover(provider)
        removeListener?.call(provider, 'accountsChanged', handleAccountsChanged)
        removeListener?.call(provider, 'chainChanged', handleChainChanged)
    }

    removeDappWalletListeners = removeListeners
    setDappWalletListenerActive(true)
    return stopDappWalletListeners
}

export function attachDappWalletListeners(
    options: DappWalletListenerOptions = {},
): () => void {
    return startDappWalletListeners(options)
}
