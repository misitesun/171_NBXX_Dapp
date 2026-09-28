# Services
服务层。

This directory wraps access to external systems such as HTTP APIs, browser storage, uploads, platform runtime checks and wallet-related bridges.
这个目录封装 HTTP 接口、浏览器存储、上传、平台运行环境判断以及钱包相关桥接等外部系统访问。

Keep side effects here instead of scattering them across page components.
把副作用集中放在这里，避免散落到页面组件中。

Wallet and on-chain interaction helpers live in `dapp`.
钱包和链上交互能力放在 `dapp` 模块中。
