import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
    addAppBasenameToPathname,
    stripAppBasenameFromLocation,
    stripAppBasenameFromPathname,
} from '../src/router/appBrowserHistory.ts'

test('accepts root paths that are served outside the h5 basename', () => {
    assert.equal(stripAppBasenameFromPathname('/'), '/')
    assert.equal(stripAppBasenameFromPathname('/ref/abc'), '/ref/abc')
    assert.equal(stripAppBasenameFromPathname('/home'), '/home')
})

test('strips the h5 basename when the current URL already includes it', () => {
    assert.equal(stripAppBasenameFromPathname('/h5'), '/')
    assert.equal(stripAppBasenameFromPathname('/h5/'), '/')
    assert.equal(stripAppBasenameFromPathname('/h5/home'), '/home')
    assert.equal(stripAppBasenameFromPathname('/h5/ref/abc'), '/ref/abc')
})

test('builds browser paths with the h5 basename for app navigations', () => {
    assert.equal(addAppBasenameToPathname('/'), '/h5/')
    assert.equal(addAppBasenameToPathname('/home'), '/h5/home')
    assert.equal(addAppBasenameToPathname('/ref/abc'), '/h5/ref/abc')
    assert.equal(addAppBasenameToPathname('/h5/home'), '/h5/home')
})

test('keeps search and hash while normalizing browser locations for the router', () => {
    assert.deepEqual(
        stripAppBasenameFromLocation({
            pathname: '/h5/ref/abc',
            search: '?from=invite',
            hash: '#top',
            state: { source: 'test' },
            key: 'route-test',
        }),
        {
            pathname: '/ref/abc',
            search: '?from=invite',
            hash: '#top',
            state: { source: 'test' },
            key: 'route-test',
        },
    )
})

test('router uses AppBrowserRouter instead of strict BrowserRouter basename', async () => {
    const [router, appBrowserRouter, routerReadme] = await Promise.all([
        readFile('src/router/AppRouter.tsx', 'utf8'),
        readFile('src/router/AppBrowserRouter.tsx', 'utf8'),
        readFile('src/router/README.md', 'utf8'),
    ])

    assert.match(router, /<AppBrowserRouter>/)
    assert.doesNotMatch(router, /BrowserRouter basename/)
    assert.match(appBrowserRouter, /unstable_HistoryRouter/)
    assert.match(appBrowserRouter, /createAppBrowserHistory/)
    assert.match(routerReadme, /AppBrowserRouter/)
    assert.match(routerReadme, /with and without the configured `\/h5` prefix/)
})

test('route pathname changes reset the shared window scroll position before paint', async () => {
    const [router, routerReadme, compatibility] = await Promise.all([
        readFile('src/router/AppRouter.tsx', 'utf8'),
        readFile('src/router/README.md', 'utf8'),
        readFile('docs/compatibility.md', 'utf8'),
    ])

    assert.match(router, /function RouteScrollReset\(\)/)
    assert.match(router, /const \{ pathname \} = useLocation\(\)/)
    assert.match(router, /window\.history\.scrollRestoration = 'manual'/)
    assert.match(router, /window\.history\.scrollRestoration = previousScrollRestoration/)
    assert.match(router, /useLayoutEffect\(\(\) => \{[\s\S]*?window\.scrollTo\(0, 0\)[\s\S]*?\}, \[pathname\]\)/)
    assert.match(router, /<RouteScrollReset \/>/)
    assert.match(routerReadme, /pathname change resets the shared window scroll position/)
    assert.match(compatibility, /### Route scroll reset/)
})
