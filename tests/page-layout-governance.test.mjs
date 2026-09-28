import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import test from 'node:test'

import {
    validatePageLayouts,
    validatePageStyleContent,
} from '../scripts/validate-page-layout.mjs'

test('page layout governance accepts normal flow and narrow documented overlays', () => {
    const content = `
.home-page {
    display: grid;
    gap: 24px;

    &__art {
        /* layout-exception: background-art decorative glow stays behind flowing content */
        position: absolute;
    }
}
`

    assert.deepEqual(validatePageStyleContent(content, 'src/pages/home/HomePage.scss'), [])
})

test('page layout governance rejects undocumented positional layout', () => {
    const content = `
.home-page__card {
    position: absolute;
    top: 120px;
}
`

    assert.deepEqual(validatePageStyleContent(content, 'src/pages/home/HomePage.scss'), [
        'src/pages/home/HomePage.scss:3 uses position: absolute without an immediate layout-exception comment',
    ])
})

test('existing page styles comply with the normal-flow position exception rule', () => {
    const { violations } = validatePageLayouts(resolve('.'))

    assert.deepEqual(violations, [])
})
