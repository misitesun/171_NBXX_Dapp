# NFT purchase

依据 `docs/contracts/nbxx-node-purchase.md`，封装已确认的初级/高级 NFT 购买流程。

- `index.ts`：等级映射、链上价格、钱包/网络校验、`hasPurchased(user)` 购买状态检查、余额及授权检查、购买成功回执；已购买地址在交易前再次校验并拒绝重复购买，原始金额保持 bigint。
- `useNftPurchase.ts`：价格和购买状态加载/重试、同步提交锁、公共加载状态、拒签与错误提示、成功后独立刷新边界。购买状态未知或读取失败时由首页禁用购买，失败状态可重试。
- ABI 与项目地址位于 `src/services/contracts`；钱包、ERC20、Gas、回执等待继续复用 `src/services/dapp`。

首页消费该 feature；showcase 保持静态展示。交易使用当前注入的钱包和项目既有链配置。仅购买，没有收益、领取或管理操作。

验证：`pnpm exec node --test tests/nbxx-contract.test.mjs tests/nbxx-purchase.test.mjs tests/home-page.test.mjs`、`pnpm lint`、`pnpm exec tsc -b`。实际钱包交易由开发者测试。
