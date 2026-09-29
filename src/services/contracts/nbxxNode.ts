import { readDappContract, writeDappContractWithGas } from '../dapp'
import { getNbxxNodeAddress, type ContractAddress } from './config.ts'
import { NBXX_NODE_ABI } from './nbxxNodeAbi.ts'

export function readNbxxNodePrices(address: ContractAddress = getNbxxNodeAddress()) {
    // Both getters are public configuration reads and do not require an account.
    return Promise.all([
        readDappContract<bigint>({ address, abi: NBXX_NODE_ABI, functionName: 'PRICE_TYPE_1' }),
        readDappContract<bigint>({ address, abi: NBXX_NODE_ABI, functionName: 'PRICE_TYPE_2' }),
    ]).then(([type1, type2]) => ({ type1, type2 }))
}

export function readNbxxNodeUsdt(address: ContractAddress = getNbxxNodeAddress()) {
    return readDappContract<ContractAddress>({ address, abi: NBXX_NODE_ABI, functionName: 'usdt' })
}

export function readNbxxNodeHasPurchased(user: ContractAddress, address: ContractAddress = getNbxxNodeAddress()) {
    // The ABI takes the queried wallet explicitly; this does not depend on msg.sender.
    return readDappContract<boolean>({ address, abi: NBXX_NODE_ABI, functionName: 'hasPurchased', args: [user] })
}

export async function writeNbxxNodeBuy(nodeType: number, address: ContractAddress = getNbxxNodeAddress()) {
    // Validate the ABI's uint8 wire type only. Product-tier meanings must be confirmed separately.
    if (!Number.isInteger(nodeType) || nodeType < 0 || nodeType > 255) throw new Error('Invalid uint8 nodeType')
    return writeDappContractWithGas({ address, abi: NBXX_NODE_ABI, functionName: 'buy', args: [nodeType] })
}
