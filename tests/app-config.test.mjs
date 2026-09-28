import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
    APP_CONFIG,
    APP_LOGIN_MODE,
    APP_LOGIN_MODE_OPTIONS,
    APP_LAYOUT_MENU_TYPE,
    APP_LAYOUT_MENU_TYPE_OPTIONS,
} from '../src/config/app.ts'
import { DEFAULT_LANGUAGE_CODE } from '../src/i18n/config.ts'
import { STORAGE_DEFAULT } from '../src/services/storage/config.ts'

test('app config stores project-level startup options', () => {
    assert.equal(typeof APP_CONFIG.name, 'string')
    assert.equal(typeof APP_CONFIG.routeBase, 'string')
    assert.equal(typeof APP_CONFIG.routerBasename, 'string')
    assert.equal(typeof APP_CONFIG.homeRouteName, 'string')
    assert.equal(typeof APP_CONFIG.enableI18n, 'boolean')
    assert.equal(typeof APP_CONFIG.defaultLanguageCode, 'string')
    assert.equal(
        APP_LAYOUT_MENU_TYPE_OPTIONS.includes(APP_CONFIG.defaultLayoutMenuType),
        true,
    )
    assert.equal(APP_LOGIN_MODE_OPTIONS.includes(APP_CONFIG.loginMode), true)
})

test('login mode is a project-level choice between hybrid, wallet, and account access', () => {
    assert.deepEqual(APP_LOGIN_MODE_OPTIONS, [
        APP_LOGIN_MODE.hybrid,
        APP_LOGIN_MODE.dapp,
        APP_LOGIN_MODE.account,
    ])
    assert.equal(APP_LOGIN_MODE_OPTIONS.includes(APP_CONFIG.loginMode), true)
})

test('layout menu type is a mutually exclusive project-level choice', () => {
    assert.deepEqual(APP_LAYOUT_MENU_TYPE_OPTIONS, [
        APP_LAYOUT_MENU_TYPE.tabbar,
        APP_LAYOUT_MENU_TYPE.sidebar,
    ])
    assert.equal(
        APP_LAYOUT_MENU_TYPE_OPTIONS.includes(APP_CONFIG.defaultLayoutMenuType),
        true,
    )
})

test('app config reads the app name from the Vite env', async () => {
    const source = await readFile(new URL('../src/config/app.ts', import.meta.url), 'utf8')

    assert.match(source, /name:\s*import\.meta\.env\?\.VITE_APP_NAME\s*\?\?\s*''/)
})

test('feature modules read shared project defaults from app config', () => {
    assert.equal(DEFAULT_LANGUAGE_CODE, APP_CONFIG.defaultLanguageCode)
    assert.equal(STORAGE_DEFAULT.language, APP_CONFIG.defaultLanguageCode)
})

test('default language follows development and production environments', async () => {
    const source = await readFile(new URL('../src/config/app.ts', import.meta.url), 'utf8')

    assert.match(source, /defaultLanguageCode:\s*import\.meta\.env\?\.PROD\s*\?\s*'en'\s*:\s*'zh-Hans'/)
})
