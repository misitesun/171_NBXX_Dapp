import { useCallback, useEffect, useRef, useState } from 'react'

import type { ToastVariant } from './Toast.tsx'

export const TOAST_DURATION_MS = 2500

export function useToast() {
    const [message, setMessage] = useState<string | null>(null)
    const [variant, setVariant] = useState<ToastVariant>('default')
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const showToast = useCallback((
        text: string,
        nextVariant: ToastVariant = 'default',
    ) => {
        clearTimeout(timer.current)
        setMessage(text)
        setVariant(nextVariant)
        timer.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS)
    }, [])
    useEffect(() => () => clearTimeout(timer.current), [])
    return { message, variant, showToast }
}
