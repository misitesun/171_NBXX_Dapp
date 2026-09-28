import {
    access,
    readFile,
    writeFile,
} from 'node:fs/promises'
import { join, resolve } from 'node:path'

const TARGET_ENV_FILES = [
    '.env.development',
    '.env.production',
]

function getRootFromArgs() {
    const rootIndex = process.argv.indexOf('--root')

    if (rootIndex < 0) {
        return process.cwd()
    }

    return resolve(process.argv[rootIndex + 1] ?? process.cwd())
}

async function pathExists(path) {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

function createRuntimeEnvContent(example) {
    const lines = example
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter((line) => !line.trimStart().startsWith('#'))

    const runtimeLines = []

    for (const line of lines) {
        const previousLine = runtimeLines.at(-1)

        if (!line && !previousLine) {
            continue
        }

        runtimeLines.push(line)
    }

    while (runtimeLines.at(-1) === '') {
        runtimeLines.pop()
    }

    return `${runtimeLines.join('\n')}\n`
}

async function createEnvFiles() {
    const root = getRootFromArgs()
    const examplePath = join(root, '.env.example')
    const example = await readFile(examplePath, 'utf8')
    const runtimeEnv = createRuntimeEnvContent(example)

    for (const file of TARGET_ENV_FILES) {
        const targetPath = join(root, file)

        if (await pathExists(targetPath)) {
            console.log(`skip ${file}`)
            continue
        }

        await writeFile(targetPath, runtimeEnv)
        console.log(`create ${file}`)
    }
}

await createEnvFiles()
