import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

test('secondary header renders a passed title and handles second-level navigation back', async () => {
    const componentPath = 'src/components/SecondaryHeader/SecondaryHeader.tsx'
    const stylePath = 'src/components/SecondaryHeader/SecondaryHeader.scss'
    const entryPath = 'src/components/SecondaryHeader/index.ts'
    const readmePath = 'src/components/SecondaryHeader/README.md'

    assert.equal(existsSync(componentPath), true)
    assert.equal(existsSync(stylePath), true)
    assert.equal(existsSync(entryPath), true)
    assert.equal(existsSync('src/components/Navbar/Navbar.tsx'), false)
    assert.equal(existsSync('src/components/Navbar/index.ts'), false)

    const [componentSource, styleSource, entrySource, readmeSource] = await Promise.all([
        readFile(componentPath, 'utf8'),
        readFile(stylePath, 'utf8'),
        readFile(entryPath, 'utf8'),
        readFile(readmePath, 'utf8'),
    ])

    assert.match(componentSource, /export interface SecondaryHeaderProps/)
    assert.match(componentSource, /title: string/)
    assert.match(componentSource, /import type \{ ReactNode \} from 'react'/)
    assert.match(componentSource, /right\?: ReactNode/)
    assert.match(componentSource, /showGap\?: boolean/)
    assert.match(componentSource, /showGap = true/)
    assert.match(componentSource, /useLocation/)
    assert.match(componentSource, /useAppNavigate/)
    assert.match(componentSource, /ROUTE_PATH\.home/)
    assert.match(componentSource, /function handleBackClick\(\)/)
    assert.match(componentSource, /location\.key === 'default'/)
    assert.match(componentSource, /replaceRoute\(ROUTE_PATH\.home\)/)
    assert.match(componentSource, /backRoute\(\)/)
    assert.match(componentSource, /onClick=\{handleBackClick\}/)
    assert.match(componentSource, /\{title\}/)
    assert.match(componentSource, /\{right\}/)
    assert.doesNotMatch(componentSource, /showSafeTop/)
    assert.match(componentSource, /showGap \? \(/)
    assert.match(componentSource, /<div className="safe-top" \/>/)
    assert.match(componentSource, /<div className="gap-100" \/>/)
    assert.match(componentSource, /import '\.\/SecondaryHeader\.scss'/)
    assert.match(styleSource, /\.secondary-header\s*\{/)
    assert.match(styleSource, /&-bar/)
    assert.match(entrySource, /export \{ SecondaryHeader \} from '\.\/SecondaryHeader\.tsx'/)
    assert.match(entrySource, /export type \{ SecondaryHeaderProps \} from '\.\/SecondaryHeader\.tsx'/)
    assert.match(readmeSource, /second-level pages/)
    assert.match(readmeSource, /二级页面/)
})
