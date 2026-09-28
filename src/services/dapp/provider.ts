import detectEthereumProvider from '@metamask/detect-provider'
import {
    createWalletClient,
    custom,
    publicActions,
} from 'viem'

import {
    DAPP_CURRENT_CHAIN,
    DAPP_ERROR_MESSAGE,
    DAPP_PROVIDER_DETECT_TIMEOUT,
} from './config.ts'
import {
    isDappProviderExpected,
    isFlutterHost,
} from '../platform/runtime.ts'
import type { DappEthereumProvider } from './types.ts'

export interface DappProviderDetectOptions {
    waitForDelayedProvider?: boolean
}

function isDappProvider(provider: unknown): provider is DappEthereumProvider {
    return (
        typeof provider === 'object' &&
        provider !== null &&
        typeof (provider as DappEthereumProvider).request === 'function'
    )
}

function createInjectedWalletClient(provider: DappEthereumProvider) {
    return createWalletClient({
        chain: DAPP_CURRENT_CHAIN,
        transport: custom(provider),
    }).extend(publicActions)
}

let cachedProvider: DappEthereumProvider | undefined
let cachedWalletClient: ReturnType<typeof createInjectedWalletClient> | undefined

export function resetDappProviderCache(): void {
    cachedProvider = undefined
    cachedWalletClient = undefined
}

export async function detectDappProvider(
    options: DappProviderDetectOptions = {},
): Promise<DappEthereumProvider | undefined> {
    if (cachedProvider) return cachedProvider

    if (typeof window === 'undefined') return undefined

    if (isDappProvider(window.ethereum)) {
        cachedProvider = window.ethereum
        return cachedProvider
    }

    const shouldWaitForDelayedProvider =
        options.waitForDelayedProvider === true
        || isDappProviderExpected()

    if (!shouldWaitForDelayedProvider) return undefined

    if (isFlutterHost() && !isDappProviderExpected()) return undefined

    if (typeof window.addEventListener !== 'function') return undefined

    const provider = await detectEthereumProvider<unknown>({
        mustBeMetaMask: false,
        silent: true,
        timeout: DAPP_PROVIDER_DETECT_TIMEOUT,
    })

    if (!isDappProvider(provider)) return undefined

    cachedProvider = provider
    return cachedProvider
}

export function getDappProvider(): DappEthereumProvider {
    const provider = cachedProvider ?? (
        typeof window === 'undefined'
            ? undefined
            : window.ethereum
    )

    if (!isDappProvider(provider)) {
        throw new Error(DAPP_ERROR_MESSAGE.providerUnavailable)
    }

    cachedProvider = provider
    return provider
}

export function getDappWalletClient(): ReturnType<typeof createInjectedWalletClient> {
    if (!cachedWalletClient) {
        cachedWalletClient = createInjectedWalletClient(getDappProvider())
    }

    return cachedWalletClient
}
