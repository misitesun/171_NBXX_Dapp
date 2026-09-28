import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import {
    dirname,
    join,
    resolve,
} from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const createPackageDir = join(rootDir, 'packages/create-template-react')
const archivePath = join(createPackageDir, 'template.tgz')
const stagingDir = mkdtempSync(join(tmpdir(), 'template-react-pack-'))
const templateDir = join(stagingDir, 'template')

const EXCLUDED_PREFIXES = [
    'dist/',
    'dist-ssr/',
    'node_modules/',
    'packages/create-template-react/',
]
const EXCLUDED_FILES = new Set([
    '.DS_Store',
    '.env.development',
    '.env.production',
])

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        encoding: 'utf8',
        ...options,
    })

    if (result.status !== 0) {
        throw new Error(result.stderr || result.stdout || `${command} failed`)
    }

    return result.stdout
}

function shouldInclude(file) {
    if (EXCLUDED_FILES.has(file)) return false

    return !EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix))
}

function getTemplateFiles() {
    const output = run('git', ['ls-files', '-co', '--exclude-standard', '-z'])

    return output
        .split('\0')
        .filter(Boolean)
        .filter(shouldInclude)
        .filter((file) => existsSync(join(rootDir, file)))
}

function copyTemplateFiles(files) {
    mkdirSync(templateDir, {
        recursive: true,
    })

    for (const file of files) {
        const source = join(rootDir, file)
        const target = join(templateDir, file)

        mkdirSync(dirname(target), {
            recursive: true,
        })
        cpSync(source, target, {
            recursive: true,
        })
    }
}

function removeTemplatePublisherScripts() {
    const packageJsonPath = join(templateDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    delete packageJson.scripts?.['create:pack']
    delete packageJson.scripts?.['create:local']
    delete packageJson.scripts?.['create:publish']

    writeFileSync(`${packageJsonPath}`, `${JSON.stringify(packageJson, null, 4)}\n`)
}

function createArchive() {
    if (existsSync(archivePath)) {
        rmSync(archivePath, {
            force: true,
        })
    }

    mkdirSync(createPackageDir, {
        recursive: true,
    })

    run('tar', [
        '-czf',
        archivePath,
        '-C',
        stagingDir,
        'template',
    ], {
        stdio: 'pipe',
    })
}

try {
    const files = getTemplateFiles()

    copyTemplateFiles(files)
    removeTemplatePublisherScripts()
    createArchive()

    console.log(`Packed ${files.length} files into ${archivePath}`)
} finally {
    rmSync(stagingDir, {
        recursive: true,
        force: true,
    })
}
