import {
    APP_CONFIG,
    APP_LAYOUT_MENU_TYPE,
    APP_LAYOUT_MENU_TYPE_OPTIONS,
    type AppLayoutMenuType,
} from '../config/index.ts'

export const APP_ROUTE_BASE = APP_CONFIG.routeBase

// Browser route base without a trailing slash for AppBrowserRouter.
// 给 AppBrowserRouter 使用的浏览器路由前缀，不带结尾斜杠。
export const APP_ROUTER_BASENAME = APP_CONFIG.routerBasename

export const APP_HOME_ROUTE_NAME = APP_CONFIG.homeRouteName

export const LAYOUT_MENU_TYPE = APP_LAYOUT_MENU_TYPE

export const LAYOUT_MENU_TYPE_OPTIONS = APP_LAYOUT_MENU_TYPE_OPTIONS

export type LayoutMenuType = AppLayoutMenuType

export const DEFAULT_LAYOUT_MENU_TYPE = APP_CONFIG.defaultLayoutMenuType
