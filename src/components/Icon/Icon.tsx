import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { DEFAULT_ICON_VIEW_BOX, getIconDefinition } from './config.ts'
import type { IconName } from './config.ts'

import './Icon.scss'

export type { IconName } from './config.ts'

export interface IconProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'color' | 'name'> {
    name: IconName
    size?: number | string
    color?: string
    title?: string
    ariaLabel?: string
}

function normalizeIconSize(size?: number | string): string | undefined {
    if (size === undefined) {
        return undefined
    }

    return typeof size === 'number' ? `${size}px` : size
}

export function Icon(props: IconProps) {
    const {
        name,
        size,
        color,
        title,
        ariaLabel,
        className,
        style,
        ...svgProps
    } = props

    const icon = getIconDefinition(name)

    if (!icon) {
        return null
    }

    const iconSize = normalizeIconSize(size)
    const iconClassName = [
        'app-icon',
        `app-icon--${name}`,
        className,
    ].filter(Boolean).join(' ')
    const iconStyle: CSSProperties = {
        ...style,
        ...(iconSize ? { width: iconSize, height: iconSize } : {}),
        ...(color ? { color } : {}),
    }
    const accessibleName = ariaLabel ?? svgProps['aria-label'] ?? title

    return (
        <svg
            {...svgProps}
            className={iconClassName}
            viewBox={icon.viewBox ?? DEFAULT_ICON_VIEW_BOX}
            style={iconStyle}
            role={accessibleName ? 'img' : svgProps.role}
            aria-label={accessibleName}
            aria-hidden={accessibleName ? undefined : true}
        >
            {title ? <title>{title}</title> : null}

            {icon.paths.map((path, index) => (
                <path
                    key={`${path.d}-${index}`}
                    d={path.d}
                    fillRule={path.fillRule}
                    clipRule={path.clipRule}
                    fill="currentColor"
                />
            ))}
        </svg>
    )
}
