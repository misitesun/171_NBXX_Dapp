import test from 'node:test'
import assert from 'node:assert/strict'

import {
    getRuntimeHost,
    isDappEnvironment,
    isDappProviderExpected,
    isFlutterBridgeReady,
    isFlutterHost,
} from '../src/services/platform/runtime.ts'

test('classifies a regular browser', () => {
    globalThis.window = {}

    assert.equal(isFlutterHost(), false)
    assert.equal(isDappEnvironment(), false)
    assert.equal(getRuntimeHost(), 'browser')
})

test('classifies an injected wallet browser as dapp', () => {
    globalThis.window = {
        ethereum: { request: async () => undefined },
    }

    assert.equal(isDappEnvironment(), true)
    assert.equal(getRuntimeHost(), 'dapp')
})

test('identifies an explicit delayed DApp provider marker', () => {
    globalThis.window = {
        __FROM_FLUTTER__: true,
        __EXPECT_DAPP_PROVIDER__: true,
    }

    assert.equal(isDappProviderExpected(), true)
})

test('gives the agreed Flutter marker host priority', () => {
    globalThis.window = {
        __FROM_FLUTTER__: true,
        Flutter: { postMessage: () => undefined },
        ethereum: { request: async () => undefined },
    }

    assert.equal(isFlutterHost(), true)
    assert.equal(isFlutterBridgeReady(), true)
    assert.equal(isDappEnvironment(), true)
    assert.equal(getRuntimeHost(), 'flutter')
})

test('does not treat a bridge object without the agreed marker as Flutter', () => {
    globalThis.window = {
        Flutter: { postMessage: () => undefined },
    }

    assert.equal(isFlutterHost(), false)
    assert.equal(isFlutterBridgeReady(), false)
    assert.equal(getRuntimeHost(), 'browser')
})
