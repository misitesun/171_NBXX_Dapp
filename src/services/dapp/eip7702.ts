import type {
    Chain,
    Hash,
} from 'viem'

import {
    DAPP_CURRENT_CHAIN,
    DAPP_ERROR_MESSAGE,
} from './config.ts'
import { getDappProvider } from './provider.ts'
import { getConnectedDappAddress } from './wallet.ts'
import {
    getDappBatchStatus,
    sendDappBatchCalls,
} from './batch.ts'
import type {
    DappBatchCall,
    DappBatchOptions,
} from './types.ts'

type DappEip7702Capabilities = Record<string, unknown>

export interface DappEip7702SupportOptions {
    chain?: Chain
    from?: `0x${string}`
}

export interface DappEip7702SendOptions extends DappBatchOptions {
    requireSupport?: boolean
}

function toHexChainId(chainId: number): `0x${string}` {
    return `0x${chainId.toString(16)}`
}

function readCapabilityValue(
    capabilities: DappEip7702Capabilities,
    chainId: number,
): unknown {
    return capabilities[toHexChainId(chainId)]
        ?? capabilities[String(chainId)]
        ?? capabilities[chainId]
}

function isSupportedCapability(value: unknown): boolean {
    if (value === true) return true
    if (!value || typeof value !== 'object') return false

    const capability = value as Record<string, unknown>
    return capability.supported === true
}

export function isDappEip7702CapabilitySupported(
    capabilities: DappEip7702Capabilities,
    chainId: number = DAPP_CURRENT_CHAIN.id,
): boolean {
    const chainCapabilities = readCapabilityValue(capabilities, chainId)
    if (!chainCapabilities || typeof chainCapabilities !== 'object') {
        return false
    }

    const values = chainCapabilities as Record<string, unknown>
    return (
        isSupportedCapability(values.atomicBatch)
        || isSupportedCapability(values.sendCalls)
        || isSupportedCapability(values.walletSendCalls)
    )
}

export async function detectDappEip7702Support(
    options: DappEip7702SupportOptions = {},
): Promise<boolean> {
    const chain = options.chain ?? DAPP_CURRENT_CHAIN
    const from = options.from ?? await getConnectedDappAddress()

    try {
        const capabilities = await getDappProvider().request({
            method: 'wallet_getCapabilities',
            params: [from, [toHexChainId(chain.id)]],
        })

        if (!capabilities || typeof capabilities !== 'object') return false

        return isDappEip7702CapabilitySupported(
            capabilities as DappEip7702Capabilities,
            chain.id,
        )
    } catch {
        return false
    }
}

export async function sendDappEip7702Calls(
    calls: DappBatchCall[],
    options: DappEip7702SendOptions = {},
): Promise<unknown> {
    if (options.requireSupport !== false) {
        const supported = await detectDappEip7702Support(options)

        if (!supported) {
            throw new Error(DAPP_ERROR_MESSAGE.eip7702Unavailable)
        }
    }

    return sendDappBatchCalls(calls, options)
}

export function getDappEip7702CallsStatus(batchId: Hash | string): Promise<unknown> {
    return getDappBatchStatus(batchId)
}
