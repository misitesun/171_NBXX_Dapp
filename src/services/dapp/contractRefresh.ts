import { DAPP_CONFIG } from './config.ts'

export function waitForDappContractDataSync(): Promise<void> {
    return new Promise((resolve) => {
        globalThis.setTimeout(resolve, DAPP_CONFIG.contractWriteRefreshDelayMs)
    })
}
