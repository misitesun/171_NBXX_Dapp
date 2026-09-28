import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const styleShowcaseFiles = [
    'src/showcase/styles/index.tsx',
    'src/showcase/styles/StyleShowcase.scss',
    'src/showcase/styles/layout/LayoutStylesPage.tsx',
    'src/showcase/styles/text/TextStylesPage.tsx',
    'src/showcase/styles/spacing/SpacingStylesPage.tsx',
    'src/showcase/styles/button/ButtonStylesPage.tsx',
]

test('style showcase keeps only high-frequency preview pages', async () => {
    await Promise.all(styleShowcaseFiles.map((file) => access(file)))

    const index = await readFile('src/showcase/styles/index.tsx', 'utf8')

    assert.match(index, /STYLE_SHOWCASE_LIST/)
    assert.match(index, /SHOWCASE_ROUTE_PATH\.styleLayout/)
    assert.match(index, /SHOWCASE_ROUTE_PATH\.styleText/)
    assert.match(index, /SHOWCASE_ROUTE_PATH\.styleSpacing/)
    assert.match(index, /SHOWCASE_ROUTE_PATH\.styleButton/)
    assert.match(index, /title: '布局'/)
    assert.match(index, /title: '文字'/)
    assert.match(index, /title: '间距'/)
    assert.match(index, /title: '按钮和卡片'/)
})

test('style showcase previews representative utility classes', async () => {
    const layout = await readFile(
        'src/showcase/styles/layout/LayoutStylesPage.tsx',
        'utf8',
    )
    const text = await readFile(
        'src/showcase/styles/text/TextStylesPage.tsx',
        'utf8',
    )
    const spacing = await readFile(
        'src/showcase/styles/spacing/SpacingStylesPage.tsx',
        'utf8',
    )
    const button = await readFile(
        'src/showcase/styles/button/ButtonStylesPage.tsx',
        'utf8',
    )
    const demoStyle = await readFile(
        'src/showcase/styles/StyleShowcase.scss',
        'utf8',
    )

    assert.match(layout, /<SecondaryHeader title="布局样式" \/>/)
    assert.match(layout, /flex-center/)
    assert.match(layout, /flex-between/)
    assert.match(layout, /grid grid-2 row-gap-20 column-gap-20/)
    assert.match(layout, /scroll-x/)
    assert.match(layout, /full-view/)

    assert.match(text, /<SecondaryHeader title="文字样式" \/>/)
    assert.match(text, /const NUMBER_CLASS_SAMPLE_LIST = \[50, 100, 150, 200\]/)
    assert.match(text, /size-\$\{value\}/)
    assert.match(text, /lh-\$\{value\}/)
    assert.match(text, /opc-5/)
    assert.match(text, /bold-8/)
    assert.match(text, /word-ellipsis-1/)
    assert.match(text, /word-ellipsis-2/)
    assert.doesNotMatch(text, /app-row-card[^"']*word-ellipsis-2/)

    assert.match(spacing, /<SecondaryHeader title="间距样式" \/>/)
    assert.match(spacing, /const NUMBER_CLASS_SAMPLE_LIST = \[50, 100, 150, 200\]/)
    assert.match(spacing, /gap-\$\{value\}/)
    assert.match(spacing, /mt-\$\{value\}/)
    assert.match(spacing, /pt-\$\{value\}/)

    assert.match(button, /<SecondaryHeader title="按钮和卡片" \/>/)
    assert.match(button, /full-btn/)
    assert.match(button, /auto-btn/)
    assert.match(button, /app-card/)
    assert.match(button, /app-row-card/)
    assert.match(button, /app-color/)

    assert.match(demoStyle, /\.style-showcase-demo/)
    assert.match(demoStyle, /background-color: var\(--app-box-bg\)/)
    assert.match(demoStyle, /background-color: var\(--app-color\)/)
})
