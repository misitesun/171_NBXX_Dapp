import {
    formatNumericString,
    type NumericDisplayValue,
} from './numericString.ts'

export function formatAmount(value: NumericDisplayValue): string {
    return formatNumericString(value, { zeroText: '0.00' })
}
