import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE_EXTENSIONS = new Set([
    '.ts',
    '.tsx',
])

async function listSourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name)

        if (entry.isDirectory()) return listSourceFiles(entryPath)
        if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) return []

        return [entryPath]
    }))

    return files.flat()
}

test('typescript resolves the shared src alias used by Vite without deprecated baseUrl', () => {
    const source = readFileSync('tsconfig.app.json', 'utf8')

    assert.doesNotMatch(source, /"baseUrl"/)
    assert.match(source, /"@\/\*":\s*\[\s*"\.\/src\/\*"\s*\]/)
})

test('source files avoid relative imports deeper than two parent levels', async () => {
    const files = await listSourceFiles('src')
    const tooDeepImports = []
    const tooDeepPattern = /(?:from\s+|import\s*\(|import\s+)['"](?:\.\.\/){3,}/

    await Promise.all(files.map(async (file) => {
        const source = await readFile(file, 'utf8')

        if (tooDeepPattern.test(source)) {
            tooDeepImports.push(file)
        }
    }))

    assert.deepEqual(tooDeepImports, [])
})

test('tsx image sources do not use unresolved src alias strings', async () => {
    const files = await listSourceFiles('src')
    const aliasStringSources = []
    const aliasStringPattern = /src=(?:"|')@\//

    await Promise.all(files.filter((file) => file.endsWith('.tsx')).map(async (file) => {
        const source = await readFile(file, 'utf8')

        if (aliasStringPattern.test(source)) {
            aliasStringSources.push(file)
        }
    }))

    assert.deepEqual(aliasStringSources, [])
})

test('agent rules document the shared import path convention', () => {
    const source = readFileSync('AGENTS.md', 'utf8')

    assert.match(source, /Use the `@\/` alias once an import would need three or more parent jumps/)
    assert.match(source, /`\.\/`, `\.\.\/` and `\.\.\/\.\.\/` are acceptable/)
    assert.match(source, /Do not write imports such as `\.\.\/\.\.\/\.\.\/services\/\.\.\.`/)
})

test('agent rules document reuse of global style utilities', () => {
    const source = readFileSync('AGENTS.md', 'utf8')

    assert.match(source, /Reuse existing global utility classes from `src\/styles`/)
    assert.match(source, /combining existing utility classes/)
    assert.match(source, /put that class directly in `className`/)
    assert.match(source, /Do not duplicate utility styles in page or component SCSS/)
    assert.match(source, /Only write custom SCSS for styles that are genuinely page-specific/)
})
