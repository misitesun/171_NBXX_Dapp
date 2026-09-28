import { createPortal } from 'react-dom'
import './Toast.scss'

export type ToastVariant = 'default' | 'success' | 'error'

export interface ToastProps {
    message: string | null
    variant?: ToastVariant
}

function ToastStatusIcon({ variant }: { variant: Exclude<ToastVariant, 'default'> }) {
    return (
        <span className="app-toast__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="9" />
                {variant === 'success'
                    ? <path d="m7.5 12.5 2.8 2.8 6.2-6.6" />
                    : <path d="m9 9 6 6m0-6-6 6" />}
            </svg>
        </span>
    )
}

export function Toast({
    message,
    variant = 'default',
}: ToastProps) {
    if (!message || typeof document === 'undefined') return null

    const isError = variant === 'error'
    const alignmentClassName = variant === 'default'
        ? 'justify-center'
        : 'justify-end'

    return createPortal(<div className={`app-toast app-toast--${variant} flex items-center ${alignmentClassName}`}>
        <div
            key={`${variant}:${message}`}
            className="app-toast__message size-26 tc"
            role={isError ? 'alert' : 'status'}
            aria-live={isError ? 'assertive' : 'polite'}
        >
            {variant === 'default' ? null : <ToastStatusIcon variant={variant} />}
            <span className="app-toast__text">{message}</span>
        </div>
    </div>, document.body)
}
