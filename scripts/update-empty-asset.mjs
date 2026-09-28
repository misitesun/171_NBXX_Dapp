#!/usr/bin/env node

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

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

const RETINA_EMPTY_ASSET_MIN_EDGE = 500

function readArg(name, fallback = '') {
    const index = process.argv.indexOf(name)

    if (index === -1) {
        return fallback
    }

    return process.argv[index + 1] || fallback
}

function parsePngSize(buffer) {
    if (buffer.length < 33 || !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
        throw new Error('Empty component icon must be a PNG file.')
    }

    const type = buffer.subarray(12, 16).toString('ascii')

    if (type !== 'IHDR') {
        throw new Error('Empty component icon PNG is missing the IHDR header.')
    }

    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
    }
}

function resolveDisplayWidth({ width, height }) {
    const scale = Math.max(width, height) >= RETINA_EMPTY_ASSET_MIN_EDGE ? 2 : 1

    return Math.max(1, Math.round(width / scale))
}

function updateEmptyImageStyle(styleContent, displayWidth) {
    const blockPattern = /(&__image\s*\{)([\s\S]*?)(\n\s*\})/
    const match = styleContent.match(blockPattern)

    if (!match) {
        throw new Error('Empty.scss must contain an &__image style block.')
    }

    let body = match[2]

    if (/width:\s*[^;]+;/.test(body)) {
        body = body.replace(/width:\s*[^;]+;/, `width: ${displayWidth}px;`)
    } else {
        body = `${body}\n        width: ${displayWidth}px;`
    }

    if (/height:\s*[^;]+;/.test(body)) {
        body = body.replace(/height:\s*[^;]+;/, 'height: auto;')
    } else {
        body = `${body}\n        height: auto;`
    }

    return styleContent.replace(blockPattern, `${match[1]}${body}${match[3]}`)
}

async function main() {
    const input = readArg('--input')

    if (!input) {
        throw new Error('Usage: pnpm empty:asset -- --input <empty-icon.png>')
    }

    const inputPath = resolve(input)
    const outputPath = resolve(readArg('--output', 'src/assets/common/empty.png'))
    const stylePath = resolve(readArg('--style', 'src/components/Empty/Empty.scss'))
    const inputBuffer = await readFile(inputPath)
    const imageSize = parsePngSize(inputBuffer)
    const displayWidth = resolveDisplayWidth(imageSize)
    const styleContent = await readFile(stylePath, 'utf8')
    const nextStyleContent = updateEmptyImageStyle(styleContent, displayWidth)

    await mkdir(dirname(outputPath), { recursive: true })

    if (inputPath !== outputPath) {
        await copyFile(inputPath, outputPath)
    }

    await writeFile(stylePath, nextStyleContent)

    console.log([
        `Updated Empty component icon: ${imageSize.width}x${imageSize.height}.`,
        `Rendered width: ${displayWidth}px.`,
        'Rendered height: auto.',
    ].join(' '))
}

main().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
