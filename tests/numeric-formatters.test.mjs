import test from 'node:test'
import assert from 'node:assert/strict'

import { formatAmount } from '../src/shared/formatters/formatAmount.ts'
import { formatQuantity } from '../src/shared/formatters/formatQuantity.ts'

test('formats amounts with the legacy zero convention and exact string precision', () => {
    assert.equal(formatAmount(undefined), '0.00')
    assert.equal(formatAmount('0.0000009'), '0.00')
    assert.equal(formatAmount('1'), '1')
    assert.equal(formatAmount('001234.5000009'), '1,234.5')
    assert.equal(
        formatAmount('999999999999999999.1234569'),
        '999,999,999,999,999,999.123456',
    )
    assert.equal(formatAmount('-1234.5678919'), '-1,234.567891')
    assert.equal(formatAmount(9007199254740993n), '9,007,199,254,740,993')
    assert.equal(formatAmount('not-a-number'), '0.00')
})

test('formats non-money quantities with a plain zero convention', () => {
    assert.equal(formatQuantity(null), '0')
    assert.equal(formatQuantity('0.0000009'), '0')
    assert.equal(formatQuantity('1000000'), '1,000,000')
    assert.equal(formatQuantity('1234.5000009'), '1,234.5')
    assert.equal(formatQuantity('-0'), '0')
    assert.equal(formatQuantity('invalid'), '0')
})

test('does not silently turn a large scientific-notation value into zero', () => {
    const formatted = formatQuantity('1e10001')

    assert.equal(formatted.replaceAll(',', ''), `1${'0'.repeat(10001)}`)
})
