import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { registerUiModules } from './hu-ui-render.mjs'

const codes = ['zh-Hans', 'zh-Hant', 'en', 'ja', 'ko']
const messages = Object.fromEntries(codes.map(code => [code, JSON.parse(readFileSync(`src/i18n/locales/project/${code}.json`, 'utf8'))]))

test('home languages keep all configuration placeholders and emphasis tags', () => {
    const reference = messages['zh-Hans']
    const placeholders = value => [...value.matchAll(/{{\s*(\w+)\s*}}/g)].map(match => match[1]).sort()
    const tags = value => [...value.matchAll(/<\/?(green|red|gold)>/g)].map(match => match[0]).sort()
    for (const code of codes) {
        assert.deepEqual(Object.keys(messages[code]).sort(), Object.keys(reference).sort(), code)
        for (const key of Object.keys(reference)) {
            assert.deepEqual(placeholders(messages[code][key]), placeholders(reference[key]), `${code} ${key}`)
            assert.deepEqual(tags(messages[code][key]), tags(reference[key]), `${code} ${key}`)
        }
    }
})

test('home renders supplied tier values and respects processing/sold-out state in every language', async () => {
    const hooks = registerUiModules()
    try {
        const { HomePage } = await import('../src/pages/main/home/HomePage.tsx')
        const { HOME_PAGE_CONFIG, getHomeTier } = await import('../src/pages/main/home/config.ts')
        const config = {
            ...HOME_PAGE_CONFIG,
            tiers: HOME_PAGE_CONFIG.tiers.map(tier => ({
                ...tier, price: '742', supply: 23, dividendRate: '8.7%',
                dailyMiningRate: '2.3%', daoVotes: 17, credit: '9876',
            })),
        }
        assert.equal(getHomeTier({ ...config, tiers: [config.tiers[0]] }, 'premium').id, 'basic')
        assert.equal(getHomeTier({ ...config, tiers: [] }, 'premium'), undefined)
        for (const code of codes) {
            const instance = i18next.createInstance()
            await instance.init({ lng: code, resources: { [code]: { translation: messages[code] } }, interpolation: { escapeValue: false } })
            const html = renderToStaticMarkup(createElement(I18nextProvider, { i18n: instance }, createElement(HomePage, { config })))
            for (const value of ['742', '46', '8.7%', '2.3%', '17', '9876']) assert.ok(html.includes(value), `${code} ${value}`)
            assert.doesNotMatch(html, /{{|home\.benefit\.|home\.tier\./)
            const pending = renderToStaticMarkup(createElement(I18nextProvider, { i18n: instance }, createElement(HomePage, { config, purchasing: true })))
            assert.match(pending, /aria-busy="true"/)
            assert.equal((pending.match(/disabled=""/g) || []).length, 3)
            const soldOut = { ...config, tiers: config.tiers.map(tier => ({ ...tier, soldOut: true })) }
            const unavailable = renderToStaticMarkup(createElement(I18nextProvider, { i18n: instance }, createElement(HomePage, { config: soldOut })))
            assert.equal((unavailable.match(/disabled=""/g) || []).length, 3)
        }
    } finally { hooks.deregister() }
})

test('home accepts independent team, invitation and member data and handles an empty team', async () => {
    const hooks = registerUiModules()
    try {
        const { HomePage } = await import('../src/pages/main/home/HomePage.tsx')
        const { HOME_PAGE_CONFIG } = await import('../src/pages/main/home/config.ts')
        for (const code of codes) {
            const instance = i18next.createInstance()
            await instance.init({ lng: code, resources: { [code]: { translation: messages[code] } }, interpolation: { escapeValue: false } })
            const config = {
                ...HOME_PAGE_CONFIG,
                metrics: [{ id: 'custom', labelKey: 'home.team.performanceUnit', value: '009,812.3400', featured: true }],
                performanceUnit: 'CUSTOM', invitationText: 'https://example.com/invite?code=a&team=b',
                teamMembers: [{ id: 'member-a', address: '0xcustom-address', joinedAt: '2027.01.02 03:04:05', teamPerformance: '123.4500', personalPerformance: '006.70' }],
            }
            const render = config => renderToStaticMarkup(createElement(I18nextProvider, { i18n: instance }, createElement(HomePage, { config })))
            const html = render(config)
            for (const value of ['009,812', '.3400', 'CUSTOM', '0xcustom-address', '2027.01.02 03:04:05', '123.4500', '006.70', 'https://example.com/invite?code=a&amp;team=b']) assert.ok(html.includes(value), `${code} ${value}`)
            assert.doesNotMatch(html, /home\.team\.|home\.invitation\.|{{/)
            const empty = render({ ...config, teamMembers: [], invitationText: '' })
            assert.ok(empty.includes(messages[code]['home.team.noMembers']))
            assert.doesNotMatch(empty, /0xcustom-address/)
            assert.equal((empty.match(/disabled=""/g) || []).length, 1)
        }
    } finally { hooks.deregister() }
})
