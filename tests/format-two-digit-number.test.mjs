import test from 'node:test'
import assert from 'node:assert/strict'

import { formatTwoDigitNumber } from '../src/shared/formatters/formatTwoDigitNumber.ts'

test('pads non-negative single-digit integers to two digits', () => {
    assert.equal(formatTwoDigitNumber(0), '00')
    assert.equal(formatTwoDigitNumber(1), '01')
    assert.equal(formatTwoDigitNumber('9'), '09')
    assert.equal(formatTwoDigitNumber(10), '10')
})

test('preserves non-matching values and uses the display fallback for empty values', () => {
    assert.equal(formatTwoDigitNumber(1.5), '1.5')
    assert.equal(formatTwoDigitNumber(-1), '-1')
    assert.equal(formatTwoDigitNumber('abc'), 'abc')
    assert.equal(formatTwoDigitNumber(null), '--')
    assert.equal(formatTwoDigitNumber(undefined), '--')
    assert.equal(formatTwoDigitNumber(''), '--')
    assert.equal(formatTwoDigitNumber('   '), '--')
})
