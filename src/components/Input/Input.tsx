import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import './Input.scss'

export type InputFocusVariant = 'default' | 'gradient'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    focusVariant?: InputFocusVariant
    prefix?: ReactNode
    suffix?: ReactNode
    ref?: Ref<HTMLInputElement>
}

export function Input({ focusVariant = 'gradient', prefix, suffix, className = '', disabled, ref, ...props }: InputProps) {
    const wrapperClassName = [
        'app-input',
        'flex',
        'items-center',
        `app-input--focus-${focusVariant}`,
        disabled ? 'app-input--disabled' : '',
    ].filter(Boolean).join(' ')

    return <div className={wrapperClassName}>
        {prefix ? <span className="app-input__prefix">{prefix}</span> : null}
        <input {...props} ref={ref} disabled={disabled} className={className} />
        {suffix ? <span className="app-input__suffix">{suffix}</span> : null}
    </div>
}
