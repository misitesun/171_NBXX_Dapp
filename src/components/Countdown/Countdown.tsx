import { useEffect, useState } from 'react'
import { countdownParts, DEFAULT_COUNTDOWN_SECONDS, remainingSeconds } from './time'
import './Countdown.scss'

export interface CountdownProps {
    label: string
    /** Optional fixed display for component previews. Omit to start the clock. */
    value?: readonly [string, string, string]
    durationSeconds?: number
    tone?: 'pink' | 'cyan'
}

export function Countdown({ label, value, durationSeconds = DEFAULT_COUNTDOWN_SECONDS, tone = 'pink' }: CountdownProps) {
    const duration = Number.isFinite(durationSeconds) ? Math.max(0, Math.floor(durationSeconds)) : 0
    const [seconds, setSeconds] = useState(duration)

    useEffect(() => {
        if (value) return
        const deadline = Date.now() + duration * 1000
        setSeconds(duration)
        if (duration === 0) return

        const update = () => {
            const remaining = remainingSeconds(deadline, Date.now())
            setSeconds(remaining)
            if (remaining === 0) {
                window.clearInterval(timer)
                document.removeEventListener('visibilitychange', update)
            }
        }
        const timer = window.setInterval(update, 250)
        // Reconcile immediately when a throttled/background tab becomes visible.
        document.addEventListener('visibilitychange', update)
        return () => {
            window.clearInterval(timer)
            document.removeEventListener('visibilitychange', update)
        }
    }, [duration, value])

    const display = value ?? countdownParts(seconds)
    return (
        <div className={`countdown countdown--${tone}`}>
            <p className="size-24">{label}</p>
            <div className="countdown__digits flex items-center" aria-label={`${label} ${display.join(':')}`}>
                {display.map((part, index) => (
                    <span className="countdown__unit flex items-center" key={index} aria-hidden="true">
                        {index > 0 ? <span className="countdown__separator">:</span> : null}
                        <span className="countdown__digit flex items-center justify-center">{part}</span>
                    </span>
                ))}
            </div>
        </div>
    )
}
