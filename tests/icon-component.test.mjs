import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('icon component provides a local inline svg icon contract', async () => {
    const [component, config, styles, entry, readme, showcasePage, showcaseStyle] = await Promise.all([
        readFile('src/components/Icon/Icon.tsx', 'utf8'),
        readFile('src/components/Icon/config.ts', 'utf8'),
        readFile('src/components/Icon/Icon.scss', 'utf8'),
        readFile('src/components/Icon/index.ts', 'utf8'),
        readFile('src/components/Icon/README.md', 'utf8'),
        readFile('src/showcase/components/icon/IconShowcasePage.tsx', 'utf8'),
        readFile('src/showcase/components/icon/IconShowcasePage.scss', 'utf8'),
    ])

    assert.match(component, /name:\s*IconName/)
    assert.match(component, /getIconDefinition\(name\)/)
    assert.match(component, /return null/)
    assert.match(component, /fill="currentColor"/)
    assert.match(component, /className=\{iconClassName\}/)
    assert.match(component, /aria-hidden/)
    assert.match(component, /<title>\{title\}<\/title>/)
    assert.match(component, /normalizeIconSize\(size\)/)

    assert.match(config, /ICON_DEFINITIONS/)
    assert.match(config, /'home'/)
    assert.match(config, /'menu'/)
    assert.match(config, /'language'/)
    assert.match(config, /'arrow'/)
    assert.match(config, /'arrow-left'/)
    assert.match(config, /'arrow-up'/)
    assert.match(config, /'arrow-down'/)
    assert.match(config, /'cross'/)
    assert.match(config, /'scan'/)
    assert.match(config, /'refresh'/)
    assert.match(config, /'loading'/)
    assert.match(config, /paths:\s*IconPathDefinition\[\]/)
    assert.match(config, /'loading':\s*\{\s*paths:\s*\[\s*\]/)
    assert.match(config, /viewBox/)
    assert.match(config, /getIconDefinition/)

    assert.match(styles, /\.app-icon\s*\{/)
    assert.match(styles, /width:\s*1em;/)
    assert.match(styles, /height:\s*1em;/)
    assert.match(styles, /color:\s*currentColor;/)
    assert.match(styles, /\.app-icon--loading\s*\{[\s\S]*border:\s*2px solid rgb\(141 144 148 \/ 30%\);/)
    assert.match(styles, /border-top-color:\s*#8D9094;/)
    assert.match(styles, /animation:\s*app-icon-loading 0\.8s linear infinite;/)

    assert.match(entry, /export \{ Icon \} from '\.\/Icon\.tsx'/)
    assert.match(entry, /export type \{ IconName, IconProps \} from '\.\/Icon\.tsx'/)
    assert.match(readme, /currentColor/)
    assert.match(readme, /Vant/)
    assert.match(showcasePage, /export function IconShowcasePage/)
    assert.match(showcasePage, /ICON_DEFINITIONS/)
    assert.match(showcasePage, /ICON_NAME_LIST\.map/)
    assert.match(showcasePage, /<Icon name=\{name\}/)
    assert.match(showcasePage, /<SecondaryHeader title="图标" \/>/)
    assert.match(showcaseStyle, /\.icon-showcase\s*\{/)
})
