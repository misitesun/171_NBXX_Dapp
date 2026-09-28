import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
    DAPP_CONFIG,
    DAPP_ERC20_MAX_APPROVE_AMOUNT,
    ERC20_ABI,
    getErc20ApproveAmount,
    shouldUseErc20MaxAllowance,
} from '../src/services/dapp/index.ts'

test('erc20 abi contains the common permanent token methods', () => {
    const functionNames = ERC20_ABI
        .filter((item) => item.type === 'function')
        .map((item) => item.name)

    assert.deepEqual(
        functionNames,
        [
            'name',
            'symbol',
            'decimals',
            'totalSupply',
            'balanceOf',
            'allowance',
            'approve',
            'transfer',
            'transferFrom',
        ],
    )
})

test('erc20 max approve is controlled by the project setting', () => {
    assert.equal(shouldUseErc20MaxAllowance(), DAPP_CONFIG.enableErc20MaxApprove)
})

test('erc20 approve amount uses the configured max allowance policy', () => {
    const amount = 123n

    assert.equal(
        getErc20ApproveAmount(amount),
        DAPP_CONFIG.enableErc20MaxApprove
            ? DAPP_ERC20_MAX_APPROVE_AMOUNT
            : amount,
    )
})

test('erc20 allowance helper approves the configured amount when allowance is insufficient', () => {
    const source = readFileSync('src/services/dapp/erc20.ts', 'utf8')

    assert.match(source, /ensureErc20Allowance/)
    assert.match(source, /getErc20ApproveAmount\(amount\)/)
    assert.match(source, /writeWithGas\('approve'/)
})
