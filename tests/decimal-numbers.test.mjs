import test from 'node:test'
import assert from 'node:assert/strict'

import {
    addDecimalNumbers,
    divideDecimalNumbers,
    multiplyDecimalNumbers,
    subtractDecimalNumbers,
} from '../src/shared/calculations/decimalNumbers.ts'

test('calculates exact decimals without converting string inputs to number', () => {
    assert.equal(addDecimalNumbers('0.1', 0.2), '0.3')
    assert.equal(
        addDecimalNumbers('999999999999999999.123456', '0.876544'),
        '1000000000000000000',
    )
    assert.equal(subtractDecimalNumbers('1000000000000000000', '0.1'), '999999999999999999.9')
    assert.equal(multiplyDecimalNumbers('123456789.123456', '0.000001'), '123.456789123456')
    assert.equal(divideDecimalNumbers(1n, 8), '0.125')
})

test('supports negatives and scientific notation', () => {
    assert.equal(addDecimalNumbers('-1.5', '2'), '0.5')
    assert.equal(subtractDecimalNumbers('-1.5', '2'), '-3.5')
    assert.equal(multiplyDecimalNumbers('-2.5', '-4'), '10')
    assert.equal(divideDecimalNumbers('-1e3', '4e-1'), '-2500')
    assert.equal(divideDecimalNumbers('10', '-4'), '-2.5')
    assert.equal(divideDecimalNumbers('1e-10000', '1e-10000'), '1')
})

test('applies the approved empty and zero business fallbacks', () => {
    assert.equal(addDecimalNumbers(null, '10.00'), '10')
    assert.equal(addDecimalNumbers(0, '10'), '10')
    assert.equal(subtractDecimalNumbers(undefined, '10'), '10')
    assert.equal(subtractDecimalNumbers('10', 0), '10')
    assert.equal(subtractDecimalNumbers(0, '10'), '10')
    assert.equal(multiplyDecimalNumbers('', '10'), '10')
    assert.equal(divideDecimalNumbers('10', '  '), '10')
    assert.equal(multiplyDecimalNumbers('10', 0), '0')
    assert.equal(divideDecimalNumbers(0, '10'), '0')
    assert.equal(divideDecimalNumbers('10', 0), '0')
    assert.equal(addDecimalNumbers(null, undefined), '0')
})

test('returns zero for invalid non-empty values', () => {
    assert.equal(addDecimalNumbers('abc', '10'), '0')
    assert.equal(subtractDecimalNumbers('10', Number.NaN), '0')
    assert.equal(multiplyDecimalNumbers(Number.POSITIVE_INFINITY, '10'), '0')
    assert.equal(divideDecimalNumbers('10', '1.2.3'), '0')
})

test('truncates division to the requested precision', () => {
    assert.equal(divideDecimalNumbers(1, 3), '0.333333333333333333')
    assert.equal(divideDecimalNumbers(1, 3, 6), '0.333333')
    assert.equal(divideDecimalNumbers(10, 3, 0), '3')
    assert.equal(divideDecimalNumbers(1, 3, -1), '0')
    assert.equal(divideDecimalNumbers(1, 3, 101), '0')
})

test('rejects resource-exhausting numeric inputs without throwing', () => {
    assert.equal(addDecimalNumbers('1e10001', '1'), '0')
    assert.equal(addDecimalNumbers('1e-10001', '1'), '0')
    assert.equal(addDecimalNumbers('1'.repeat(10001), '1'), '0')
    assert.equal(addDecimalNumbers(`1${' '.repeat(10000)}`, '1'), '0')
    assert.equal(addDecimalNumbers(' '.repeat(10001), '1'), '0')
})
