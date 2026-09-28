import test from 'node:test'
import assert from 'node:assert/strict'

import {
    DAPP_CURRENT_CHAIN,
    DAPP_PROVIDER_STATUS,
    DAPP_PRODUCTION_CHAIN,
} from '../src/services/dapp/config.ts'
import { resetDappProviderCache } from '../src/services/dapp/provider.ts'
import {
    connectDappWallet,
    disconnectDappWallet,
    initializeDappWallet,
    signDappMessage,
} from '../src/services/dapp/wallet.ts'
import { ensureDappChain } from '../src/services/dapp/chain.ts'
import { useDappStore } from '../src/stores/dapp/store.ts'

const TEST_ADDRESS = '0x0000000000000000000000000000000000000001'

function createStorage() {
    const cache = new Map()
    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: (key) => cache.delete(key),
    }
}

function createProvider(options = {}) {
    const requests = []
    const listeners = new Map()
    const provider = {
        requests,
        listeners,
        accounts: options.accounts ?? [],
        chainId: options.chainId ?? '0x38',
        async request(args) {
            requests.push(args)

            if (args.method === 'eth_accounts') return provider.accounts
            if (args.method === 'eth_requestAccounts') {
                provider.accounts = options.requestedAccounts ?? [TEST_ADDRESS]
                return provider.accounts
            }
            if (args.method === 'eth_chainId') return provider.chainId
            if (args.method === 'wallet_switchEthereumChain') {
                if (options.switchError) {
                    const error = options.switchError
                    options.switchError = undefined
                    throw error
                }
                provider.chainId = args.params[0].chainId
                return null
            }
            if (args.method === 'wallet_addEthereumChain') {
                provider.addedChain = args.params[0]
                return null
            }
            if (args.method === 'personal_sign') return options.signature ?? '0xsignature'
            if (args.method === 'eth_getBalance') return options.balance ?? '0xde0b6b3a7640000'

            return null
        },
        on(event, listener) {
            listeners.set(event, listener)
        },
        removeListener(event) {
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

test('connects through the injected window ethereum provider and stores wallet state', async () => {
    const provider = createProvider()
    setupWalletTest(provider)

    const result = await connectDappWallet()

    assert.equal(result.address, TEST_ADDRESS)
    assert.equal(result.chainId, 56)
    assert.equal(useDappStore.getState().providerStatus, DAPP_PROVIDER_STATUS.available)
    assert.equal(useDappStore.getState().walletAddress, TEST_ADDRESS)
    assert.equal(window.localStorage.getItem('WALLET_ADDRESS'), TEST_ADDRESS)
    assert.deepEqual(
        provider.requests.map((request) => request.method),
        ['eth_accounts', 'eth_requestAccounts', 'eth_chainId'],
    )
})

test('switches chain and adds the chain when the wallet does not know it', async () => {
    const switchError = new Error('unknown chain')
    switchError.code = 4902
    const provider = createProvider({ chainId: '0x1', switchError })
    setupWalletTest(provider)

    await ensureDappChain(DAPP_PRODUCTION_CHAIN, { skipInDevelopment: false })

    assert.equal(provider.addedChain.chainId, '0x38')
    assert.equal(provider.addedChain.chainName, DAPP_PRODUCTION_CHAIN.name)
    assert.deepEqual(
        provider.requests.map((request) => request.method),
        ['eth_chainId', 'wallet_switchEthereumChain', 'wallet_addEthereumChain', 'wallet_switchEthereumChain'],
    )
})

test('initializes wallet environment before checking the target chain', async () => {
    const provider = createProvider({ chainId: `0x${DAPP_CURRENT_CHAIN.id.toString(16)}` })
    setupWalletTest(provider)

    const initialized = await initializeDappWallet({ skipChainInDevelopment: false })

    assert.equal(initialized, true)
    assert.equal(useDappStore.getState().providerStatus, DAPP_PROVIDER_STATUS.available)
    assert.equal(useDappStore.getState().chainId, DAPP_CURRENT_CHAIN.id)
    assert.deepEqual(
        provider.requests.map((request) => request.method),
        ['eth_chainId', 'eth_chainId'],
    )
})

test('initialization stops early when there is no injected wallet environment', async () => {
    resetDappProviderCache()
    globalThis.window = { localStorage: createStorage() }
    useDappStore.getState().resetDappState()

    const initialized = await initializeDappWallet({ skipChainInDevelopment: false })

    assert.equal(initialized, false)
    assert.equal(useDappStore.getState().providerStatus, DAPP_PROVIDER_STATUS.unavailable)
})

test('signs the exact project-supplied message with the connected wallet address', async () => {
    const provider = createProvider({ accounts: [TEST_ADDRESS], signature: '0xsigned' })
    setupWalletTest(provider)

    const result = await signDappMessage('server-issued challenge')

    assert.equal(result.signature, '0xsigned')
    assert.equal(result.message, 'server-issued challenge')
    assert.equal('timestamp' in result, false)
    assert.equal(provider.requests.at(-1).method, 'personal_sign')
})

test('disconnect only clears local wallet state', () => {
    const provider = createProvider({ accounts: [TEST_ADDRESS] })
    setupWalletTest(provider)

    useDappStore.getState().setWalletAddress(TEST_ADDRESS)
    disconnectDappWallet()

    assert.equal(useDappStore.getState().walletAddress, '')
    assert.equal(window.localStorage.getItem('WALLET_ADDRESS'), null)
    assert.equal(provider.requests.length, 0)
})
