import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { matchRoutes, MemoryRouter, Routes, Route } from 'react-router'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { registerUiModules } from './hu-ui-render.mjs'

const hooks = registerUiModules()
const { resolveReferralCode, setReferralCode } = await import('../src/services/storage/referral.ts')
const { buildApiHomeConfig } = await import('../src/pages/main/home/apiConfig.ts')
const { ROUTE_PATH } = await import('../src/router/routes.ts')
const { LoginPage } = await import('../src/pages/auth/login/LoginPage.tsx')
const { useAuthStore } = await import('../src/stores/auth/store.ts')

function setupStorage() {
    const cache = new Map()
    globalThis.window = { localStorage: {
        getItem: key => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
    } }
    return cache
}

test('generated invitation route decodes the original code and authorization prioritizes it over legacy query and cache', () => {
    setupStorage()
    setReferralCode(' cached-ref ')
    const code = 'a+B c'
    const link = new URL(buildApiHomeConfig({ referral_code: code }, [], 'https://example.com').invitationText)
    const matches = matchRoutes([{ path: ROUTE_PATH.referral }], link.pathname)
    const pathRef = matches[0].params.ref
    assert.equal(pathRef, code)
    assert.equal(resolveReferralCode(pathRef, '?ref=old-query'), code)
    assert.equal(resolveReferralCode(undefined, '?ref=legacy%2Bcode'), 'legacy+code')
    assert.equal(resolveReferralCode(undefined, '?ref=%20'), 'cached-ref')
    assert.equal(resolveReferralCode(undefined, ''), 'cached-ref')
    setReferralCode(resolveReferralCode(pathRef, ''))
    assert.equal(resolveReferralCode(undefined, ''), code)
    assert.equal(matchRoutes([{ path: ROUTE_PATH.referral }], '/h5/unknown', '/h5'), null)
})

test('automatic authorization splash keeps only the brand image and status in all enabled languages', async () => {
    setupStorage()
    useAuthStore.setState({ status: 'signedOut', user: null })
    for (const code of ['zh-Hans', 'zh-Hant', 'en', 'ja', 'ko']) {
        const messages = JSON.parse(readFileSync(`src/i18n/locales/project/${code}.json`, 'utf8'))
        const instance = i18next.createInstance()
        await instance.init({ lng: code, resources: { [code]: { translation: messages } }, interpolation: { escapeValue: false } })
        const html = renderToStaticMarkup(createElement(I18nextProvider, { i18n: instance },
            createElement(MemoryRouter, { initialEntries: ['/ref/incoming-code'] },
                createElement(Routes, null, createElement(Route, { path: ROUTE_PATH.referral, element: createElement(LoginPage) }))),
        ))
        assert.match(html, /data-page="login"/)
        assert.doesNotMatch(html, /<input|<textarea|<form|<button|<h1|authorization-page__language|auth\.welcome|{{name}}/)
        assert.match(html, /role="status"/)
    }
})

test.after(() => hooks.deregister())
