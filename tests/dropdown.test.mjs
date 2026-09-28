import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('Dropdown keeps its documented overlay, alignment and truncation contract', async () => {
    const [
        component,
        style,
        commonStyle,
        entry,
        readme,
        componentReadme,
        showcase,
        showcaseReadme,
    ] = await Promise.all([
        readFile('src/components/Dropdown/Dropdown.tsx', 'utf8'),
        readFile('src/components/Dropdown/Dropdown.scss', 'utf8'),
        readFile('src/styles/common/common.scss', 'utf8'),
        readFile('src/components/Dropdown/index.ts', 'utf8'),
        readFile('src/components/Dropdown/README.md', 'utf8'),
        readFile('src/components/README.md', 'utf8'),
        readFile(
            'src/showcase/components/dropdown/DropdownShowcasePage.tsx',
            'utf8',
        ),
        readFile('src/showcase/components/dropdown/README.md', 'utf8'),
    ])

    assert.match(component, /export type DropdownContentAlign = 'left' \| 'center' \| 'right'/)
    assert.match(component, /showIcon = true/)
    assert.match(component, /showArrow = false/)
    assert.match(component, /contentAlign = 'left'/)
    assert.match(component, /triggerLabel\?: ReactNode/)
    assert.match(component, /export interface DropdownTriggerRenderProps/)
    assert.match(component, /renderTrigger\?: \(props: DropdownTriggerRenderProps\) => ReactNode/)
    assert.match(component, /maskClassName\?: string/)
    assert.match(component, /maskClassName = ''/)
    assert.match(component, /const maskClassNames =/)
    assert.match(component, /className=\{maskClassNames\}/)
    assert.match(component, /setTriggerElement/)
    assert.match(component, /renderTrigger\s*\?/)
    assert.match(component, /createPortal\(/)
    assert.match(component, /aria-haspopup="listbox"/)
    assert.match(component, /role="listbox"/)
    assert.match(component, /role="option"/)
    assert.match(component, /event\.key !== 'Escape'/)
    assert.match(component, /window\.addEventListener\('resize', updatePanelPosition\)/)
    assert.match(component, /window\.addEventListener\('scroll', updatePanelPosition, true\)/)
    assert.match(component, /getViewportWidthPx\(PANEL_VIEWPORT_GUTTER\)/)
    assert.match(component, /word-ellipsis-1/)
    assert.match(component, /onChange\?\.\(option\.value, option\)/)
    assert.match(component, /onOpenChange\?\.\(nextOpen\)/)

    assert.match(style, /position:\s*fixed;/)
    assert.match(style, /backdrop-filter:\s*blur\(16px\)/)
    assert.match(style, /width:\s*max-content;/)
    assert.match(style, /max-width:\s*calc\(100dvw - 48px\);/)
    assert.match(style, /max-height:\s*calc\(100dvh - 48px\);/)
    assert.match(commonStyle, /\.word-ellipsis-1\s*\{[\s\S]*text-overflow: ellipsis/)
    assert.match(style, /&__trigger--align-left/)
    assert.match(style, /&__trigger--align-center/)
    assert.match(style, /&__trigger--align-right/)
    assert.match(style, /&__option--selected/)
    assert.match(style, /z-index:\s*90;/)
    assert.match(style, /z-index:\s*91;/)

    assert.match(entry, /Dropdown/)
    assert.match(entry, /DropdownContentAlign/)
    assert.match(readme, /showArrow.*默认关闭/)
    assert.match(readme, /showIcon.*菜单选项/)
    assert.match(readme, /renderTrigger/)
    assert.match(readme, /maskClassName/)
    assert.match(readme, /玻璃 mask/)
    assert.match(readme, /单行省略号/)
    assert.match(componentReadme, /Dropdown/)
    assert.match(componentReadme, /Picker/)
    assert.match(componentReadme, /Popup/)
    assert.match(showcase, /export function DropdownShowcasePage/)
    assert.match(showcase, /contentAlign="left"/)
    assert.match(showcase, /contentAlign="center"/)
    assert.match(showcase, /contentAlign="right"/)
    assert.match(showcase, /showIcon=\{false\}/)
    assert.match(showcase, /showArrow/)
    assert.match(showcase, /LONG_LABEL/)
    assert.match(showcaseReadme, /Dropdown/)
})
