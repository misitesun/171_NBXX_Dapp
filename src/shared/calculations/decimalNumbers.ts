export type DecimalCalculationValue =
    | string
    | number
    | bigint
    | null
    | undefined

interface DecimalNumber {
    coefficient: bigint
    scale: number
}

type ParsedInput =
    | { kind: 'empty' }
    | { kind: 'invalid' }
    | { kind: 'value'; decimal: DecimalNumber }

const ZERO: DecimalNumber = { coefficient: 0n, scale: 0 }
const MAX_INPUT_LENGTH = 10_000
const MAX_SCALE = 10_000
const MAX_DIVISION_FRACTION_DIGITS = 100

function powerOfTen(exponent: number): bigint {
    return 10n ** BigInt(exponent)
}

function normalizeDecimal(decimal: DecimalNumber): DecimalNumber {
    let { coefficient, scale } = decimal

    while (scale > 0 && coefficient % 10n === 0n) {
        coefficient /= 10n
        scale -= 1
    }

    return coefficient === 0n ? ZERO : { coefficient, scale }
}

function parseDecimal(value: DecimalCalculationValue): ParsedInput {
    if (value === null || value === undefined) return { kind: 'empty' }
    if (typeof value === 'number' && !Number.isFinite(value)) {
        return { kind: 'invalid' }
    }

    const rawText = String(value)
    if (rawText.length > MAX_INPUT_LENGTH) return { kind: 'invalid' }

    const text = rawText.trim()
    if (!text) return { kind: 'empty' }

    const match = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(text)
    if (!match || (!match[2] && !match[3])) return { kind: 'invalid' }

    const [, sign, integer = '', fraction = '', exponentText = '0'] = match
    const exponent = Number(exponentText)
    if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > MAX_SCALE) {
        return { kind: 'invalid' }
    }

    const digits = `${integer || '0'}${fraction}`.replace(/^0+(?=\d)/, '')
    let coefficient = BigInt(digits || '0')
    if (sign === '-') coefficient = -coefficient

    let scale = fraction.length - exponent
    if (Math.abs(scale) > MAX_SCALE) return { kind: 'invalid' }
    if (scale < 0) {
        coefficient *= powerOfTen(-scale)
        scale = 0
    }

    return {
        kind: 'value',
        decimal: normalizeDecimal({ coefficient, scale }),
    }
}

function serializeDecimal(decimal: DecimalNumber): string {
    const normalized = normalizeDecimal(decimal)
    const negative = normalized.coefficient < 0n
    const digits = (negative
        ? -normalized.coefficient
        : normalized.coefficient).toString()

    if (normalized.scale === 0) return `${negative ? '-' : ''}${digits}`

    const padded = digits.padStart(normalized.scale + 1, '0')
    const splitAt = padded.length - normalized.scale
    return `${negative ? '-' : ''}${padded.slice(0, splitAt)}.${padded.slice(splitAt)}`
}

function alignScales(
    left: DecimalNumber,
    right: DecimalNumber,
): [bigint, bigint, number] {
    const scale = Math.max(left.scale, right.scale)
    return [
        left.coefficient * powerOfTen(scale - left.scale),
        right.coefficient * powerOfTen(scale - right.scale),
        scale,
    ]
}

function hasInvalidInput(left: ParsedInput, right: ParsedInput): boolean {
    return left.kind === 'invalid' || right.kind === 'invalid'
}

function presentDecimal(input: ParsedInput): DecimalNumber | undefined {
    return input.kind === 'value' ? input.decimal : undefined
}

export type DecimalComparison = -1 | 0 | 1

export function compareDecimalNumbers(
    leftValue: DecimalCalculationValue,
    rightValue: DecimalCalculationValue,
): DecimalComparison | null {
    const left = parseDecimal(leftValue)
    const right = parseDecimal(rightValue)
    if (left.kind !== 'value' || right.kind !== 'value') return null

    const [leftCoefficient, rightCoefficient] = alignScales(
        left.decimal,
        right.decimal,
    )
    if (leftCoefficient === rightCoefficient) return 0
    return leftCoefficient < rightCoefficient ? -1 : 1
}

function calculateAddOrSubtract(
    leftValue: DecimalCalculationValue,
    rightValue: DecimalCalculationValue,
    operation: 'add' | 'subtract',
): string {
    const left = parseDecimal(leftValue)
    const right = parseDecimal(rightValue)
    if (hasInvalidInput(left, right)) return '0'

    const leftDecimal = presentDecimal(left)
    const rightDecimal = presentDecimal(right)
    if (!leftDecimal && !rightDecimal) return '0'
    if (!leftDecimal) return serializeDecimal(rightDecimal ?? ZERO)
    if (!rightDecimal) return serializeDecimal(leftDecimal)
    if (leftDecimal.coefficient === 0n) return serializeDecimal(rightDecimal)
    if (rightDecimal.coefficient === 0n) return serializeDecimal(leftDecimal)

    const [leftCoefficient, rightCoefficient, scale] = alignScales(
        leftDecimal,
        rightDecimal,
    )
    const coefficient = operation === 'add'
        ? leftCoefficient + rightCoefficient
        : leftCoefficient - rightCoefficient

    return serializeDecimal({ coefficient, scale })
}

export function addDecimalNumbers(
    left: DecimalCalculationValue,
    right: DecimalCalculationValue,
): string {
    return calculateAddOrSubtract(left, right, 'add')
}

export function subtractDecimalNumbers(
    left: DecimalCalculationValue,
    right: DecimalCalculationValue,
): string {
    return calculateAddOrSubtract(left, right, 'subtract')
}

export function multiplyDecimalNumbers(
    leftValue: DecimalCalculationValue,
    rightValue: DecimalCalculationValue,
): string {
    const left = parseDecimal(leftValue)
    const right = parseDecimal(rightValue)
    if (hasInvalidInput(left, right)) return '0'

    const leftDecimal = presentDecimal(left)
    const rightDecimal = presentDecimal(right)
    if (!leftDecimal && !rightDecimal) return '0'
    if (!leftDecimal) return serializeDecimal(rightDecimal ?? ZERO)
    if (!rightDecimal) return serializeDecimal(leftDecimal)
    if (leftDecimal.coefficient === 0n || rightDecimal.coefficient === 0n) {
        return '0'
    }

    return serializeDecimal({
        coefficient: leftDecimal.coefficient * rightDecimal.coefficient,
        scale: leftDecimal.scale + rightDecimal.scale,
    })
}

export function divideDecimalNumbers(
    leftValue: DecimalCalculationValue,
    rightValue: DecimalCalculationValue,
    maximumFractionDigits = 18,
): string {
    if (
        !Number.isSafeInteger(maximumFractionDigits)
        || maximumFractionDigits < 0
        || maximumFractionDigits > MAX_DIVISION_FRACTION_DIGITS
    ) {
        return '0'
    }

    const left = parseDecimal(leftValue)
    const right = parseDecimal(rightValue)
    if (hasInvalidInput(left, right)) return '0'

    const leftDecimal = presentDecimal(left)
    const rightDecimal = presentDecimal(right)
    if (!leftDecimal && !rightDecimal) return '0'
    if (!leftDecimal) return serializeDecimal(rightDecimal ?? ZERO)
    if (!rightDecimal) return serializeDecimal(leftDecimal)
    if (leftDecimal.coefficient === 0n || rightDecimal.coefficient === 0n) {
        return '0'
    }

    const decimalShift = maximumFractionDigits
        + rightDecimal.scale
        - leftDecimal.scale
    const numerator = decimalShift >= 0
        ? leftDecimal.coefficient * powerOfTen(decimalShift)
        : leftDecimal.coefficient
    const denominator = decimalShift >= 0
        ? rightDecimal.coefficient
        : rightDecimal.coefficient * powerOfTen(-decimalShift)

    return serializeDecimal({
        coefficient: numerator / denominator,
        scale: maximumFractionDigits,
    })
}
