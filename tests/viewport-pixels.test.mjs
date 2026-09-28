import test from 'node:test'
import assert from 'node:assert/strict'

import { getViewportHeightPx } from '../src/shared/viewport/getViewportHeightPx.ts'
import { getViewportWidthPx } from '../src/shared/viewport/getViewportWidthPx.ts'

function replaceWindow(value) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
    Object.defineProperty(globalThis, 'window', { configurable: true, value })
    return () => {
        if (descriptor) Object.defineProperty(globalThis, 'window', descriptor)
        else delete globalThis.window
    }
}

test('converts design dimensions to current physical viewport pixels', () => {
    const restore = replaceWindow({ innerWidth: 375, innerHeight: 406 })

    try {
        assert.equal(getViewportWidthPx(30), 15)
        assert.equal(getViewportWidthPx('50', '1000'), 18.75)
        assert.equal(getViewportHeightPx(100, 812), 50)
        assert.equal(getViewportWidthPx('0x10'), 0)
    } finally {
        restore()
    }
})

test('reads each viewport dimension only once per call', () => {
    let widthReads = 0
    let heightReads = 0
    const restore = replaceWindow({
        get innerWidth() { widthReads += 1; return 375 },
        get innerHeight() { heightReads += 1; return 812 },
    })

    try {
        getViewportWidthPx(30)
        getViewportHeightPx(30, 812)
        assert.equal(widthReads, 1)
        assert.equal(heightReads, 1)
    } finally {
        restore()
    }
})

test('uses design dimensions during SSR and safely rejects invalid values', () => {
    const restore = replaceWindow(undefined)

    try {
        assert.equal(getViewportWidthPx(30), 30)
        assert.equal(getViewportHeightPx('40', 812), 40)
        assert.equal(getViewportWidthPx('0.0000000000000000001'), 1e-19)
        assert.equal(
            getViewportHeightPx('0.0000000000000000001', 812),
            1e-19,
        )
        assert.equal(getViewportWidthPx(null), 0)
        assert.equal(getViewportWidthPx(-1), 0)
        assert.equal(getViewportWidthPx(10, 0), 0)
        assert.equal(getViewportHeightPx('abc', 812), 0)
    } finally {
        restore()
    }
})
