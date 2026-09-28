import test from 'node:test'
import assert from 'node:assert/strict'

import {
    getToken,
    removeToken,
    setToken,
} from '../src/services/storage/token.ts'

function createStorage() {
    const cache = new Map()

    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, String(value)),
        removeItem: (key) => cache.delete(key),
    }
}

test('stores, reads, and removes the established TOKEN value', () => {
    globalThis.window = { localStorage: createStorage() }

    assert.equal(getToken(), '')
    setToken('token-value')
    assert.equal(getToken(), 'token-value')
    removeToken()
    assert.equal(getToken(), '')
})

test('does not let unavailable storage break authentication flow', () => {
    globalThis.window = {
        localStorage: {
            getItem: () => {
                throw new DOMException('blocked', 'SecurityError')
            },
            setItem: () => {
                throw new DOMException('blocked', 'SecurityError')
            },
            removeItem: () => {
                throw new DOMException('blocked', 'SecurityError')
            },
        },
    }

    assert.equal(getToken(), '')
    assert.doesNotThrow(() => setToken('token-value'))
    assert.doesNotThrow(() => removeToken())
})
