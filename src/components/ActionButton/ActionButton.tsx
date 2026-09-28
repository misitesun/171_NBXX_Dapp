import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './ActionButton.scss'

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'soft' | 'secondary'
    size?: 'regular' | 'small'
    icon?: ReactNode
    loading?: boolean
    animated?: boolean
}

export function ActionButton({ variant = 'primary', size = 'regular', icon, loading = false, animated, disabled, className = '', children, type = 'button', ...props }: ActionButtonProps) {
    const shouldAnimate = variant === 'primary' && animated !== false
    const buttonClassName = [
        'action-button',
        `action-button--${variant}`,
        `action-button--${size}`,
        shouldAnimate ? 'action-button--animated' : '',
        'flex items-center justify-center',
        className,
    ].filter(Boolean).join(' ')

    return (
        <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
            className={buttonClassName}>
            <span className="action-button__content">
                {icon ? <span className="action-button__icon">{icon}</span> : null}
                {children}
            </span>
        </button>
    )
}
