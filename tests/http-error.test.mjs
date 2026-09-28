import test from 'node:test'
import assert from 'node:assert/strict'

import { HttpError, toHttpError } from '../src/services/http/error.ts'

test('normalizes an Axios response error', () => {
    const source = {
        isAxiosError: true,
        message: 'Request failed',
        code: 'ERR_BAD_REQUEST',
        response: {
            status: 401,
            data: { message: '登录已失效' },
        },
    }

    const error = toHttpError(source)

    assert.ok(error instanceof HttpError)
    assert.equal(error.message, '登录已失效')
    assert.equal(error.status, 401)
    assert.equal(error.code, 'ERR_BAD_REQUEST')
    assert.deepEqual(error.data, { message: '登录已失效' })
})

test('preserves a regular Error message', () => {
    const source = new Error('网络不可用')
    const error = toHttpError(source)

    assert.ok(error instanceof HttpError)
    assert.equal(error.message, '网络不可用')
    assert.equal(error.cause, source)
})
