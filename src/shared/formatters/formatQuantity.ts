import {
    formatNumericString,
    type NumericDisplayValue,
} from './numericString.ts'

export function formatQuantity(value: NumericDisplayValue): string {
    return formatNumericString(value, { zeroText: '0' })
}
