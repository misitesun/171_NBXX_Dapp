import {
    compareDecimalNumbers,
    divideDecimalNumbers,
    multiplyDecimalNumbers,
    type DecimalCalculationValue,
} from './decimalNumbers.ts'

export function calculatePercentage(
    currentValue: DecimalCalculationValue,
    totalValue: DecimalCalculationValue,
): number {
    const currentVsZero = compareDecimalNumbers(currentValue, 0)
    const totalVsZero = compareDecimalNumbers(totalValue, 0)
    if (
        currentVsZero === null
        || totalVsZero === null
        || currentVsZero <= 0
        || totalVsZero <= 0
    ) {
        return 0
    }

    const currentVsTotal = compareDecimalNumbers(currentValue, totalValue)
    if (currentVsTotal === null) return 0
    if (currentVsTotal >= 0) return 100

    const ratio = divideDecimalNumbers(currentValue, totalValue, 100)
    const percentage = multiplyDecimalNumbers(ratio, 100)
    const integerPart = percentage.split('.')[0]
    const result = Number(integerPart)

    return Number.isSafeInteger(result)
        ? Math.min(100, Math.max(0, result))
        : 0
}
