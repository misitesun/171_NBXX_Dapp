import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
const skillNames = [
    'dapp-change-review',
    'dapp-cross-cutting-change',
    'dapp-feature-delivery',
    'dapp-project-integration',
    'dapp-react-engineering',
]

function readRepositoryFile(relativePath) {
    return readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8')
}

test('AI governance skills expose a stable local entry point', () => {
    for (const skillName of skillNames) {
        const skillPath = new URL(`../.agents/skills/${skillName}/SKILL.md`, import.meta.url)
        const metadataPath = new URL(`../.agents/skills/${skillName}/agents/openai.yaml`, import.meta.url)

        assert.equal(existsSync(skillPath), true, `${skillName} must have SKILL.md`)
        assert.equal(existsSync(metadataPath), true, `${skillName} must have OpenAI metadata`)
        assert.match(readFileSync(skillPath, 'utf8'), new RegExp(`name: ${skillName}`))
    }
})

test('governance validators accept the repository contracts', () => {
    for (const scriptName of ['validate-ai-skills.mjs', 'validate-module-docs.mjs']) {
        const result = spawnSync(process.execPath, [`scripts/${scriptName}`], {
            cwd: repositoryRoot,
            encoding: 'utf8',
        })

        assert.equal(result.status, 0, result.stderr || result.stdout)
    }
})

test('TypeScript compiler configurations keep the approved strict baseline', () => {
    for (const configPath of ['tsconfig.app.json', 'tsconfig.node.json']) {
        const config = readRepositoryFile(configPath)

        assert.match(config, /"strict": true/)
        assert.match(config, /"noImplicitReturns": true/)
    }
})

test('real-project DApp integration remains contract-first and legacy-safe', () => {
    const playbook = readRepositoryFile('docs/dapp-project-integration.md')
    const skill = readRepositoryFile('.agents/skills/dapp-project-integration/SKILL.md')
    const decision = readRepositoryFile('docs/decisions/0003-project-dapp-integration-boundary.md')

    assert.match(playbook, /Source-of-truth order/)
    assert.match(playbook, /Legacy code must never supply/)
    assert.match(playbook, /Server-signed raw data is preserved/)
    assert.match(skill, /legacy code can only reveal a question/)
    assert.match(skill, /Do not invent fields, ABI items, addresses/)
    assert.match(decision, /Current project ABI Markdown and PHP API Markdown are the source of truth/)
})

test('mutation success is not coupled to parsing an unused response body', () => {
    const agentRules = readRepositoryFile('AGENTS.md')
    const collaboration = readRepositoryFile('docs/ai-collaboration.md')
    const apiBoundary = readRepositoryFile('docs/php-api-contracts.md')
    const integrationPlaybook = readRepositoryFile('docs/dapp-project-integration.md')
    const compatibility = readRepositoryFile('docs/compatibility.md')
    const decision = readRepositoryFile('docs/decisions/0006-api-mutation-success-boundary.md')
    const featureSkill = readRepositoryFile('.agents/skills/dapp-feature-delivery/SKILL.md')
    const integrationSkill = readRepositoryFile('.agents/skills/dapp-project-integration/SKILL.md')
    const reviewSkill = readRepositoryFile('.agents/skills/dapp-change-review/SKILL.md')

    for (const source of [agentRules, apiBoundary, integrationPlaybook, decision, featureSkill, integrationSkill]) {
        assert.match(source, /Promise<void>/)
        assert.match(source, /unused|未使用/i)
    }

    assert.match(collaboration, /success body/)
    assert.match(compatibility, /duplicate write/)
    assert.match(apiBoundary, /refresh failure.*submission failure/is)
    assert.match(reviewSkill, /parsing of an unused success body/)
    assert.match(reviewSkill, /duplicate-write risk/)
})

test('Figma implementation requires measured visual fidelity instead of screenshot guesses', () => {
    const agentRules = readRepositoryFile('AGENTS.md')
    const workflow = readRepositoryFile('PROJECT_WORKFLOW.md')
    const collaboration = readRepositoryFile('docs/ai-collaboration.md')
    const featureSkill = readRepositoryFile('.agents/skills/dapp-feature-delivery/SKILL.md')
    const reactSkill = readRepositoryFile('.agents/skills/dapp-react-engineering/SKILL.md')
    const decision = readRepositoryFile('docs/decisions/0004-figma-measured-fidelity.md')

    for (const source of [agentRules, workflow, collaboration, featureSkill, reactSkill, decision]) {
        assert.match(source, /Figma/)
        assert.match(source, /estimate/i)
        assert.match(source, /frame width/i)
    }

    assert.match(agentRules, /font family, weight, size, line height and letter spacing/)
    assert.match(agentRules, /gradient type, angle, stops, positions and opacity/)
    assert.match(decision, /Measured Figma layer properties are the source of truth/)
})
