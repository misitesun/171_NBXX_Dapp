import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { registerUiModules } from './hu-ui-render.mjs'

import {
    calculateCountUpFrame,
    createCountFormatter,
    getDecimalPlaces,
    resolveDecimalPlaces,
} from '../src/components/CountUp/number.ts'

test('count-up uses the shared 500ms default timing', async () => {
    const source = await readFile('src/components/CountUp/CountUp.tsx', 'utf8')
    assert.match(source, /const DEFAULT_DURATION_SECONDS = 0\.5\b/)
    assert.match(source, /duration = DEFAULT_DURATION_SECONDS/)

})

test('count-up reaches the exact integer or decimal target at the configured duration', () => {
    assert.deepEqual(calculateCountUpFrame(0, 1000, 2000, 2000), { value: 1000, done: true })
    assert.deepEqual(calculateCountUpFrame(0, 0.0125, 2000, 2000), { value: 0.0125, done: true })

    const quarter = calculateCountUpFrame(0, 1000, 500, 2000)
    assert.equal(quarter.done, false)
    assert.equal(quarter.value, 62.5)

    const halfway = calculateCountUpFrame(0, 1000, 1000, 2000)
    assert.equal(halfway.done, false)
    assert.equal(halfway.value, 500)

    const descending = calculateCountUpFrame(10.5, 2.25, 1000, 2000)
    assert.ok(descending.value < 10.5)
    assert.ok(descending.value > 2.25)
})

test('count-up infers decimal precision, including scientific notation', () => {
    assert.equal(getDecimalPlaces(1000), 0)
    assert.equal(getDecimalPlaces(12.345), 3)
    assert.equal(getDecimalPlaces(1e-7), 7)
    assert.equal(getDecimalPlaces(1.23e-7), 9)
    assert.equal(getDecimalPlaces('0.997490'), 6)
    assert.equal(getDecimalPlaces('1.20e-7'), 9)
    assert.equal(resolveDecimalPlaces(0, 1.25), 2)
    assert.equal(resolveDecimalPlaces(0, '0.997490'), 6)
    assert.equal(resolveDecimalPlaces(0, 1.25, 4), 4)
    assert.equal(resolveDecimalPlaces(0, 1.25, 99), 20)
})

test('count-up formatting preserves decimals and supports a custom thousands separator', () => {
    assert.equal(createCountFormatter(0, '')(1000), '1000')
    assert.equal(createCountFormatter(2, ',')(1000.5), '1,000.50')
    assert.equal(createCountFormatter(3, ' ')(12345.6), '12 345.600')
    assert.equal(createCountFormatter(2, '')(-0.001), '0.00')
    assert.equal(createCountFormatter(6, '')('0.997490'), '0.997490')
    assert.equal(
        createCountFormatter(6, ',')('123456789012345.997490'),
        '123,456,789,012,345.997490',
    )
})

test('count-up renders its starting value while exposing the final accessible value', async () => {
    const hooks = registerUiModules()
    try {
        const { CountUp } = await import('../src/components/CountUp/index.ts')
        const html = renderToStaticMarkup(createElement(CountUp, {
            to: 1000.5,
            duration: 2,
            decimalPlaces: 2,
            separator: ',',
            className: 'balance-value',
            'data-testid': 'balance-count',
        }))

        assert.match(html, /class="balance-value"/)
        assert.match(html, /data-testid="balance-count"/)
        assert.match(html, /aria-label="1,000\.50"/)
        assert.match(html, />0\.00<\/span>/)
    } finally {
        hooks.deregister()
    }
})

test('count-up keeps API string precision while its decimal value starts at zero', async () => {
    const hooks = registerUiModules()
    try {
        const { CountUp } = await import('../src/components/CountUp/index.ts')
        const html = renderToStaticMarkup(createElement(CountUp, {
            to: '0.997490',
            duration: 2,
            className: 'token-price',
        }))

        assert.match(html, /class="token-price"/)
        assert.match(html, /aria-label="0\.997490"/)
        assert.match(html, />0\.000000<\/span>/)
    } finally {
        hooks.deregister()
    }
})

test('count-up updates transient frames without React rerenders and cleans up scheduled work', async () => {
    const source = await readFile('src/components/CountUp/CountUp.tsx', 'utf8')

    assert.match(source, /element\.textContent = formatValue\(frame\.value\)/)
    assert.match(source, /window\.requestAnimationFrame\(update\)/)
    assert.match(source, /window\.cancelAnimationFrame\(animationFrameId\)/)
    assert.match(source, /window\.clearTimeout\(delayId\)/)
    assert.match(source, /prefers-reduced-motion: reduce/)
    assert.doesNotMatch(source, /useState/)
})
