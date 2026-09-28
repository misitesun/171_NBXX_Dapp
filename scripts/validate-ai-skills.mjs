import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SKILLS_ROOT = resolve('.agents/skills')
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function fail(message) {
    console.error(`AI skill validation failed: ${message}`)
    process.exitCode = 1
}

function readText(filePath) {
    return readFileSync(filePath, 'utf8')
}

function getFrontmatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)

    return match?.[1] ?? ''
}

function yamlValue(text, key) {
    const match = text.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'm'))

    return match?.[1].trim().replace(/^['"]|['"]$/g, '') ?? ''
}

function isPlaceholder(value) {
    return value.length === 0 || /\bTODO\b|<[^>]+>/i.test(value)
}

if (!existsSync(SKILLS_ROOT)) {
    fail(`missing ${SKILLS_ROOT}`)
} else {
    const skillDirectories = readdirSync(SKILLS_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()

    if (skillDirectories.length === 0) {
        fail('no skill directories found')
    }

    for (const skillName of skillDirectories) {
        if (!NAME_PATTERN.test(skillName)) {
            fail(`skill directory ${skillName} must use lowercase kebab-case`)
            continue
        }

        const skillPath = resolve(SKILLS_ROOT, skillName, 'SKILL.md')
        const metadataPath = resolve(SKILLS_ROOT, skillName, 'agents/openai.yaml')

        if (!existsSync(skillPath)) {
            fail(`${skillName} is missing SKILL.md`)
            continue
        }

        if (!existsSync(metadataPath)) {
            fail(`${skillName} is missing agents/openai.yaml`)
            continue
        }

        const frontmatter = getFrontmatter(readText(skillPath))
        const declaredName = yamlValue(frontmatter, 'name')
        const description = yamlValue(frontmatter, 'description')

        if (declaredName !== skillName) {
            fail(`${skillName} frontmatter name must equal its directory name`)
        }

        if (isPlaceholder(description)) {
            fail(`${skillName} must have a concrete frontmatter description`)
        }

        const metadata = readText(metadataPath)
        const displayName = yamlValue(metadata, 'display_name')
        const shortDescription = yamlValue(metadata, 'short_description')
        const defaultPrompt = yamlValue(metadata, 'default_prompt')

        if (!/^interface:\s*$/m.test(metadata)) {
            fail(`${skillName} metadata must declare interface`)
        }

        if (isPlaceholder(displayName) || isPlaceholder(shortDescription)) {
            fail(`${skillName} metadata must have display_name and short_description`)
        }

        if (isPlaceholder(defaultPrompt) || !defaultPrompt.includes(`$${skillName}`)) {
            fail(`${skillName} metadata default_prompt must invoke $${skillName}`)
        }

        if (!/^\s{4}allow_implicit_invocation:\s*true\s*$/m.test(metadata)) {
            fail(`${skillName} metadata must enable implicit invocation`)
        }
    }

    if (process.exitCode === undefined) {
        console.log(`AI skill validation passed (${skillDirectories.length} skills).`)
    }
}
