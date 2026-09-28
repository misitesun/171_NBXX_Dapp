import test from 'node:test'
import assert from 'node:assert/strict'

import {
    DAPP_AMOUNT_DECIMALS,
    DAPP_CONFIG,
    formatDappAmountUnits,
    getDappAmountDecimals,
    parseDappAmountUnits,
} from '../src/services/dapp/index.ts'

test('dapp amount decimals are controlled by the project setting', () => {
    assert.equal(DAPP_AMOUNT_DECIMALS, DAPP_CONFIG.amountDecimals)
    assert.equal(getDappAmountDecimals(), DAPP_CONFIG.amountDecimals)
})

test('dapp amount unit conversion supports an explicit 18-decimal value', () => {
    assert.equal(
        formatDappAmountUnits(1_230_000_000_000_000_000n, { decimals: 18 }),
        '1.23',
    )
    assert.equal(
        parseDappAmountUnits('1.23', { decimals: 18 }),
        1_230_000_000_000_000_000n,
    )
})

test('dapp amount unit conversion can use a 6-decimal override', () => {
    assert.equal(formatDappAmountUnits(1_230_000n, { decimals: 6 }), '1.23')
    assert.equal(parseDappAmountUnits('1.23', { decimals: 6 }), 1_230_000n)
})
