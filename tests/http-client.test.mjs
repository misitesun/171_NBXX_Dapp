import test from 'node:test'
import assert from 'node:assert/strict'
import { AxiosError } from 'axios'

import { APP_CONFIG } from '../src/config/app.ts'
import {
    httpClient,
    registerHttpUnauthorizedHandler,
    registerHttpWalletAddressProvider,
} from '../src/services/http/client.ts'
import { HttpError } from '../src/services/http/error.ts'
import {
    clearHttpErrorNotification,
    getHttpErrorNotification,
} from '../src/services/http/feedback.ts'

function createStorage(token = '') {
    const cache = new Map(token ? [['TOKEN', token]] : [])
    return {
        getItem: (key) => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: (key) => cache.delete(key),
    }
}

test('sends only generic configured headers', async () => {
    const storage = createStorage('token-value')
    storage.setItem('LANG', 'zh-Hant')
    storage.setItem('WALLET_ADDRESS', '0x0000000000000000000000000000000000000001')
    globalThis.window = { localStorage: storage }
    let captured

    await httpClient.request({
        url: '/example',
        method: 'POST',
        data: { value: 1 },
        adapter: async (config) => {
            captured = config
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
        },
    })

    assert.equal(captured.headers.get('Authorization'), 'Bearer token-value')
    assert.equal(captured.headers.has('Address'), false)
    assert.equal(captured.headers.get('lang'), 'zh-TW')
    assert.equal(
        captured.headers.getContentType(),
        'application/json; charset=UTF-8',
    )
})

test('omits the authorization header when local token storage is empty', async () => {
    globalThis.window = { localStorage: createStorage() }
    let captured

    await httpClient.request({
        url: '/example',
        adapter: async (config) => {
            captured = config
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
        },
    })

    assert.equal(captured.headers.has('Authorization'), false)
})

test('wallet requests send the connected Address before login and pair Bearer only with a verified wallet', async () => {
    const storage = createStorage('token-value')
    storage.setItem('WALLET_ADDRESS', '0x0000000000000000000000000000000000000001')
    globalThis.window = { localStorage: storage }
    let verifiedAddress
    const unregister = registerHttpWalletAddressProvider(() => verifiedAddress)
    const requestHeaders = async () => {
        let headers
        await httpClient.request({
            url: '/private',
            adapter: async (config) => {
                headers = config.headers
                return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
            },
        })
        return headers
    }

    try {
        let headers = await requestHeaders()
        assert.equal(headers.has('Authorization'), false)
        assert.equal(headers.has('Address'), false)

        verifiedAddress = '0x0000000000000000000000000000000000000002'
        headers = await requestHeaders()
        assert.equal(headers.get('Authorization'), 'Bearer token-value')
        assert.equal(headers.get('Address'), verifiedAddress)

        verifiedAddress = undefined
        headers = await requestHeaders()
        assert.equal(headers.has('Authorization'), false)
        assert.equal(headers.has('Address'), false)

        storage.removeItem('TOKEN')
        verifiedAddress = '0x0000000000000000000000000000000000000003'
        headers = await requestHeaders()
        assert.equal(headers.has('Authorization'), false)
        assert.equal(headers.get('Address'), verifiedAddress)
    } finally {
        unregister()
    }
})

test('does not send lang when i18n is disabled', async () => {
    const previousEnableI18n = APP_CONFIG.enableI18n
    APP_CONFIG.enableI18n = false

    try {
        globalThis.window = { localStorage: createStorage('token-value') }
        let captured

        await httpClient.request({
            url: '/example',
            adapter: async (config) => {
                captured = config
                return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
            },
        })

        assert.equal(captured.headers.has('lang'), false)
    } finally {
        APP_CONFIG.enableI18n = previousEnableI18n
    }
})

test('does not invent a wallet-address header in a DApp wallet host', async () => {
    const storage = createStorage('token-value')
    storage.setItem('WALLET_ADDRESS', '0x0000000000000000000000000000000000000001')
    globalThis.window = {
        ethereum: { request: async () => [] },
        localStorage: storage,
    }
    let captured

    await httpClient.request({
        url: '/example',
        adapter: async (config) => {
            captured = config
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
        },
    })

    assert.equal(captured.headers.has('Address'), false)
})

test('does not invent a wallet-address header in a Flutter wallet host', async () => {
    const storage = createStorage('token-value')
    storage.setItem('WALLET_ADDRESS', '0x0000000000000000000000000000000000000001')
    globalThis.window = {
        __FROM_FLUTTER__: true,
        ethereum: { request: async () => [] },
        localStorage: storage,
    }
    let captured

    await httpClient.request({
        url: '/example',
        adapter: async (config) => {
            captured = config
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
        },
    })

    assert.equal(captured.headers.has('Address'), false)
})

test('normalizes 401 and removes the cached token', async () => {
    clearHttpErrorNotification()
    const storage = createStorage('expired')
    globalThis.window = { localStorage: storage }
    let checkedAddress = '0x0000000000000000000000000000000000000001'
    const unregisterAddress = registerHttpWalletAddressProvider(() => checkedAddress)

    let unauthorizedCalls = 0
    const unregister = registerHttpUnauthorizedHandler(() => {
        unauthorizedCalls += 1
        checkedAddress = undefined
    })
    const request = httpClient.request({
        url: '/private',
        adapter: async (config) => {
            const response = {
                data: { message: '登录已失效' },
                status: 401,
                statusText: 'Unauthorized',
                headers: {},
                config,
            }
            throw new AxiosError(
                'Request failed',
                'ERR_BAD_REQUEST',
                config,
                undefined,
                response,
            )
        },
    })

    await assert.rejects(request, (error) => {
        assert.ok(error instanceof HttpError)
        assert.equal(error.status, 401)
        return true
    })
    assert.equal(storage.getItem('TOKEN'), null)
    assert.equal(unauthorizedCalls, 1)
    assert.equal(getHttpErrorNotification()?.message, '登录已失效')
    let headersAfter401
    await httpClient.request({
        url: '/private',
        adapter: async (config) => {
            headersAfter401 = config.headers
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
        },
    })
    assert.equal(headersAfter401.has('Authorization'), false)
    assert.equal(headersAfter401.has('Address'), false)
    unregister()
    unregisterAddress()
    clearHttpErrorNotification()
})
