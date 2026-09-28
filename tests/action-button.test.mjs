import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { registerUiModules } from './hu-ui-render.mjs'

test('ActionButton enables brand motion only for primary actions by default', async () => {
    const hooks = registerUiModules()

    try {
        const { ActionButton } = await import('../src/components/ActionButton/ActionButton.tsx')
        const primary = renderToStaticMarkup(createElement(ActionButton, null, '确认'))
        const staticPrimary = renderToStaticMarkup(createElement(ActionButton, { animated: false }, '确认'))
        const outline = renderToStaticMarkup(createElement(ActionButton, { variant: 'outline' }, '返回'))
        const requestedAnimatedOutline = renderToStaticMarkup(createElement(ActionButton, { variant: 'outline', animated: true }, '返回'))

        assert.match(primary, /action-button--primary/)
        assert.match(primary, /action-button--animated/)
        assert.match(primary, /action-button__content/)
        assert.doesNotMatch(staticPrimary, /action-button--animated/)
        assert.doesNotMatch(outline, /action-button--animated/)
        assert.doesNotMatch(requestedAnimatedOutline, /action-button--animated/)
    } finally {
        hooks.deregister()
    }
})

test('ActionButton keeps the project gradient fixed and moves only the shine', async () => {
    const [component, styles, readme] = await Promise.all([
        readFile('src/components/ActionButton/ActionButton.tsx', 'utf8'),
        readFile('src/components/ActionButton/ActionButton.scss', 'utf8'),
        readFile('src/components/ActionButton/README.md', 'utf8'),
    ])

    assert.match(component, /animated\?: boolean/)
    assert.match(component, /variant === 'primary' && animated !== false/)
    assert.match(styles, /background: var\(--app-action-gradient\)/)
    assert.match(styles, /width: 28%/)
    assert.match(styles, /clip-path: polygon\(25% 0, 100% 0, 75% 100%, 0 100%\)/)
    assert.match(styles, /rgb\(255 255 255 \/ 50%\) 50%/)
    assert.match(styles, /animation: action-button-shine 3s linear infinite/)
    assert.match(styles, /@keyframes action-button-shine/)
    assert.match(styles, /prefers-reduced-motion: reduce/)
    assert.match(styles, /&::after \{ animation: none; opacity: 0; \}/)
    assert.match(readme, /animated=\{false\}/)
})
