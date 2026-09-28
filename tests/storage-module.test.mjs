import test from 'node:test'
import assert from 'node:assert/strict'

import { STORAGE_KEY } from '../src/services/storage/config.ts'
import {
    getLanguage,
    getWalletAddress,
    removeLanguage,
    removeWalletAddress,
    setLanguage,
    setWalletAddress,
} from '../src/services/storage/index.ts'

function createStorage() {
    const cache = new Map()
    return {
        cache,
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: (key) => cache.delete(key),
    }
}

test('uses only business-neutral starter storage keys', () => {
    assert.deepEqual(STORAGE_KEY, {
        walletAddress: 'WALLET_ADDRESS',
        token: 'TOKEN',
        language: 'LANG',
    })
})

test('stores, reads, and removes common string values', () => {
    const localStorage = createStorage()
    globalThis.window = { localStorage }

    setWalletAddress('0x123')
    setLanguage('en')

    assert.equal(getWalletAddress(), '0x123')
    assert.equal(getLanguage(), 'en')

    removeWalletAddress()
    removeLanguage()

    assert.equal(getWalletAddress(), '')
    assert.equal(getLanguage(), 'zh-Hans')
})

test('does not throw when localStorage is unavailable', () => {
    globalThis.window = {
        get localStorage() { throw new Error('blocked') },
    }

    assert.doesNotThrow(() => setWalletAddress('0x123'))
    assert.equal(getWalletAddress(), '')
    assert.doesNotThrow(() => removeWalletAddress())
})
