import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function assertMatchesInOrder(content, patterns) {
    let cursor = -1

    for (const pattern of patterns) {
        const match = content.slice(cursor + 1).match(pattern)

        assert.notEqual(match?.index, undefined, `Missing ordered pattern: ${pattern}`)

        cursor += match.index + 1
    }
}

test('project workflow guide records the real project development route', () => {
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')
    const readme = readFileSync('README.md', 'utf8')
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')

    assert.match(workflow, /AGENTS\.md/)
    assert.match(workflow, /PROJECT_SETUP\.md/)
    assert.match(workflow, /PROJECT_TERMS\.md/)
    assert.match(workflow, /\.env\.example/)
    assert.match(workflow, /pnpm env:init/)
    assert.match(workflow, /pnpm dev/)
    assert.match(workflow, /pnpm test/)
    assert.match(workflow, /pnpm lint/)
    assert.match(workflow, /pnpm build/)
    assert.match(workflow, /AI startup prompt/)
    assert.match(workflow, /Empty project prompt/)
    assert.match(workflow, /https:\/\/github\.com\/misitesun\/react_dapp_demo\.git/)
    assert.match(workflow, /目标空目录/)
    assert.match(workflow, /Figma page prompt/)
    assert.match(workflow, /Template feedback prompt/)
    assert.match(workflow, /usePageRefresh/)
    assert.match(workflow, /useLatestRequest/)
    assert.match(workflow, /PROJECT_SETUP_STATUS\.md/)
    assert.match(workflow, /next-step guidance/)
    assert.match(workflow, /下一步引导/)
    assert.match(workflow, /completion summary/)
    assert.match(workflow, /完成总结/)
    assert.match(workflow, /automatic theme color extraction/i)
    assert.match(workflow, /页面实现时自动抽取公共颜色/)
    assert.match(workflow, /主题 SCSS 配置/)
    assert.match(workflow, /src\/styles\/color\.scss/)
    assert.match(workflow, /developer does not need to confirm theme colors/i)
    assert.match(workflow, /开发者不需要[\s\S]*确认[\s\S]*颜色/)
    assert.match(workflow, /only ask[\s\S]*project-wide theme direction/i)
    assert.match(workflow, /只有[\s\S]*全项目主题方向/)
    assert.match(workflow, /first designed page/)
    assert.match(workflow, /第一个设计页面/)
    assert.match(workflow, /manually export[\s\S]*page assets/i)
    assert.match(workflow, /手动导出[\s\S]*切图资源/)
    assert.match(workflow, /Figma slicing[\s\S]*too free-form/i)
    assert.match(workflow, /不要自行猜测或静默下载随意切片/)
    assert.match(agentRules, /manually export[\s\S]*page assets/i)
    assert.match(agentRules, /Figma export and slicing choices[\s\S]*very flexible/i)
    assert.doesNotMatch(workflow, /theme token pack[\s\S]{0,240}ask for one confirmation/i)
    assert.doesNotMatch(workflow, /主题 token 包[\s\S]{0,240}一次确认/)
    assert.match(workflow, /Figma page/)
    assert.match(workflow, /API integration/)
    assert.match(workflow, /DApp and contract/)
    assert.match(workflow, /showcase/)

    assert.match(readme, /PROJECT_WORKFLOW\.md/)
    assert.match(setup, /PROJECT_WORKFLOW\.md/)
    assert.match(agentRules, /PROJECT_WORKFLOW\.md/)
    assert.match(setup, /下一步引导/)
    assert.match(agentRules, /下一步引导/)
    assert.match(setup, /主题 SCSS 配置/)
    assert.match(agentRules, /主题 SCSS 配置/)
    assert.match(setup, /页面实现时自动抽取公共颜色/)
    assert.match(agentRules, /页面实现时自动抽取公共颜色/)
})

test('empty project startup flow runs the dev server before the first setup question', () => {
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')

    assert.match(workflow, /template is copied/)
    assert.match(workflow, /pnpm install/)
    assert.match(workflow, /pnpm env:init/)
    assert.match(workflow, /pnpm dev/)
    assert.match(workflow, /Local/)
    assert.match(workflow, /Network/)
    assert.match(workflow, /局域网/)
    assert.match(workflow, /first setup question/)
    assert.match(workflow, /第一个初始化问题/)
    assert.match(workflow, /default setup pack/)
    assert.match(workflow, /默认配置包/)
    assert.match(workflow, /only grouped setup question/i)
    assert.match(workflow, /唯一可以合并询问/)
    assert.match(workflow, /non-default setup items/i)
    assert.match(workflow, /非默认初始化项/)
    assert.match(workflow, /one at a time/i)
    assert.match(workflow, /一次只问一项/)
    assert.match(workflow, /Do not ask for the project name/i)
    assert.match(workflow, /不要在同一轮询问项目名称/)
    assert.match(workflow, /project logo/i)
    assert.match(workflow, /Empty component icon/)
    assert.match(workflow, /env values/i)
    assert.match(workflow, /contract addresses/i)
    assert.match(workflow, /reply `默认`/)
    assert.match(workflow, /回复 `默认`/)
    assert.match(workflow, /菜单 tabbar/)
    assert.match(workflow, /多语言关闭/)
    assert.match(workflow, /可选项/)
    assert.match(workflow, /sidebar/)
    assert.match(workflow, /tabbar/)
    assert.match(workflow, /dapp/)
    assert.match(workflow, /hybrid/)
    assert.match(workflow, /account/)
    assert.match(workflow, /other viem chain/)
    assert.match(workflow, /development[\s\S]*zh-Hans/)
    assert.match(workflow, /production[\s\S]*en/)
    assert.match(workflow, /gas check disabled/)
    assert.match(workflow, /gas estimate disabled/)
    assert.match(workflow, /specific amount/)
    assert.match(workflow, /other decimals/)
    assert.match(setup, /first setup question/)
    assert.match(setup, /局域网/)
    assert.match(setup, /only grouped setup question/i)
    assert.match(setup, /非默认初始化项/)
    assert.match(agentRules, /first setup question/)
    assert.match(agentRules, /局域网/)
    assert.match(agentRules, /only grouped setup question/i)
    assert.match(agentRules, /非默认初始化项/)
    assert.doesNotMatch(workflow, /project name and the default setup pack together/i)
    assert.doesNotMatch(workflow, /项目名称和默认配置包一起/)
    assert.doesNotMatch(setup, /project name and the default setup pack together/i)
    assert.doesNotMatch(setup, /项目名称和默认配置包一起/)
    assert.doesNotMatch(agentRules, /project name and the default setup pack together/i)
    assert.doesNotMatch(agentRules, /项目名称和默认配置包一起/)
    assertMatchesInOrder(workflow, [
        /default setup pack/i,
        /Ask for the project name/i,
        /Ask whether the project logo/i,
        /Ask whether the Empty component icon/i,
    ])
})

test('post-setup development workflow is sequential with skippable contract preparation', () => {
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')
    const setup = readFileSync('PROJECT_SETUP.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')

    assertMatchesInOrder(workflow, [
        /static pages/i,
        /API documentation/i,
        /Contract documentation/i,
        /Feature logic integration/i,
        /Pre-build preparation/i,
    ])

    assert.match(workflow, /fixed post-setup development sequence/i)
    assert.match(workflow, /Do not enter the next step until the current step is complete/i)
    assert.match(workflow, /Step 3 is the only skippable step/i)
    assert.match(workflow, /If API documentation is ready before contract documentation/i)
    assert.match(workflow, /record the skipped contract step in `PROJECT_SETUP_STATUS\.md`/)
    assert.match(workflow, /continue to Step 4/)
    assert.match(workflow, /VITE_BASE_URL/)
    assert.match(workflow, /VITE_RPC_URL/)
    assert.match(workflow, /animate\.css/)
    assert.match(workflow, /translate all static page copy/i)
    assert.match(workflow, /docs\/dapp-project-integration\.md/)
    assert.match(workflow, /dapp-project-integration/)

    assert.match(setup, /fixed post-setup development sequence/i)
    assert.match(setup, /Step 3 can be skipped/i)

    assert.match(agentRules, /fixed post-setup development sequence/i)
    assert.match(agentRules, /Do not enter the next step until the current step is complete/i)
    assert.match(agentRules, /Step 3 is the only skippable step/i)
    assert.match(agentRules, /record the skipped contract step/)
})

test('figma page workflow protects shared modules and ignores device chrome', () => {
    const workflow = readFileSync('PROJECT_WORKFLOW.md', 'utf8')
    const agentRules = readFileSync('AGENTS.md', 'utf8')

    for (const content of [workflow, agentRules]) {
        assert.match(content, /shared module[\s\S]*overall[\s\S]*layout/i)
        assert.match(content, /公共模块[\s\S]*整体布局/)
        assert.match(content, /content-level[\s\S]*adaptation/i)
        assert.match(content, /内容级适配/)
        assert.match(content, /reorder[\s\S]*inside[\s\S]*slot/i)
        assert.match(content, /调整[\s\S]*顺序/)
        assert.match(content, /hide[\s\S]*app name/i)
        assert.match(content, /隐藏[\s\S]*appname|隐藏[\s\S]*项目名/i)
        assert.match(content, /replace[\s\S]*resources[\s\S]*configuration/i)
        assert.match(content, /替换资源/)
        assert.match(content, /manual[\s\S]*intervention/i)
        assert.match(content, /人工手动介入/)
        assert.match(content, /mobile status bar|device chrome/i)
        assert.match(content, /手机信息状态栏/)
        assert.match(content, /H5/)
    }
})
