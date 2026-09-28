import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
    mkdtemp,
    readFile,
    rm,
    writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const realEnvFiles = ['.env.development', '.env.production']

function getRuntimeLines(content) {
    return content
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter((line) => line && !line.startsWith('#'))
}

function assertEnvAssignmentStyle(content) {
    for (const line of getRuntimeLines(content)) {
        assert.match(line, /^[A-Z][A-Z0-9_]* =(?: .*)?$/)
        assert.doesNotMatch(line, /^[A-Z][A-Z0-9_]*=/)
    }
}

test('example env keeps shared formatting and documentation', async () => {
    const content = await readFile(new URL('../.env.example', import.meta.url), 'utf8')

    assert.match(content, /# Runtime endpoints and shared project values\./)
    assert.match(content, /# 运行时接口地址和项目通用值。/)
    assert.match(content, /# Whether to inject social sharing meta tags into index\.html\./)
    assert.match(content, /# 是否向 index\.html 注入社交分享 meta 标签。/)
    assertEnvAssignmentStyle(content)
})

test('real env files keep only runtime values without comments', async () => {
    const contents = await Promise.all(
        realEnvFiles.map((file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')),
    )

    for (const content of contents) {
        assert.doesNotMatch(content, /^#/m)
        assertEnvAssignmentStyle(content)
    }
})

test('only real environment files are ignored', async () => {
    const gitignore = await readFile(new URL('../.gitignore', import.meta.url), 'utf8')
    const rules = new Set(
        gitignore
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#')),
    )

    assert.equal(rules.has('.env.development'), true)
    assert.equal(rules.has('.env.production'), true)
    assert.equal(rules.has('.env.example'), false)
})

test('env init script creates local env files without copying example comments', async () => {
    const root = await mkdtemp(join(tmpdir(), 'template-env-'))
    const example = await readFile(new URL('../.env.example', import.meta.url), 'utf8')

    try {
        await writeFile(join(root, '.env.example'), example)

        const result = spawnSync(
            process.execPath,
            [
                'scripts/create-env-files.mjs',
                '--root',
                root,
            ],
            { encoding: 'utf8' },
        )

        assert.equal(result.status, 0, result.stderr || result.stdout)

        const [development, production] = await Promise.all([
            readFile(join(root, '.env.development'), 'utf8'),
            readFile(join(root, '.env.production'), 'utf8'),
        ])

        for (const content of [development, production]) {
            assert.doesNotMatch(content, /^#/m)
            assertEnvAssignmentStyle(content)
        }
    } finally {
        await rm(root, { recursive: true, force: true })
    }
})

test('readme documents creating local env files through the env init script', async () => {
    const [readme, setup, packageJsonSource] = await Promise.all([
        readFile(new URL('../README.md', import.meta.url), 'utf8'),
        readFile(new URL('../PROJECT_SETUP.md', import.meta.url), 'utf8'),
        readFile(new URL('../package.json', import.meta.url), 'utf8'),
    ])
    const packageJson = JSON.parse(packageJsonSource)

    assert.match(readme, /Only `.env.example` is tracked by git\./)
    assert.match(readme, /pnpm env:init/)
    assert.doesNotMatch(readme, /cp \.env\.example \.env\.development/)
    assert.doesNotMatch(readme, /cp \.env\.example \.env\.production/)
    assert.match(setup, /pnpm env:init/)
    assert.equal(packageJson.scripts['env:init'], 'node scripts/create-env-files.mjs')
    assert.match(readme, /Keep `.env.development` and `.env.production` local only\./)
})
