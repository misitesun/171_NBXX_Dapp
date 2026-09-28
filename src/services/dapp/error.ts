interface ErrorWithCause {
    code?: unknown
    message?: unknown
    shortMessage?: unknown
    cause?: unknown
}

/** Read the wallet's rejection message through viem's wrapped error chain. */
export function getDappUserRejectionMessage(error: unknown): string | undefined {
    const visited = new Set<object>()
    let current = error
    let rejected = false
    let message = ''

    while (current && typeof current === 'object' && !visited.has(current)) {
        visited.add(current)
        const candidate = current as ErrorWithCause

        if (candidate.code === 4001) {
            rejected = true
            const rawMessage = typeof candidate.message === 'string'
                ? candidate.message.trim()
                : ''
            const shortMessage = typeof candidate.shortMessage === 'string'
                ? candidate.shortMessage.trim()
                : ''
            const conciseMessage = rawMessage.includes('\n')
                ? shortMessage || rawMessage.split('\n', 1)[0]
                : rawMessage || shortMessage

            if (conciseMessage) message = conciseMessage
        }

        current = candidate.cause
    }

    return rejected ? message : undefined
}
