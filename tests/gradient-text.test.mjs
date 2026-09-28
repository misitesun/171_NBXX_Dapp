import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { registerUiModules } from './hu-ui-render.mjs'

test('gradient text preserves content and span attributes, with an inaccessible decorative border', async () => {
    const hooks = registerUiModules()
    try {
        const { default: GradientText } = await import('../src/components/GradientText/GradientText.tsx')
        const html = renderToStaticMarkup(createElement(GradientText, {
            colors: ['red', 'blue'], animationSpeed: 3, showBorder: true,
            className: 'custom-class', 'aria-label': 'DApp Template',
        }, 'DApp Template'))
        assert.match(html, /aria-label="DApp Template"/)
        assert.match(html, /custom-class/)
        assert.match(html, /aria-hidden="true"/)
        assert.match(html, /linear-gradient\(to right, red, blue, red\)/)
        assert.match(html, /--gradient-text-duration:3s/)
        assert.match(html, />DApp Template</)
        assert.doesNotMatch(html, /role="button"|tabindex=/)
    } finally { hooks.deregister() }
})

test('empty palettes and invalid speeds remain renderable; single colors and directions are supported', async () => {
    const hooks = registerUiModules()
    try {
        const { default: GradientText } = await import('../src/components/GradientText/GradientText.tsx')
        for (const speed of [0, -1, NaN, Infinity]) {
            const html = renderToStaticMarkup(createElement(GradientText, { colors: [], animationSpeed: speed }, 'Readable'))
            assert.match(html, /--gradient-text-duration:8s/)
            assert.match(html, /var\(--app-color\)/)
            assert.doesNotMatch(html, /undefined|NaN|Infinity/)
        }
        const vertical = renderToStaticMarkup(createElement(GradientText, { colors: ['red'], direction: 'vertical', yoyo: false }, 'Vertical'))
        assert.match(vertical, /linear-gradient\(to bottom, red, red\)/)
        assert.match(vertical, /--gradient-text-end:50% 150%/)
        assert.match(vertical, /--gradient-text-direction:normal/)
        assert.doesNotMatch(vertical, /aria-hidden=/)
    } finally { hooks.deregister() }
})
