import test from 'node:test'
import assert from 'node:assert/strict'
import { compile } from 'sass-embedded'

test('orbit border compiles with theme controls, masks and reduced-motion support', () => {
    const { css } = compile('src/styles/common/common.scss')
    assert.match(css, /@property --orbit-border-progress/)
    assert.match(css, /syntax: "<angle>"/)
    const rule = css.match(/\.orbit-border::before \{([^}]+)\}/)?.[1]
    assert.ok(rule)
    for (const [property, variable] of [
        ['animation-duration', 'speed'],
        ['animation-delay', 'delay'],
        ['animation-direction', 'direction'],
    ]) {
        assert.ok(rule.includes(property + ': var(--orbit-border-' + variable + ')'))
    }
    assert.match(rule, /border-radius: inherit/)
    assert.match(rule, /pointer-events: none/)
    assert.match(rule, /mask-composite: exclude/)
    assert.match(rule, /-webkit-mask-composite: xor/)
    assert.match(rule, /conic-gradient/)
    assert.match(css, /--orbit-border-color-start: var\(--app-cyan\)/)
    assert.match(css, /--orbit-border-color-peak: var\(--app-violet\)/)
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.orbit-border::before \{\s*animation: none;/)
    assert.match(css, /@keyframes orbit-border-spin[\s\S]*?--orbit-border-progress: 360deg/)
})
