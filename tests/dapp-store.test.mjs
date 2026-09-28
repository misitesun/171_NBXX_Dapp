import test from 'node:test'
import assert from 'node:assert/strict'

import { DAPP_PROVIDER_STATUS } from '../src/services/dapp/config.ts'
import { useDappStore } from '../src/stores/dapp/store.ts'

function createStorage() {
    const cache = new Map()
    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: (key) => cache.delete(key),
    }
}

test('dapp store tracks wallet state and syncs the wallet address to storage', () => {
    const storage = createStorage()
    globalThis.window = { localStorage: storage }

    useDappStore.getState().resetDappState()

    useDappStore.getState().setProviderStatus(DAPP_PROVIDER_STATUS.available)
    useDappStore.getState().setWalletAddress('0x0000000000000000000000000000000000000001')
    useDappStore.getState().setChainId(56)
    useDappStore.getState().setDappLoading(true)

    assert.equal(useDappStore.getState().providerStatus, DAPP_PROVIDER_STATUS.available)
    assert.equal(useDappStore.getState().walletAddress, '0x0000000000000000000000000000000000000001')
    assert.equal(useDappStore.getState().chainId, 56)
    assert.equal(useDappStore.getState().dappLoading, true)
    assert.equal(storage.getItem('WALLET_ADDRESS'), '0x0000000000000000000000000000000000000001')

    useDappStore.getState().clearWalletAddress()

    assert.equal(useDappStore.getState().walletAddress, '')
    assert.equal(storage.getItem('WALLET_ADDRESS'), null)
})
