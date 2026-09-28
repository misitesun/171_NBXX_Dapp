import test from 'node:test'
import assert from 'node:assert/strict'

import {
    ERC20_ABI,
    detectDappEip7702Support,
    formatDappAmountUnits,
    ensureErc20Allowance,
    getDappEip7702CallsStatus,
    getErc20ApproveAmount,
    initializeDappWallet,
    isDappEip7702CapabilitySupported,
    parseDappAmountUnits,
    readErc20Decimals,
    sendDappEip7702Calls,
    shouldCheckDappGas,
    shouldEstimateDappGas,
    shouldUseErc20MaxAllowance,
    writeErc20Approve,
    writeErc20Transfer,
} from '../src/services/dapp/index.ts'

test('dapp module entry exports the common startup and config helpers', () => {
    assert.equal(typeof initializeDappWallet, 'function')
    assert.equal(typeof shouldCheckDappGas, 'function')
    assert.equal(typeof shouldEstimateDappGas, 'function')
    assert.equal(typeof shouldUseErc20MaxAllowance, 'function')
    assert.equal(typeof detectDappEip7702Support, 'function')
    assert.equal(typeof isDappEip7702CapabilitySupported, 'function')
    assert.equal(typeof sendDappEip7702Calls, 'function')
    assert.equal(typeof getDappEip7702CallsStatus, 'function')
    assert.equal(typeof formatDappAmountUnits, 'function')
    assert.equal(typeof parseDappAmountUnits, 'function')
    assert.equal(typeof getErc20ApproveAmount, 'function')
    assert.equal(typeof readErc20Decimals, 'function')
    assert.equal(typeof ensureErc20Allowance, 'function')
    assert.equal(typeof writeErc20Approve, 'function')
    assert.equal(typeof writeErc20Transfer, 'function')
    assert.equal(Array.isArray(ERC20_ABI), true)
})
