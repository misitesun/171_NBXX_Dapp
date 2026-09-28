import type { InputHTMLAttributes } from 'react'
import './Radio.scss'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/** Keep native grouping, label activation and keyboard selection. */
export function Radio({ className = '', ...props }: RadioProps) {
    return <input {...props} type="radio" className={`app-radio ${className}`} />
}
