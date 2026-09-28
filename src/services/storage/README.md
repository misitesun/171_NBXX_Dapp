# Storage service

This module centralizes SSR-safe local storage access. The base template owns only business-neutral keys: wallet address, optional auth token and language.

本模块集中提供兼容 SSR 的本地存储访问。基础模板只维护与业务无关的键：钱包地址、可选鉴权 Token 和语言。

```ts
STORAGE_KEY.walletAddress // WALLET_ADDRESS
STORAGE_KEY.token         // TOKEN
STORAGE_KEY.language      // LANG
```

Use semantic methods from `src/services/storage/index.ts`; do not access `window.localStorage` directly in pages, features or stores. Read failures return defaults, and write/remove failures do not interrupt the UI in private browsing or restricted WebViews.

页面、feature 和 store 应使用 `src/services/storage/index.ts` 的语义方法，不直接访问 `window.localStorage`。隐私模式或受限 WebView 中读取失败会返回默认值，写入或删除失败不会中断 UI。

Project-specific referral, login-account, preference or cache keys should be added only after their owner and lifecycle are documented.

邀请、登录账号、偏好或缓存等项目专属键，只有归属与生命周期明确后才可添加。

If a real project uses referral links and must retain a code while switching addresses in one wallet app, use this module's safe `localStorage` helpers for a project-owned key. A non-empty code on the current link takes priority and replaces the saved value; without one, login reads the saved value. Successful login, account changes and Token invalidation do not automatically remove it. The project authentication document defines the key and any explicit removal policy; the template has no referral key.
若真实项目使用邀请链接，并需要在同一钱包 App 切换地址后继续使用邀请码，应通过本模块的安全 `localStorage` 读写方法保存项目专属键：当前链接的非空邀请码优先并覆盖保存值，链接没有邀请码时读取保存值；登录成功、账号切换和 Token 失效不自动删除。具体键名和显式清理时机由项目鉴权文档确定，模板本身不预置邀请码键。
