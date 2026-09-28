import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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

function tempRoot() {
    return mkdtempSync(join(tmpdir(), 'favicon-generator-'))
}

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

            raw[pixelOffset] = 255
            raw[pixelOffset + 1] = 0
            raw[pixelOffset + 2] = 0
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

test('favicon generator creates a fixed 68x68 ico from a square png logo', () => {
    const root = tempRoot()

    try {
        const logoPath = join(root, 'logo.png')
        const faviconPath = join(root, 'favicon.ico')

        writeFileSync(logoPath, createTestPng(1, 1))

        const result = spawnSync(
            process.execPath,
            [
                'scripts/create-favicon-from-logo.mjs',
                '--input',
                logoPath,
                '--output',
                faviconPath,
            ],
            { encoding: 'utf8' },
        )

        assert.equal(result.status, 0, result.stderr)

        const favicon = readFileSync(faviconPath)

        assert.equal(favicon.readUInt16LE(0), 0)
        assert.equal(favicon.readUInt16LE(2), 1)
        assert.equal(favicon.readUInt16LE(4), 1)
        const imageSize = favicon.readUInt32LE(14)
        const imageOffset = favicon.readUInt32LE(18)

        assert.equal(favicon[6], 68)
        assert.equal(favicon[7], 68)
        assert.ok(imageSize > 68 * 68 * 4)
        assert.equal(favicon.readUInt32LE(18), 22)
        assert.equal(favicon.readUInt32LE(imageOffset), 40)
        assert.equal(favicon.readUInt32LE(imageOffset + 4), 68)
        assert.equal(favicon.readUInt32LE(imageOffset + 8), 136)
        assert.equal(favicon.readUInt16LE(imageOffset + 14), 32)
    } finally {
        rmSync(root, { recursive: true, force: true })
    }
})

test('favicon generator documentation says the ico is fixed to 68x68', () => {
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')

    assert.match(setup, /68x68/)
    assert.match(workflow, /68x68/)
})

test('favicon generator rejects a non-square png logo', () => {
    const root = tempRoot()

    try {
        const logoPath = join(root, 'logo.png')
        const faviconPath = join(root, 'favicon.ico')
        const nonSquarePng = createTestPng(2, 1)
        writeFileSync(logoPath, nonSquarePng)

        const result = spawnSync(
            process.execPath,
            [
                'scripts/create-favicon-from-logo.mjs',
                '--input',
                logoPath,
                '--output',
                faviconPath,
            ],
            { encoding: 'utf8' },
        )

        assert.notEqual(result.status, 0)
        assert.match(result.stderr, /square PNG/)
    } finally {
        rmSync(root, { recursive: true, force: true })
    }
})
