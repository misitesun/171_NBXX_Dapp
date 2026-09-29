// Development-only browser regression. All responses are local fixtures, never sent to the backend.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { httpClient, HttpError } from '../src/services/http'
import { useAuthStore } from '../src/stores/auth/store.ts'
import { useHomeData } from '../src/pages/main/home/useHomeData.ts'

const member = (id: number) => ({ id, team_count: 2, node_kpi: '123.000000', team_node_kpi: '456.000000', referral_code: `r${id}`, referral_count: 1 })
const firstPage = Array.from({ length: 20 }, (_, i) => member(i + 1))
let gate: (() => void) | undefined
let holdNext = false
let failFirst = false
let emptyFirst = false
let calls: number[] = []
httpClient.defaults.adapter = async config => {
    if (config.url === '/api/users/my') return { data: member(100), status: 200, statusText: 'OK', headers: {}, config }
    const page = config.params.page_no
    calls.push(page)
    if (page === 2 && holdNext) await new Promise<void>(resolve => { gate = resolve })
    if (page === 1 && failFirst) throw new HttpError('Fixture unavailable', { status: 500 })
    return { data: { referrals: page === 1 ? emptyFirst ? [] : firstPage : [member(21)] }, status: 200, statusText: 'OK', headers: {}, config }
}
useAuthStore.setState({ status: 'signedIn', user: null })
let current: ReturnType<typeof useHomeData>
const report = () => undefined
const delay = () => new Promise<void>(resolve => setTimeout(resolve, 30))
async function settle() { await delay(); await delay() }
function assert(value: unknown, label: string) { if (!value) throw new Error(label) }

export function Harness() {
    const data = useHomeData(report)
    current = data
    const [results, setResults] = useState('READY')
    async function verify() {
        const passed: string[] = []
        try {
            await settle()
            assert(current.members.length === 20 && current.hasMore && !current.loading, 'initial page one')
            assert(current.user?.id === 100, 'profile')
            passed.push('first page and real profile binding')
            holdNext = true
            calls = []
            const next = current.loadMore()
            await delay()
            const duplicate = current.loadMore()
            await duplicate
            assert(calls.filter(page => page === 2).length === 1, 'duplicate page two blocked')
            passed.push('duplicate pagination blocked synchronously')
            const refresh = current.reload()
            await settle()
            gate?.()
            await Promise.all([next, refresh]); await settle()
            assert(current.members.length === 20 && current.hasMore && !current.loadingMore, 'stale page two rejected after refresh')
            passed.push('replacement page one ignores stale page two')
            holdNext = false
            await current.loadMore(); await settle()
            assert(current.members.length === 21 && !current.hasMore, 'short final page')
            passed.push('short final page ends pagination')
            failFirst = true
            await current.reload(); await settle()
            assert(current.members.length === 0 && !current.hasMore && current.teamFailed && !current.loading, 'failed first page')
            passed.push('failed first page remains an error rather than empty success')
            failFirst = false
            await current.reload(); await settle()
            assert(current.members.length === 20 && current.hasMore && !current.teamFailed, 'retry resets pagination')
            passed.push('retry loads fresh page one')
            setResults(`PASS ${passed.length}/${passed.length}\n${passed.join('\n')}`)
        } catch (error) { setResults(`FAIL\n${error instanceof Error ? error.message : String(error)}`) }
    }
    return <main><h1>NodeXX home regression (local fixtures)</h1><button onClick={() => { void verify() }}>Run pagination checks</button><pre id="results">{results}</pre><pre>{JSON.stringify({ count: data.members.length, hasMore: data.hasMore, loading: data.loading, teamFailed: data.teamFailed })}</pre></main>
}
const root = document.getElementById('root')
if (root) createRoot(root).render(<Harness />)
