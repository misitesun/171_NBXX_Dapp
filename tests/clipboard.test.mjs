import test from 'node:test'
import assert from 'node:assert/strict'

import { copyTextToClipboard } from '../src/shared/clipboard/copyTextToClipboard.ts'

function replaceGlobal(name, value) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { configurable: true, value })
    return () => {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor)
        else delete globalThis[name]
    }
}

test('copies with the native Clipboard API when available', async () => {
    let copied
    const restoreNavigator = replaceGlobal('navigator', {
        clipboard: { writeText: async (text) => { copied = text } },
    })

    try {
        assert.equal(await copyTextToClipboard('wallet-address'), true)
        assert.equal(copied, 'wallet-address')
    } finally {
        restoreNavigator()
    }
})

test('falls back to a temporary textarea and always cleans it up', async () => {
    const appended = []
    const removed = []
    const textarea = {
        value: '',
        style: {},
        setAttribute() {},
        focus() {},
        select() {},
        setSelectionRange() {},
    }
    const restoreNavigator = replaceGlobal('navigator', {})
    const restoreDocument = replaceGlobal('document', {
        body: {
            appendChild(node) { appended.push(node) },
            removeChild(node) { removed.push(node) },
        },
        createElement: () => textarea,
        execCommand: (command) => command === 'copy',
    })

    try {
        assert.equal(await copyTextToClipboard('123'), true)
        assert.equal(textarea.value, '123')
        assert.deepEqual(removed, appended)
    } finally {
        restoreDocument()
        restoreNavigator()
    }
})

test('uses the textarea fallback after native clipboard permission is denied', async () => {
    const textarea = {
        value: '',
        style: {},
        setAttribute() {},
        focus() {},
        select() {},
        setSelectionRange() {},
    }
    const restoreNavigator = replaceGlobal('navigator', {
        clipboard: { writeText: async () => { throw new Error('denied') } },
    })
    const restoreDocument = replaceGlobal('document', {
        body: { appendChild() {}, removeChild() {} },
        createElement: () => textarea,
        execCommand: () => true,
    })

    try {
        assert.equal(await copyTextToClipboard('fallback-value'), true)
        assert.equal(textarea.value, 'fallback-value')
    } finally {
        restoreDocument()
        restoreNavigator()
    }
})

test('normalizes WebView DOM failures to false', async () => {
    const restoreNavigator = replaceGlobal('navigator', {})
    const restoreDocument = replaceGlobal('document', {
        body: { appendChild() {}, removeChild() {} },
        createElement: () => { throw new Error('restricted DOM') },
    })

    try {
        assert.equal(await copyTextToClipboard('value'), false)
    } finally {
        restoreDocument()
        restoreNavigator()
    }
})

test('returns false for empty text or when both clipboard paths fail', async () => {
    const restoreNavigator = replaceGlobal('navigator', {
        clipboard: { writeText: async () => { throw new Error('denied') } },
    })
    const restoreDocument = replaceGlobal('document', undefined)

    try {
        assert.equal(await copyTextToClipboard(''), false)
        assert.equal(await copyTextToClipboard('value'), false)
    } finally {
        restoreDocument()
        restoreNavigator()
    }
})
