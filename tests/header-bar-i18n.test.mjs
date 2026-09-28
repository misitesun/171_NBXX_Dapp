import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('header bar renders a masked connected wallet address without auth coupling', async () => {
    const component = await readFile('src/pages/main/layout/HeaderBar/HeaderBar.tsx', 'utf8')

    assert.match(component, /import \{ LanguageSwitch \} from '@\/components\/LanguageSwitch'/)
    assert.doesNotMatch(component, /headerLangUrl/)
    assert.match(component, /<LanguageSwitch className=/)
    assert.match(component, /useDappStore/)
    assert.doesNotMatch(component, /useUserStore/)
    assert.match(component, /maskWalletAddress/)
    assert.match(component, /className="auto-btn size-24 bold-6 ml-20"/)
    assert.match(
        component,
        /!staticPreview && walletAddress/,
    )
    assert.match(component, /\{maskWalletAddress\(walletAddress\)\}/)
    assert.doesNotMatch(component, /t\('链接'\)/)
})

test('header bar renders the 100px gap by default and allows hiding it', async () => {
    const component = await readFile('src/pages/main/layout/HeaderBar/HeaderBar.tsx', 'utf8')

    assert.match(component, /type HeaderBarProps/)
    assert.doesNotMatch(component, /allowWalletAddress/)
    assert.match(component, /showGap\?: boolean/)
    assert.match(component, /showGap = true/)
    assert.match(component, /showGap \? <div className="gap-100" \/> : null/)
})

test('main layout keeps the shared wallet chip enabled on every first-level page', async () => {
    const layout = await readFile('src/pages/main/layout/MainLayout.tsx', 'utf8')

    assert.doesNotMatch(layout, /allowWalletAddress=/)
    assert.match(layout, /<HeaderBar\s+staticPreview=\{staticPreview\}/)
})

test('header menu icon only renders in sidebar layout mode', async () => {
    const component = await readFile('src/pages/main/layout/HeaderBar/HeaderBar.tsx', 'utf8')
    const layout = await readFile('src/pages/main/layout/MainLayout.tsx', 'utf8')

    assert.match(component, /showSidebarMenu\?: boolean/)
    assert.match(component, /onSidebarMenuClick\?: \(\) => void/)
    assert.match(component, /showSidebarMenu = false/)
    assert.match(component, /showSidebarMenu \? \(/)
    assert.match(component, /<MenuToggleIcon open=\{sidebarOpen\}/)
    assert.match(component, /onClick=\{onSidebarMenuClick\}/)
    assert.match(component, /aria-expanded=\{sidebarOpen\}/)
    assert.match(layout, /<HeaderBar/)
    assert.match(layout, /showSidebarMenu=\{isSidebarLayout\}/)
    assert.match(layout, /onSidebarMenuClick=\{handleToggleSidebarMenu\}/)
})
