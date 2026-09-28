import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('project installs animate.css as the shared animation helper', async () => {
    const source = await readFile(new URL('../package.json', import.meta.url), 'utf8')
    const packageJson = JSON.parse(source)

    assert.match(packageJson.dependencies?.['animate.css'] ?? '', /^\^?\d+\.\d+\.\d+/)
})

test('app imports animate.css once from the main entry', async () => {
    const source = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')

    assert.match(source, /import 'animate\.css'/)
})
