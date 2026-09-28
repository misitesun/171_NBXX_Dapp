import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('project editor config uses four-space indentation', async () => {
    const editorConfig = await readFile(new URL('../.editorconfig', import.meta.url), 'utf8')

    assert.match(editorConfig, /root = true/)
    assert.match(editorConfig, /indent_style = space/)
    assert.match(editorConfig, /indent_size = 4/)
})
