import { useLayoutEffect, useRef } from 'react'

import { getMenuV2Frame, MENU_V2_DURATION_MS, type MenuV2Line } from './menuV2Motion.ts'
import './MenuToggleIcon.scss'

type MenuToggleIconProps = {
    open: boolean
}

function drawLine(element: SVGLineElement, line: MenuV2Line) {
    element.setAttribute('x1', String(line.x1))
    element.setAttribute('y1', String(line.y1))
    element.setAttribute('x2', String(line.x2))
    element.setAttribute('y2', String(line.y2))
    element.setAttribute('opacity', String(line.opacity))
}

export function MenuToggleIcon({ open }: MenuToggleIconProps) {
    const topRef = useRef<SVGLineElement>(null)
    const centerRef = useRef<SVGLineElement>(null)
    const bottomRef = useRef<SVGLineElement>(null)
    const progressRef = useRef(open ? MENU_V2_DURATION_MS : 0)
    const initialFrameRef = useRef(getMenuV2Frame(progressRef.current))
    const initialFrame = initialFrameRef.current

    useLayoutEffect(() => {
        const top = topRef.current
        const center = centerRef.current
        const bottom = bottomRef.current
        if (!top || !center || !bottom) return

        const draw = () => {
            const frame = getMenuV2Frame(progressRef.current)
            drawLine(top, frame.top)
            drawLine(center, frame.center)
            drawLine(bottom, frame.bottom)
        }

        const target = open ? MENU_V2_DURATION_MS : 0
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            progressRef.current = target
            draw()
            return
        }

        draw()
        if (progressRef.current === target) return

        let lastTime = performance.now()
        let frameId = 0
        const tick = (now: number) => {
            const direction = open ? 1 : -1
            progressRef.current = Math.max(0, Math.min(MENU_V2_DURATION_MS,
                progressRef.current + direction * (now - lastTime)))
            lastTime = now
            draw()
            if (progressRef.current !== target) frameId = requestAnimationFrame(tick)
        }

        frameId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frameId)
    }, [open])

    return (
        <svg
            className="menu-toggle-icon"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <line ref={topRef} x1={initialFrame.top.x1} y1={initialFrame.top.y1} x2={initialFrame.top.x2} y2={initialFrame.top.y2} />
            <line ref={centerRef} x1={initialFrame.center.x1} y1={initialFrame.center.y1} x2={initialFrame.center.x2} y2={initialFrame.center.y2} />
            <line ref={bottomRef} x1={initialFrame.bottom.x1} y1={initialFrame.bottom.y1} x2={initialFrame.bottom.x2} y2={initialFrame.bottom.y2} opacity={initialFrame.bottom.opacity} />
        </svg>
    )
}
