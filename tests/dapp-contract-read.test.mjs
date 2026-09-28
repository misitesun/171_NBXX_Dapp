import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
    createDappContractActions,
    readDappContract,
    resetDappProviderCache,
} from '../src/services/dapp/index.ts'

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000100'
const CONNECTED_ADDRESS = '0x0000000000000000000000000000000000000001'

const TEST_ABI = [
    {
        type: 'function',
        name: 'claimableReward',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'globalTotal',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
]

function encodeUint256(value) {
    return `0x${value.toString(16).padStart(64, '0')}`
}

function createReadProvider() {
    const requests = []

    return {
        requests,
        async request(args) {
            requests.push(args)

            if (args.method === 'eth_call') {
                return encodeUint256(42n)
            }

            return null
        },
    }
}

function setupReadTest(provider) {
    resetDappProviderCache()
    globalThis.window = { ethereum: provider }
}

function getEthCall(provider) {
    return provider.requests.find((request) => request.method === 'eth_call')
}

test('business contract read can pass the current wallet address as eth_call from', async () => {
    const provider = createReadProvider()
    setupReadTest(provider)
    const contract = createDappContractActions(CONTRACT_ADDRESS, TEST_ABI)

    const result = await contract.read('claimableReward', [], {
        account: CONNECTED_ADDRESS,
    })
    const call = getEthCall(provider)

    assert.equal(result, 42n)
    assert.equal(call.params[0].from, CONNECTED_ADDRESS)
})

test('readDappContract forwards account to viem readContract', async () => {
    const provider = createReadProvider()
    setupReadTest(provider)

    await readDappContract({
        address: CONTRACT_ADDRESS,
        abi: TEST_ABI,
        functionName: 'claimableReward',
        account: CONNECTED_ADDRESS,
    })
    const call = getEthCall(provider)

    assert.equal(call.params[0].from, CONNECTED_ADDRESS)
})

test('public contract reads do not require account', async () => {
    const provider = createReadProvider()
    setupReadTest(provider)

    await readDappContract({
        address: CONTRACT_ADDRESS,
        abi: TEST_ABI,
        functionName: 'globalTotal',
    })
    const call = getEthCall(provider)

    assert.equal(Object.hasOwn(call.params[0], 'from'), false)
})

test('contract read documentation records user-context account rules', () => {
    const agentRules = readFileSync('AGENTS.md', 'utf8')
    const dappReadme = readFileSync('src/services/dapp/README.md', 'utf8')
    const contractsReadme = readFileSync('src/services/contracts/README.md', 'utf8')
    const contractSource = readFileSync('src/services/dapp/contract.ts', 'utf8')
    const typesSource = readFileSync('src/services/dapp/types.ts', 'utf8')

    for (const content of [agentRules, dappReadme, contractsReadme]) {
        assert.match(content, /view[\s\S]*pure/)
        assert.match(content, /msg\.sender/)
        assert.match(content, /readContract\(\{[\s\S]*account/)
        assert.match(content, /EIP-7702/)
        assert.match(content, /公共行情|public market/i)
    }

    assert.match(contractSource, /account/)
    assert.match(typesSource, /account\?: Address/)
})
