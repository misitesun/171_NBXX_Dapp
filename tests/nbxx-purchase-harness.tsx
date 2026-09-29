// Development-only hook regression. This fixture never broadcasts wallet transactions.
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
// eslint-disable-next-line no-restricted-imports -- Test fixture only: encode/decode fake RPC responses, never build product transactions here.
import { decodeFunctionData, encodeFunctionResult } from 'viem'
import { initializeI18n, appI18n } from '../src/i18n'
import { NBXX_NODE_ABI } from '../src/services/contracts/nbxxNodeAbi.ts'
import { ERC20_ABI, resetDappProviderCache } from '../src/services/dapp'
import { useDappStore } from '../src/stores/dapp'
import { useAuthStore } from '../src/stores/auth/store.ts'
import { useNftPurchase } from '../src/features/purchase/useNftPurchase.ts'

const owner = '0x0000000000000000000000000000000000000001'
const node = import.meta.env.VITE_NBXX_NODE
const token = import.meta.env.VITE_USDT
const hash = `0x${'1'.repeat(64)}`
let writes = 0
let rejected = false
let failRefresh = false
let refreshes = 0
const feedback: Array<{message: string; variant?: string}> = []
// eslint-disable-next-line no-restricted-properties -- Test fixture only: install a fake provider in this isolated harness tab.
window.ethereum = { async request({ method, params }) {
    if (method === 'eth_accounts') return [owner]
    if (method === 'eth_chainId') return '0x7a69'
    if (method === 'eth_call') {
        const tx = (params as Array<{to: string; data: `0x${string}`}>)[0]
        const abi = tx.to.toLowerCase() === node.toLowerCase() ? NBXX_NODE_ABI : ERC20_ABI
        const { functionName } = decodeFunctionData({ abi, data: tx.data })
        const values: Record<string, bigint | number | string> = { PRICE_TYPE_1: 500000000n, PRICE_TYPE_2: 1000000000n, usdt: token, decimals: 6, balanceOf: 10000000000n, allowance: 10000000000n }
        return encodeFunctionResult({ abi, functionName, result: values[functionName] })
    }
    if (method === 'eth_sendTransaction') {
        if (rejected) throw Object.assign(new Error('Fixture rejection'), { code: 4001 })
        writes += 1; return hash
    }
    if (method === 'eth_blockNumber') return '0x1'
    if (method === 'eth_getTransactionReceipt') return { transactionHash: hash, transactionIndex: '0x0', blockHash: `0x${'2'.repeat(64)}`, blockNumber: '0x1', from: owner, to: node, cumulativeGasUsed: '0x5208', gasUsed: '0x5208', contractAddress: null, logs: [], logsBloom: `0x${'0'.repeat(512)}`, status: '0x1', effectiveGasPrice: '0x1', type: '0x0' }
    throw new Error(`Unexpected fixture request: ${method}`)
} }
resetDappProviderCache()
useAuthStore.setState({ status: 'signedIn', user: null })
// Avoid modifying real persisted wallet data in this dedicated test tab.
useDappStore.setState({ walletAddress: owner })
const reload = async () => { refreshes += 1; if (failRefresh) throw new Error('Fixture refresh failed') }
const showToast = (message: string, variant?: string) => { feedback.push({ message, variant }) }
let current: ReturnType<typeof useNftPurchase>
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 50))
function assert(condition: unknown, message: string) { if (!condition) throw new Error(message) }
export function Harness() {
    current = useNftPurchase(reload, showToast)
    const [result, setResult] = useState('READY')
    async function run() {
        try {
            await settle()
            assert(current.prices?.basic === '500' && current.prices?.premium === '1000', 'price binding')
            failRefresh = true
            const pending = current.purchase('premium')
            const duplicate = current.purchase('basic')
            await settle()
            assert(current.purchasing, 'loading covers write and sync')
            await Promise.all([pending, duplicate]); await settle()
            assert(writes === 1 && refreshes === 1, 'duplicate buy prevented')
            assert(feedback[0]?.variant === 'success' && feedback[0]?.message === appI18n.t('purchase.success'), 'success receipt feedback')
            assert(feedback[1]?.message === appI18n.t('home.dataFailed') && !feedback.some(item => item.message === appI18n.t('purchase.failed')), 'refresh failure kept separate')
            assert(!current.purchasing, 'loading cleared after refresh failure')
            feedback.length = 0; rejected = true; failRefresh = false
            await current.purchase('basic'); await settle()
            assert(feedback.length === 1 && feedback[0].message === appI18n.t('purchase.cancelled') && feedback[0].variant === undefined && refreshes === 1 && !current.purchasing, 'rejection has neutral feedback and no refresh')
            setResult('PASS 4/4\nChain price binding\nDuplicate buy and loading\nConfirmed purchase versus failed refresh\nNeutral rejection and no refresh')
        } catch (error) { setResult(`FAIL\n${error instanceof Error ? error.message : String(error)}`) }
    }
    return <main><h1>NodeXX purchase hook (local fixtures)</h1><button onClick={() => { void run() }}>Run purchase checks</button><pre id="results">{result}</pre><pre>{JSON.stringify({prices:current.prices,purchasing:current.purchasing})}</pre></main>
}
void initializeI18n().then(() => {
    const root = document.getElementById('root')
    if (root) createRoot(root).render(<Harness />)
})
