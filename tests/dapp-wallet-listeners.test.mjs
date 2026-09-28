import test from 'node:test'
import assert from 'node:assert/strict'

import { DAPP_PRODUCTION_CHAIN } from '../src/services/dapp/config.ts'
import { switchDappChain } from '../src/services/dapp/chain.ts'
import { resetDappProviderCache } from '../src/services/dapp/provider.ts'
import {
    startDappWalletListeners,
    stopDappWalletListeners,
} from '../src/services/dapp/wallet.ts'
import { useDappStore } from '../src/stores/dapp/store.ts'

const TEST_ADDRESS = '0x0000000000000000000000000000000000000001'

function createStorage() {
    const cache = new Map()

    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, String(value)),
        removeItem: (key) => cache.delete(key),
    }
}

function createProvider() {
    const listeners = new Map()
    const removedEvents = []
    const provider = {
        listeners,
        removedEvents,
        chainId: '0x38',
        async request(args) {
            if (args.method === 'wallet_switchEthereumChain') {
                provider.chainId = args.params[0].chainId
                listeners.get('chainChanged')?.(provider.chainId)
                return null
            }

            if (args.method === 'eth_chainId') return provider.chainId
            return null
        },
        on(event, listener) {
            listeners.set(event, listener)
        },
        removeListener(event) {
            removedEvents.push(event)
            listeners.delete(event)
        },
    }

    return provider
}

function setupWalletTest(provider) {
    resetDappProviderCache()
    globalThis.window = {
        ethereum: provider,
        localStorage: createStorage(),
    }
    useDappStore.getState().resetDappState()
}

test('starting listeners removes old listeners before registering the current pair', () => {
    const provider = createProvider()
    setupWalletTest(provider)

    startDappWalletListeners()
    startDappWalletListeners()

    assert.deepEqual(provider.removedEvents, ['accountsChanged', 'chainChanged'])
    assert.equal(typeof provider.listeners.get('accountsChanged'), 'function')
    assert.equal(typeof provider.listeners.get('chainChanged'), 'function')

    stopDappWalletListeners()
    assert.equal(provider.listeners.size, 0)
})

test('wallet listeners update state and only forward user account changes to callbacks', () => {
    const provider = createProvider()
    setupWalletTest(provider)

    const accountChanges = []
    startDappWalletListeners({
        onAccountsChanged: (address) => accountChanges.push(address),
    })

    provider.listeners.get('accountsChanged')([TEST_ADDRESS])

    assert.equal(useDappStore.getState().walletAddress, TEST_ADDRESS)
    assert.deepEqual(accountChanges, [TEST_ADDRESS])
    stopDappWalletListeners()
})

test('a chain switch initiated by the app does not forward the matching chain event', async () => {
    const provider = createProvider()
    setupWalletTest(provider)

    const chainChanges = []
    startDappWalletListeners({
        onChainChanged: (chainId) => chainChanges.push(chainId),
    })

    await switchDappChain(DAPP_PRODUCTION_CHAIN)
    assert.deepEqual(chainChanges, [])

    provider.listeners.get('chainChanged')('0x1')
    assert.deepEqual(chainChanges, [1])
    stopDappWalletListeners()
})
