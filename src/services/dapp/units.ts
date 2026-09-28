import {
    formatUnits,
    parseUnits,
} from 'viem'

import {
    DAPP_AMOUNT_DECIMALS,
    DAPP_ERROR_MESSAGE,
    DAPP_MAX_AMOUNT_DECIMALS,
} from './config.ts'

export type DappAmountUnitValue = string | number | bigint

export interface DappAmountUnitOptions {
    decimals?: number
}

function getDappAmountUnitDecimals(
    options: DappAmountUnitOptions = {},
): number {
    const decimals = options.decimals ?? DAPP_AMOUNT_DECIMALS

    if (
        !Number.isSafeInteger(decimals)
        || decimals < 0
        || decimals > DAPP_MAX_AMOUNT_DECIMALS
    ) {
        throw new Error(DAPP_ERROR_MESSAGE.invalidAmount)
    }

    return decimals
}

function normalizeDappAmountValue(value: DappAmountUnitValue): string {
    if (typeof value === 'number' && !Number.isFinite(value)) {
        throw new Error(DAPP_ERROR_MESSAGE.invalidAmount)
    }

    const text = String(value).trim()
    if (!text) throw new Error(DAPP_ERROR_MESSAGE.invalidAmount)

    return text
}

function normalizeDappRawUnitValue(value: DappAmountUnitValue): bigint {
    if (typeof value === 'bigint') return value

    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
        throw new Error(DAPP_ERROR_MESSAGE.invalidAmount)
    }

    const text = String(value).trim()
    if (!/^-?\d+$/.test(text)) throw new Error(DAPP_ERROR_MESSAGE.invalidAmount)

    return BigInt(text)
}

export function parseDappAmountUnits(
    value: DappAmountUnitValue,
    options: DappAmountUnitOptions = {},
): bigint {
    return parseUnits(
        normalizeDappAmountValue(value),
        getDappAmountUnitDecimals(options),
    )
}

export function formatDappAmountUnits(
    value: DappAmountUnitValue,
    options: DappAmountUnitOptions = {},
): string {
    return formatUnits(
        normalizeDappRawUnitValue(value),
        getDappAmountUnitDecimals(options),
    )
}
