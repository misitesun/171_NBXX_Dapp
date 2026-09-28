#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { inflateSync } from 'node:zlib'

const FAVICON_SIZE = 68
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

const PNG_CHANNELS = {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4,
}

function readArg(name, fallback) {
    const index = process.argv.indexOf(name)

    if (index === -1) {
        return fallback
    }

    return process.argv[index + 1] || fallback
}

function assertPng(buffer) {
    if (buffer.length < 33 || !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
        throw new Error('Logo must be a PNG file.')
    }
}

function paethPredictor(left, up, upLeft) {
    const estimate = left + up - upLeft
    const leftDistance = Math.abs(estimate - left)
    const upDistance = Math.abs(estimate - up)
    const upLeftDistance = Math.abs(estimate - upLeft)

    if (leftDistance <= upDistance && leftDistance <= upLeftDistance) {
        return left
    }

    if (upDistance <= upLeftDistance) {
        return up
    }

    return upLeft
}

function parsePng(buffer) {
    assertPng(buffer)

    let offset = PNG_SIGNATURE.length
    let width = 0
    let height = 0
    let bitDepth = 0
    let colorType = 0
    let palette = Buffer.alloc(0)
    let transparency = Buffer.alloc(0)
    const idatChunks = []

    while (offset < buffer.length) {
        const length = buffer.readUInt32BE(offset)
        const type = buffer.subarray(offset + 4, offset + 8).toString('ascii')
        const dataStart = offset + 8
        const dataEnd = dataStart + length
        const data = buffer.subarray(dataStart, dataEnd)

        if (type === 'IHDR') {
            width = data.readUInt32BE(0)
            height = data.readUInt32BE(4)
            bitDepth = data[8]
            colorType = data[9]
        }

        if (type === 'PLTE') {
            palette = data
        }

        if (type === 'tRNS') {
            transparency = data
        }

        if (type === 'IDAT') {
            idatChunks.push(data)
        }

        if (type === 'IEND') {
            break
        }

        offset = dataEnd + 4
    }

    if (!width || !height) {
        throw new Error('Logo PNG is missing the IHDR header.')
    }

    if (width !== height) {
        throw new Error('Logo must be a square PNG before generating favicon.ico.')
    }

    if (bitDepth !== 8 || !PNG_CHANNELS[colorType]) {
        throw new Error('Logo PNG must use 8-bit grayscale, RGB, palette, grayscale-alpha, or RGBA color.')
    }

    if (idatChunks.length === 0) {
        throw new Error('Logo PNG is missing image data.')
    }

    return {
        width,
        height,
        bitDepth,
        colorType,
        palette,
        transparency,
        imageData: inflateSync(Buffer.concat(idatChunks)),
    }
}

function unfilterPngRows(png) {
    const channels = PNG_CHANNELS[png.colorType]
    const rowLength = png.width * channels
    const expectedLength = (rowLength + 1) * png.height

    if (png.imageData.length < expectedLength) {
        throw new Error('Logo PNG image data is incomplete.')
    }

    const rows = []
    let inputOffset = 0
    let previousRow = Buffer.alloc(rowLength)

    for (let y = 0; y < png.height; y += 1) {
        const filter = png.imageData[inputOffset]
        const currentRow = Buffer.alloc(rowLength)
        inputOffset += 1

        for (let x = 0; x < rowLength; x += 1) {
            const value = png.imageData[inputOffset + x]
            const left = x >= channels ? currentRow[x - channels] : 0
            const up = previousRow[x] || 0
            const upLeft = x >= channels ? previousRow[x - channels] : 0

            if (filter === 0) {
                currentRow[x] = value
            } else if (filter === 1) {
                currentRow[x] = (value + left) & 0xff
            } else if (filter === 2) {
                currentRow[x] = (value + up) & 0xff
            } else if (filter === 3) {
                currentRow[x] = (value + Math.floor((left + up) / 2)) & 0xff
            } else if (filter === 4) {
                currentRow[x] = (value + paethPredictor(left, up, upLeft)) & 0xff
            } else {
                throw new Error('Logo PNG uses an unsupported scanline filter.')
            }
        }

        rows.push(currentRow)
        previousRow = currentRow
        inputOffset += rowLength
    }

    return rows
}

function convertRowsToRgba(png, rows) {
    const rgba = new Uint8Array(png.width * png.height * 4)

    for (let y = 0; y < png.height; y += 1) {
        const row = rows[y]

        for (let x = 0; x < png.width; x += 1) {
            const rgbaOffset = (y * png.width + x) * 4

            if (png.colorType === 0) {
                const gray = row[x]

                rgba[rgbaOffset] = gray
                rgba[rgbaOffset + 1] = gray
                rgba[rgbaOffset + 2] = gray
                rgba[rgbaOffset + 3] = 255
            } else if (png.colorType === 2) {
                const rowOffset = x * 3

                rgba[rgbaOffset] = row[rowOffset]
                rgba[rgbaOffset + 1] = row[rowOffset + 1]
                rgba[rgbaOffset + 2] = row[rowOffset + 2]
                rgba[rgbaOffset + 3] = 255
            } else if (png.colorType === 3) {
                const paletteIndex = row[x]
                const paletteOffset = paletteIndex * 3

                if (paletteOffset + 2 >= png.palette.length) {
                    throw new Error('Logo PNG palette is invalid.')
                }

                rgba[rgbaOffset] = png.palette[paletteOffset]
                rgba[rgbaOffset + 1] = png.palette[paletteOffset + 1]
                rgba[rgbaOffset + 2] = png.palette[paletteOffset + 2]
                rgba[rgbaOffset + 3] = png.transparency[paletteIndex] ?? 255
            } else if (png.colorType === 4) {
                const rowOffset = x * 2
                const gray = row[rowOffset]

                rgba[rgbaOffset] = gray
                rgba[rgbaOffset + 1] = gray
                rgba[rgbaOffset + 2] = gray
                rgba[rgbaOffset + 3] = row[rowOffset + 1]
            } else if (png.colorType === 6) {
                const rowOffset = x * 4

                rgba[rgbaOffset] = row[rowOffset]
                rgba[rgbaOffset + 1] = row[rowOffset + 1]
                rgba[rgbaOffset + 2] = row[rowOffset + 2]
                rgba[rgbaOffset + 3] = row[rowOffset + 3]
            }
        }
    }

    return rgba
}

function resizeRgbaToSquare(source, size) {
    const output = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y += 1) {
        const sourceY = Math.min(source.height - 1, Math.floor((y * source.height) / size))

        for (let x = 0; x < size; x += 1) {
            const sourceX = Math.min(source.width - 1, Math.floor((x * source.width) / size))
            const sourceOffset = (sourceY * source.width + sourceX) * 4
            const outputOffset = (y * size + x) * 4

            output[outputOffset] = source.data[sourceOffset]
            output[outputOffset + 1] = source.data[sourceOffset + 1]
            output[outputOffset + 2] = source.data[sourceOffset + 2]
            output[outputOffset + 3] = source.data[sourceOffset + 3]
        }
    }

    return output
}

function createBitmapInfoHeader(size, pixelLength, maskLength) {
    const header = Buffer.alloc(40)

    header.writeUInt32LE(40, 0)
    header.writeInt32LE(size, 4)
    header.writeInt32LE(size * 2, 8)
    header.writeUInt16LE(1, 12)
    header.writeUInt16LE(32, 14)
    header.writeUInt32LE(0, 16)
    header.writeUInt32LE(pixelLength + maskLength, 20)
    header.writeInt32LE(0, 24)
    header.writeInt32LE(0, 28)
    header.writeUInt32LE(0, 32)
    header.writeUInt32LE(0, 36)

    return header
}

function createIcoFromRgba(rgba, size) {
    const pixelLength = size * size * 4
    const maskRowLength = Math.ceil(size / 32) * 4
    const maskLength = maskRowLength * size
    const bitmapHeader = createBitmapInfoHeader(size, pixelLength, maskLength)
    const bitmapPixels = Buffer.alloc(pixelLength)
    const mask = Buffer.alloc(maskLength)

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            const sourceOffset = (y * size + x) * 4
            const outputOffset = ((size - 1 - y) * size + x) * 4

            bitmapPixels[outputOffset] = rgba[sourceOffset + 2]
            bitmapPixels[outputOffset + 1] = rgba[sourceOffset + 1]
            bitmapPixels[outputOffset + 2] = rgba[sourceOffset]
            bitmapPixels[outputOffset + 3] = rgba[sourceOffset + 3]
        }
    }

    const iconImage = Buffer.concat([bitmapHeader, bitmapPixels, mask])
    const iconDirectory = Buffer.alloc(22)

    iconDirectory.writeUInt16LE(0, 0)
    iconDirectory.writeUInt16LE(1, 2)
    iconDirectory.writeUInt16LE(1, 4)
    iconDirectory[6] = size
    iconDirectory[7] = size
    iconDirectory[8] = 0
    iconDirectory[9] = 0
    iconDirectory.writeUInt16LE(1, 10)
    iconDirectory.writeUInt16LE(32, 12)
    iconDirectory.writeUInt32LE(iconImage.length, 14)
    iconDirectory.writeUInt32LE(iconDirectory.length, 18)

    return Buffer.concat([iconDirectory, iconImage])
}

function decodePngToRgba(buffer) {
    const png = parsePng(buffer)
    const rows = unfilterPngRows(png)

    return {
        width: png.width,
        height: png.height,
        data: convertRowsToRgba(png, rows),
    }
}

async function main() {
    const inputPath = resolve(readArg('--input', 'public/brand/app-logo.png'))
    const outputPath = resolve(readArg('--output', 'public/favicon.ico'))
    const logoBuffer = await readFile(inputPath)
    const source = decodePngToRgba(logoBuffer)
    const resizedRgba = resizeRgbaToSquare(source, FAVICON_SIZE)
    const faviconBuffer = createIcoFromRgba(resizedRgba, FAVICON_SIZE)

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, faviconBuffer)

    console.log(`Generated ${FAVICON_SIZE}x${FAVICON_SIZE} favicon.ico from ${inputPath}`)
}

main().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
