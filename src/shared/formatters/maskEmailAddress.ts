export function maskEmailAddress(value: string | null | undefined): string {
    if (!value) return '--'

    const match = /^([^@\s]+)@([^@\s]+)$/.exec(value)
    if (!match) return '--'

    const [, localPart, domain] = match
    const visibleLocal = localPart.length === 1
        ? localPart
        : `${localPart[0]}***${localPart.at(-1)}`

    return `${visibleLocal}${localPart.length === 1 ? '***' : ''}@${domain}`
}
