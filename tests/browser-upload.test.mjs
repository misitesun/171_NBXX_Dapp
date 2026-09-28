import test from 'node:test'
import assert from 'node:assert/strict'

import { selectImageFile } from '../src/services/upload/browser.ts'

function createBrowserHarness({ clickError } = {}) {
    const listeners = new Map()
    const windowListeners = new Map()
    const documentListeners = new Map()
    let removed = false

    const input = {
        type: '',
        accept: '',
        capture: '',
        style: {},
        files: null,
        addEventListener: (type, handler) => listeners.set(type, handler),
        removeEventListener: (type) => listeners.delete(type),
        click: () => {
            if (clickError) throw clickError
        },
        remove: () => {
            removed = true
        },
    }

    globalThis.window = {
        addEventListener: (type, handler) => windowListeners.set(type, handler),
        removeEventListener: (type) => windowListeners.delete(type),
        setTimeout,
        clearTimeout,
    }
    globalThis.document = {
        visibilityState: 'hidden',
        body: { append: () => undefined },
        createElement: () => input,
        addEventListener: (type, handler) => documentListeners.set(type, handler),
        removeEventListener: (type) => documentListeners.delete(type),
    }

    return {
        input,
        listeners,
        windowListeners,
        documentListeners,
        wasRemoved: () => removed,
    }
}

test('settles and cleans up when native file selection is cancelled', async () => {
    const harness = createBrowserHarness()
    const selection = selectImageFile()

    harness.listeners.get('cancel')()

    await assert.rejects(selection, /未选择文件/)
    assert.equal(harness.wasRemoved(), true)
    assert.equal(harness.listeners.size, 0)
    assert.equal(harness.windowListeners.size, 0)
    assert.equal(harness.documentListeners.size, 0)
})

test('cleans up when opening the file picker throws', async () => {
    const harness = createBrowserHarness({ clickError: new Error('blocked') })

    await assert.rejects(selectImageFile(), /blocked/)
    assert.equal(harness.wasRemoved(), true)
    assert.equal(harness.listeners.size, 0)
    assert.equal(harness.windowListeners.size, 0)
    assert.equal(harness.documentListeners.size, 0)
})

test('settles when a mobile host becomes visible without a cancel event', async () => {
    const harness = createBrowserHarness()
    const selection = selectImageFile()

    assert.equal(typeof harness.documentListeners.get('visibilitychange'), 'function')
    document.visibilityState = 'visible'
    harness.documentListeners.get('visibilitychange')()

    await assert.rejects(selection, /未选择文件/)
    assert.equal(harness.wasRemoved(), true)
})
