export type RelativeTimeValue = string | number | Date | null | undefined

function pad(value: number): string {
    return String(value).padStart(2, '0')
}

function isSameCalendarDay(left: Date, right: Date): boolean {
    return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate()
}

export function formatRelativeTime(
    value: RelativeTimeValue,
    now: Date = new Date(),
): string {
    if (value === null || value === undefined || value === '') return '--'

    const date = value instanceof Date ? new Date(value) : new Date(value)
    if (Number.isNaN(date.getTime())) return '--'

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
    if (isSameCalendarDay(date, now)) return time
    if (isSameCalendarDay(date, yesterday)) return `昨天 ${time}`

    const monthAndDay = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    return date.getFullYear() === now.getFullYear()
        ? `${monthAndDay} ${time}`
        : `${date.getFullYear()}-${monthAndDay} ${time}`
}
