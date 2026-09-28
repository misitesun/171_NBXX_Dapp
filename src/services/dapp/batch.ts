import {
    encodeFunctionData,
    type Hash,
} from 'viem'

import { DAPP_CURRENT_CHAIN } from './config.ts'
import { getDappProvider } from './provider.ts'
import { getConnectedDappAddress } from './wallet.ts'
import type {
    DappBatchCall,
    DappBatchOptions,
} from './types.ts'

export async function sendDappBatchCalls(
    calls: DappBatchCall[],
    options: DappBatchOptions = {},
): Promise<unknown> {
    const chain = options.chain ?? DAPP_CURRENT_CHAIN
    const from = options.from ?? await getConnectedDappAddress()
    const encodedCalls = calls.map((call) => ({
        to: call.to,
        data: encodeFunctionData({
            abi: call.abi,
            functionName: call.functionName,
            args: call.args ?? [],
        } as any),
        value: call.value ?? '0x0',
    }))

    // TODO(dapp-7702): Keep this low-level until a real project confirms wallet compatibility details.
    // TODO(dapp-7702): 真实项目确认钱包兼容细节后，再把 7702 批量调用流程封成更高层方法。
    return getDappProvider().request({
        method: 'wallet_sendCalls',
        params: [{
            version: '2.0.0',
            chainId: `0x${chain.id.toString(16)}`,
            from,
            atomicRequired: options.atomicRequired ?? true,
            calls: encodedCalls,
        }],
    })
}

export async function getDappBatchStatus(batchId: Hash | string): Promise<unknown> {
    return getDappProvider().request({
        method: 'wallet_getCallsStatus',
        params: [batchId],
    })
}
