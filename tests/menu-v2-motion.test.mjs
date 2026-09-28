import test from 'node:test'
import assert from 'node:assert/strict'

import { getMenuV2Frame, MENU_V2_DURATION_MS } from '../src/pages/main/layout/menuV2Motion.ts'

function closeTo(actual, expected) {
    assert.ok(Math.abs(actual - expected) < .001, `${actual} should be close to ${expected}`)
}

test('Menu V2 starts as three centered horizontal strokes', () => {
    const { top, center, bottom } = getMenuV2Frame(0)

    for (const [line, y] of [[top, 7], [center, 16], [bottom, 25]]) {
        closeTo(line.y1, y)
        closeTo(line.y2, y)
        closeTo(line.x1 + line.x2, 32)
        assert.equal(line.opacity, 1)
    }
})

test('Menu V2 converges before rotating into an X and hides the bottom stroke', () => {
    const converged = getMenuV2Frame(MENU_V2_DURATION_MS * 10 / 60)
    closeTo(converged.top.y1, 16)
    closeTo(converged.bottom.y1, 16)
    closeTo(converged.bottom.opacity, 0)

    const open = getMenuV2Frame(MENU_V2_DURATION_MS * 45 / 60)
    closeTo(open.top.x1, 25)
    closeTo(open.top.y1, 7)
    closeTo(open.top.x2, 7)
    closeTo(open.top.y2, 25)
    closeTo(open.center.x1, 7)
    closeTo(open.center.y1, 7)
    closeTo(open.center.x2, 25)
    closeTo(open.center.y2, 25)
    assert.equal(open.bottom.opacity, 0)
    assert.deepEqual(getMenuV2Frame(MENU_V2_DURATION_MS), open)
})
