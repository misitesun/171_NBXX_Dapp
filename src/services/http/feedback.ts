import type { HttpError } from './error.ts'

export interface HttpErrorNotification {
    id: number
    message: string
}

type HttpErrorNotificationListener = () => void

const notificationListeners = new Set<HttpErrorNotificationListener>()
const reportedErrors = new WeakSet<object>()

let currentNotification: HttpErrorNotification | null = null
let nextNotificationId = 0

function emitNotificationChange(): void {
    notificationListeners.forEach((listener) => listener())
}

export function reportHttpError(error: HttpError): void {
    reportedErrors.add(error)

    if (error.code === 'ERR_CANCELED') return

    const message = error.message.trim()
    if (!message || currentNotification?.message === message) return

    nextNotificationId += 1
    currentNotification = {
        id: nextNotificationId,
        message,
    }
    emitNotificationChange()
}

export function wasHttpErrorReported(error: unknown): boolean {
    return error instanceof Error && reportedErrors.has(error)
}

export function subscribeHttpErrorNotifications(
    listener: HttpErrorNotificationListener,
): () => void {
    notificationListeners.add(listener)
    return () => {
        notificationListeners.delete(listener)
    }
}

export function getHttpErrorNotification(): HttpErrorNotification | null {
    return currentNotification
}

export function clearHttpErrorNotification(id?: number): void {
    if (!currentNotification) return
    if (id !== undefined && currentNotification.id !== id) return

    currentNotification = null
    emitNotificationChange()
}
