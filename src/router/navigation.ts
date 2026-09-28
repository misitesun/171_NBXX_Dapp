import type { NavigateFunction, NavigateOptions, To } from 'react-router'

import { APP_ROUTE_BASE } from './config.ts'

export type RouteQueryValue =
    | string
    | number
    | boolean
    | null
    | undefined

export type RouteQuery = Record<string, RouteQueryValue | readonly RouteQueryValue[]>

export type BuildRoutePathOptions = {
    query?: RouteQuery
    hash?: string
}

export type AppRouteNavigateOptions = NavigateOptions & BuildRoutePathOptions

export type AppRouteNavigator = {
    pushRoute: (to: To, options?: AppRouteNavigateOptions) => void
    replaceRoute: (to: To, options?: AppRouteNavigateOptions) => void
    goRoute: (delta: number) => void
    backRoute: (step?: number) => void
    forwardRoute: (step?: number) => void
}

type RouteStringParts = {
    pathname: string
    search: string
    hash: string
}

function splitRouteString(path: string): RouteStringParts {
    const hashIndex = path.indexOf('#')
    const pathAndSearch = hashIndex >= 0 ? path.slice(0, hashIndex) : path
    const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
    const searchIndex = pathAndSearch.indexOf('?')

    if (searchIndex < 0) {
        return {
            pathname: pathAndSearch,
            search: '',
            hash,
        }
    }

    return {
        pathname: pathAndSearch.slice(0, searchIndex),
        search: pathAndSearch.slice(searchIndex),
        hash,
    }
}

function normalizeHash(hash = ''): string {
    if (!hash) {
        return ''
    }

    return hash.startsWith('#') ? hash : `#${hash}`
}

function appendQueryValue(
    params: URLSearchParams,
    key: string,
    value: RouteQueryValue | readonly RouteQueryValue[],
): void {
    if (Array.isArray(value)) {
        value.forEach((item) => appendQueryValue(params, key, item))
        return
    }

    if (value === null || value === undefined) {
        return
    }

    params.append(key, String(value))
}

function mergeSearch(search = '', query?: RouteQuery): string {
    const params = new URLSearchParams(search.startsWith('?')
        ? search.slice(1)
        : search)

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            appendQueryValue(params, key, value)
        })
    }

    const nextSearch = params.toString()
    return nextSearch ? `?${nextSearch}` : ''
}

function normalizeHistoryStep(step: number | undefined): number {
    if (!step || !Number.isFinite(step)) {
        return 1
    }

    return Math.abs(Math.trunc(step))
}

function splitRouteOptions(options: AppRouteNavigateOptions = {}): {
    routeOptions: BuildRoutePathOptions
    navigateOptions: NavigateOptions
} {
    const { query, hash, ...navigateOptions } = options

    return {
        routeOptions: { query, hash },
        navigateOptions,
    }
}

export function buildRoutePath(
    to: To,
    options: BuildRoutePathOptions = {},
): To {
    if (typeof to !== 'string') {
        return {
            ...to,
            search: mergeSearch(to.search, options.query),
            hash: options.hash === undefined
                ? normalizeHash(to.hash)
                : normalizeHash(options.hash),
        }
    }

    const parts = splitRouteString(to)

    return [
        parts.pathname,
        mergeSearch(parts.search, options.query),
        options.hash === undefined
            ? normalizeHash(parts.hash)
            : normalizeHash(options.hash),
    ].join('')
}

export function buildRouteHref(
    path: string,
    options: BuildRoutePathOptions = {},
): string {
    const routePath = buildRoutePath(path, options)

    if (typeof routePath !== 'string') {
        return APP_ROUTE_BASE
    }

    const route = routePath.startsWith('/') ? routePath : `/${routePath}`
    const base = APP_ROUTE_BASE.endsWith('/')
        ? APP_ROUTE_BASE.slice(0, -1)
        : APP_ROUTE_BASE

    return `${base}${route}`
}

export function createRouteNavigator(
    navigate: NavigateFunction,
): AppRouteNavigator {
    return {
        pushRoute(to, options) {
            const { routeOptions, navigateOptions } = splitRouteOptions(options)
            void navigate(buildRoutePath(to, routeOptions), navigateOptions)
        },

        replaceRoute(to, options) {
            const { routeOptions, navigateOptions } = splitRouteOptions(options)
            void navigate(buildRoutePath(to, routeOptions), {
                ...navigateOptions,
                replace: true,
            })
        },

        goRoute(delta) {
            void navigate(delta)
        },

        backRoute(step) {
            void navigate(-normalizeHistoryStep(step))
        },

        forwardRoute(step) {
            void navigate(normalizeHistoryStep(step))
        },
    }
}
