import { registerHooks } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import ts from 'typescript'

export function registerUiModules() {
    return registerHooks({
        resolve(specifier, context, nextResolve) {
            let candidate
            if (specifier.startsWith('@/')) candidate = pathToFileURL(resolve('src', specifier.slice(2))).href
            else if (specifier.startsWith('.')) candidate = new URL(specifier, context.parentURL).href
            if (candidate) {
                for (const suffix of ['', '.ts', '.tsx', '/index.ts']) {
                    if (existsSync(fileURLToPath(candidate + suffix)) && /\.(tsx?|scss|css|png|svg)$/.test(candidate + suffix)) {
                        return { url: candidate + suffix, shortCircuit: true }
                    }
                }
            }
            return nextResolve(specifier, context)
        },
        load(url, context, nextLoad) {
            if (/\.(scss|css|png|svg)$/.test(url)) return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(url)}` }
            if (!/\.tsx?$/.test(url) || url.includes('/node_modules/')) return nextLoad(url, context)
            const output = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
                compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
            })
            return { format: 'module', shortCircuit: true, source: output.outputText }
        },
    })
}
