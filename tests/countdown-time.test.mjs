import test from 'node:test'
import assert from 'node:assert/strict'
import { countdownParts, remainingSeconds, DEFAULT_COUNTDOWN_SECONDS } from '../src/components/Countdown/time.ts'

test('countdown starts at 24 hours and crosses minute/hour boundaries', () => {
    assert.deepEqual(countdownParts(DEFAULT_COUNTDOWN_SECONDS), ['24', '00', '00'])
    assert.deepEqual(countdownParts(86399), ['23', '59', '59'])
    assert.deepEqual(countdownParts(3600), ['01', '00', '00'])
    assert.deepEqual(countdownParts(59), ['00', '00', '59'])
})

test('deadline arithmetic accounts for delayed ticks and never becomes negative', () => {
    assert.equal(remainingSeconds(10000, 0), 10)
    assert.equal(remainingSeconds(10000, 1200), 9)
    assert.equal(remainingSeconds(10000, 8500), 2)
    assert.equal(remainingSeconds(10000, 10000), 0)
    assert.equal(remainingSeconds(10000, 15000), 0)
    assert.deepEqual(countdownParts(-1), ['00', '00', '00'])
    assert.deepEqual(countdownParts(NaN), ['00', '00', '00'])
})
