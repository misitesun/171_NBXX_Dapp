import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { deflateSync } from 'node:zlib'

const PNG_SIGNATURE = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
])

function createChunk(type, data) {
    const chunk = Buffer.alloc(12 + data.length)

    chunk.writeUInt32BE(data.length, 0)
    chunk.write(type, 4, 4, 'ascii')
    data.copy(chunk, 8)
    chunk.writeUInt32BE(0, 8 + data.length)

    return chunk
}

function createTestPng(width, height) {
    const header = Buffer.alloc(13)
    const scanlineLength = width * 4
    const raw = Buffer.alloc((scanlineLength + 1) * height)

    header.writeUInt32BE(width, 0)
    header.writeUInt32BE(height, 4)
    header[8] = 8
    header[9] = 6

    for (let y = 0; y < height; y += 1) {
        const rowOffset = y * (scanlineLength + 1)

        raw[rowOffset] = 0

        for (let x = 0; x < width; x += 1) {
            const pixelOffset = rowOffset + 1 + x * 4

            raw[pixelOffset] = 128
            raw[pixelOffset + 1] = 128
            raw[pixelOffset + 2] = 128
            raw[pixelOffset + 3] = 255
        }
    }

    return Buffer.concat([
        PNG_SIGNATURE,
        createChunk('IHDR', header),
        createChunk('IDAT', deflateSync(raw)),
        createChunk('IEND', Buffer.alloc(0)),
    ])
}

test('empty component wraps the shared no-data image and text', async () => {
    const [component, styles, entry, readme, showcasePage, showcaseStyle] = await Promise.all([
        readFile('src/components/Empty/Empty.tsx', 'utf8'),
        readFile('src/components/Empty/Empty.scss', 'utf8'),
        readFile('src/components/Empty/index.ts', 'utf8'),
        readFile('src/components/Empty/README.md', 'utf8'),
        readFile('src/showcase/components/empty/EmptyShowcasePage.tsx', 'utf8'),
        readFile('src/showcase/components/empty/EmptyShowcasePage.scss', 'utf8'),
    ])

    await access('src/assets/common/empty.png')

    assert.match(component, /useTranslation/)
    assert.match(component, /emptyUrl from '@\/assets\/common\/empty\.png'/)
    assert.match(component, /text\?:\s*ReactNode/)
    assert.match(component, /showGap\?:\s*boolean/)
    assert.match(component, /text \?\? t\('暂无数据'\)/)
    assert.match(component, /className="gap-100"/)
    assert.match(component, /empty__image/)
    assert.match(component, /empty__text/)

    assert.match(styles, /\.empty\s*\{/)
    assert.match(styles, /&__image/)
    assert.match(styles, /width:\s*204px/)
    assert.match(styles, /height:\s*auto/)

    assert.match(entry, /export \{ Empty \} from '\.\/Empty\.tsx'/)
    assert.match(readme, /暂无数据/)
    assert.match(readme, /gap-100/)
    assert.match(showcasePage, /export function EmptyShowcasePage/)
    assert.match(showcasePage, /<SecondaryHeader title="空数据" \/>/)
    assert.match(showcasePage, /<Empty \/>/)
    assert.match(showcasePage, /<Empty text="暂无收益记录" showGap=\{false\} \/>/)
    assert.match(showcaseStyle, /\.empty-showcase\s*\{/)
})

test('empty asset setup script copies the icon and writes an auto-scaled width only', () => {
    const root = mkdtempSync(join(tmpdir(), 'empty-asset-'))

    try {
        const inputPath = join(root, 'empty-source.png')
        const outputPath = join(root, 'empty.png')
        const stylePath = join(root, 'Empty.scss')

        writeFileSync(inputPath, createTestPng(750, 500))
        writeFileSync(stylePath, [
            '.empty {',
            '    &__image {',
            '        width: 204px;',
            '        height: 210px;',
            '    }',
            '}',
            '',
        ].join('\n'))

        const result = spawnSync(
            process.execPath,
            [
                'scripts/update-empty-asset.mjs',
                '--input',
                inputPath,
                '--output',
                outputPath,
                '--style',
                stylePath,
            ],
            { encoding: 'utf8' },
        )

        assert.equal(result.status, 0, result.stderr)
        assert.deepEqual(readFileSync(outputPath), readFileSync(inputPath))

        const style = readFileSync(stylePath, 'utf8')

        assert.match(style, /width:\s*375px/)
        assert.match(style, /height:\s*auto/)
        assert.doesNotMatch(style, /height:\s*\d+px/)
    } finally {
        rmSync(root, { recursive: true, force: true })
    }
})
