import { useId, type CSSProperties } from 'react'

import './WalletOrbitBorder.scss'

const VIEWBOX_WIDTH = 670
const VIEWBOX_HEIGHT = 274
const STROKE_WIDTH = 2
const SOURCE_STROKE_WIDTH = 10
const CENTERLINE_RADIUS = 39
const PATH_WIDTH = VIEWBOX_WIDTH - STROKE_WIDTH
const PATH_HEIGHT = VIEWBOX_HEIGHT - STROKE_WIDTH
const PATH_PERIMETER = 2 * (PATH_WIDTH + PATH_HEIGHT - 4 * CENTERLINE_RADIUS)
    + 2 * Math.PI * CENTERLINE_RADIUS
const HIGHLIGHT_LENGTH = 335
const SEGMENTS_PER_HIGHLIGHT = 32
const SEGMENT_STEP = HIGHLIGHT_LENGTH / SEGMENTS_PER_HIGHLIGHT
const SEGMENT_OVERLAP = 1

type OrbitColor = {
    red: number
    green: number
    blue: number
    alpha: number
}

type OrbitColorStop = {
    position: number
    color: OrbitColor
}

type OrbitSegmentStyle = CSSProperties & {
    '--wallet-orbit-start-offset': string
}

type OrbitGroupStyle = CSSProperties & {
    '--wallet-orbit-end-distance': string
}

const COLOR_STOPS: OrbitColorStop[] = [
    { position: 0, color: { red: 220, green: 20, blue: 60, alpha: 0.1 } },
    { position: 0.28, color: { red: 220, green: 20, blue: 60, alpha: 1 } },
    { position: 0.6, color: { red: 255, green: 208, blue: 0, alpha: 0.4 } },
    { position: 1, color: { red: 220, green: 20, blue: 60, alpha: 0.1 } },
]

function interpolate(from: number, to: number, progress: number): number {
    return from + (to - from) * progress
}

function getSegmentColor(position: number): string {
    const endIndex = COLOR_STOPS.findIndex((stop) => position <= stop.position)
    const end = COLOR_STOPS[Math.max(1, endIndex)]
    const start = COLOR_STOPS[Math.max(0, endIndex - 1)]
    const progress = (position - start.position) / (end.position - start.position)
    const red = Math.round(interpolate(start.color.red, end.color.red, progress))
    const green = Math.round(interpolate(start.color.green, end.color.green, progress))
    const blue = Math.round(interpolate(start.color.blue, end.color.blue, progress))
    const alpha = interpolate(start.color.alpha, end.color.alpha, progress).toFixed(3)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const ORBIT_SEGMENTS = [0, PATH_PERIMETER / 2].flatMap((highlightOffset, highlightIndex) => (
    Array.from({ length: SEGMENTS_PER_HIGHLIGHT }, (_, segmentIndex) => {
        const position = (segmentIndex + 0.5) / SEGMENTS_PER_HIGHLIGHT
        const startOffset = -(highlightOffset + segmentIndex * SEGMENT_STEP)

        return {
            key: `${highlightIndex}-${segmentIndex}`,
            color: getSegmentColor(position),
            startOffset,
        }
    })
))

const GROUP_STYLE: OrbitGroupStyle = {
    '--wallet-orbit-end-distance': `${-PATH_PERIMETER}`,
}

export function WalletOrbitBorder() {
    const instanceId = useId().replaceAll(':', '')
    const filterId = `wallet-orbit-soften-${instanceId}`
    const maskId = `wallet-orbit-ring-${instanceId}`
    const dashLength = SEGMENT_STEP + SEGMENT_OVERLAP
    const dashGap = PATH_PERIMETER - dashLength

    return (
        <svg
            aria-hidden="true"
            className="wallet-orbit-border"
            focusable="false"
            preserveAspectRatio="none"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        >
            <defs>
                <filter
                    id={filterId}
                    filterUnits="userSpaceOnUse"
                    height={VIEWBOX_HEIGHT + 20}
                    width={VIEWBOX_WIDTH + 20}
                    x={-10}
                    y={-10}
                >
                    <feGaussianBlur stdDeviation="3" />
                </filter>
                <mask
                    id={maskId}
                    height={VIEWBOX_HEIGHT}
                    maskUnits="userSpaceOnUse"
                    width={VIEWBOX_WIDTH}
                    x="0"
                    y="0"
                >
                    <rect
                        fill="none"
                        height={PATH_HEIGHT}
                        rx={CENTERLINE_RADIUS}
                        ry={CENTERLINE_RADIUS}
                        stroke="#fff"
                        strokeWidth={STROKE_WIDTH}
                        width={PATH_WIDTH}
                        x={STROKE_WIDTH / 2}
                        y={STROKE_WIDTH / 2}
                    />
                </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
                <g
                    className="wallet-orbit-border__segments"
                    filter={`url(#${filterId})`}
                    style={GROUP_STYLE}
                >
                    {ORBIT_SEGMENTS.map((segment) => {
                        const style: OrbitSegmentStyle = {
                            '--wallet-orbit-start-offset': `${segment.startOffset}`,
                        }

                        return (
                            <rect
                                key={segment.key}
                                className="wallet-orbit-border__segment"
                                fill="none"
                                height={PATH_HEIGHT}
                                pathLength={PATH_PERIMETER}
                                rx={CENTERLINE_RADIUS}
                                ry={CENTERLINE_RADIUS}
                                stroke={segment.color}
                                strokeDasharray={`${dashLength} ${dashGap}`}
                                strokeDashoffset={segment.startOffset}
                                strokeLinecap="butt"
                                strokeWidth={SOURCE_STROKE_WIDTH}
                                style={style}
                                width={PATH_WIDTH}
                                x={STROKE_WIDTH / 2}
                                y={STROKE_WIDTH / 2}
                            />
                        )
                    })}
                </g>
            </g>
        </svg>
    )
}
