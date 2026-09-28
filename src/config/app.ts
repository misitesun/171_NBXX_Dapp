export const APP_LAYOUT_MENU_TYPE = {
    tabbar: 'tabbar',
    sidebar: 'sidebar',
} as const

export type AppLayoutMenuType =
    (typeof APP_LAYOUT_MENU_TYPE)[keyof typeof APP_LAYOUT_MENU_TYPE]

export const APP_LOGIN_MODE = {
    hybrid: 'hybrid',
    dapp: 'dapp',
    account: 'account',
} as const

export type AppLoginMode =
    (typeof APP_LOGIN_MODE)[keyof typeof APP_LOGIN_MODE]

export const APP_HOME_ROUTE_NAME = 'home'

// Project-level layout menu mode options. Choose exactly one mode for a project.
// 项目级 layout 菜单模式选项，一个项目只能选择其中一种。
export const APP_LAYOUT_MENU_TYPE_OPTIONS = [
    APP_LAYOUT_MENU_TYPE.tabbar,
    APP_LAYOUT_MENU_TYPE.sidebar,
] as const

// Project-level login mode. Choose exactly one mode for a project.
// 项目级登录模式，一个项目只能选择其中一种。
export const APP_LOGIN_MODE_OPTIONS = [
    APP_LOGIN_MODE.hybrid,
    APP_LOGIN_MODE.dapp,
    APP_LOGIN_MODE.account,
] as const

export const APP_CONFIG = {
    name: import.meta.env?.VITE_APP_NAME ?? '',
    routeBase: '/h5/',
    routerBasename: '/h5',

    // Special home route name used by app-wide navigation logic.
    // 首页路由名称，给全局跳首页等逻辑统一使用。
    homeRouteName: APP_HOME_ROUTE_NAME,

    // Project-level layout menu mode. `tabbar` and `sidebar` are mutually exclusive.
    // 项目级 layout 菜单模式，`tabbar` 和 `sidebar` 是互斥关系。
    defaultLayoutMenuType: APP_LAYOUT_MENU_TYPE.sidebar,

    // `dapp` only allows wallet login, `hybrid` allows wallet and account login, and `account` only allows account login.
    // `dapp` 仅支持钱包登录，`hybrid` 同时支持钱包和账号登录，`account` 仅支持账号登录。
    loginMode: APP_LOGIN_MODE.dapp as AppLoginMode,

    // Whether the project exposes language switching and sends the `lang` request header.
    // 项目是否开放语言切换并发送 `lang` 请求头。
    enableI18n: true as boolean,

    defaultLanguageCode: import.meta.env?.PROD ? 'en' : 'zh-Hans',
} as const
