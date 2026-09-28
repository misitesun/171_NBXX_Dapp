import type { RoutePath } from './routes.ts'

type AppRouteReplacer = (path: RoutePath) => void

let appRouteReplacer: AppRouteReplacer | undefined
let pendingRoutePath: RoutePath | undefined

export function registerAppRouteReplacer(replacer: AppRouteReplacer): () => void {
    appRouteReplacer = replacer

    if (pendingRoutePath) {
        const path = pendingRoutePath
        pendingRoutePath = undefined
        replacer(path)
    }

    return () => {
        if (appRouteReplacer === replacer) {
            appRouteReplacer = undefined
        }
    }
}

export function replaceAppRoute(path: RoutePath): void {
    if (appRouteReplacer) {
        appRouteReplacer(path)
        return
    }

    pendingRoutePath = path
}
