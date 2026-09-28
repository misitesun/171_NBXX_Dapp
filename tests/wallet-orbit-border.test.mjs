import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [source, styles] = await Promise.all([
    readFile('src/pages/main/layout/WalletOrbitBorder.tsx', 'utf8'),
    readFile('src/pages/main/layout/WalletOrbitBorder.scss', 'utf8'),
])

test('wallet orbit follows the measured rounded rectangle perimeter', () => {
    assert.match(source, /const VIEWBOX_WIDTH = 670/)
    assert.match(source, /const VIEWBOX_HEIGHT = 274/)
    assert.match(source, /const STROKE_WIDTH = 2/)
    assert.match(source, /const SOURCE_STROKE_WIDTH = 10/)
    assert.match(source, /const CENTERLINE_RADIUS = 39/)
    assert.match(source, /const HIGHLIGHT_LENGTH = 335/)
    assert.match(source, /\[0, PATH_PERIMETER \/ 2\]/)
    assert.match(source, /pathLength=\{PATH_PERIMETER\}/)
    assert.match(source, /strokeDasharray=\{`\$\{dashLength\} \$\{dashGap\}`\}/)
    assert.match(source, /<feGaussianBlur stdDeviation="3" \/>/)
    assert.match(source, /mask=\{`url\(#\$\{maskId\}\)`\}/)
})

test('wallet orbit animates one shared distance at a constant twelve-second rate', () => {
    assert.match(styles, /@property --wallet-orbit-distance/)
    assert.match(styles, /animation:\s*wallet-orbit-border-travel 12s linear infinite/)
    assert.match(styles, /stroke-dashoffset:\s*calc\(/)
    assert.match(styles, /@keyframes wallet-orbit-border-travel/)
    assert.match(styles, /to \{ --wallet-orbit-distance: var\(--wallet-orbit-end-distance\); \}/)
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation:\s*none/)
    assert.doesNotMatch(styles, /conic-gradient|offset-path/)
})
