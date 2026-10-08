import test from 'node:test'
import assert from 'node:assert/strict'
import {
    existsSync,
    readdirSync,
    readFileSync,
    statSync,
} from 'node:fs'
import { join } from 'node:path'

function collectSourceFiles(directory) {
    return readdirSync(directory).flatMap((name) => {
        const file = join(directory, name)
        const stat = statSync(file)

        if (stat.isDirectory()) {
            return collectSourceFiles(file)
        }

        if (!/\.(ts|tsx|json|scss|md)$/.test(file)) {
            return []
        }

        return [file]
    })
}

test('new project setup guide records template bootstrapping decisions', () => {
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const readme = readFileSync('README.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))

    assert.match(setup, /\.env\.example/)
    assert.match(setup, /\.env\.development/)
    assert.match(setup, /\.env\.production/)
    assert.match(setup, /VITE_BASE_URL/)
    assert.match(setup, /VITE_RPC_URL/)
    assert.match(setup, /project logo/)
    assert.match(setup, /项目 logo/)
    assert.match(setup, /square PNG/)
    assert.match(setup, /正方形 PNG/)
    assert.match(setup, /100x100/)
    assert.match(setup, /Empty component icon/)
    assert.match(setup, /Empty 组件图标/)
    assert.match(setup, /project logo[\s\S]*Empty component icon/)
    assert.match(setup, /项目 logo[\s\S]*Empty 组件图标/)
    assert.match(setup, /empty:asset/)
    assert.match(setup, /1x/)
    assert.match(setup, /2x/)
    assert.match(setup, /width[\s\S]*height[\s\S]*auto/)
    assert.match(setup, /宽度[\s\S]*高度[\s\S]*auto/)
    assert.match(setup, /Figma/)
    assert.match(setup, /PROJECT_TERMS\.md/)
    assert.match(setup, /default setup pack/)
    assert.match(setup, /默认配置包/)
    assert.match(setup, /reply `默认`/)
    assert.match(setup, /回复 `默认`/)
    assert.match(setup, /Route base[\s\S]*\/h5\//)
    assert.match(setup, /home route[\s\S]*\/home/)
    assert.match(setup, /Layout menu[\s\S]*sidebar/)
    assert.match(setup, /Login mode[\s\S]*dapp/)
    assert.match(setup, /i18n[\s\S]*enabled/)
    assert.match(setup, /production chain[\s\S]*BSC/i)
    assert.match(setup, /Available options/)
    assert.match(setup, /可选项/)
    assert.match(setup, /sidebar[\s\S]*side navigation/)
    assert.match(setup, /tabbar[\s\S]*bottom navigation/)
    assert.match(setup, /dapp[\s\S]*wallet/)
    assert.match(setup, /hybrid[\s\S]*wallet[\s\S]*account/)
    assert.match(setup, /account[\s\S]*account/)
    assert.match(setup, /enabled[\s\S]*language switching/)
    assert.match(setup, /development[\s\S]*zh-Hans/)
    assert.match(setup, /production[\s\S]*en/)
    assert.match(setup, /disabled[\s\S]*zh-Hans/)
    assert.match(setup, /BSC[\s\S]*viem/)
    assert.match(setup, /other viem chain/)
    assert.match(setup, /gas check disabled/)
    assert.match(setup, /gas estimate disabled/)
    assert.match(setup, /ERC20[\s\S]*maximum/)
    assert.match(setup, /specific amount/)
    assert.match(setup, /Token decimals[\s\S]*18/)
    assert.match(setup, /other decimals/)
    assert.doesNotMatch(setup, /Project name and package name/)
    assert.doesNotMatch(setup, /项目名称与包名/)
    assert.doesNotMatch(workflow, /Package name/)
    assert.match(setup, /@jcy\/template-react/)
    assert.match(agentRules, /@jcy\/template-react/)
    assert.match(workflow, /@jcy\/template-react/)
    assert.match(workflow, /项目 logo/)
    assert.match(workflow, /正方形 PNG/)
    assert.match(workflow, /100x100/)
    assert.match(workflow, /Empty 组件图标/)
    assert.match(workflow, /empty:asset/)
    assert.match(workflow, /width[\s\S]*height[\s\S]*auto/)
    assert.match(setup, /favicon/)
    assert.match(setup, /logo.*generate/)
    assert.match(setup, /logo 自动生成/)
    assert.match(workflow, /logo 自动生成/)
    assert.match(agentRules, /favicon/)
    assert.match(agentRules, /不要再向开发者索要 favicon/)
    assert.match(agentRules, /default setup pack/)
    assert.match(agentRules, /默认配置包/)
    assert.match(agentRules, /回复 `默认`/)
    assert.match(agentRules, /available options/)
    assert.match(agentRules, /可选项/)
    assert.match(setup, /没有 logo/)
    assert.match(setup, /可先跳过/)
    assert.match(setup, /brand-status\.json/)
    assert.match(workflow, /brand-status\.json/)
    assert.match(workflow, /生产构建/)
    assert.match(agentRules, /brand-status\.json/)
    assert.match(agentRules, /生产构建/)
    assert.match(agentRules, /Empty 组件图标/)
    assert.match(agentRules, /empty:asset/)
    assert.equal(packageJson.scripts['favicon:generate'], 'node scripts/create-favicon-from-logo.mjs')
    assert.equal(packageJson.scripts['empty:asset'], 'node scripts/update-empty-asset.mjs')
    assert.match(packageJson.scripts.prebuild, /verify-brand-assets\.mjs/)
    assert.doesNotMatch(setup, /public\/brand\/app-logo\.png/)
    assert.doesNotMatch(workflow, /public\/brand\/app-logo\.png/)
    assert.doesNotMatch(setup, /Provide `public\/favicon\.ico`/)
    assert.doesNotMatch(workflow, /Provide `public\/favicon\.ico`/)
    assert.doesNotMatch(setup, /Replace `public\/brand\/app-logo\.png`/)
    assert.doesNotMatch(setup, /替换 `public\/brand\/app-logo\.png`/)
    assert.doesNotMatch(setup, /Confirm `PROJECT_TERMS\.md`/)
    assert.doesNotMatch(setup, /确认 `PROJECT_TERMS\.md`/)

    assert.match(readme, /PROJECT_SETUP\.md/)
    assert.match(readme, /PROJECT_TERMS\.md/)
    assert.match(agentRules, /PROJECT_SETUP\.md/)
    assert.match(agentRules, /PROJECT_TERMS\.md/)
})

test('project terminology documents the confirmed project name and confirmation workflow', () => {
    const terms = readFileSync('PROJECT_TERMS.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')
    const files = collectSourceFiles('src')

    assert.match(terms, /intentionally defines no product terms or banned words/)
    assert.match(terms, /基础模板有意不预置任何产品术语或禁用词/)
    assert.match(terms, /开发者确认项目展示名称为 NBXX/)
    assert.match(terms, /\| NodeXX \/ NOdeXX \| NBXX \|/)
    assert.match(agentRules, /base template defines no product vocabulary/)
    assert.match(agentRules, /基础模板不预置产品词汇/)
    assert.equal(files.length > 0, true)
})

test('template provides a single public brand logo for project replacement', () => {
    assert.equal(existsSync('public/brand/app-logo.png'), true)
})
