import {
    defineChain,
    parseEther,
    parseGwei,
} from 'viem'
import { bsc } from 'viem/chains'

export type DappEnv = Partial<Record<string, string>>

export const DAPP_DEFAULT_AMOUNT_DECIMALS = 18

export const DAPP_MAX_AMOUNT_DECIMALS = 36

export const DAPP_PROVIDER_DETECT_TIMEOUT = 5000

function getDappEnv(): DappEnv {
    return (import.meta.env ?? {}) as unknown as DappEnv
}

function readDappEnv(
    key: string,
    fallback = '',
    env: DappEnv = getDappEnv(),
): string {
    const value = env[key]
    return value ? value : fallback
}

export const DAPP_PROVIDER_STATUS = {
    checking: 'checking',
    available: 'available',
    unavailable: 'unavailable',
} as const

export type DappProviderStatus =
    (typeof DAPP_PROVIDER_STATUS)[keyof typeof DAPP_PROVIDER_STATUS]

// Production target chain. Replace this viem preset when a project uses another network.
// 生产目标链。项目使用其他网络时，替换为对应的 viem 预设链。
export const DAPP_PRODUCTION_CHAIN = bsc

// Local test chain. Its RPC endpoint is read from VITE_RPC_URL for LAN development.
// 本地测试链。其 RPC 节点从 VITE_RPC_URL 读取，便于局域网开发。
export const DAPP_LOCAL_CHAIN = defineChain({
    id: 31337,
    name: 'Local Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'GO',
        symbol: 'GO',
    },
    rpcUrls: {
        default: {
            http: [readDappEnv('VITE_RPC_URL', 'http://127.0.0.1:8545')],
        },
    },
})

export const DAPP_CURRENT_CHAIN = import.meta.env?.PROD
    ? DAPP_PRODUCTION_CHAIN
    : DAPP_LOCAL_CHAIN

// DApp transaction and amount settings shared by the current project.
// 当前项目共用的 DApp 交易和金额设置。
export const DAPP_CONFIG = {
    // Minimum native token balance required before contract writes.
    // 写合约前要求的最低原生代币余额。
    minGasBalance: '0.0004',

    // Whether contract writes check the native token balance first.
    // 写合约前是否先检查原生代币余额。
    enableGasCheck: false,

    // Whether production contract writes estimate and submit gas values.
    // 生产环境写合约时是否估算并提交 gas 参数。
    enableGasEstimate: false,

    // Whether insufficient ERC20 allowance is approved with the maximum amount.
    // ERC20 授权不足时是否授权最大额度。
    enableErc20MaxApprove: true,

    // Delay refreshes after a confirmed contract write so indexed backend data can catch up.
    // 写合约确认后刷新数据前的等待时间，给后端索引链上交易留出同步时间。
    contractWriteRefreshDelayMs: 3000,

    // Decimals used to convert DApp display amounts and on-chain integer units.
    // DApp 展示金额和链上整数单位互转使用的小数位。
    amountDecimals: 18,
} as const

export const DAPP_APPROVE_AMOUNT =
    115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const DAPP_ERC20_MAX_APPROVE_AMOUNT = DAPP_APPROVE_AMOUNT

export const DAPP_GAS_LIMIT_MULTIPLIER = 130n

export const DAPP_DEFAULT_GAS_PRICE = parseGwei('0.05')

export const DAPP_MIN_GAS_BALANCE = parseEther(DAPP_CONFIG.minGasBalance)

export function shouldCheckDappGas(): boolean {
    return DAPP_CONFIG.enableGasCheck
}

export function shouldEstimateDappGas(
    isProduction = Boolean(import.meta.env?.PROD),
): boolean {
    if (!isProduction) return false
    return DAPP_CONFIG.enableGasEstimate
}

export function shouldUseErc20MaxAllowance(): boolean {
    return DAPP_CONFIG.enableErc20MaxApprove
}

export function getErc20ApproveAmount(amount: bigint): bigint {
    return shouldUseErc20MaxAllowance()
        ? DAPP_ERC20_MAX_APPROVE_AMOUNT
        : amount
}

export function getDappAmountDecimals(): number {
    return DAPP_CONFIG.amountDecimals
}

export const DAPP_AMOUNT_DECIMALS = getDappAmountDecimals()

export const DAPP_ERROR_MESSAGE = {
    providerUnavailable: '没有钱包环境',
    walletAddressUnavailable: '未获取到钱包地址',
    gasBalanceInsufficient: 'Gas费用不足',
    contractReverted: '交易执行失败',
    tokenAddressUnavailable: '未配置 Token 合约地址',
    eip7702Unavailable: '当前钱包暂不支持7702批量调用',
    erc20BalanceInsufficient: '余额不足',
    invalidAmount: '金额格式错误',
} as const
