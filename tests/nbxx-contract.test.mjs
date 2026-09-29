import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { encodeFunctionData, encodeFunctionResult } from 'viem'
import { registerUiModules } from './hu-ui-render.mjs'

const hooks = registerUiModules()
const { NBXX_NODE_ABI } = await import('../src/services/contracts/nbxxNodeAbi.ts')
const { getNbxxContractAddresses } = await import('../src/services/contracts/config.ts')
const { readNbxxNodePrices, readNbxxNodeUsdt, writeNbxxNodeBuy } = await import('../src/services/contracts/nbxxNode.ts')
const { resetDappProviderCache } = await import('../src/services/dapp/provider.ts')
const { useDappStore } = await import('../src/stores/dapp/store.ts')
const node = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
const usdt = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const account = '0x0000000000000000000000000000000000000001'
const hash = `0x${'1'.repeat(64)}`
function setup(status = '0x1') {
    const requests = []
    globalThis.window = { ethereum: { async request(args) {
        requests.push(args)
        if (args.method === 'eth_accounts') return [account]
        if (args.method === 'eth_chainId') return '0x7a69'
        if (args.method === 'eth_call') {
            const data = args.params[0].data
            for (const [name, result] of [['PRICE_TYPE_1', 500000000n], ['PRICE_TYPE_2', 1000000000n], ['usdt', usdt]]) {
                if (data === encodeFunctionData({ abi: NBXX_NODE_ABI, functionName: name })) return encodeFunctionResult({ abi: NBXX_NODE_ABI, functionName: name, result })
            }
            throw new Error('Unexpected read')
        }
        if (args.method === 'eth_sendTransaction') return hash
        if (args.method === 'eth_blockNumber') return '0x1'
        if (args.method === 'eth_getTransactionReceipt') return {
            transactionHash: hash, transactionIndex: '0x0', blockHash: `0x${'2'.repeat(64)}`, blockNumber: '0x1',
            from: account, to: node, cumulativeGasUsed: '0x5208', gasUsed: '0x5208', contractAddress: null,
            logs: [], logsBloom: `0x${'0'.repeat(512)}`, status, effectiveGasPrice: '0x1', type: '0x0',
        }
        throw new Error(`Unexpected RPC ${args.method}`)
    } } }
    resetDappProviderCache()
    return requests
}

test('NBXXNode ABI is an unchanged copy of the supplied document', () => {
    assert.deepEqual(NBXX_NODE_ABI, JSON.parse(readFileSync('docs/contracts/NBXXNode.json', 'utf8')))
    const buy = NBXX_NODE_ABI.find(entry => entry.type === 'function' && entry.name === 'buy')
    assert.equal(buy.stateMutability, 'nonpayable')
    assert.deepEqual(buy.inputs.map(input => input.type), ['uint8'])
})

test('env-backed addresses reject missing, zero and malformed values', () => {
    assert.deepEqual(getNbxxContractAddresses({ VITE_USDT: usdt, VITE_NBXX_NODE: node }), { usdt, node })
    for (const bad of ['', 'not-address', '0x123', `0x${'0'.repeat(40)}`]) {
        assert.throws(() => getNbxxContractAddresses({ VITE_USDT: bad, VITE_NBXX_NODE: node }))
        assert.throws(() => getNbxxContractAddresses({ VITE_USDT: usdt, VITE_NBXX_NODE: bad }))
    }
})

test('price and token getters preserve raw values and are public account-free reads', async () => {
    const requests = setup()
    assert.deepEqual(await readNbxxNodePrices(node), { type1: 500000000n, type2: 1000000000n })
    assert.equal((await readNbxxNodeUsdt(node)).toLowerCase(), usdt.toLowerCase())
    const calls = requests.filter(request => request.method === 'eth_call')
    assert.equal(calls.length, 3)
    assert.ok(calls.every(call => call.params[0].from === undefined && call.params[0].to.toLowerCase() === node.toLowerCase()))
})

test('buy passes the single uint8 parameter with no payable value and waits for successful receipt', async () => {
    const requests = setup()
    const receipt = await writeNbxxNodeBuy(2, node)
    assert.equal(receipt.status, 'success')
    const transaction = requests.find(request => request.method === 'eth_sendTransaction').params[0]
    assert.equal(transaction.data, encodeFunctionData({ abi: NBXX_NODE_ABI, functionName: 'buy', args: [2] }))
    assert.equal(transaction.to.toLowerCase(), node.toLowerCase())
    assert.equal(transaction.from.toLowerCase(), account.toLowerCase())
    assert.equal(transaction.value, undefined)
    assert.ok(requests.some(request => request.method === 'eth_getTransactionReceipt'))
    assert.equal(useDappStore.getState().dappLoading, false)
})

test('a reverted receipt rejects and uint8 validation fails before wallet requests', async () => {
    setup('0x0')
    await assert.rejects(writeNbxxNodeBuy(1, node), /交易执行失败/)
    assert.equal(useDappStore.getState().dappLoading, false)
    const requests = setup()
    for (const invalid of [-1, 256, 1.2, NaN]) await assert.rejects(writeNbxxNodeBuy(invalid, node), /Invalid uint8/)
    assert.equal(requests.length, 0)
})

test.after(() => hooks.deregister())
