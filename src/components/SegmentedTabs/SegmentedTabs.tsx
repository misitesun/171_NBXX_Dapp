import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    type CSSProperties,
    type KeyboardEvent,
    type ReactNode,
} from 'react'

import './SegmentedTabs.scss'

const GOOEY_PARTICLE_COUNT = 12
const GOOEY_DURATION_MS = 500
const GOOEY_MIN_DURATION_MS = GOOEY_DURATION_MS * 0.7
const GOOEY_DURATION_VARIANCE_MS = GOOEY_DURATION_MS * 0.175
const GOOEY_MAX_DELAY_MS = GOOEY_DURATION_MS * 0.025
const GOOEY_CLEANUP_BUFFER_MS = GOOEY_DURATION_MS * 0.1
const GOOEY_TIMING_STYLE = {
    '--gooey-total-duration': `${GOOEY_DURATION_MS}ms`,
    '--gooey-grow-duration': `${GOOEY_DURATION_MS * 0.78}ms`,
} as CSSProperties
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min)
}

export interface SegmentedTabOption<Value extends string> {
    value: Value
    label: ReactNode
    disabled?: boolean
}

export type SegmentedTabOptions<Value extends string> = readonly [
    SegmentedTabOption<Value>,
    SegmentedTabOption<Value>,
    ...SegmentedTabOption<Value>[],
]

export interface SegmentedTabsProps<Value extends string> {
    items: SegmentedTabOptions<Value>
    value: Value
    onChange: (value: Value) => void
    ariaLabel: string
    className?: string
    idPrefix?: string
}

export function SegmentedTabs<Value extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    className = '',
    idPrefix,
}: SegmentedTabsProps<Value>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const filterId = `segmented-tabs-goo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const blurRef = useRef<SVGFEGaussianBlurElement>(null)
    const animatedButtonRef = useRef<HTMLButtonElement | null>(null)
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
    const effectRef = useRef<HTMLSpanElement>(null)
    const particleLayerRef = useRef<HTMLSpanElement>(null)
    const previousValueRef = useRef(value)
    const animationFrameRef = useRef<number | null>(null)
    const cleanupTimerRef = useRef<number | null>(null)

    const clearGooeyEffect = useCallback(() => {
        if (animationFrameRef.current !== null) {
            window.cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }

        if (cleanupTimerRef.current !== null) {
            window.clearTimeout(cleanupTimerRef.current)
            cleanupTimerRef.current = null
        }

        effectRef.current?.classList.remove('segmented-tabs__goo--active')
        particleLayerRef.current?.replaceChildren()
        animatedButtonRef.current?.classList.remove('segmented-tabs__item--forming')
        animatedButtonRef.current = null
    }, [])

    const playGooeyEffect = useCallback((target: HTMLButtonElement) => {
        clearGooeyEffect()

        if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return

        const container = containerRef.current
        const effect = effectRef.current
        const particleLayer = particleLayerRef.current

        if (!container || !effect || !particleLayer) return

        const selectedSurfaceStyle = window.getComputedStyle(target, '::before')

        // Text-only variants intentionally suppress the shared gradient surface.
        if (selectedSurfaceStyle.display === 'none') return

        const containerRect = container.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        if (targetRect.width <= 0 || targetRect.height <= 0) return

        const effectPadding = targetRect.height * 1.7

        Object.assign(effect.style, {
            left: `${targetRect.left - containerRect.left + container.scrollLeft - container.clientLeft - effectPadding}px`,
            top: `${targetRect.top - containerRect.top + container.scrollTop - container.clientTop - effectPadding}px`,
            width: `${targetRect.width + effectPadding * 2}px`,
            height: `${targetRect.height + effectPadding * 2}px`,
        })
        effect.style.setProperty('--gooey-padding', `${effectPadding}px`)
        blurRef.current?.setAttribute('stdDeviation', `${targetRect.height * 0.055}`)

        const fragment = document.createDocumentFragment()

        for (let index = 0; index < GOOEY_PARTICLE_COUNT; index += 1) {
            const angle = (Math.PI * 2 * index) / GOOEY_PARTICLE_COUNT + randomBetween(-0.24, 0.24)
            const endAngle = angle + randomBetween(-0.22, 0.22)
            const angleSin = Math.sin(angle)
            const startHorizontalRadius = targetRect.width / 2
                + targetRect.height * randomBetween(0.25, 0.7)
            const startVerticalRadius = targetRect.height * randomBetween(0.95, 1.4)
            const startX = Math.cos(angle) * startHorizontalRadius
            const startY = angleSin * startVerticalRadius
            const endX = Math.cos(endAngle) * targetRect.width * 0.32
            const endY = Math.sin(endAngle) * targetRect.height * 0.2
            const rotation = randomBetween(-110, 110)
            const scale = randomBetween(0.45, 1.15)
            const duration = randomBetween(
                GOOEY_MIN_DURATION_MS,
                GOOEY_MIN_DURATION_MS + GOOEY_DURATION_VARIANCE_MS,
            )
            const delay = randomBetween(0, GOOEY_MAX_DELAY_MS)
            const particle = document.createElement('span')
            const point = document.createElement('span')

            particle.className = 'segmented-tabs__goo-particle'
            point.className = 'segmented-tabs__goo-point'
            particle.style.setProperty('--gooey-start-x', `${startX}px`)
            particle.style.setProperty('--gooey-start-y', `${startY}px`)
            particle.style.setProperty('--gooey-end-x', `${endX}px`)
            particle.style.setProperty('--gooey-end-y', `${endY}px`)
            particle.style.setProperty('--gooey-rotation', `${rotation}deg`)
            particle.style.setProperty('--gooey-scale', `${scale}`)
            particle.style.setProperty('--gooey-small-scale', `${scale * 0.55}`)
            particle.style.setProperty('--gooey-duration', `${duration}ms`)
            particle.style.setProperty('--gooey-delay', `${delay}ms`)
            particle.appendChild(point)
            fragment.appendChild(particle)
        }

        particleLayer.replaceChildren(fragment)
        animatedButtonRef.current = target
        target.classList.add('segmented-tabs__item--forming')
        animationFrameRef.current = window.requestAnimationFrame(() => {
            animationFrameRef.current = null
            effect.classList.add('segmented-tabs__goo--active')
            cleanupTimerRef.current = window.setTimeout(() => {
                clearGooeyEffect()
            }, GOOEY_DURATION_MS + GOOEY_CLEANUP_BUFFER_MS)
        })
    }, [clearGooeyEffect])

    useLayoutEffect(() => {
        if (previousValueRef.current === value) return

        previousValueRef.current = value
        const selectedIndex = items.findIndex((item) => item?.value === value)
        const selectedButton = selectedIndex < 0
            ? null
            : buttonRefs.current[selectedIndex]

        if (selectedButton) playGooeyEffect(selectedButton)
    }, [items, playGooeyEffect, value])

    useEffect(() => {
        window.addEventListener('resize', clearGooeyEffect)
        return () => {
            window.removeEventListener('resize', clearGooeyEffect)
            clearGooeyEffect()
        }
    }, [clearGooeyEffect])

    function selectByKeyboard(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
        const enabledIndexes = items.reduce<number[]>((indexes, item, index) => {
            if (item && !item.disabled) indexes.push(index)
            return indexes
        }, [])

        if (!enabledIndexes.length) return

        const currentEnabledIndex = enabledIndexes.indexOf(currentIndex)
        let nextEnabledIndex = currentEnabledIndex

        if (event.key === 'ArrowRight') {
            nextEnabledIndex = (currentEnabledIndex + 1) % enabledIndexes.length
        } else if (event.key === 'ArrowLeft') {
            nextEnabledIndex = (currentEnabledIndex - 1 + enabledIndexes.length) % enabledIndexes.length
        } else if (event.key === 'Home') {
            nextEnabledIndex = 0
        } else if (event.key === 'End') {
            nextEnabledIndex = enabledIndexes.length - 1
        } else {
            return
        }

        event.preventDefault()
        const nextIndex = enabledIndexes[nextEnabledIndex]
        const nextItem = nextIndex === undefined ? undefined : items[nextIndex]

        if (!nextItem || nextIndex === undefined) return

        onChange(nextItem.value)
        buttonRefs.current[nextIndex]?.focus()
    }

    return (
        <div
            ref={containerRef}
            className={`segmented-tabs flex ${className}`}
            style={GOOEY_TIMING_STYLE}
            role="tablist"
            aria-label={ariaLabel}
            onScroll={clearGooeyEffect}
        >
            <svg className="segmented-tabs__filter" aria-hidden="true" focusable="false">
                <defs>
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
                    </filter>
                </defs>
            </svg>
            <span className="segmented-tabs__goo" ref={effectRef} style={{ filter: `url(#${filterId})` }} aria-hidden="true">
                <span className="segmented-tabs__goo-pill" />
                <span className="segmented-tabs__goo-particles" ref={particleLayerRef} />
            </span>
            {items.map((item, index) => {
                if (!item) return null

                const selected = item.value === value
                const tabId = idPrefix ? `${idPrefix}-${item.value}-tab` : undefined
                const panelId = idPrefix ? `${idPrefix}-${item.value}-panel` : undefined

                return (
                    <button
                        key={item.value}
                        ref={(element) => { buttonRefs.current[index] = element }}
                        id={tabId}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={panelId}
                        tabIndex={selected ? 0 : -1}
                        disabled={item.disabled}
                        className={`segmented-tabs__item flex-center size-28 bold-5 ${selected ? 'segmented-tabs__item--active' : ''}`}
                        onClick={() => onChange(item.value)}
                        onKeyDown={(event) => selectByKeyboard(event, index)}
                    >
                        <span>{item.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
