import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

test('contract loading wraps popup and blocks interaction during contract writes', async () => {
    assert.equal(existsSync('src/components/CusLoading/CusLoading.tsx'), false)
    assert.equal(existsSync('src/components/CusLoading/index.ts'), false)

    const [component, styles, entry, readme, showcasePage, showcaseStyle] = await Promise.all([
        readFile('src/components/ContractLoading/ContractLoading.tsx', 'utf8'),
        readFile('src/components/ContractLoading/ContractLoading.scss', 'utf8'),
        readFile('src/components/ContractLoading/index.ts', 'utf8'),
        readFile('src/components/ContractLoading/README.md', 'utf8'),
        readFile('src/showcase/components/contract-loading/ContractLoadingShowcasePage.tsx', 'utf8'),
        readFile('src/showcase/components/contract-loading/ContractLoadingShowcasePage.scss', 'utf8'),
    ])

    assert.match(component, /import \{ Popup \} from '@\/components\/Popup'/)
    assert.match(component, /import \{ DropletLoading \} from '@\/components\/DropletLoading'/)
    assert.match(component, /export interface ContractLoadingProps/)
    assert.match(component, /show:\s*boolean/)
    assert.match(component, /<Popup\s+show=\{show\}/)
    assert.match(component, /position="center"/)
    assert.match(component, /contentPreset=\{false\}/)
    assert.match(component, /closeOnOverlayClick=\{false\}/)
    assert.match(component, /enterAnimation="fadeIn"/)
    assert.match(component, /leaveAnimation="fadeOut"/)
    assert.match(component, /<DropletLoading/)
    assert.match(component, /className=\{`contract-loading\$\{tone === 'green' \? ' contract-loading--green' : ''\} \$\{className\}`\.trim\(\)\}/)
    assert.match(component, /ariaLabel="Contract loading"/)

    assert.match(styles, /\.contract-loading-popup/)
    assert.match(styles, /z-index:\s*1000000/)
    assert.match(styles, /&__content \{[\s\S]*?background: transparent;/)

    assert.match(entry, /export \{ ContractLoading \} from '\.\/ContractLoading\.tsx'/)
    assert.match(entry, /export type \{ ContractLoadingProps \} from '\.\/ContractLoading\.tsx'/)
    assert.match(readme, /contract write waiting states/)
    assert.match(readme, /写合约等待/)
    assert.match(readme, /Popup/)
    assert.match(readme, /DropletLoading/)
    assert.match(readme, /40px `small` variant/)
    assert.match(showcasePage, /export function ContractLoadingShowcasePage/)
    assert.match(showcasePage, /useRef<number \| undefined>\(undefined\)/)
    assert.match(showcasePage, /window\.setTimeout/)
    assert.match(showcasePage, /<SecondaryHeader title="合约 Loading" \/>/)
    assert.match(showcasePage, /<ContractLoading show=\{showLoading\} \/>/)
    assert.match(showcaseStyle, /\.contract-loading-showcase\s*\{/)
})
