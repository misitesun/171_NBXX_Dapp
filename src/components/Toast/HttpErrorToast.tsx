import {
    useEffect,
    useSyncExternalStore,
} from 'react'

import {
    clearHttpErrorNotification,
    getHttpErrorNotification,
    subscribeHttpErrorNotifications,
} from '../../services/http/feedback.ts'
import { Toast } from './Toast.tsx'
import { TOAST_DURATION_MS } from './useToast.ts'

function getServerHttpErrorNotification(): null {
    return null
}

export function HttpErrorToast() {
    const notification = useSyncExternalStore(
        subscribeHttpErrorNotifications,
        getHttpErrorNotification,
        getServerHttpErrorNotification,
    )

    useEffect(() => {
        if (!notification) return

        const timer = setTimeout(() => {
            clearHttpErrorNotification(notification.id)
        }, TOAST_DURATION_MS)

        return () => clearTimeout(timer)
    }, [notification])

    return <Toast message={notification?.message ?? null} variant="error" />
}
