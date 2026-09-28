import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

test('brand status records whether the project logo has been replaced', async () => {
    const status = JSON.parse(await readFile('public/brand/brand-status.json', 'utf8'))

    assert.equal(status.isProjectLogoReady, false)
    assert.match(status.messageZh, /项目 logo/)
    assert.match(status.messageZh, /正式打包/)
})

test('production build guard blocks the template placeholder logo', () => {
    const result = spawnSync(
        process.execPath,
        ['scripts/verify-brand-assets.mjs'],
        {
            encoding: 'utf8',
        },
    )

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /project logo/i)
    assert.match(result.stderr, /pnpm favicon:generate/)
})

test('production build guard allows confirmed project logo status', () => {
    const directory = mkdtempSync(join(tmpdir(), 'brand-assets-'))
    const statusPath = join(directory, 'brand-status.json')

    writeFileSync(statusPath, JSON.stringify({
        isProjectLogoReady: true,
    }))

    const result = spawnSync(
        process.execPath,
        ['scripts/verify-brand-assets.mjs', '--status', statusPath],
        {
            encoding: 'utf8',
        },
    )

    assert.equal(result.status, 0)
})
