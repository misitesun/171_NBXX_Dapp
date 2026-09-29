import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { decodeFunctionData, encodeFunctionResult } from 'viem'
import { registerUiModules } from './hu-ui-render.mjs'

const ui = registerUiModules()
const node = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
const usdt = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const owner = '0x0000000000000000000000000000000000000001'
const other = '0x0000000000000000000000000000000000000002'
// Node has no Vite env. Inject only deployment addresses, leaving generic services unchanged.
const env = registerHooks({ load(url, context, nextLoad) {
    if (!url.endsWith('/services/contracts/config.ts')) return nextLoad(url, context)
    const source = readFileSync(new URL(url), 'utf8').replaceAll('import.meta.env', JSON.stringify({ VITE_USDT: usdt, VITE_NBXX_NODE: node }))
    return { format: 'module', shortCircuit: true, source: ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText }
} })
const { purchaseNft, getPurchasePrices } = await import('../src/features/purchase/index.ts')
const { NBXX_NODE_ABI } = await import('../src/services/contracts/nbxxNodeAbi.ts')
const { ERC20_ABI, resetDappProviderCache, DAPP_ERC20_MAX_APPROVE_AMOUNT } = await import('../src/services/dapp/index.ts')
const { useAuthStore } = await import('../src/stores/auth/store.ts')
const { useDappStore } = await import('../src/stores/dapp/store.ts')
const price = 9007199254740993123456n
function setup(options = {}) {
    const reads = [], writes = [], receipts = []
    let account = owner
    let allowance = options.allowance ?? 0n
    const hash = `0x${'1'.repeat(64)}`
    globalThis.window = { ethereum: { async request({ method, params }) {
        if (method === 'eth_accounts') return [account]
        if (method === 'eth_chainId') return options.chain ?? '0x7a69'
        if (method === 'eth_call') {
            const contract = params[0].to.toLowerCase() === node.toLowerCase() ? NBXX_NODE_ABI : ERC20_ABI
            const call = decodeFunctionData({ abi: contract, data: params[0].data })
            reads.push(call)
            await options.onRead?.(call)
            const values = { PRICE_TYPE_1: price, PRICE_TYPE_2: price * 2n, usdt: options.token ?? usdt, decimals: 6,
                balanceOf: options.balance ?? price * 10n, allowance }
            return encodeFunctionResult({ abi: contract, functionName: call.functionName, result: values[call.functionName] })
        }
        if (method === 'eth_sendTransaction') {
            if (options.reject) throw Object.assign(new Error('User rejected'), { code: 4001 })
            const abi = params[0].to.toLowerCase() === node.toLowerCase() ? NBXX_NODE_ABI : ERC20_ABI
            writes.push({ ...decodeFunctionData({ abi, data: params[0].data }), ...params[0] })
            return hash
        }
        if (method === 'eth_blockNumber') return '0x1'
        if (method === 'eth_getTransactionReceipt') {
            const write = writes.at(-1)
            receipts.push(write.functionName)
            if (write.functionName === 'approve') allowance = DAPP_ERC20_MAX_APPROVE_AMOUNT
            if (write.functionName === 'approve' && options.changeAfterApproval) { account = other; useDappStore.setState({ walletAddress: other }) }
            return { transactionHash: hash, transactionIndex: '0x0', blockHash: `0x${'2'.repeat(64)}`, blockNumber: '0x1',
                from: owner, to: write.to, cumulativeGasUsed: '0x5208', gasUsed: '0x5208', contractAddress: null,
                logs: [], logsBloom: `0x${'0'.repeat(512)}`, status: options.revert === write.functionName ? '0x0' : '0x1', effectiveGasPrice: '0x1', type: '0x0' }
        }
        throw new Error(`Unexpected RPC ${method}`)
    } } }
    resetDappProviderCache()
    useAuthStore.setState({ status: 'signedIn', user: null })
    useDappStore.setState({ walletAddress: owner })
    return { reads, writes, receipts }
}

test('prices use actual token decimals and preserve values above Number.MAX_SAFE_INTEGER', async () => {
    setup()
    assert.deepEqual(await getPurchasePrices(), { basic: '9007199254740993.123456', premium: '18014398509481986.246912' })
})
test('basic purchase approves NBXXNode with configured maximum policy and buys exactly type 1 after approval receipt', async () => {
    const { writes, reads, receipts } = setup()
    await purchaseNft('basic')
    assert.deepEqual(writes.map(write => write.functionName), ['approve', 'buy'])
    assert.equal(writes[0].args[0].toLowerCase(), node.toLowerCase())
    assert.equal(writes[0].args[1], DAPP_ERC20_MAX_APPROVE_AMOUNT)
    assert.deepEqual(writes[1].args, [1])
    assert.deepEqual(receipts, ['approve', 'buy'])
    for (const call of reads.filter(call => ['balanceOf', 'allowance'].includes(call.functionName))) assert.equal(call.args[0], owner)
    assert.ok(writes.every(write => write.from === owner && write.value === undefined))
})
test('premium uses the raw type 2 price, skipping approve only when allowance covers its exact bigint value', async () => {
    const ready = setup({ allowance: price * 2n })
    await purchaseNft('premium')
    assert.deepEqual(ready.writes.map(write => write.functionName), ['buy'])
    assert.deepEqual(ready.writes[0].args, [2])
    const insufficient = setup({ allowance: price * 2n - 1n })
    await purchaseNft('premium')
    assert.deepEqual(insufficient.writes.map(write => write.functionName), ['approve', 'buy'])
})
test('insufficient balance, wrong network and mismatched payment token prevent any write', async () => {
    for (const options of [{ balance: price - 1n }, { chain: '0x38' }, { token: other }]) {
        const fixture = setup(options)
        await assert.rejects(purchaseNft('basic'))
        assert.equal(fixture.writes.length, 0)
    }
})
test('account change while checking allowance and after approval prevent the subsequent purchase', async () => {
    const changedRead = setup({ onRead(call) { if (call.functionName === 'allowance') useDappStore.setState({ walletAddress: other }) } })
    await assert.rejects(purchaseNft('basic'), /sessionChanged/)
    assert.equal(changedRead.writes.length, 0)
    const changedApproval = setup({ changeAfterApproval: true })
    await assert.rejects(purchaseNft('basic'), /sessionChanged/)
    assert.deepEqual(changedApproval.writes.map(write => write.functionName), ['approve'])
})
test('duplicate actions cannot write twice, and the guard releases after completion', async () => {
    let release
    const fixture = setup({ allowance: price * 2n, onRead(call) {
        if (call.functionName === 'PRICE_TYPE_1') return new Promise(resolve => { release = resolve })
    } })
    const first = purchaseNft('basic')
    await assert.rejects(purchaseNft('premium'), /purchase.busy/)
    while (!release) await new Promise(resolve => setTimeout(resolve, 1))
    release(); await first
    assert.equal(fixture.writes.length, 1)
    const next = setup({ allowance: price * 2n })
    await purchaseNft('premium')
    assert.equal(next.writes.length, 1)
})
test('failed approval stops buy; failed buy and wallet rejection reject with loading cleared', async () => {
    for (const options of [{ revert: 'approve' }, { allowance: price * 2n, revert: 'buy' }, { reject: true }]) {
        const fixture = setup(options)
        await assert.rejects(purchaseNft('basic'))
        if (options.revert === 'approve') assert.deepEqual(fixture.writes.map(write => write.functionName), ['approve'])
        assert.equal(useDappStore.getState().dappLoading, false)
    }
})
test.after(() => { env.deregister(); ui.deregister() })
