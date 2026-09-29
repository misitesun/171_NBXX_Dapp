// Project-specific contract wrappers should be exported here.
// 项目专属合约封装统一从这里导出。

export { getNbxxContractAddresses, getNbxxNodeAddress, type ContractAddress } from './config.ts'
export { readNbxxNodeHasPurchased, readNbxxNodePrices, readNbxxNodeUsdt, writeNbxxNodeBuy } from './nbxxNode.ts'
