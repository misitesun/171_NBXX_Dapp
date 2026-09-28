import test from 'node:test'
import assert from 'node:assert/strict'

import { calculatePercentage } from '../src/shared/calculations/calculatePercentage.ts'

test('calculates and truncates integer percentages through exact decimals', () => {
    assert.equal(calculatePercentage(54.5, 100), 54)
    assert.equal(calculatePercentage('545', '1000'), 54)
    assert.equal(
        calculatePercentage('999999999999999999', '2000000000000000000'),
        49,
    )
    assert.equal(calculatePercentage(1n, 3n), 33)
})

test('caps percentages at 100', () => {
    assert.equal(calculatePercentage(100, 100), 100)
    assert.equal(calculatePercentage('100.0001', '100'), 100)
})

test('returns zero for invalid percentage boundaries', () => {
    assert.equal(calculatePercentage(0, 100), 0)
    assert.equal(calculatePercentage(null, 100), 0)
    assert.equal(calculatePercentage(10, undefined), 0)
    assert.equal(calculatePercentage(-1, 100), 0)
    assert.equal(calculatePercentage(10, -100), 0)
    assert.equal(calculatePercentage(10, 0), 0)
    assert.equal(calculatePercentage('abc', 100), 0)
    assert.equal(calculatePercentage(Number.NaN, 100), 0)
})
