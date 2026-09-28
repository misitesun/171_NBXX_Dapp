#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

function readArg(name, fallback) {
    const index = process.argv.indexOf(name)

    if (index === -1) {
        return fallback
    }

    return process.argv[index + 1] || fallback
}

async function readBrandStatus(statusPath) {
    try {
        const content = await readFile(statusPath, 'utf8')

        return JSON.parse(content)
    } catch {
        throw new Error(`Brand status file is missing or invalid: ${statusPath}`)
    }
}

async function main() {
    const statusPath = resolve(readArg('--status', 'public/brand/brand-status.json'))
    const status = await readBrandStatus(statusPath)

    if (status.isProjectLogoReady === true) {
        return
    }

    throw new Error([
        'The project logo is still using the template placeholder.',
        '当前项目 logo 仍然是模板占位资源。',
        '',
        'You can skip the logo during early development, but production build is blocked until it is replaced.',
        '前期开发可以先跳过 logo，但正式生产构建前必须替换。',
        '',
        'Required steps:',
        '1. Replace the project logo with a square PNG.',
        '2. Run `pnpm favicon:generate` to generate favicon.ico.',
        '3. Set `public/brand/brand-status.json` isProjectLogoReady to true.',
    ].join('\n'))
}

main().catch((error) => {
    console.error(error.message)
    process.exit(1)
})
