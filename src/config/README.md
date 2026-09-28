# Config
全局配置。

Project-level startup configuration lives here, such as the app name, route base path, default layout menu type and default language.
项目级初始化配置放在这里，例如应用名称、路由基础路径、默认 layout 菜单类型和默认语言。

`defaultLayoutMenuType` is a project-level single-choice menu mode. Use `tabbar` for bottom navigation or `sidebar` for side navigation, but do not use both in the same project.
`defaultLayoutMenuType` 是项目级单选菜单模式。`tabbar` 表示底部导航，`sidebar` 表示侧边栏导航，同一个项目不要同时使用两种。

The app name is read from `VITE_APP_NAME`, so HTML metadata and TypeScript configuration use the same source.
应用名称读取 `VITE_APP_NAME`，这样 HTML 元信息和 TypeScript 配置使用同一个来源。

`loginMode` records the authentication mode selected during project setup: `dapp` means wallet authentication, `hybrid` means wallet plus account/password authentication, and `account` means account/password authentication only. The blank template defaults to `dapp`, but it does not implement an authentication flow until the real API contract is confirmed.
`loginMode` 记录项目初始化时选择的认证模式：`dapp` 表示钱包认证，`hybrid` 表示钱包与账号密码认证并存，`account` 表示仅账号密码认证。空白模板默认值为 `dapp`，但在真实接口契约确认前不会实现认证流程。

`enableI18n` controls both language switching and the request `lang` header. It defaults to `true`; development defaults to `zh-Hans`, and production defaults to `en`. When set to `false`, the application is fixed to `zh-Hans`, and shared components can continue calling `t()` without extra conditions.
`enableI18n` 同时控制语言切换和请求 `lang` 头，默认值为 `true`；开发环境默认 `zh-Hans`，生产环境默认 `en`。设为 `false` 时，应用固定使用 `zh-Hans`，公共组件仍可直接调用 `t()`，无需增加额外判断。

Module-specific protocol configuration should stay inside its own module, such as `HTTP_HEADER`, `STORAGE_KEY` and i18n resource lists.
模块内部协议配置应继续留在模块内，例如 `HTTP_HEADER`、`STORAGE_KEY` 和多语言资源列表。

Template defaults are starter values, not confirmed project decisions. Record real choices in `PROJECT_SETUP_STATUS.md` during setup.
模板默认值只是启动值，不代表真实项目已确认。初始化时应把实际选择记录到 `PROJECT_SETUP_STATUS.md`。
