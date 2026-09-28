import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFile } from 'node:fs/promises'

import { registerUiModules } from './hu-ui-render.mjs'

test('SegmentedTabs renders a controlled semantic tab list with two or more items', async () => {
    const hooks = registerUiModules()

    try {
        const { SegmentedTabs } = await import('../src/components/SegmentedTabs/SegmentedTabs.tsx')
        const html = renderToStaticMarkup(createElement(SegmentedTabs, {
            items: [
                { value: 'staking', label: '质押中' },
                { value: 'converted', label: '已转化' },
                { value: 'completed', label: '已完成' },
            ],
            value: 'staking',
            onChange() {},
            ariaLabel: '质押订单状态',
            idPrefix: 'stake-orders',
        }))

        assert.match(html, /role="tablist"/)
        assert.equal((html.match(/role="tab"/g) ?? []).length, 3)
        assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1)
        assert.match(html, /id="stake-orders-staking-tab"/)
        assert.match(html, /aria-controls="stake-orders-staking-panel"/)
        assert.match(html, /class="segmented-tabs__goo"/)
        assert.match(html, /--gooey-total-duration:500ms;--gooey-grow-duration:390ms/)
        assert.match(html, /aria-hidden="true"/)
    } finally {
        hooks.deregister()
    }
})

test('SegmentedTabs owns a self-cleaning gooey transition without changing the design gradient', async () => {
    const [source, style, readme] = await Promise.all([
        readFile('src/components/SegmentedTabs/SegmentedTabs.tsx', 'utf8'),
        readFile('src/components/SegmentedTabs/SegmentedTabs.scss', 'utf8'),
        readFile('src/components/SegmentedTabs/README.md', 'utf8'),
    ])

    assert.match(source, /const GOOEY_PARTICLE_COUNT = 12/)
    assert.match(source, /window\.matchMedia\(REDUCED_MOTION_QUERY\)\.matches/)
    assert.match(source, /window\.getComputedStyle\(target, '::before'\)/)
    assert.match(source, /selectedSurfaceStyle\.display === 'none'/)
    assert.match(source, /particleLayer\.replaceChildren\(fragment\)/)
    assert.match(source, /clearGooeyEffect\(\)/)
    assert.equal((style.match(/background: var\(--app-action-gradient\);/g) ?? []).length, 3)
    assert.match(source, /0 0 0 18 -7/)
    assert.doesNotMatch(style, /mix-blend-mode|contrast\(|background:\s*(?:black|rgb\(0 0 0\))/)
    assert.match(style, /@keyframes segmented-tabs-goo-particle/)
    assert.match(style, /@media \(prefers-reduced-motion: reduce\)/)
    assert.doesNotMatch(style, /#[\da-f]{3,8}/i)
    assert.match(readme, /settled selected surface always remains[\s\S]*--app-action-gradient/)
})

test('SegmentedTabs derives every switching phase from the shared 500ms duration', async () => {
    const [source, style] = await Promise.all([
        readFile('src/components/SegmentedTabs/SegmentedTabs.tsx', 'utf8'),
        readFile('src/components/SegmentedTabs/SegmentedTabs.scss', 'utf8'),
    ])

    assert.match(source, /const GOOEY_DURATION_MS = 500\b/)
    assert.match(source, /GOOEY_MIN_DURATION_MS = GOOEY_DURATION_MS \* 0\.7\b/)
    assert.match(source, /GOOEY_DURATION_VARIANCE_MS = GOOEY_DURATION_MS \* 0\.175\b/)
    assert.match(source, /GOOEY_MAX_DELAY_MS = GOOEY_DURATION_MS \* 0\.025\b/)
    assert.match(source, /GOOEY_DURATION_MS \+ GOOEY_CLEANUP_BUFFER_MS/)
    assert.equal((style.match(/segmented-tabs-goo-grow var\(--gooey-grow-duration\)/g) ?? []).length, 2)
    for (const phase of ['pill', 'surface', 'label']) {
        assert.ok(style.includes(`segmented-tabs-goo-${phase} var(--gooey-total-duration)`))
    }
    assert.doesNotMatch(style, /segmented-tabs-goo-\w+ \d+(?:ms|s)/)
})

test('multiple SegmentedTabs instances have independent transparent SVG filters', async () => {
    const hooks = registerUiModules()
    try {
        const { SegmentedTabs } = await import('../src/components/SegmentedTabs/SegmentedTabs.tsx')
        const props = {
            items: [{ value: 'usdt', label: 'USDT' }, { value: 'xea', label: 'XEA' }],
            value: 'usdt', onChange() {}, ariaLabel: '资产',
        }
        const html = renderToStaticMarkup(createElement('div', null,
            createElement(SegmentedTabs, props), createElement(SegmentedTabs, props)))
        const ids = [...html.matchAll(/<filter id="([^"]+)"/g)].map((match) => match[1])
        assert.equal(ids.length, 2)
        assert.equal(new Set(ids).size, 2)
        for (const id of ids) assert.ok(html.includes(`filter:url(#${id})`))
        assert.doesNotMatch(html, /<feFlood/)
    } finally {
        hooks.deregister()
    }
})

test('SegmentedTabs supports five-item project filters without changing its interaction contract', async () => {
    const hooks = registerUiModules()

    try {
        const { SegmentedTabs } = await import('../src/components/SegmentedTabs/SegmentedTabs.tsx')
        const html = renderToStaticMarkup(createElement(SegmentedTabs, {
            items: [
                { value: 'sol', label: 'SOL' },
                { value: 'bsc', label: 'BSC' },
                { value: 'eth', label: 'ETH' },
                { value: 'trx', label: 'TRX' },
                { value: 'polygon', label: 'POLYGON' },
            ],
            value: 'sol',
            onChange() {},
            ariaLabel: '选择交易链',
            idPrefix: 'realtime-trades',
        }))

        assert.equal((html.match(/role="tab"/g) ?? []).length, 5)
        assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1)
        assert.match(html, /id="realtime-trades-polygon-tab"/)
        assert.match(html, /aria-controls="realtime-trades-polygon-panel"/)
    } finally {
        hooks.deregister()
    }
})
