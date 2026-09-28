import test from 'node:test'
import assert from 'node:assert/strict'

import {
    useAppStore,
    useDappStore,
} from '../src/stores/index.ts'
import { DEFAULT_LANGUAGE_CODE } from '../src/i18n/config.ts'
import { DAPP_PROVIDER_STATUS } from '../src/services/dapp/config.ts'

test('store modules expose their starter states', () => {
    assert.equal(useAppStore.getState().languageCode, DEFAULT_LANGUAGE_CODE)
    assert.equal(typeof useAppStore.getState().setLanguageCode, 'function')
    assert.equal(useDappStore.getState().providerStatus, DAPP_PROVIDER_STATUS.checking)
    assert.equal(useDappStore.getState().walletAddress, '')
    assert.equal(useDappStore.getState().chainId, undefined)
    assert.equal(useDappStore.getState().dappLoading, false)
    assert.equal(typeof useDappStore.getState().setWalletAddress, 'function')
})

test('app store keeps the current language code and ignores unsupported values', () => {
    useAppStore.getState().setLanguageCode('en')
    assert.equal(useAppStore.getState().languageCode, 'en')

    useAppStore.getState().setLanguageCode('unsupported')
    assert.equal(useAppStore.getState().languageCode, 'en')
})
