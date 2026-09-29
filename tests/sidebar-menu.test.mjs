import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const sidebarSource = await readFile(
    'src/pages/main/layout/SidebarMenu.tsx',
    'utf8',
)
const layoutSource = await readFile(
    'src/pages/main/layout/MainLayout.tsx',
    'utf8',
)

test('sidebar menu is a right popup controlled by the main layout', () => {
    assert.match(sidebarSource, /import \{ Popup \} from '@\/components\/Popup'/)
    assert.match(sidebarSource, /type SidebarMenuProps/)
    assert.match(sidebarSource, /show: boolean/)
    assert.match(sidebarSource, /onClose: \(\) => void/)
    assert.match(sidebarSource, /<Popup/)
    assert.match(sidebarSource, /show=\{show\}/)
    assert.match(sidebarSource, /onClose=\{onClose\}/)
    assert.match(sidebarSource, /position="right"/)
    assert.match(sidebarSource, /contentPreset=\{false\}/)

    assert.match(layoutSource, /useState/)
    assert.match(layoutSource, /const \[showSidebarMenu, setShowSidebarMenu\] = useState\(false\)/)
    assert.match(layoutSource, /function handleToggleSidebarMenu\(\)/)
    assert.match(layoutSource, /setShowSidebarMenu\(\(isOpen\) => !isOpen\)/)
    assert.match(layoutSource, /function handleCloseSidebarMenu\(\)/)
    assert.match(layoutSource, /setShowSidebarMenu\(false\)/)
    assert.match(layoutSource, /<SidebarMenu/)
    assert.match(layoutSource, /show=\{showSidebarMenu\}/)
    assert.match(layoutSource, /onClose=\{handleCloseSidebarMenu\}/)
})

test('sidebar menu reuses the shared first-level layout menu items', () => {
    assert.match(sidebarSource, /MAIN_PAGE_ITEMS\.map/)
    assert.match(sidebarSource, /key=\{item\.path\}/)
    assert.match(sidebarSource, /to=\{item\.path\}/)
    assert.match(sidebarSource, /\{t\(item\.titleKey\)\}/)
    assert.match(sidebarSource, /onClick=\{handleMenuLinkClick\}/)
    assert.match(sidebarSource, /function handleMenuLinkClick\(\)/)
    assert.match(sidebarSource, /handleMenuLinkClick[\s\S]*onClose\(\)/)
})

test('sidebar retains template menu icons and isolates the copied visual theme', async () => {
    const styles = await readFile('src/pages/main/layout/MainLayout.scss', 'utf8')
    assert.match(sidebarSource, /name=\{item\.icon\}/)
    assert.match(sidebarSource, /app-menu__link--active/)
    assert.match(styles, /color: var\(--app-sidebar-accent\)/)
    assert.doesNotMatch(sidebarSource, /referral_code|features\/ai-claw|ROUTE_PATH/)
    assert.doesNotMatch(sidebarSource, /<AppBrand/)
})

test('sidebar copies the connected wallet address through the shared clipboard boundary', () => {
    assert.match(sidebarSource, /copyTextToClipboard\(walletAddress\)/)
    assert.match(sidebarSource, /!staticPreview && walletAddress/)
    assert.match(sidebarSource, /WalletOrbitBorder/)
    assert.doesNotMatch(sidebarSource, /navigator\.clipboard|localStorage|fetch\(/)
})
