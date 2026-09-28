import assert from 'node:assert/strict'
import test from 'node:test'
import { BaseError, RpcRequestError, UserRejectedRequestError } from 'viem'

import { getDappUserRejectionMessage } from '../src/services/dapp/error.ts'

const WALLET_MESSAGE = 'MetaMask Tx Signature: User denied transaction signature.'

test('wallet rejection keeps the provider message through viem contract wrappers', () => {
    const rpcError = new RpcRequestError({
        body: { method: 'eth_sendTransaction' },
        error: { code: 4001, message: WALLET_MESSAGE },
        url: 'https://wallet.example',
    })
    const wrapped = new BaseError('Contract function execution failed.', {
        cause: new UserRejectedRequestError(rpcError),
    })

    assert.equal(getDappUserRejectionMessage(wrapped), WALLET_MESSAGE)
})

test('only provider code 4001 is treated as a user cancellation', () => {
    assert.equal(getDappUserRejectionMessage({ code: 4001 }), '')
    assert.equal(getDappUserRejectionMessage({ code: 4100, message: WALLET_MESSAGE }), undefined)
    assert.equal(getDappUserRejectionMessage(new Error(WALLET_MESSAGE)), undefined)
})
