import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { registerUiModules } from './hu-ui-render.mjs'

test('tabbar renders the blank template navigation from shared config', async () => {
    const hooks = registerUiModules()
    try {
        const { TabbarMenu } = await import('../src/pages/main/layout/TabbarMenu.tsx')
        const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/home'] }, createElement(TabbarMenu)))
        assert.ok(html.includes('首页'))
        assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
        assert.equal((html.match(/aria-disabled="true"/g) ?? []).length, 0)
        assert.match(html, /href="\/home"/)
        assert.match(html, /app-icon--home/)
    } finally { hooks.deregister() }
})

test('tabbar contains no deleted business destinations', async () => {
    const hooks = registerUiModules()
    try {
        const { TabbarMenu } = await import('../src/pages/main/layout/TabbarMenu.tsx')
        const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/home'] }, createElement(TabbarMenu)))
        assert.match(html, /href="\/home"/)
        assert.doesNotMatch(html, /href="\/(user|stake|presale|otc)"/)
        assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
        assert.equal((html.match(/aria-disabled="true"/g) ?? []).length, 0)
    } finally { hooks.deregister() }
})
