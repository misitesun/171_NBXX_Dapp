import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('useLatestRequest provides a reusable stale request guard for page data', async () => {
    const [hook, entry, readme, agentRules] = await Promise.all([
        readFile('src/hooks/useLatestRequest.ts', 'utf8'),
        readFile('src/hooks/index.ts', 'utf8'),
        readFile('src/hooks/README.md', 'utf8'),
        readFile('AGENTS.md', 'utf8'),
    ])

    assert.match(hook, /export function useLatestRequest/)
    assert.match(hook, /latestRequestIdRef/)
    assert.match(hook, /createLatestRequestGuard/)
    assert.match(hook, /invalidateLatestRequest/)
    assert.match(hook, /return \(\) => requestId === latestRequestIdRef\.current/)
    assert.match(hook, /useEffect\(\(\) => invalidateLatestRequest/)
    assert.match(entry, /useLatestRequest/)
    assert.match(readme, /old async requests/i)
    assert.match(agentRules, /useLatestRequest/)
})
