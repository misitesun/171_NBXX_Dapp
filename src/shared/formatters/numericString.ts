export type NumericDisplayValue = string | number | bigint | null | undefined

interface NumericDisplayOptions {
    zeroText: string
    maximumFractionDigits?: number
}

function expandScientificNotation(value: string): string | null {
    const match = /^([+-]?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(value)
    if (!match) return null

    const [, sign, integer, fraction = '', exponentText] = match
    if (exponentText === undefined) return `${sign}${integer}.${fraction}`

    const exponent = Number(exponentText)
    if (!Number.isSafeInteger(exponent)) return null

    const digits = `${integer}${fraction}`
    const decimalIndex = integer.length + exponent

    if (decimalIndex <= 0) {
        return `${sign}0.${'0'.repeat(-decimalIndex)}${digits}`
    }

    if (decimalIndex >= digits.length) {
        return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}.`
    }

    return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`
}

export function formatNumericString(
    value: NumericDisplayValue,
    {
        zeroText,
        maximumFractionDigits = 6,
    }: NumericDisplayOptions,
): string {
    if (value === null || value === undefined || value === '') return zeroText
    if (typeof value === 'number' && !Number.isFinite(value)) return zeroText

    const expanded = expandScientificNotation(String(value).trim())
    if (!expanded) return zeroText

    const negative = expanded.startsWith('-')
    const unsigned = expanded.replace(/^[+-]/, '')
    const [rawInteger, rawFraction = ''] = unsigned.split('.')
    const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0'
    const fraction = rawFraction
        .slice(0, maximumFractionDigits)
        .replace(/0+$/, '')
    const isZero = integer === '0' && fraction === ''

    if (isZero) return zeroText

    const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${negative ? '-' : ''}${groupedInteger}${fraction ? `.${fraction}` : ''}`
}
