# Showcase router
演示路由。

This module owns routes for showcase pages and only exposes them while Vite is running in development mode.
该模块管理演示页面的路由，并且只在 Vite 开发环境中暴露这些路由。

Each page uses a lazy import inside the development-only branch, so production builds do not include its page module.
每个页面都在仅开发环境的分支内懒加载，因此生产构建不会包含对应页面模块。
