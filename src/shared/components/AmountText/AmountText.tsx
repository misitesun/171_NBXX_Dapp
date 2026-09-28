import type { ComponentPropsWithoutRef } from 'react'

import { formatAmount } from '../../formatters/formatAmount.ts'
import type { NumericDisplayValue } from '../../formatters/numericString.ts'

export interface AmountTextProps extends Omit<
    ComponentPropsWithoutRef<'span'>,
    'children'
> {
    value: NumericDisplayValue
}

export function AmountText({ value, ...spanProps }: AmountTextProps) {
    return <span {...spanProps}>{formatAmount(value)}</span>
}
