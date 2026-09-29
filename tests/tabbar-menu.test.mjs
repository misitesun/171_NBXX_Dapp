import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { registerUiModules } from './hu-ui-render.mjs'

async function renderTabbar() {
    const hooks = registerUiModules()
    try {
        const [{ TabbarMenu }, { appI18n }] = await Promise.all([
            import('../src/pages/main/layout/TabbarMenu.tsx'),
            import('../src/i18n/instance.ts'),
        ])
        if (!appI18n.isInitialized) {
            await appI18n.init({
                lng: 'zh-Hans',
                resources: { 'zh-Hans': { translation: { 'home.nav': '首页', '主导航': '主导航' } } },
                keySeparator: false,
                interpolation: { escapeValue: false },
            })
        }
        const app = createElement(I18nextProvider, { i18n: appI18n },
            createElement(MemoryRouter, { initialEntries: ['/home'] }, createElement(TabbarMenu)))
        return renderToStaticMarkup(app)
    } finally { hooks.deregister() }
}

test('tabbar renders the blank template navigation from shared config', async () => {
    const html = await renderTabbar()
    assert.ok(html.includes('首页'))
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
    assert.equal((html.match(/aria-disabled="true"/g) ?? []).length, 0)
    assert.match(html, /href="\/home"/)
    assert.match(html, /app-icon--home/)
})

test('tabbar contains no deleted business destinations', async () => {
    const html = await renderTabbar()
    assert.match(html, /href="\/home"/)
    assert.doesNotMatch(html, /href="\/(user|stake|presale|otc)"/)
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
    assert.equal((html.match(/aria-disabled="true"/g) ?? []).length, 0)
})
