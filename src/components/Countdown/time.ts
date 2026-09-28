export const DEFAULT_COUNTDOWN_SECONDS = 24 * 60 * 60

export function remainingSeconds(deadline: number, now: number): number {
    return Math.max(0, Math.ceil((deadline - now) / 1000))
}

export function countdownParts(seconds: number): readonly [string, string, string] {
    const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
    return [Math.floor(total / 3600), Math.floor(total / 60) % 60, total % 60]
        .map((part) => String(part).padStart(2, '0')) as [string, string, string]
}
