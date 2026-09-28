import test from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const NATIVE_INPUT_OWNERS = new Set([
    path.normalize('src/components/Input/Input.tsx'),
    path.normalize('src/components/Radio/Radio.tsx'),
])

async function collectTsxFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true })
    const nestedFiles = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name)
        if (entry.isDirectory()) return collectTsxFiles(entryPath)
        return entry.isFile() && entry.name.endsWith('.tsx') ? [entryPath] : []
    }))

    return nestedFiles.flat()
}

test('business text inputs use the shared gradient-focus Input component', async () => {
    const inputSource = await readFile('src/components/Input/Input.tsx', 'utf8')
    assert.match(inputSource, /focusVariant = 'gradient'/)

    const files = await collectTsxFiles('src')
    for (const file of files) {
        if (NATIVE_INPUT_OWNERS.has(path.normalize(file))) continue
        const source = await readFile(file, 'utf8')
        assert.doesNotMatch(source, /<(?:input|textarea)\b/, `${file} must use the shared Input component`)
    }
})
