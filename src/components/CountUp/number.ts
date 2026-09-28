const MAXIMUM_FRACTION_DIGITS = 20
const MAXIMUM_EXPANDED_DIGITS = 1_000
const NUMERIC_TEXT_PATTERN = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d+))?$/i

export type CountUpValue = number | string

interface ParsedNumericText {
    fractionDigits: string
    integerDigits: string
    isNegative: boolean
    exponent: number
}

export interface CountUpFrame {
    value: number
    done: boolean
}

function parseNumericText(value: string): ParsedNumericText | null {
    const normalizedValue = value.trim()
    const match = NUMERIC_TEXT_PATTERN.exec(normalizedValue)

    if (!match || !Number.isFinite(Number(normalizedValue))) return null

    const exponent = Number.parseInt(match[5] ?? '0', 10)
    if (!Number.isSafeInteger(exponent)) return null

    return {
        isNegative: match[1] === '-',
        integerDigits: match[2] ?? '0',
        fractionDigits: match[3] ?? match[4] ?? '',
        exponent,
    }
}

export function isFiniteCountValue(value: CountUpValue): boolean {
    if (typeof value === 'number') return Number.isFinite(value)
    return parseNumericText(value) !== null
}

export function toFiniteCountNumber(value: CountUpValue, fallback = 0): number {
    if (!isFiniteCountValue(value)) return fallback

    const numericValue = typeof value === 'number' ? value : Number(value.trim())
    return Number.isFinite(numericValue) ? numericValue : fallback
}

export function getDecimalPlaces(value: CountUpValue): number {
    if (typeof value === 'string') {
        const parsedValue = parseNumericText(value)
        if (!parsedValue) return 0

        return Math.min(
            MAXIMUM_FRACTION_DIGITS,
            Math.max(0, parsedValue.fractionDigits.length - parsedValue.exponent),
        )
    }

    if (!Number.isFinite(value) || Number.isInteger(value)) return 0

    const [coefficient, exponentText] = Math.abs(value).toString().toLowerCase().split('e')
    const coefficientDecimals = coefficient.split('.')[1]?.length ?? 0
    const exponent = exponentText ? Number.parseInt(exponentText, 10) : 0

    return Math.min(MAXIMUM_FRACTION_DIGITS, Math.max(0, coefficientDecimals - exponent))
}

export function resolveDecimalPlaces(
    from: CountUpValue,
    to: CountUpValue,
    decimalPlaces?: number,
): number {
    const inferred = Math.max(getDecimalPlaces(from), getDecimalPlaces(to))
    if (decimalPlaces === undefined || !Number.isFinite(decimalPlaces)) return inferred

    return Math.min(MAXIMUM_FRACTION_DIGITS, Math.max(0, Math.floor(decimalPlaces)))
}

function incrementDigitString(value: string): string {
    const digits = value.split('')

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        if (digits[index] !== '9') {
            digits[index] = String(Number(digits[index]) + 1)
            return digits.join('')
        }

        digits[index] = '0'
    }

    return `1${digits.join('')}`
}

function formatNumericText(
    value: string,
    decimalPlaces: number,
    separator: string,
): string | null {
    const parsedValue = parseNumericText(value)
    if (!parsedValue) return null

    const sourceDigits = `${parsedValue.integerDigits}${parsedValue.fractionDigits}`
    const decimalIndex = parsedValue.integerDigits.length + parsedValue.exponent
    const leadingZeroCount = Math.max(0, -decimalIndex)
    const trailingZeroCount = Math.max(0, decimalIndex - sourceDigits.length)

    if (leadingZeroCount + sourceDigits.length + trailingZeroCount > MAXIMUM_EXPANDED_DIGITS) {
        return null
    }

    let integerDigits: string
    let fractionDigits: string

    if (decimalIndex <= 0) {
        integerDigits = '0'
        fractionDigits = `${'0'.repeat(leadingZeroCount)}${sourceDigits}`
    } else if (decimalIndex >= sourceDigits.length) {
        integerDigits = `${sourceDigits}${'0'.repeat(trailingZeroCount)}`
        fractionDigits = ''
    } else {
        integerDigits = sourceDigits.slice(0, decimalIndex)
        fractionDigits = sourceDigits.slice(decimalIndex)
    }

    integerDigits = integerDigits.replace(/^0+(?=\d)/, '')

    const keptFraction = fractionDigits.slice(0, decimalPlaces).padEnd(decimalPlaces, '0')
    let scaledDigits = `${integerDigits}${keptFraction}`.replace(/^0+(?=\d)/, '')
    const shouldRoundUp = fractionDigits.length > decimalPlaces
        && Number(fractionDigits[decimalPlaces]) >= 5

    if (shouldRoundUp) scaledDigits = incrementDigitString(scaledDigits)

    scaledDigits = scaledDigits.padStart(decimalPlaces + 1, '0')
    integerDigits = decimalPlaces > 0
        ? scaledDigits.slice(0, -decimalPlaces)
        : scaledDigits
    fractionDigits = decimalPlaces > 0 ? scaledDigits.slice(-decimalPlaces) : ''

    const isZero = !/[1-9]/.test(`${integerDigits}${fractionDigits}`)
    const sign = parsedValue.isNegative && !isZero ? '-' : ''
    const groupedInteger = separator
        ? integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
        : integerDigits

    return `${sign}${groupedInteger}${decimalPlaces > 0 ? `.${fractionDigits}` : ''}`
}

export function createCountFormatter(
    decimalPlaces: number,
    separator: string,
): (value: CountUpValue) => string {
    const formatter = new Intl.NumberFormat('en-US', {
        useGrouping: separator.length > 0,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    })
    const roundsToZeroBelow = 0.5 * (10 ** -decimalPlaces)

    return (value: CountUpValue) => {
        if (typeof value === 'string') {
            const formattedText = formatNumericText(value, decimalPlaces, separator)
            if (formattedText !== null) return formattedText
        }

        const finiteValue = toFiniteCountNumber(value)
        const displayValue = Math.abs(finiteValue) < roundsToZeroBelow ? 0 : finiteValue
        const formattedValue = formatter.format(displayValue)

        return separator ? formattedValue.replaceAll(',', separator) : formattedValue
    }
}

export function calculateCountUpFrame(
    from: number,
    to: number,
    elapsedMilliseconds: number,
    durationMilliseconds: number,
): CountUpFrame {
    if (durationMilliseconds <= 0 || elapsedMilliseconds >= durationMilliseconds) {
        return { value: to, done: true }
    }

    const progress = Math.min(1, Math.max(0, elapsedMilliseconds / durationMilliseconds))
    const easedProgress = progress < 0.5
        ? 4 * (progress ** 3)
        : 1 - (((-2 * progress) + 2) ** 3) / 2

    return {
        value: from + ((to - from) * easedProgress),
        done: false,
    }
}
