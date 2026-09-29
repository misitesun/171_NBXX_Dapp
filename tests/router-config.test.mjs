import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
    APP_ROUTE_BASE,
    APP_ROUTER_BASENAME,
    DEFAULT_LAYOUT_MENU_TYPE,
    LAYOUT_MENU_TYPE,
    LAYOUT_MENU_TYPE_OPTIONS,
} from '../src/router/config.ts'
import { ROUTE_PATH } from '../src/router/routes.ts'

test('router uses the fixed h5 base path for history mode', () => {
    assert.equal(APP_ROUTE_BASE, '/h5/')
    assert.equal(APP_ROUTER_BASENAME, '/h5')
})

test('vite build output also uses the fixed h5 base path', async () => {
    const source = await readFile(
        new URL('../vite.config.ts', import.meta.url),
        'utf8',
    )

    assert.match(source, /base:\s*'\/h5\/'/)
})

test('router derives the home path from the project-level home route name', async () => {
    const [routesSource, routerConfigSource] = await Promise.all([
        readFile(new URL('../src/router/routes.ts', import.meta.url), 'utf8'),
        readFile(new URL('../src/router/config.ts', import.meta.url), 'utf8'),
    ])

    assert.equal(ROUTE_PATH.home, '/home')
    assert.equal(ROUTE_PATH.referral, '/ref/:ref')
    assert.match(routerConfigSource, /export const APP_HOME_ROUTE_NAME\s*=\s*APP_CONFIG\.homeRouteName/)
    assert.match(routesSource, /home:\s*`\/\$\{APP_HOME_ROUTE_NAME\}`/)
    assert.doesNotMatch(routesSource, /home:\s*'\/home'/)
})

test('layout exposes the supported menu modes for templates', () => {
    assert.deepEqual(LAYOUT_MENU_TYPE, {
        tabbar: 'tabbar',
        sidebar: 'sidebar',
    })
    assert.deepEqual(LAYOUT_MENU_TYPE_OPTIONS, ['tabbar', 'sidebar'])
    assert.equal(DEFAULT_LAYOUT_MENU_TYPE, 'sidebar')
})

test('project routes include protected home and authorization entry', () => {
    assert.equal(ROUTE_PATH.root, '/')
    assert.equal(ROUTE_PATH.home, '/home')
    assert.deepEqual(Object.keys(ROUTE_PATH), ['root', 'home', 'login', 'referral'])
})

test('main page config owns the first-level page records', async () => {
    const [routerRoutesSource, mainConfigSource] = await Promise.all([
        readFile(new URL('../src/router/routes.ts', import.meta.url), 'utf8'),
        readFile(new URL('../src/pages/main/config.ts', import.meta.url), 'utf8'),
    ])

    assert.match(mainConfigSource, /export const MAIN_PAGE_ITEMS/)
    assert.match(mainConfigSource, /path:\s*ROUTE_PATH\.home/)
    assert.match(mainConfigSource, /title:\s*'首页'/)
    assert.doesNotMatch(mainConfigSource, /ROUTE_PATH\.(user|stake|presale|otc)/)
    assert.doesNotMatch(routerRoutesSource, /appRouteItems/)
})

test('project gates the home route and keeps authorization outside the main layout', async () => {
    const source = await readFile(new URL('../src/router/AppRouter.tsx', import.meta.url), 'utf8')
    assert.match(source, /<Route path=\{ROUTE_PATH.login\} element=\{<LoginPage \/>\}/)
    assert.match(source, /<Route element=\{<RequireAuthentication \/>\}>/)
    assert.match(source, /element=\{<AuthenticatedHomePage \/>\}/)
    assert.match(source, /<AuthSession \/>/)
})
