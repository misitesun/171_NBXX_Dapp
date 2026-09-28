import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('showcase pages are registered only through the development router module', async () => {
    const config = await readFile('src/showcase/router/config.ts', 'utf8')
    const routes = await readFile('src/showcase/router/routes.tsx', 'utf8')
    const appRouter = await readFile('src/router/AppRouter.tsx', 'utf8')
    const showcase = await readFile('src/showcase/Showcase.tsx', 'utf8')
    const components = await readFile(
        'src/showcase/components/index.tsx',
        'utf8',
    )
    const page = await readFile(
        'src/showcase/components/popup/PopupShowcasePage.tsx',
        'utf8',
    )
    const pageStyle = await readFile(
        'src/showcase/components/popup/PopupShowcasePage.scss',
        'utf8',
    )
    const pickerPage = await readFile(
        'src/showcase/components/picker/PickerShowcasePage.tsx',
        'utf8',
    )
    const dropdownPage = await readFile(
        'src/showcase/components/dropdown/DropdownShowcasePage.tsx',
        'utf8',
    )
    const iconPage = await readFile(
        'src/showcase/components/icon/IconShowcasePage.tsx',
        'utf8',
    )
    const emptyPage = await readFile(
        'src/showcase/components/empty/EmptyShowcasePage.tsx',
        'utf8',
    )
    const languageSwitchPage = await readFile(
        'src/showcase/components/language-switch/LanguageSwitchShowcasePage.tsx',
        'utf8',
    )
    const contractLoadingPage = await readFile(
        'src/showcase/components/contract-loading/ContractLoadingShowcasePage.tsx',
        'utf8',
    )
    const styles = await readFile(
        'src/showcase/styles/index.tsx',
        'utf8',
    )

    assert.match(config, /home: '\/showcase'/)
    assert.match(config, /components: '\/showcase\/components'/)
    assert.match(config, /styles: '\/showcase\/styles'/)
    assert.match(config, /picker: '\/showcase\/components\/picker'/)
    assert.match(config, /dropdown: '\/showcase\/components\/dropdown'/)
    assert.match(config, /icon: '\/showcase\/components\/icon'/)
    assert.match(config, /empty: '\/showcase\/components\/empty'/)
    assert.match(config, /languageSwitch: '\/showcase\/components\/language-switch'/)
    assert.match(config, /contractLoading: '\/showcase\/components\/contract-loading'/)
    assert.match(config, /styleLayout: '\/showcase\/styles\/layout'/)
    assert.match(config, /styleText: '\/showcase\/styles\/text'/)
    assert.match(config, /styleSpacing: '\/showcase\/styles\/spacing'/)
    assert.match(config, /styleButton: '\/showcase\/styles\/button'/)
    assert.match(routes, /import\.meta\.env\.DEV/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.home/)
    assert.match(routes, /<Suspense fallback=\{null\}>/)
    assert.match(routes, /createElement\(showcaseRoutePage\)/)
    assert.match(routes, /lazy\(async \(\) => \{/)
    assert.match(
        routes,
        /await import\('@\/showcase\/Showcase\.tsx'\)/,
    )
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.components/)
    assert.match(routes, /createElement\(componentsRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/index\.tsx'\)/,
    )
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.styles/)
    assert.match(routes, /createElement\(stylesRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/styles\/index\.tsx'\)/,
    )
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.popup/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.picker/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.dropdown/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.icon/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.empty/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.languageSwitch/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.contractLoading/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.styleLayout/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.styleText/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.styleSpacing/)
    assert.match(routes, /SHOWCASE_ROUTE_PATH\.styleButton/)
    assert.doesNotMatch(routes, /lazy=\{async \(\) => \{/)
    assert.match(routes, /createElement\(popupShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/popup\/PopupShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(pickerShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/picker\/PickerShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(dropdownShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/dropdown\/DropdownShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(iconShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/icon\/IconShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(emptyShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/empty\/EmptyShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(languageSwitchShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/language-switch\/LanguageSwitchShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(contractLoadingShowcaseRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/components\/contract-loading\/ContractLoadingShowcasePage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(layoutStylesRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/styles\/layout\/LayoutStylesPage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(textStylesRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/styles\/text\/TextStylesPage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(spacingStylesRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/styles\/spacing\/SpacingStylesPage\.tsx'\)/,
    )
    assert.match(routes, /createElement\(buttonStylesRoutePage\)/)
    assert.match(
        routes,
        /await import\('@\/showcase\/styles\/button\/ButtonStylesPage\.tsx'\)/,
    )
    assert.match(appRouter, /SHOWCASE_ROUTE_ELEMENTS/)
    assert.match(showcase, /export function ShowcasePage/)
    assert.match(showcase, /pushRoute\(SHOWCASE_ROUTE_PATH\.components\)/)
    assert.match(showcase, /pushRoute\(SHOWCASE_ROUTE_PATH\.styles\)/)
    assert.match(components, /export function ComponentsPage/)
    assert.match(components, /COMPONENT_SHOWCASE_LIST/)
    assert.match(components, /title: '弹窗'/)
    assert.match(components, /title: '选择器'/)
    assert.match(components, /title: '下拉框'/)
    assert.match(components, /title: '图标'/)
    assert.match(components, /title: '空数据'/)
    assert.match(components, /title: '语言切换'/)
    assert.match(components, /title: '合约 Loading'/)
    assert.match(components, /pushRoute\(path\)/)
    assert.match(page, /import \{ Popup, type PopupPosition \} from '@\/components\/Popup'/)
    assert.match(page, /<SecondaryHeader title="弹窗" \/>/)
    assert.match(page, /POPUP_DEMO_LIST/)
    assert.match(page, /title: '居中弹窗'/)
    assert.match(page, /title: '右侧弹窗'/)
    assert.match(page, /title: '左侧弹窗'/)
    assert.match(page, /title: '底部弹窗'/)
    assert.doesNotMatch(page, /Center Popup|Right Popup|Left Popup|Bottom Popup/)
    assert.match(page, /contentPreset: true/)
    assert.match(page, /contentPreset: false/)
    assert.match(page, /position=\{activeDemo\.position\}/)
    assert.match(page, /title=\{activeDemo\.title\}/)
    assert.match(page, /contentPreset=\{activeDemo\.contentPreset\}/)
    assert.match(page, /const isSidePopup = activeDemo\.position === 'left' \|\| activeDemo\.position === 'right'/)
    assert.match(page, /contentClassName=\{isSidePopup \? 'full-view' : ''\}/)
    assert.match(page, /activeDemo\.contentPreset \?/)
    assert.match(page, /popup-showcase-drawer/)
    assert.match(page, /popup-showcase-drawer--\$\{activeDemo\.position\}/)
    assert.match(page, /popup-showcase-drawer--\$\{activeDemo\.position\} flex flex-column/)
    assert.match(page, /className="full-btn"/)
    assert.match(page, /className="full-btn mt-40"/)
    assert.match(page, /className="app-card"/)
    assert.match(page, /grid grid-2 row-gap-20 column-gap-20 mt-30/)
    assert.doesNotMatch(page, /grid grid-2 gap-20 mt-30/)
    assert.doesNotMatch(page, /contentPreset=\{false\}/)
    assert.match(pageStyle, /&-drawer\s*\{[\s\S]*height:\s*100%;/)
    assert.doesNotMatch(pageStyle, /display:\s*flex/)
    assert.doesNotMatch(pageStyle, /flex-direction:\s*column/)
    assert.match(pageStyle, /&--left\s*\{[\s\S]*border-radius:\s*0 30px 30px 0;/)
    assert.match(pageStyle, /&--right\s*\{[\s\S]*border-radius:\s*30px 0 0 30px;/)
    assert.match(pickerPage, /export function PickerShowcasePage/)
    assert.match(pickerPage, /<SecondaryHeader title="选择器" \/>/)
    assert.match(pickerPage, /<Picker/)
    assert.match(dropdownPage, /export function DropdownShowcasePage/)
    assert.match(dropdownPage, /<SecondaryHeader title="下拉框" \/>/)
    assert.match(dropdownPage, /<Dropdown/)
    assert.match(dropdownPage, /contentAlign="left"/)
    assert.match(dropdownPage, /contentAlign="center"/)
    assert.match(dropdownPage, /contentAlign="right"/)
    assert.match(iconPage, /export function IconShowcasePage/)
    assert.match(iconPage, /<SecondaryHeader title="图标" \/>/)
    assert.match(iconPage, /ICON_NAME_LIST/)
    assert.match(emptyPage, /export function EmptyShowcasePage/)
    assert.match(emptyPage, /<SecondaryHeader title="空数据" \/>/)
    assert.match(emptyPage, /<Empty \/>/)
    assert.match(languageSwitchPage, /export function LanguageSwitchShowcasePage/)
    assert.match(languageSwitchPage, /<SecondaryHeader title="语言切换" \/>/)
    assert.doesNotMatch(languageSwitchPage, /Vue|slot/)
    assert.doesNotMatch(languageSwitchPage, /打开次数/)
    assert.match(languageSwitchPage, /<LanguageSwitch \/>/)
    assert.match(languageSwitchPage, /<LanguageSwitch>/)
    assert.match(languageSwitchPage, /默认图标入口/)
    assert.match(languageSwitchPage, /自定义按钮入口/)
    assert.match(contractLoadingPage, /export function ContractLoadingShowcasePage/)
    assert.match(contractLoadingPage, /<SecondaryHeader title="合约 Loading" \/>/)
    assert.match(contractLoadingPage, /<ContractLoading show=\{showLoading\} \/>/)
    assert.match(styles, /export function StylesPage/)
    assert.match(styles, /STYLE_SHOWCASE_LIST/)
    assert.match(styles, /title: '布局'/)
    assert.match(styles, /title: '文字'/)
    assert.match(styles, /title: '间距'/)
    assert.match(styles, /title: '按钮和卡片'/)
    assert.match(styles, /pushRoute\(path\)/)
})
