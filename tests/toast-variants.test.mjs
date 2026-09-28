import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Toast exposes default, success and error variants with matching accessibility', async () => {
    const [component, hook, entry] = await Promise.all([
        readFile('src/components/Toast/Toast.tsx', 'utf8'),
        readFile('src/components/Toast/useToast.ts', 'utf8'),
        readFile('src/components/Toast/index.ts', 'utf8'),
    ])

    assert.match(component, /export type ToastVariant = 'default' \| 'success' \| 'error'/)
    assert.match(component, /variant = 'default'/)
    assert.match(component, /app-toast--\$\{variant\}/)
    assert.match(component, /role=\{isError \? 'alert' : 'status'\}/)
    assert.match(component, /aria-live=\{isError \? 'assertive' : 'polite'\}/)
    assert.match(component, /<ToastStatusIcon variant=\{variant\} \/>/)
    assert.match(component, /variant === 'success'/)
    assert.match(component, /<span className="app-toast__text">\{message\}<\/span>/)
    assert.match(hook, /nextVariant: ToastVariant = 'default'/)
    assert.match(hook, /return \{ message, variant, showToast \}/)
    assert.match(entry, /ToastVariant/)
})

test('default Toast stays centered while status variants clear navigation and enter from the right', async () => {
    const [styles, colors] = await Promise.all([
        readFile('src/components/Toast/Toast.scss', 'utf8'),
        readFile('src/styles/color.scss', 'utf8'),
    ])
    const statusMessageStyles = styles.match(
        /&--success &__message,\s*&--error &__message \{([\s\S]*?)\n    \}/,
    )?.[1] ?? ''

    assert.match(styles, /&--default \{\s*padding: 40px;/)
    assert.match(styles, /top: calc\(80px \+ env\(safe-area-inset-top\)\)/)
    assert.match(styles, /animation: app-toast-enter-from-right 280ms ease-out both/)
    assert.match(styles, /&--success &__message,\s*&--error &__message \{[\s\S]*max-width: 80vw;[\s\S]*min-height: 88px;/)
    assert.match(styles, /&__text \{[\s\S]*white-space: normal;[\s\S]*word-break: break-word;/)
    assert.match(styles, /&__icon \{[\s\S]*flex: 0 0 auto;/)
    assert.doesNotMatch(statusMessageStyles, /^\s*height:/m)
    assert.match(styles, /prefers-reduced-motion: reduce/)
    assert.match(styles, /background-color: var\(--app-toast-success-bg\)/)
    assert.match(styles, /background-color: var\(--app-toast-error-bg\)/)
    assert.match(styles, /border: 2px solid var\(--app-green\)/)
    assert.match(styles, /border: 2px solid var\(--app-red\)/)
    assert.match(colors, /--app-toast-success-bg: rgb\(52 185 38 \/ 50%\)/)
    assert.match(colors, /--app-toast-error-bg: rgb\(241 70 61 \/ 50%\)/)
})
