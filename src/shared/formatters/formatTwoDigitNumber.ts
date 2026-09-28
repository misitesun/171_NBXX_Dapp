export type TwoDigitNumberValue = string | number | null | undefined

export function formatTwoDigitNumber(value: TwoDigitNumberValue): string {
    if (value === null || value === undefined) return '--'
    if (typeof value === 'string' && !value.trim()) return '--'

    const number = Number(value)
    if (
        Number.isFinite(number)
        && Number.isInteger(number)
        && number >= 0
        && number < 10
    ) {
        return `0${number}`
    }

    return String(value)
}
