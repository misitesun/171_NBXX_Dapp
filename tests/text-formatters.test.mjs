import test from 'node:test'
import assert from 'node:assert/strict'

import { formatRelativeTime } from '../src/shared/formatters/formatRelativeTime.ts'
import { maskEmailAddress } from '../src/shared/formatters/maskEmailAddress.ts'
import { maskPhoneNumber } from '../src/shared/formatters/maskPhoneNumber.ts'
import { maskWalletAddress } from '../src/shared/formatters/maskWalletAddress.ts'

test('masks wallet addresses, phone numbers, and email addresses by meaning', () => {
    assert.equal(maskWalletAddress('0x1234567890abcdef'), '0x123****cdef')
    assert.equal(maskWalletAddress('short'), 'short')
    assert.equal(maskWalletAddress(''), '--')

    assert.equal(maskPhoneNumber('13812345678'), '138****5678')
    assert.equal(maskPhoneNumber('12345'), '12345')
    assert.equal(maskPhoneNumber(undefined), '--')

    assert.equal(maskEmailAddress('jacychen@example.com'), 'j***n@example.com')
    assert.equal(maskEmailAddress('a@example.com'), 'a***@example.com')
    assert.equal(maskEmailAddress('invalid-email'), '--')
    assert.equal(maskEmailAddress(null), '--')
})

test('formats relative time for today, yesterday, current year, and older years', () => {
    const now = new Date(2026, 6, 13, 12, 0)

    assert.equal(formatRelativeTime(new Date(2026, 6, 13, 8, 5), now), '08:05')
    assert.equal(
        formatRelativeTime(new Date(2026, 6, 12, 23, 9), now),
        '昨天 23:09',
    )
    assert.equal(
        formatRelativeTime(new Date(2026, 0, 2, 3, 4), now),
        '01-02 03:04',
    )
    assert.equal(
        formatRelativeTime(new Date(2025, 11, 31, 20, 30), now),
        '2025-12-31 20:30',
    )
    assert.equal(formatRelativeTime('invalid', now), '--')
    assert.equal(formatRelativeTime(undefined, now), '--')
})
