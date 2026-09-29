# Stores

Shared client state uses Zustand and is split by ownership. The blank template ships only `app` state for language/application concerns and `dapp` state for provider status, wallet address, chain ID and global contract loading.

共享客户端状态使用 Zustand，并按归属拆分。空白模板仅提供 `app`（语言和应用级状态）与 `dapp`（Provider、钱包地址、链 ID、全局合约 Loading）两个 store。

Add feature or user stores only when confirmed page and API contracts require cross-component state. Export stable stores from `src/stores/index.ts`, and use selectors in components so they subscribe only to required fields.

只有已确认的页面与接口契约确实需要跨组件状态时，才新增 feature 或 user store。稳定 store 从 `src/stores/index.ts` 导出；组件中使用 selector，只订阅所需字段。

```ts
import { useDappStore } from '@/stores'

const walletAddress = useDappStore((state) => state.walletAddress)
```

NodeXX 新增 auth store，由路由门槛、授权页与首页共同消费；详见 auth/README.md。
