import {
    compareDecimalNumbers,
    divideDecimalNumbers,
    multiplyDecimalNumbers,
} from '../calculations/decimalNumbers.ts'

export type ViewportPixelValue =
    | string
    | number
    | bigint
    | null
    | undefined

function toValidNumber(
    value: ViewportPixelValue,
    allowZero: boolean,
): number | undefined {
    if (value === null || value === undefined) return undefined
    if (typeof value === 'string' && !value.trim()) return undefined

    const comparedWithZero = compareDecimalNumbers(value, 0)
    if (
        comparedWithZero === null
        || comparedWithZero < 0
        || (!allowZero && comparedWithZero === 0)
    ) {
        return undefined
    }

    const number = Number(value)
    if (!Number.isFinite(number)) return undefined
    return number
}

export function calculateViewportPx(
    designPx: ViewportPixelValue,
    designSize: ViewportPixelValue,
    viewportSize: number,
): number {
    const validDesignPx = toValidNumber(designPx, true)
    const validDesignSize = toValidNumber(designSize, false)
    const validViewportSize = toValidNumber(viewportSize, false)
    if (
        validDesignPx === undefined
        || validDesignSize === undefined
        || validViewportSize === undefined
    ) {
        return 0
    }

    if (validViewportSize === validDesignSize) return validDesignPx

    const scaled = multiplyDecimalNumbers(viewportSize, designPx)
    const result = Number(divideDecimalNumbers(scaled, designSize))
    return Number.isFinite(result) && result >= 0 ? result : 0
}
