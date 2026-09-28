import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
    isDappEip7702CapabilitySupported,
} from '../src/services/dapp/index.ts'

test('dapp eip7702 wrapper does not add a project env switch', () => {
    const configSource = readFileSync('src/services/dapp/config.ts', 'utf8')
    const eip7702Source = readFileSync('src/services/dapp/eip7702.ts', 'utf8')
    const envExample = readFileSync('.env.example', 'utf8')

    assert.doesNotMatch(configSource, /VITE_ENABLE_DAPP_EIP7702/)
    assert.doesNotMatch(configSource, /shouldEnableDappEip7702/)
    assert.doesNotMatch(eip7702Source, /shouldEnableDappEip7702/)
    assert.doesNotMatch(envExample, /VITE_ENABLE_DAPP_EIP7702/)
})

test('dapp eip7702 capability parser accepts common wallet capability shapes', () => {
    assert.equal(
        isDappEip7702CapabilitySupported({
            '0x38': {
                atomicBatch: { supported: true },
            },
        }, 56),
        true,
    )
    assert.equal(
        isDappEip7702CapabilitySupported({
            56: {
                atomicBatch: true,
            },
        }, 56),
        true,
    )
    assert.equal(
        isDappEip7702CapabilitySupported({
            56: {
                atomicBatch: { supported: false },
            },
        }, 56),
        false,
    )
})

test('dapp eip7702 wrapper keeps wallet compatibility checks before sending calls', () => {
    const source = readFileSync('src/services/dapp/eip7702.ts', 'utf8')

    assert.match(source, /wallet_getCapabilities/)
    assert.match(source, /sendDappBatchCalls/)
    assert.match(source, /DAPP_ERROR_MESSAGE\.eip7702Unavailable/)
})
