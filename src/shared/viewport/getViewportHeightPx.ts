import {
    calculateViewportPx,
    type ViewportPixelValue,
} from './calculateViewportPx.ts'

export function getViewportHeightPx(
    designPx: ViewportPixelValue,
    designHeight: ViewportPixelValue,
): number {
    const viewportHeight = typeof window === 'undefined'
        ? Number(designHeight)
        : window.innerHeight

    return calculateViewportPx(designPx, designHeight, viewportHeight)
}
