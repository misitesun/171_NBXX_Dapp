import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

test('renders a formatted amount and passes span attributes through', async () => {
    const hooks = registerHooks({
        load(url, context, nextLoad) {
            if (!url.endsWith('.tsx')) return nextLoad(url, context)

            const source = readFileSync(new URL(url), 'utf8')
            const output = ts.transpileModule(source, {
                compilerOptions: {
                    jsx: ts.JsxEmit.ReactJSX,
                    module: ts.ModuleKind.ESNext,
                    target: ts.ScriptTarget.ES2022,
                },
            })

            return { format: 'module', shortCircuit: true, source: output.outputText }
        },
    })

    try {
        const { AmountText } = await import(
            '../src/shared/components/AmountText/AmountText.tsx'
        )
        const html = renderToStaticMarkup(
            createElement(AmountText, {
                value: '999999999999999999.1234569',
                className: 'balance',
                'data-token': 'USDT',
            }),
        )

        assert.equal(
            html,
            '<span class="balance" data-token="USDT">999,999,999,999,999,999.123456</span>',
        )
    } finally {
        hooks.deregister()
    }
})
