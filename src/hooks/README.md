# Hooks
自定义 Hooks。

This directory stores reusable React hooks that can be shared by multiple pages or feature modules.
这个目录存放可被多个页面或业务模块复用的 React 自定义 Hooks。

Prefer clear names such as `useWalletStatus` or `usePageVisible` instead of generic names.
优先使用 `useWalletStatus` 或 `usePageVisible` 这类明确名称，不要使用过于泛的名字。

`useLatestRequest()` protects page data from old async requests writing back after a newer refresh has started.
`useLatestRequest()` 用于避免旧异步请求在新刷新之后回写页面数据。
