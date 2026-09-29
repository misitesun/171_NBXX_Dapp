import test from 'node:test'
import assert from 'node:assert/strict'
import { AxiosError } from 'axios'
import { registerUiModules } from './hu-ui-render.mjs'

const hooks = registerUiModules()
const { loginWithWallet, mountAuthSession, logout, getAuthRequestSignal } = await import('../src/features/auth/session.ts')
const { httpClient } = await import('../src/services/http/index.ts')
const { resetDappProviderCache } = await import('../src/services/dapp/index.ts')
const { useAuthStore } = await import('../src/stores/auth/store.ts')
const { getMyInfo } = await import('../src/features/user/api.ts')
const address = '0x0000000000000000000000000000000000000001'
const otherAddress = '0x0000000000000000000000000000000000000002'
const user = { id: 1, team_count: 0, node_kpi: '0.000000', team_node_kpi: '0.000000', referral_code: 'mine', referral_count: 0 }
const signature = `0x${'ab'.repeat(65)}`
const originalAdapter = httpClient.defaults.adapter
let removeSession
function setup(options = {}) {
    removeSession?.(); logout(); resetDappProviderCache()
    const cache = new Map(Object.entries(options.storage ?? {}))
    const listeners = new Map()
    const requests = []
    const provider = {
        accounts: [options.address ?? address],
        async request(args) {
            requests.push(args)
            if (args.method === 'eth_chainId') return '0x38'
            if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') return provider.accounts
            if (args.method === 'personal_sign') return options.sign ? options.sign() : signature
            return null
        },
        on: (name, handler) => listeners.set(name, handler),
        removeListener: name => listeners.delete(name),
    }
    globalThis.window = { ethereum: provider, localStorage: { getItem: key => cache.get(key) ?? null, setItem: (key, value) => cache.set(key, value), removeItem: key => cache.delete(key) } }
    const calls = []
    httpClient.defaults.adapter = async config => {
        calls.push(config)
        if (options.response) return options.response(config)
        return { data: config.url === '/api/auth/login' ? { token: 'real-backend-token' } : user, status: 200, headers: {}, config }
    }
    removeSession = mountAuthSession()
    return { cache, listeners, requests, calls, provider }
}

function deferred() { let resolve; const promise = new Promise(r => { resolve = r }); return { promise, resolve } }
async function nextTask() { await new Promise(resolve => setImmediate(resolve)) }

test('wallet login signs the exact timestamp message, merges double submit and separates profile refresh from POST success', async () => {
    const env = setup()
    const first = loginWithWallet(' valid-ref ')
    assert.equal(loginWithWallet('different-ref'), first)
    await first
    assert.equal(env.calls.length, 1)
    const body = JSON.parse(env.calls[0].data)
    const signed = env.requests.find(request => request.method === 'personal_sign')
    assert.equal(Buffer.from(signed.params[0].slice(2), 'hex').toString(), `Login-${body.timestamp}`)
    assert.equal(body.address, address)
    assert.equal(body.signature, signature)
    assert.equal(body.ref, 'valid-ref')
    assert.ok(Math.abs(Date.now() / 1000 - body.timestamp) < 2)
    assert.equal(env.calls[0].headers.has('Authorization'), false)
    assert.equal(env.calls[0].headers.get('Address'), address)
    assert.equal(env.cache.get('TOKEN'), 'real-backend-token')
    assert.equal(useAuthStore.getState().status, 'signedIn')
    assert.equal(useAuthStore.getState().user, null)
    httpClient.defaults.adapter = async config => { throw new AxiosError('error', 'ERR_BAD_RESPONSE', config, undefined, { data: 'Internal Server Error.', status: 500, headers: {}, config }) }
    await assert.rejects(getMyInfo(getAuthRequestSignal()))
    assert.equal(useAuthStore.getState().status, 'signedIn')
    assert.equal(env.cache.get('TOKEN'), 'real-backend-token')
})

test('existing accounts can omit ref and wallet changes invalidate token, profile and outstanding requests', async () => {
    const env = setup()
    await loginWithWallet('')
    assert.equal('ref' in JSON.parse(env.calls[0].data), false)
    const signal = getAuthRequestSignal()
    env.listeners.get('accountsChanged')([otherAddress])
    assert.equal(signal.aborted, true)
    assert.equal(env.cache.has('TOKEN'), false)
    assert.equal(useAuthStore.getState().status, 'signedOut')
    assert.equal(useAuthStore.getState().user, null)
})

test('changing wallet while signing never submits or revives an old login', async () => {
    const sign = deferred()
    const env = setup({ sign: () => sign.promise })
    const login = loginWithWallet('ref')
    await nextTask()
    env.listeners.get('accountsChanged')([otherAddress])
    sign.resolve(signature)
    await assert.rejects(login, /auth.sessionChanged/)
    assert.equal(env.calls.length, 0)
    assert.equal(env.cache.has('TOKEN'), false)
})

test('a logout while POST is outstanding aborts it and ignores the late successful token', async () => {
    const response = deferred()
    const env = setup({ response: config => response.promise.then(() => ({ data: { token: 'stale-token' }, status: 200, headers: {}, config })) })
    const login = loginWithWallet('ref')
    await nextTask()
    assert.equal(env.calls.length, 1)
    logout()
    response.resolve()
    await assert.rejects(login)
    assert.equal(env.cache.has('TOKEN'), false)
    assert.equal(useAuthStore.getState().status, 'signedOut')
})

test('resume validates current wallet and token through my endpoint without a new signature', async () => {
    const env = setup({ storage: { TOKEN: 'cached', WALLET_ADDRESS: address.toUpperCase() } })
    await nextTask()
    assert.equal(env.calls[0].url, '/api/users/my')
    assert.equal(env.calls[0].headers.get('Address'), address)
    assert.equal(env.calls[0].headers.get('Authorization'), 'Bearer cached')
    assert.equal(env.requests.some(request => request.method === 'personal_sign'), false)
    assert.equal(useAuthStore.getState().status, 'signedIn')
    assert.deepEqual(useAuthStore.getState().user, user)
    env.listeners.get('chainChanged')('0x1')
    assert.equal(env.cache.has('TOKEN'), false)
    assert.equal(useAuthStore.getState().status, 'signedOut')
})

test('a cached token belonging to a different wallet is discarded before protected requests', async () => {
    const env = setup({ address: otherAddress, storage: { TOKEN: 'cached', WALLET_ADDRESS: address } })
    await nextTask()
    assert.equal(env.calls.length, 0)
    assert.equal(env.cache.has('TOKEN'), false)
    assert.equal(useAuthStore.getState().status, 'signedOut')
})

test('SSO 401 clears the session and keeps the backend plain text error', async () => {
    const env = setup()
    await loginWithWallet('ref')
    httpClient.defaults.adapter = async config => { throw new AxiosError('unauthorized', 'ERR_BAD_REQUEST', config, undefined, { data: 'Unauthorized.', status: 401, headers: {}, config }) }
    await assert.rejects(getMyInfo(getAuthRequestSignal()), error => error.status === 401 && error.message === 'Unauthorized.')
    assert.equal(env.cache.has('TOKEN'), false)
    assert.equal(useAuthStore.getState().status, 'signedOut')
})

test('signatures older than 60 seconds require a new user authorization', async () => {
    const now = Date.now
    const base = now()
    const env = setup({ sign: () => { Date.now = () => base + 61_000; return signature } })
    try {
        await assert.rejects(loginWithWallet('ref'), /auth.signatureExpired/)
        assert.equal(env.calls.length, 0)
        assert.equal(env.cache.has('TOKEN'), false)
    } finally { Date.now = now }
})

test.after(() => { removeSession?.(); logout(); httpClient.defaults.adapter = originalAdapter; hooks.deregister() })
