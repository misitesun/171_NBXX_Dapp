import { useEffect, useMemo, useRef, type HTMLAttributes } from 'react'

import {
    calculateCountUpFrame,
    createCountFormatter,
    isFiniteCountValue,
    resolveDecimalPlaces,
    toFiniteCountNumber,
    type CountUpValue,
} from './number'

const DEFAULT_DURATION_SECONDS = 0.5
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export interface CountUpProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Final number or numeric string. Non-finite values fall back to `from`. */
    to: CountUpValue
    /** Starting value. */
    from?: CountUpValue
    /** Animation duration in seconds. */
    duration?: number
    /** Delay before the animation starts, in seconds. */
    delay?: number
    /** Fixed decimal precision. Omit to infer it from `from` and `to`. */
    decimalPlaces?: number
    /** Thousands separator. An empty string disables grouping. */
    separator?: string
    /** Allows callers to hold the component at `from` until data is ready. */
    startWhen?: boolean
    onStart?: () => void
    onEnd?: () => void
}

export default function CountUp({
    to,
    from = 0,
    duration = DEFAULT_DURATION_SECONDS,
    delay = 0,
    decimalPlaces,
    separator = '',
    startWhen = true,
    onStart,
    onEnd,
    'aria-label': ariaLabel,
    ...spanProps
}: CountUpProps) {
    const elementRef = useRef<HTMLSpanElement>(null)
    const onStartRef = useRef(onStart)
    const onEndRef = useRef(onEnd)
    onStartRef.current = onStart
    onEndRef.current = onEnd

    const displayFrom = isFiniteCountValue(from) ? from : 0
    const safeFrom = toFiniteCountNumber(displayFrom)
    const displayTo = isFiniteCountValue(to) ? to : displayFrom
    const safeTo = toFiniteCountNumber(displayTo, safeFrom)
    const safeDuration = Number.isFinite(duration) ? Math.max(0, duration) : DEFAULT_DURATION_SECONDS
    const safeDelay = Number.isFinite(delay) ? Math.max(0, delay) : 0
    const fractionDigits = resolveDecimalPlaces(displayFrom, displayTo, decimalPlaces)
    const formatValue = useMemo(
        () => createCountFormatter(fractionDigits, separator),
        [fractionDigits, separator],
    )
    const initialText = formatValue(displayFrom)
    const finalText = formatValue(displayTo)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        element.textContent = initialText
        if (!startWhen) return

        const durationMilliseconds = safeDuration * 1000
        let animationFrameId: number | undefined
        let cancelled = false

        const finish = () => {
            if (cancelled) return
            element.textContent = finalText
            onEndRef.current?.()
        }

        const start = () => {
            if (cancelled) return
            onStartRef.current?.()

            if (
                safeFrom === safeTo
                || durationMilliseconds === 0
                || window.matchMedia?.(REDUCED_MOTION_QUERY).matches
            ) {
                finish()
                return
            }

            const startedAt = performance.now()
            const update = (timestamp: number) => {
                const frame = calculateCountUpFrame(
                    safeFrom,
                    safeTo,
                    timestamp - startedAt,
                    durationMilliseconds,
                )
                element.textContent = formatValue(frame.value)

                if (frame.done) {
                    finish()
                    return
                }

                animationFrameId = window.requestAnimationFrame(update)
            }

            animationFrameId = window.requestAnimationFrame(update)
        }

        const delayId = window.setTimeout(start, safeDelay * 1000)

        return () => {
            cancelled = true
            window.clearTimeout(delayId)
            if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId)
        }
    }, [finalText, formatValue, initialText, safeDelay, safeDuration, safeFrom, safeTo, startWhen])

    return (
        <span {...spanProps} ref={elementRef} aria-label={ariaLabel ?? finalText}>
            {initialText}
        </span>
    )
}
