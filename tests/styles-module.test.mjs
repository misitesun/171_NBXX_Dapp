import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { access } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const styleFiles = [
    'src/styles/index.scss',
    'src/styles/animate.scss',
    'src/styles/common/index.scss',
    'src/styles/common/common.scss',
    'src/styles/layout/device.scss',
    'src/styles/layout/flex.scss',
    'src/styles/layout/grid.scss',
    'src/pages/main/layout/MainLayout.scss',
]

test('project imports the global SCSS style entry', () => {
    const main = readFileSync('src/main.tsx', 'utf8')

    assert.match(main, /import '\.\/styles\/index\.scss'/)
    assert.doesNotMatch(main, /import '\.\/index\.css'/)
})

test('style module keeps global initialization in the SCSS entry', async () => {
    await Promise.all(styleFiles.map((file) => access(file)))

    const entry = readFileSync('src/styles/index.scss', 'utf8')

    assert.match(entry, /\* \{/)
    assert.match(entry, /@use '\.\/color'/)
    assert.match(entry, /@use '\.\/animate'/)
    assert.match(entry, /@use '\.\/layout\/device'/)
    assert.match(entry, /@use '\.\/layout\/flex'/)
    assert.match(entry, /@use '\.\/layout\/grid'/)
    assert.match(entry, /@use '\.\/common\/index'/)
    assert.match(entry, /@use '\.\/common\/common'/)
    assert.match(entry, /-webkit-user-select: none/)
    assert.match(entry, /user-select: text/)
    assert.match(entry, /-webkit-tap-highlight-color: transparent/)
    assert.match(entry, /input\[type="number"\]::-webkit-inner-spin-button/)
})

test('layout style modules expose common flex and grid helpers', () => {
    const mixins = readFileSync('src/styles/mixins.scss', 'utf8')
    const color = readFileSync('src/styles/color.scss', 'utf8')
    const common = readFileSync('src/styles/common/common.scss', 'utf8')
    const device = readFileSync('src/styles/layout/device.scss', 'utf8')
    const flex = readFileSync('src/styles/layout/flex.scss', 'utf8')
    const grid = readFileSync('src/styles/layout/grid.scss', 'utf8')

    assert.match(mixins, /@mixin hide-scrollbar/)
    assert.match(mixins, /::-webkit-scrollbar/)
    assert.match(mixins, /@mixin calc-vh\(\$px, \$property: height\)/)
    assert.match(mixins, /#\{\$property\}: calc\(100vh - #\{\$px\}px\)/)
    assert.match(mixins, /#\{\$property\}: calc\(100dvh - #\{\$px\}px\)/)
    assert.match(mixins, /@mixin gradient-card\(/)
    assert.match(mixins, /border:\s*[^;]+solid transparent;/)
    assert.match(mixins, /background:\s*[^;]+padding-box,\s*[^;]+border-box;/)
    assert.doesNotMatch(mixins, /\bmask:/)
    assert.doesNotMatch(mixins, /mask-composite/)
    assert.doesNotMatch(mixins, /-webkit-mask/)
    assert.match(color, /--app-btn-color:\s*#000000/)
    assert.match(mixins, /\$color:\s*var\(--app-btn-color\)/)
    assert.match(common, /@use '\.\.\/mixins' as \*/)
    assert.match(common, /\.full-btn\s*\{[\s\S]*@include full-button\(88px, 20px\)/)
    assert.match(common, /\.auto-btn\s*\{[\s\S]*@include auto-button\(\)/)
    assert.match(device, /\.safe-bottom/)
    assert.match(device, /env\(safe-area-inset-bottom\)/)
    assert.match(device, /\.full-view/)
    assert.doesNotMatch(device, /\.full-screen/)
    assert.match(device, /width: 100%/)
    assert.match(device, /height: 100%/)
    assert.match(device, /\.no-scroll/)
    assert.match(device, /\.scroll-x/)
    assert.match(device, /\.scroll-y/)
    assert.match(device, /@use '\.\.\/mixins' as \*/)
    assert.match(device, /@include hide-scrollbar/)
    assert.match(device, /@for \$i from 0 through 100/)
    assert.match(device, /@if \$i % 2 == 0 or \$i % 5 == 0/)
    assert.match(device, /\.vw-#\{\$i\}/)
    assert.match(device, /\.min-vw-#\{\$i\}/)
    assert.match(device, /\.max-vw-#\{\$i\}/)
    assert.match(device, /\.vh-#\{\$i\}/)
    assert.match(device, /\.min-vh-#\{\$i\}/)
    assert.match(device, /\.max-vh-#\{\$i\}/)
    assert.match(device, /width: #\{\$i\}vw/)
    assert.match(device, /width: #\{\$i\}dvw/)
    assert.match(device, /height: #\{\$i\}vh/)
    assert.match(device, /height: #\{\$i\}dvh/)
    assert.match(flex, /\.flex-center/)
    assert.match(flex, /\.flex-between/)
    assert.match(flex, /@for \$i from 1 through 10/)
    assert.match(grid, /\.grid \{/)
    assert.match(grid, /@for \$i from 1 through 10/)
    assert.match(grid, /@for \$i from 0 through 50/)
    assert.match(grid, /@if \$i % 2 == 0 or \$i % 5 == 0/)
})

test('vite injects global SCSS mixins into every style file', () => {
    const viteConfig = readFileSync('vite.config.ts', 'utf8')

    assert.match(viteConfig, /additionalData/)
    assert.match(viteConfig, /@use "@\/styles\/mixins\.scss" as \*/)
})

test('vite uses esbuild to minify production css so backdrop-filter stays compatible', () => {
    const viteConfig = readFileSync('vite.config.ts', 'utf8')
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))

    assert.match(viteConfig, /build:\s*\{[\s\S]*cssMinify:\s*.esbuild./)
    assert.match(packageJson.devDependencies.esbuild, /^\^/)
})

test('postcss keeps the mobile 750px design draft adapter', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const postcssConfig = require('../postcss.config.cjs')
    const viewportOptions = postcssConfig.plugins['postcss-px-to-viewport-8-plugin']

    assert.equal(packageJson.devDependencies['postcss-px-to-viewport'], undefined)
    assert.match(packageJson.devDependencies['postcss-px-to-viewport-8-plugin'], /\^1\.2\.5/)
    assert.equal(viewportOptions.unitToConvert, 'px')
    assert.equal(viewportOptions.viewportWidth, 750)
    assert.equal(viewportOptions.unitPrecision, 5)
    assert.deepEqual(viewportOptions.propList, ['*'])
    assert.equal(viewportOptions.viewportUnit, 'vw')
    assert.equal(viewportOptions.fontViewportUnit, 'vw')
    assert.equal(viewportOptions.minPixelValue, 2)
    assert.equal(viewportOptions.mediaQuery, false)
    assert.equal(viewportOptions.replace, true)
    assert.equal(viewportOptions.landscape, false)
    assert.equal(viewportOptions.exclude[0].test('/node_modules/example/style.css'), true)
})
