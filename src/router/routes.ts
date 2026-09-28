import { APP_HOME_ROUTE_NAME } from './config.ts'

export const ROUTE_PATH = {
    root: '/',
    home: `/${APP_HOME_ROUTE_NAME}` as const,
} as const

export type RoutePath = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH]
