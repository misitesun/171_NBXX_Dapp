export const MENU_V2_DURATION_MS = 250

export type MenuV2Line = {
    x1: number
    y1: number
    x2: number
    y2: number
    opacity: number
}

export type MenuV2Frame = {
    top: MenuV2Line
    center: MenuV2Line
    bottom: MenuV2Line
}

// Positions and easing come from the downloaded menuV2.json (60 source frames).
// The source motion is compressed to the Popup's 250ms entrance/exit duration.
// The 1.5 scale keeps its artwork at the established 40px header-icon size.
const ART_SCALE = 1.5
const CENTER = 16

function cubicBezier(progress: number, x1: number, y1: number, x2: number, y2: number) {
    if (progress <= 0) return 0
    if (progress >= 1) return 1

    let low = 0
    let high = 1

    for (let index = 0; index < 20; index += 1) {
        const t = (low + high) / 2
        const inverse = 1 - t
        const x = 3 * inverse * inverse * t * x1 + 3 * inverse * t * t * x2 + t * t * t
        if (x < progress) low = t
        else high = t
    }

    const t = (low + high) / 2
    const inverse = 1 - t
    return 3 * inverse * inverse * t * y1 + 3 * inverse * t * t * y2 + t * t * t
}

function lineAt(centerY: number, angleDegrees: number, opacity = 1): MenuV2Line {
    const angle = angleDegrees * Math.PI / 180
    const cosine = Math.cos(angle)
    const sine = Math.sin(angle)
    const firstX = 6 * cosine + 6 * sine
    const firstY = 6 * sine - 6 * cosine

    return {
        x1: CENTER + firstX * ART_SCALE,
        y1: CENTER + (centerY - CENTER + firstY) * ART_SCALE,
        x2: CENTER - firstX * ART_SCALE,
        y2: CENTER + (centerY - CENTER - firstY) * ART_SCALE,
        opacity,
    }
}

export function getMenuV2Frame(elapsedMs: number): MenuV2Frame {
    const frame = Math.max(0, Math.min(60, elapsedMs * 60 / MENU_V2_DURATION_MS))
    const converge = cubicBezier(Math.min(frame / 10, 1), .757, 0, .833, 1)
    const spinProgress = Math.max(0, Math.min((frame - 10) / 35, 1))
    const topAngle = 45 + 315 * cubicBezier(spinProgress, .333, 0, .202, 1.082)
    const centerAngle = 45 + 225 * cubicBezier(spinProgress, .333, 0, .202, 1.114)
    const bottomOpacity = frame <= 9
        ? 1
        : 1 - cubicBezier(Math.min(frame - 9, 1), .333, 0, .667, 1)

    return {
        top: lineAt(10 + 6 * converge, topAngle),
        center: lineAt(16, centerAngle),
        bottom: lineAt(22 - 6 * converge, 45, bottomOpacity),
    }
}
