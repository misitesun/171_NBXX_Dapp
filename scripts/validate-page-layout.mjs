import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { relative, resolve } from 'node:path'

const PAGE_STYLES_DIRECTORY = 'src/pages'
const SHARED_LAYOUT_PREFIX = 'src/pages/main/layout/'
const POSITION_EXCEPTION_PATTERN = /\/\*\s*layout-exception:\s*(background-art|icon-overlay|badge-overlay|viewport-overlay)\s+(.+?)\s*\*\//i
const POSITION_PATTERN = /^\s*position\s*:\s*(absolute|fixed|sticky)\s*(?:!important\s*)?;/i

function collectScssFiles(directoryPath) {
    if (!existsSync(directoryPath)) return []

    return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = resolve(directoryPath, entry.name)

        if (entry.isDirectory()) {
            return collectScssFiles(entryPath)
        }

        return entry.isFile() && entry.name.endsWith('.scss') ? [entryPath] : []
    })
}

export function validatePageStyleContent(content, relativePath) {
    const violations = []
    const lines = content.split(/\r?\n/)

    for (const [index, line] of lines.entries()) {
        const positionMatch = line.match(POSITION_PATTERN)

        if (positionMatch === null) continue

        const previousLine = lines[index - 1]?.trim() ?? ''
        const exceptionMatch = previousLine.match(POSITION_EXCEPTION_PATTERN)

        if (exceptionMatch === null) {
            violations.push(
                `${relativePath}:${index + 1} uses position: ${positionMatch[1].toLowerCase()} without an immediate layout-exception comment`,
            )
        }
    }

    return violations
}

export function validatePageLayouts(rootDirectory = process.cwd()) {
    const pageStylesDirectory = resolve(rootDirectory, PAGE_STYLES_DIRECTORY)
    const pageStylePaths = collectScssFiles(pageStylesDirectory)
    const violations = []
    let scannedFiles = 0

    for (const stylePath of pageStylePaths) {
        const relativePath = relative(rootDirectory, stylePath).replaceAll('\\', '/')

        if (relativePath.startsWith(SHARED_LAYOUT_PREFIX)) continue

        scannedFiles += 1
        violations.push(
            ...validatePageStyleContent(readFileSync(stylePath, 'utf8'), relativePath),
        )
    }

    return { scannedFiles, violations }
}

function runValidation() {
    const { scannedFiles, violations } = validatePageLayouts()

    if (violations.length > 0) {
        console.error('Page layout validation failed:')
        console.error(violations.map((violation) => `- ${violation}`).join('\n'))
        process.exitCode = 1
        return
    }

    console.log(`Page layout validation passed (${scannedFiles} page style files).`)
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    runValidation()
}
