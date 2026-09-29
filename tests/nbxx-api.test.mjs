import test from 'node:test'
import assert from 'node:assert/strict'
import { AxiosError } from 'axios'
import { registerUiModules } from './hu-ui-render.mjs'

const hooks = registerUiModules()
const { httpClient, registerHttpWalletAddressProvider } = await import('../src/services/http/index.ts')
const { getMyInfo, getMyReferrals, parseUserInfo, parseReferrals } = await import('../src/features/user/api.ts')
const { requestWalletLogin } = await import('../src/features/auth/api.ts')
const { buildApiHomeConfig } = await import('../src/pages/main/home/apiConfig.ts')
const user = { id: 7, team_count: 12, node_kpi: '900719925474099312.123456', team_node_kpi: '5500.000000', referral_code: 'a+B c', referral_count: 3 }
const login = { address: '0x0000000000000000000000000000000000000001', signature: '0xsigned', timestamp: 1790668800 }
function storage() {
    const map = new Map([['TOKEN', 'verified-token'], ['LANG', 'zh-Hans']])
    return { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) }
}

test('user and referral parsers preserve six-decimal strings and reject incompatible responses', () => {
    assert.deepEqual(parseUserInfo(user), user)
    assert.deepEqual(parseReferrals({ referrals: [user] }), [user])
    assert.deepEqual(parseReferrals({ referrals: [] }), [])
    for (const value of [null, '', {}, { data: user }, { ...user, team_count: '12' }, { ...user, node_kpi: 500 }, { ...user, node_kpi: '500.00' }, { ...user, referral_code: null }]) assert.throws(() => parseUserInfo(value))
    for (const value of [null, [], {}, { referrals: [null] }]) assert.throws(() => parseReferrals(value))
})

test('GET endpoints, pagination, paired wallet headers and backend language follow the supplied contract', async () => {
    globalThis.window = { localStorage: storage() }
    const unregister = registerHttpWalletAddressProvider(() => login.address)
    const previous = httpClient.defaults.adapter
    const calls = []
    httpClient.defaults.adapter = async config => {
        calls.push(config)
        return { data: config.url.endsWith('/referrals') ? { referrals: [user] } : user, status: 200, headers: {}, config }
    }
    try {
        assert.deepEqual(await getMyInfo(), user)
        assert.deepEqual(await getMyReferrals(2), [user])
        assert.equal(calls[0].url, '/api/users/my')
        assert.equal(calls[1].url, '/api/users/my/referrals')
        assert.deepEqual(calls[1].params, { page_no: 2, page_size: 20 })
        assert.equal(calls[0].headers.get('Authorization'), 'Bearer verified-token')
        assert.equal(calls[0].headers.get('Address'), login.address)
        assert.equal(calls[0].headers.get('lang'), 'zh-CN')
        await assert.rejects(getMyReferrals(0))
        assert.equal(calls.length, 2)
    } finally { unregister(); httpClient.defaults.adapter = previous }
})

test('login consumes a required token, preserves request fields and rejects empty success bodies and HTTP failures', async () => {
    globalThis.window = { localStorage: storage() }
    window.localStorage.removeItem('TOKEN')
    const previous = httpClient.defaults.adapter
    try {
        let result = { token: 'backend-token' }
        let captured
        httpClient.defaults.adapter = async config => { captured = config; return { data: result, status: 200, headers: {}, config } }
        assert.equal(await requestWalletLogin({ ...login, ref: 'valid-ref' }), 'backend-token')
        assert.equal(captured.url, '/api/auth/login')
        assert.equal(captured.method, 'post')
        assert.deepEqual(JSON.parse(captured.data), { ...login, ref: 'valid-ref' })
        assert.equal(captured.headers.has('Authorization'), false)
        assert.equal(captured.headers.has('Address'), false)
        for (result of ['', null, {}, { token: '' }, { token: 1 }]) await assert.rejects(requestWalletLogin(login))
        httpClient.defaults.adapter = async config => { throw new AxiosError('bad request', 'ERR_BAD_REQUEST', config, undefined, { data: '邀请码不能为空', status: 400, headers: {}, config }) }
        await assert.rejects(requestWalletLogin(login), error => error.status === 400 && error.message === '邀请码不能为空')
    } finally { httpClient.defaults.adapter = previous }
})

test('API home config maps real metrics, escapes referral URLs and does not invent addresses or registration times', () => {
    const config = buildApiHomeConfig(user, [user], 'https://example.com')
    assert.deepEqual(config.metrics.map(metric => metric.value), ['12', '5500.000000', '3', '900719925474099312.123456'])
    assert.equal(new URL(config.invitationText).pathname, '/ref/a%2BB%20c')
    assert.equal(new URL(config.invitationText).search, '')
    assert.equal(config.performanceUnit, 'U')
    assert.equal(config.teamMembers[0].address, 'ID: 7')
    assert.equal(config.teamMembers[0].joinedAt, '')
    assert.equal(config.teamMembers[0].personalPerformance, user.node_kpi)
    const loading = buildApiHomeConfig(null, [], 'https://example.com')
    assert.equal(loading.invitationText, '')
    assert.deepEqual(loading.metrics.map(metric => metric.value), ['—', '—', '—', '—'])
    assert.deepEqual(loading.teamMembers, [])
})

test.after(() => hooks.deregister())
