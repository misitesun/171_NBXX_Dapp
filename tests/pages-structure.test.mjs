import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'

test('main first-level pages keep matching page directories and files', () => {
    const firstLevelPages = [
        {
            dir: 'src/pages/main/home',
            component: 'HomePage',
        },
    ]

    for (const page of firstLevelPages) {
        assert.equal(existsSync(page.dir), true)
        assert.equal(existsSync(`${page.dir}/${page.component}.tsx`), true)
        assert.equal(existsSync(`${page.dir}/${page.component}.scss`), true)
        assert.equal(existsSync(`${page.dir}/index.ts`), true)
    }

    assert.equal(existsSync('src/pages/main/config.ts'), true)
    assert.equal(existsSync('src/pages/main/index.ts'), true)
    assert.equal(existsSync('src/pages/main/layout/MainLayout.tsx'), true)
    assert.equal(existsSync('src/pages/main/layout/MainLayout.scss'), true)
    assert.equal(existsSync('src/pages/main/layout/index.ts'), true)
    assert.equal(existsSync('src/layouts/AppLayout'), false)
    assert.equal(existsSync('src/pages/home'), false)
    assert.equal(existsSync('src/pages/user'), false)
    assert.equal(existsSync('src/pages/sidebar/SidebarPage.tsx'), false)
    assert.equal(existsSync('src/pages/tabbar/TabbarPage.tsx'), false)
})
