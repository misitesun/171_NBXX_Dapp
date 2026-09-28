import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('dapp client uses the injected wallet provider instead of an HTTP public client', () => {
    const providerSource = readFileSync('src/services/dapp/provider.ts', 'utf8')
    const dappSources = [
        'src/services/dapp/provider.ts',
        'src/services/dapp/chain.ts',
        'src/services/dapp/wallet.ts',
        'src/services/dapp/contract.ts',
    ]
        .map((file) => readFileSync(file, 'utf8'))
        .join('\n')

    assert.match(providerSource, /createWalletClient/)
    assert.match(providerSource, /custom\(provider\)/)
    assert.match(providerSource, /\.extend\(publicActions\)/)
    assert.match(providerSource, /@metamask\/detect-provider/)
    assert.match(providerSource, /detectEthereumProvider/)
    assert.match(providerSource, /mustBeMetaMask:\s*false/)
    assert.match(providerSource, /silent:\s*true/)
    assert.match(providerSource, /timeout:\s*DAPP_PROVIDER_DETECT_TIMEOUT/)
    assert.match(providerSource, /isDappProviderExpected/)
    assert.doesNotMatch(dappSources, /createPublicClient/)
    assert.doesNotMatch(dappSources, /\bhttp\(/)
})
