import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { HttpError } from '../src/services/http/error.ts'
import {
    clearHttpErrorNotification,
    getHttpErrorNotification,
    reportHttpError,
    subscribeHttpErrorNotifications,
    wasHttpErrorReported,
} from '../src/services/http/feedback.ts'

test('HTTP error feedback publishes, deduplicates and clears notifications', () => {
    clearHttpErrorNotification()
    let listenerCalls = 0
    const unsubscribe = subscribeHttpErrorNotifications(() => {
        listenerCalls += 1
    })
    const firstError = new HttpError(' 服务器繁忙请稍后再试 ', { status: 400 })

    reportHttpError(firstError)
    const first = getHttpErrorNotification()
    reportHttpError(new HttpError('服务器繁忙请稍后再试', { status: 400 }))

    assert.equal(first?.message, '服务器繁忙请稍后再试')
    assert.equal(getHttpErrorNotification()?.id, first?.id)
    assert.equal(listenerCalls, 1)
    assert.equal(wasHttpErrorReported(firstError), true)

    clearHttpErrorNotification(first?.id)
    assert.equal(getHttpErrorNotification(), null)
    assert.equal(listenerCalls, 2)
    unsubscribe()
})

test('canceled HTTP errors are handled without user feedback', () => {
    clearHttpErrorNotification()
    const error = new HttpError('canceled', { code: 'ERR_CANCELED' })

    reportHttpError(error)

    assert.equal(getHttpErrorNotification(), null)
    assert.equal(wasHttpErrorReported(error), true)
})

test('App mounts one HTTP error presenter backed by the shared Toast', async () => {
    const [app, presenter, entry] = await Promise.all([
        readFile('src/app/App.tsx', 'utf8'),
        readFile('src/components/Toast/HttpErrorToast.tsx', 'utf8'),
        readFile('src/components/Toast/index.ts', 'utf8'),
    ])

    assert.match(app, /<HttpErrorToast \/>/)
    assert.equal((app.match(/<HttpErrorToast \/>/g) ?? []).length, 1)
    assert.match(presenter, /useSyncExternalStore/)
    assert.match(presenter, /<Toast message=\{notification\?\.message \?\? null\} variant="error" \/>/)
    assert.match(entry, /export \{ HttpErrorToast \}/)
})
