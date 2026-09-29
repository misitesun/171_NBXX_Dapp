import {
    useId,
    type CSSProperties,
} from 'react'
import { useTranslation } from 'react-i18next'

import './DropletLoading.scss'

const LOADING_DOT_COUNT = 7
const LOADING_DOTS = Array.from({ length: LOADING_DOT_COUNT }, (_, index) => index + 1)

export type DropletLoadingSize = 'regular' | 'small'

export interface DropletLoadingProps {
    size?: DropletLoadingSize
    className?: string
    ariaLabel?: string
}

export function DropletLoading({
    size = 'regular',
    className = '',
    ariaLabel,
}: DropletLoadingProps) {
    const { t } = useTranslation()
    const generatedId = useId().replace(/:/g, '')
    const filterId = `droplet-loading-${generatedId}`
    const loadingClassName = [
        'droplet-loading',
        `droplet-loading--${size}`,
        className,
    ].filter(Boolean).join(' ')
    const filterStyle = {
        '--droplet-loading-filter': `url("#${filterId}")`,
    } as CSSProperties

    return (
        <div
            className={loadingClassName}
            style={filterStyle}
            aria-label={ariaLabel ?? t('加载中...')}
            role="status"
        >
            <div className="droplet-loading__inner">
                {LOADING_DOTS.map((dotIndex) => (
                    <span
                        key={dotIndex}
                        className="droplet-loading__dot"
                        style={{
                            '--i': dotIndex,
                        } as CSSProperties}
                    />
                ))}
            </div>

            <svg className="droplet-loading__filter" aria-hidden="true">
                <filter id={filterId}>
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation={size === 'small' ? 1.3 : 10}
                    />
                    <feColorMatrix
                        values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 20 -10
                        "
                    />
                </filter>
            </svg>
        </div>
    )
}
