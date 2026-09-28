export function maskWalletAddress(
    value: string | null | undefined,
): string {
    if (!value) return '--'
    if (value.length <= 9) return value
    return `${value.slice(0, 5)}****${value.slice(-4)}`
}
