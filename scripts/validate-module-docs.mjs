import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REQUIRED_DOCUMENTS = [
    'docs/ai-collaboration.md',
    'docs/ai-skills.md',
    'docs/architecture.md',
    'docs/compatibility.md',
    'docs/dapp-project-integration.md',
    'docs/layout-standards.md',
    'docs/php-api-contracts.md',
    'docs/testing-standards.md',
    'docs/template-boundary.md',
    'docs/decisions/0001-ai-governance.md',
    'docs/decisions/0002-normal-flow-page-layout.md',
    'docs/decisions/0003-project-dapp-integration-boundary.md',
    'docs/decisions/0004-figma-measured-fidelity.md',
    'src/components/README.md',
    'src/config/README.md',
    'src/features/README.md',
    'src/hooks/README.md',
    'src/i18n/README.md',
    'src/pages/README.md',
    'src/router/README.md',
    'src/services/README.md',
    'src/services/contracts/README.md',
    'src/services/dapp/README.md',
    'src/services/http/README.md',
    'src/services/upload/README.md',
    'src/services/storage/README.md',
    'src/shared/clipboard/README.md',
    'src/stores/README.md',
]

function fail(message) {
    console.error(`Module documentation validation failed: ${message}`)
    process.exitCode = 1
}

for (const relativePath of REQUIRED_DOCUMENTS) {
    const documentPath = resolve(relativePath)

    if (!existsSync(documentPath)) {
        fail(`missing ${relativePath}`)
        continue
    }

    const content = readFileSync(documentPath, 'utf8').trim()

    if (!/^#\s+\S+/m.test(content)) {
        fail(`${relativePath} must have a top-level Markdown heading`)
    }

    if (content.length < 80) {
        fail(`${relativePath} is too short to describe a stable module contract`)
    }
}

if (process.exitCode === undefined) {
    console.log(`Module documentation validation passed (${REQUIRED_DOCUMENTS.length} documents).`)
}
