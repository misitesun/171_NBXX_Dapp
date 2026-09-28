import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
    DAPP_CONFIG,
    shouldCheckDappGas,
    shouldEstimateDappGas,
} from '../src/services/dapp/config.ts'

test('dapp gas check is controlled by the project setting', () => {
    assert.equal(shouldCheckDappGas(), DAPP_CONFIG.enableGasCheck)
})

test('dapp gas estimation follows the project setting and stays disabled in development', () => {
    assert.equal(shouldEstimateDappGas(true), DAPP_CONFIG.enableGasEstimate)
    assert.equal(shouldEstimateDappGas(false), false)
})

test('contract writes run the shared gas check before sending transactions', () => {
    const source = readFileSync('src/services/dapp/contract.ts', 'utf8')

    assert.match(source, /await checkDappGasBalance\(\)/)
})

test('contract gas submission only runs through the shared gas estimation switch', () => {
    const source = readFileSync('src/services/dapp/contract.ts', 'utf8')

    assert.match(source, /shouldEstimateDappGas\(\)/)
    assert.doesNotMatch(source, /import\.meta\.env\?\.PROD/)
})
