import test from 'node:test'
import assert from 'node:assert/strict'
import {
    existsSync,
    mkdtempSync,
    readFileSync,
    symlinkSync,
    statSync,
} from 'node:fs'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

function run(command, args, options = {}) {
    return spawnSync(command, args, {
        cwd: process.cwd(),
        encoding: 'utf8',
        ...options,
    })
}

test('create package exposes a pnpm dlx friendly CLI package', () => {
    const rootPackageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const packageJson = JSON.parse(
        readFileSync('packages/create-template-react/package.json', 'utf8'),
    )
    const readme = readFileSync('README.md', 'utf8')
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')

    assert.equal(packageJson.name, '@jcy/create-template-react')
    assert.equal(packageJson.version, '0.1.0')
    assert.equal(packageJson.type, 'module')
    assert.equal(packageJson.publishConfig, undefined)
    assert.equal(packageJson.bin['create-template-react'], 'bin/create-template-react')
    assert.deepEqual(packageJson.files, [
        'bin',
        'template.tgz',
        'README.md',
    ])
    assert.equal(
        Boolean(statSync('packages/create-template-react/bin/create-template-react').mode & 0o111),
        true,
    )

    assert.match(rootPackageJson.scripts['create:local'], /pnpm create:pack/)
    assert.match(rootPackageJson.scripts['create:local'], /pnpm --dir packages\/create-template-react pack/)
    assert.equal(rootPackageJson.scripts['create:publish'], undefined)
    assert.match(readme, /pnpm create:local/)
    assert.match(readme, /pnpm dlx \.\/packages\/create-template-react\/jcy-create-template-react-0\.1\.0\.tgz \.\.\/my-dapp/)
    assert.match(workflow, /pnpm dlx \.\/packages\/create-template-react\/jcy-create-template-react-0\.1\.0\.tgz/)
    assert.match(workflow, /https:\/\/github\.com\/misitesun\/react_dapp_demo\.git/)
})

test('create package builds a template archive and creates a project from it', async () => {
    const target = mkdtempSync(join(tmpdir(), 'template-react-created-'))

    try {
        const packResult = run('pnpm', ['create:pack'])

        assert.equal(packResult.status, 0, packResult.stderr || packResult.stdout)

        const archivePath = 'packages/create-template-react/template.tgz'

        assert.equal(existsSync(archivePath), true)
        assert.equal(statSync(archivePath).size > 0, true)

        const createResult = run('node', [
            'packages/create-template-react/bin/create-template-react',
            target,
        ])

        assert.equal(createResult.status, 0, createResult.stderr || createResult.stdout)
        assert.match(createResult.stdout, /pnpm install/)
        assert.match(createResult.stdout, /pnpm dev/)

        assert.equal(existsSync(join(target, 'package.json')), true)
        assert.equal(existsSync(join(target, 'AGENTS.md')), true)
        assert.equal(existsSync(join(target, 'src')), true)
        assert.equal(existsSync(join(target, '.env.example')), true)
        assert.equal(existsSync(join(target, '.env.development')), true)
        assert.equal(existsSync(join(target, '.env.production')), true)
        assert.equal(existsSync(join(target, 'pnpm-lock.yaml')), true)
        assert.equal(existsSync(join(target, 'node_modules')), false)
        assert.equal(existsSync(join(target, 'dist')), false)
        assert.equal(existsSync(join(target, 'packages/create-template-react')), false)
        assert.equal(existsSync(join(target, 'src/pages/main/home/HomePage.tsx')), true)
        assert.equal(existsSync(join(target, 'src/pages/main/stake')), false)
        assert.equal(existsSync(join(target, 'src/features/auth')), true)
        assert.equal(existsSync(join(target, 'src/services/dapp/uniswapV2Router.ts')), false)

        const createdPackageJson = JSON.parse(
            readFileSync(join(target, 'package.json'), 'utf8'),
        )

        assert.equal(createdPackageJson.name, '@jcy/template-react')
        assert.equal(createdPackageJson.scripts['create:pack'], undefined)
        assert.equal(createdPackageJson.scripts['create:local'], undefined)
        assert.equal(createdPackageJson.scripts['create:publish'], undefined)

        const createdProductionEnv = readFileSync(join(target, '.env.production'), 'utf8')

        assert.doesNotMatch(createdProductionEnv, /^#/m)
        assert.match(createdProductionEnv, /VITE_BASE_URL\s*=/)

        symlinkSync(
            join(process.cwd(), 'node_modules'),
            join(target, 'node_modules'),
            process.platform === 'win32' ? 'junction' : 'dir',
        )

        const appTypecheck = run(process.execPath, [
            join(process.cwd(), 'node_modules/typescript/bin/tsc'),
            '-p',
            'tsconfig.app.json',
            '--noEmit',
            '--incremental',
            'false',
        ], { cwd: target })
        assert.equal(appTypecheck.status, 0, appTypecheck.stderr || appTypecheck.stdout)

        const nodeTypecheck = run(process.execPath, [
            join(process.cwd(), 'node_modules/typescript/bin/tsc'),
            '-p',
            'tsconfig.node.json',
            '--noEmit',
            '--incremental',
            'false',
        ], { cwd: target })
        assert.equal(nodeTypecheck.status, 0, nodeTypecheck.stderr || nodeTypecheck.stdout)

        const bundleResult = run(process.execPath, [
            join(process.cwd(), 'node_modules/vite/bin/vite.js'),
            'build',
        ], { cwd: target })
        assert.equal(bundleResult.status, 0, bundleResult.stderr || bundleResult.stdout)
        assert.equal(existsSync(join(target, 'dist/index.html')), true)
    } finally {
        await rm(target, {
            recursive: true,
            force: true,
        })
    }
})

test('create CLI refuses to overwrite a non-empty project directory', async () => {
    const target = mkdtempSync(join(tmpdir(), 'template-react-non-empty-'))

    try {
        const marker = join(target, 'already-here.txt')
        const touchResult = run('node', [
            '-e',
            `import { writeFileSync } from 'node:fs'; writeFileSync(${JSON.stringify(marker)}, 'x')`,
        ])

        assert.equal(touchResult.status, 0, touchResult.stderr || touchResult.stdout)

        run('pnpm', ['create:pack'])

        const createResult = run('node', [
            'packages/create-template-react/bin/create-template-react',
            target,
        ])

        assert.notEqual(createResult.status, 0)
        assert.match(createResult.stderr, /not empty/i)
    } finally {
        await rm(target, {
            recursive: true,
            force: true,
        })
    }
})
