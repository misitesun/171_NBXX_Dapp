# Showcase
框架演示目录。

This directory contains presentation pages for demonstrating template capabilities, shared modules and reusable components.
这个目录用于放置展示模板能力、通用模块和可复用组件的介绍页面。

Showcase pages are not production business pages and must not be added to the normal application routes by default.
演示页面不属于正式业务页面，默认不要加入正常应用路由。

Routes are configured in `showcase/router` and are available only during development.
路由统一配置在 `showcase/router`，只在开发环境可用。

Keep the implementation close to the feature being demonstrated, for example `showcase/carousel` or `showcase/dapp`.
实现按演示主题就近放置，例如 `showcase/carousel` 或 `showcase/dapp`。
