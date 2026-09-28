import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

test('template uses pnpm as the package manager', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const readme = readFileSync('README.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')

    assert.match(packageJson.packageManager, /^pnpm@\d+\.\d+\.\d+$/)
    assert.equal(packageJson.scripts.preinstall, 'node scripts/ensure-pnpm.mjs')
    assert.equal(packageJson.scripts.predev, 'node scripts/ensure-pnpm.mjs')
    assert.match(packageJson.scripts.prebuild, /^node scripts\/ensure-pnpm\.mjs/)
    assert.match(packageJson.scripts.prebuild, /pnpm verify/)
    assert.match(packageJson.scripts.prebuild, /verify-brand-assets\.mjs/)
    assert.equal(packageJson.scripts.prelint, 'node scripts/ensure-pnpm.mjs')
    assert.equal(packageJson.scripts.pretest, 'node scripts/ensure-pnpm.mjs')
    assert.equal(packageJson.scripts.prepreview, 'node scripts/ensure-pnpm.mjs')
    assert.match(packageJson.scripts.dev, /vite --host 0\.0\.0\.0/)
    assert.equal(packageJson.scripts.verify, 'pnpm lint && pnpm test')
    assert.equal(packageJson.name, '@jcy/template-react')
    assert.equal(packageJson.private, undefined)

    assert.equal(existsSync('pnpm-lock.yaml'), true)
    assert.equal(existsSync('package-lock.json'), false)
    assert.equal(existsSync('yarn.lock'), false)

    assert.match(readme, /pnpm install/)
    assert.match(readme, /pnpm dev/)
    assert.match(readme, /pnpm build/)
    assert.match(readme, /pnpm test/)
    assert.match(readme, /pnpm lint/)

    assert.match(agentRules, /pnpm test/)
    assert.match(agentRules, /pnpm build/)
    assert.match(agentRules, /pnpm lint/)
    assert.match(agentRules, /Do not ask which package manager/i)
    assert.match(agentRules, /不要询问包管理器/)
    assert.match(setup, /Do not ask which package manager/i)
    assert.match(setup, /不要询问包管理器/)
    assert.match(workflow, /Do not ask which package manager/i)
    assert.match(workflow, /不要询问包管理器/)
    assert.match(workflow, /pnpm is fixed/i)
    assert.match(workflow, /pnpm 是固定/)
    assert.doesNotMatch(workflow, /fixed use npm/i)
    assert.doesNotMatch(workflow, /固定使用 npm/)
})

test('package manager guard allows pnpm and rejects npm or yarn', () => {
    const runGuard = (userAgent) => spawnSync(
        process.execPath,
        ['scripts/ensure-pnpm.mjs'],
        {
            encoding: 'utf8',
            env: {
                ...process.env,
                npm_config_user_agent: userAgent,
            },
        },
    )

    assert.equal(runGuard('pnpm/10.28.2 npm/? node/v24.0.0 darwin arm64').status, 0)
    assert.notEqual(runGuard('npm/11.0.0 node/v24.0.0 darwin arm64').status, 0)
    assert.notEqual(runGuard('yarn/1.22.22 npm/? node/v24.0.0 darwin arm64').status, 0)
})
