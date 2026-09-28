import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import './GradientText.scss'

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
    colors?: readonly string[]
    /** Seconds for one direction; invalid/non-positive values use 8 seconds. */
    animationSpeed?: number
    showBorder?: boolean
    direction?: 'horizontal' | 'vertical' | 'diagonal'
    pauseOnHover?: boolean
    yoyo?: boolean
}

const DEFAULT_COLORS = ['var(--app-color)', 'var(--app-gradient-blue)', 'var(--app-cyan)']

export default function GradientText({
    children,
    className = '',
    colors = DEFAULT_COLORS,
    animationSpeed = 8,
    showBorder = false,
    direction = 'horizontal',
    pauseOnHover = false,
    yoyo = true,
    style,
    ...props
}: GradientTextProps) {
    const suppliedColors = colors.filter((color) => color.trim().length > 0)
    const palette = suppliedColors.length ? suppliedColors : DEFAULT_COLORS
    const angle = direction === 'horizontal' ? 'to right'
        : direction === 'vertical' ? 'to bottom' : 'to bottom right'
    const speed = Number.isFinite(animationSpeed) && animationSpeed > 0 ? animationSpeed : 8
    const end = yoyo ? '100%' : '150%'
    const gradientStyle = {
        '--gradient-text-image': `linear-gradient(${angle}, ${[...palette, palette[0]].join(', ')})`,
        '--gradient-text-size': direction === 'vertical' ? '100% 300%' : direction === 'diagonal' ? '300% 300%' : '300% 100%',
        '--gradient-text-start': direction === 'vertical' ? '50% 0%' : '0% 50%',
        '--gradient-text-end': direction === 'vertical' ? `50% ${end}` : `${end} 50%`,
        '--gradient-text-duration': `${speed}s`,
        '--gradient-text-direction': yoyo ? 'alternate' : 'normal',
        ...style,
    } as CSSProperties
    const classes = [
        'gradient-text',
        showBorder && 'gradient-text--border',
        pauseOnHover && 'gradient-text--pause-on-hover',
        className,
    ].filter(Boolean).join(' ')

    return (
        <span {...props} className={classes} style={gradientStyle}>
            {showBorder ? <span className="gradient-text__border" aria-hidden="true" /> : null}
            <span className="gradient-text__content">{children}</span>
        </span>
    )
}
