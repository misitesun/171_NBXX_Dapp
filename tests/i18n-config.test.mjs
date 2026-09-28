import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
    APP_LANGUAGES,
    DEFAULT_LANGUAGE_CODE,
    findAppLanguage,
} from '../src/i18n/config.ts'
import { APP_CONFIG } from '../src/config/app.ts'
import { getRequestLanguage } from '../src/i18n/getRequestLanguage.ts'

function createStorage(language = '') {
    const cache = new Map(language ? [['LANG', language]] : [])
    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: (key) => cache.delete(key),
    }
}

test('enables the five project languages with standard language codes', () => {
    assert.deepEqual(
        APP_LANGUAGES.map(({ code }) => code),
        ['zh-Hans', 'zh-Hant', 'ja', 'ko', 'en'],
    )
    assert.equal(DEFAULT_LANGUAGE_CODE, 'zh-Hans')
    assert.equal(findAppLanguage('zh-Hans')?.code, 'zh-Hans')
    assert.equal(findAppLanguage('unsupported'), undefined)
})

test('all enabled common locales contain the business-neutral UI baseline', async () => {
    const messages = await Promise.all(
        APP_LANGUAGES.map(async ({ code }) => JSON.parse(
            await readFile(`src/i18n/locales/common/${code}.json`, 'utf8'),
        )),
    )

    assert.equal(
        messages.every((message) => (
            typeof message['切换语言'] === 'string'
            && typeof message['请选择'] === 'string'
            && message['欢迎来到{{name}}'] === undefined
        )),
        true,
    )
})

test('returns the configured backend language and safely falls back', () => {
    globalThis.window = { localStorage: createStorage('ko') }
    assert.equal(getRequestLanguage(), 'ko')

    globalThis.window = { localStorage: createStorage('unsupported') }
    assert.equal(getRequestLanguage(), 'zh-Hans')
})

test('forces simplified Chinese when i18n is disabled', () => {
    const previousEnableI18n = APP_CONFIG.enableI18n
    APP_CONFIG.enableI18n = false

    try {
        globalThis.window = { localStorage: createStorage('ko') }
        assert.equal(getRequestLanguage(), 'zh-Hans')
    } finally {
        APP_CONFIG.enableI18n = previousEnableI18n
    }
})

test('i18n initializes and changes the app store language from storage', async () => {
    const [changeSource, initializeSource, storeSource] = await Promise.all([
        readFile('src/i18n/changeAppLanguage.ts', 'utf8'),
        readFile('src/i18n/initializeI18n.ts', 'utf8'),
        readFile('src/stores/app/store.ts', 'utf8'),
    ])

    assert.match(storeSource, /languageCode/)
    assert.match(storeSource, /getLanguage\(\)/)
    assert.match(changeSource, /useAppStore/)
    assert.match(changeSource, /APP_CONFIG\.enableI18n/)
    assert.match(changeSource, /setLanguageCode\(language\.code\)/)
    assert.match(initializeSource, /useAppStore/)
    assert.match(initializeSource, /APP_CONFIG\.enableI18n/)
    assert.match(initializeSource, /setLanguageCode\(selectedLanguage\.code\)/)
})
