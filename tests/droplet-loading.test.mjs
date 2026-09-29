import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('droplet loading exposes the contract visual and a 40px inline variant', async () => {
    const [component, styles, entry, readme] = await Promise.all([
        readFile('src/components/DropletLoading/DropletLoading.tsx', 'utf8'),
        readFile('src/components/DropletLoading/DropletLoading.scss', 'utf8'),
        readFile('src/components/DropletLoading/index.ts', 'utf8'),
        readFile('src/components/DropletLoading/README.md', 'utf8'),
    ])

    assert.match(component, /export type DropletLoadingSize = 'regular' \| 'small'/)
    assert.match(component, /const LOADING_DOT_COUNT = 7/)
    assert.match(component, /useId\(\)\.replace\(\/:\/g, ''\)/)
    assert.match(component, /LOADING_DOTS\.map/)
    assert.match(component, /droplet-loading__dot/)
    assert.match(component, /stdDeviation=\{size === 'small' \? 1\.3 : 10\}/)
    assert.match(component, /aria-label=\{ariaLabel \?\? t\('加载中\.\.\.'\)\}/)
    assert.match(component, /role="status"/)

    assert.match(styles, /--droplet-loading-size: 300px;/)
    assert.match(styles, /&--small \{[\s\S]*?--droplet-loading-size: 40px;/)
    assert.match(styles, /&--small \{[\s\S]*?--droplet-loading-dot-size: 8px;/)
    assert.match(styles, /filter: var\(--droplet-loading-filter\);/)
    assert.match(styles, /animation: droplet-loading-rotate 3s ease-in-out infinite;/)
    assert.match(styles, /--droplet-loading-gradient: linear-gradient\(to right, #50D6FC, #1989F5\);/)
    assert.match(styles, /@keyframes droplet-loading-rotate/)

    assert.match(entry, /export \{ DropletLoading \} from '\.\/DropletLoading\.tsx'/)
    assert.match(readme, /40px outer frame/)
})
