import test from 'node:test'
import assert from 'node:assert/strict'

import { isFormDataBody } from '../src/services/http/body.ts'

test('recognizes native and cross-realm-like FormData bodies', () => {
    assert.equal(isFormDataBody(new FormData()), true)
    assert.equal(
        isFormDataBody({ [Symbol.toStringTag]: 'FormData' }),
        true,
    )
    assert.equal(isFormDataBody({ value: 'json' }), false)
})
