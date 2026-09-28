import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function readSource(file) {
    try {
        return await readFile(file, 'utf8')
    } catch {
        return ''
    }
}

test('main layout brand extracts the shared logo and app name block', async () => {
    const [brand, styles, header, entry] = await Promise.all([
        readSource('src/pages/main/layout/AppBrand/AppBrand.tsx'),
        readSource('src/pages/main/layout/AppBrand/AppBrand.scss'),
        readSource('src/pages/main/layout/HeaderBar/HeaderBar.tsx'),
        readSource('src/pages/main/layout/index.ts'),
    ])

    assert.match(brand, /export function AppBrand/)
    assert.match(brand, /type AppBrandProps/)
    assert.match(brand, /className\?: string/)
    assert.match(brand, /onClick\?: \(\) => void/)
    assert.match(brand, /APP_CONFIG\.routeBase/)
    assert.match(brand, /brand\/app-logo\.png/)
    assert.match(brand, /className="app-brand__logo"/)
    assert.match(brand, /APP_CONFIG\.name \|\| 'DApp'/)
    assert.match(brand, /alt=""/)
    assert.match(brand, /import '\.\/AppBrand\.scss'/)
    assert.match(styles, /cursor:\s*pointer/)

    assert.match(header, /import \{ AppBrand \} from '\.\.\/AppBrand\/AppBrand\.tsx'/)
    assert.match(header, /<AppBrand staticPreview=\{staticPreview\}/)
    assert.doesNotMatch(header, /headerLogoUrl/)
    assert.doesNotMatch(header, /hu-chain/i)
    assert.doesNotMatch(header, /LAYOUT_HEADER_TITLE/)

    assert.match(entry, /export \{ AppBrand \} from '\.\/AppBrand\/AppBrand\.tsx'/)
})

test('app brand navigates back to home only when it is not already on home', async () => {
    const brand = await readSource('src/pages/main/layout/AppBrand/AppBrand.tsx')
    const header = await readSource('src/pages/main/layout/HeaderBar/HeaderBar.tsx')

    assert.match(brand, /useLocation/)
    assert.match(brand, /useAppNavigate/)
    assert.match(brand, /ROUTE_PATH/)
    assert.match(brand, /const location = useLocation\(\)/)
    assert.match(brand, /const \{ pushRoute \} = useAppNavigate\(\)/)
    assert.match(brand, /function handleBrandClick\(\)/)
    assert.match(brand, /if \(location\.pathname !== ROUTE_PATH\.home\)/)
    assert.match(brand, /pushRoute\(ROUTE_PATH\.home\)/)
    assert.match(brand, /onClick\?\.\(\)/)
    assert.match(brand, /onClick=\{handleBrandClick\}/)
    assert.match(header, /onClick=\{sidebarOpen \? onSidebarMenuClick : undefined\}/)
})
