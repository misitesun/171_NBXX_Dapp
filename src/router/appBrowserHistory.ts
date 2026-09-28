import {
    UNSAFE_createBrowserHistory as createBrowserHistory,
    createPath,
    parsePath,
    type Location,
    type Path,
    type To,
} from 'react-router'

import { APP_ROUTER_BASENAME } from './config.ts'

type AppBrowserHistoryOptions = {
    window?: Window
}

export type AppBrowserHistory = ReturnType<typeof createBrowserHistory>

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

function normalizePathname(pathname = '/'): string {
    if (!pathname) {
        return '/'
    }

    return pathname.startsWith('/') ? pathname : `/${pathname}`
}

function normalizeBasename(basename = APP_ROUTER_BASENAME): string {
    const path = normalizePathname(basename.trim())

    if (path === '/') {
        return ''
    }

    return path.endsWith('/') ? path.slice(0, -1) : path
}

export function stripAppBasenameFromPathname(
    pathname: string,
    basename = APP_ROUTER_BASENAME,
): string {
    const base = normalizeBasename(basename)
    const path = normalizePathname(pathname)

    if (!base) {
        return path
    }

    const lowerPath = path.toLowerCase()
    const lowerBase = base.toLowerCase()

    if (lowerPath === lowerBase) {
        return '/'
    }

    if (lowerPath.startsWith(`${lowerBase}/`)) {
        return path.slice(base.length) || '/'
    }

    return path
}

export function addAppBasenameToPathname(
    pathname: string,
    basename = APP_ROUTER_BASENAME,
): string {
    const base = normalizeBasename(basename)
    const path = normalizePathname(pathname)

    if (!base) {
        return path
    }

    const lowerPath = path.toLowerCase()
    const lowerBase = base.toLowerCase()

    if (lowerPath === lowerBase || lowerPath.startsWith(`${lowerBase}/`)) {
        return path
    }

    if (path === '/') {
        return `${base}/`
    }

    return `${base}${path}`
}

export function stripAppBasenameFromLocation(
    location: Location,
    basename = APP_ROUTER_BASENAME,
): Location {
    const nextLocation: Location = {
        ...location,
        pathname: stripAppBasenameFromPathname(location.pathname, basename),
    }

    if (location.mask) {
        nextLocation.mask = {
            ...location.mask,
            pathname: stripAppBasenameFromPathname(location.mask.pathname, basename),
        }
    }

    return nextLocation
}

function stripAppBasenameFromPath(
    path: Path,
    basename = APP_ROUTER_BASENAME,
): Path {
    return {
        ...path,
        pathname: stripAppBasenameFromPathname(path.pathname, basename),
    }
}

function addAppBasenameToRoute(
    to: To,
    basename = APP_ROUTER_BASENAME,
): To {
    if (typeof to !== 'string') {
        if (!to.pathname) {
            return to
        }

        return {
            ...to,
            pathname: addAppBasenameToPathname(to.pathname, basename),
        }
    }

    if (!to || to.startsWith('?') || to.startsWith('#') || ABSOLUTE_URL_PATTERN.test(to)) {
        return to
    }

    const path = parsePath(to)

    if (!path.pathname) {
        return to
    }

    return createPath({
        ...path,
        pathname: addAppBasenameToPathname(path.pathname, basename),
    })
}

export function createAppBrowserHistory(
    options: AppBrowserHistoryOptions = {},
): AppBrowserHistory {
    const history = createBrowserHistory({
        window: options.window,
        v5Compat: true,
    })

    const appHistory: AppBrowserHistory = {
        get action() {
            return history.action
        },

        get location() {
            return stripAppBasenameFromLocation(history.location)
        },

        createHref(to) {
            return history.createHref(addAppBasenameToRoute(to))
        },

        createURL(to) {
            return history.createURL(addAppBasenameToRoute(to))
        },

        encodeLocation(to) {
            return stripAppBasenameFromPath(history.encodeLocation(to))
        },

        push(to, state) {
            history.push(addAppBasenameToRoute(to), state)
        },

        replace(to, state) {
            history.replace(addAppBasenameToRoute(to), state)
        },

        go(delta) {
            history.go(delta)
        },

        listen(listener) {
            return history.listen((update) => {
                listener({
                    ...update,
                    location: stripAppBasenameFromLocation(update.location),
                })
            })
        },
    }

    return appHistory
}
