import {
    calculateViewportPx,
    type ViewportPixelValue,
} from './calculateViewportPx.ts'

export function getViewportWidthPx(
    designPx: ViewportPixelValue,
    designWidth: ViewportPixelValue = 750,
): number {
    const viewportWidth = typeof window === 'undefined'
        ? Number(designWidth)
        : window.innerWidth

    return calculateViewportPx(designPx, designWidth, viewportWidth)
}
