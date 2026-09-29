# NBXXNode NFT 购买契约

## 事实来源与范围

- ABI：开发者提供 `/Users/sly/Downloads/NBXXNode.json`，原样归档于 `docs/contracts/NBXXNode.json`；TypeScript ABI 与归档逐项一致。
- 开发者确认 USDT：`0x5FbDB2315678afecb367f032d93F642f64180aa3`。
- 开发者确认 NBXXNode：`0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`。
- 开发者确认初级 NFT 为 `buy(1)`、高级为 `buy(2)`，USDT 授权 spender 为 NBXXNode，购买金额使用对应 `PRICE_TYPE_1/2` 的原始整数。
- 开发者要求沿用已有本地网络，完成代码后由开发者测试。项目现有开发链配置为 `DAPP_LOCAL_CHAIN`（chainId `31337`，原生币 GO），调用使用钱包注入 Provider。截图仅能证明钱包有名为“本地”的网络，不能证明部署或交易结果。
- 仅实现购买。未接管理、升级、领取、收益、转账等合约操作；价格以外的供应量/权益仍为页面设计配置。

## ABI 与调用

| 方法 | 参数/返回 | 使用方式 |
| --- | --- | --- |
| `PRICE_TYPE_1()` | `uint256` | 初级价格，保留 bigint |
| `PRICE_TYPE_2()` | `uint256` | 高级价格，保留 bigint |
| `usdt()` | `address` | 校验合约实际支付代币与 env 一致 |
| `hasPurchased(address user)` | `bool purchased` | 显式查询指定钱包是否已购买；不依赖 `msg.sender` |
| `buy(uint8 nodeType)` | 返回 `uint256 nftId`，nonpayable | 参数为 1/2，无数量参数，无原生币 value |

价格与支付代币 getter 是公共配置读取，不传 account。`hasPurchased(user)` 以 ABI 参数明确指定待查询地址，同样不传 `account`；页面传入当前连接且与登录会话一致的钱包地址。USDT 的 `decimals()` 在链上读取，不假设 18；只用于显示。余额和额度读取显式传入登录钱包 owner。价格原始 bigint 用于余额/授权比较，不从 UI 字符串反算扣款。

交易收据不会直接提供 Solidity 的 `nftId` 返回值。当前页面只需确认成功，复用共享写入封装等待成功 receipt，不伪造 NFT ID，也不解析未使用的 `NodePurchased` 日志。

## 运行流程

1. 登录首页读取价格/支付代币/USDT 精度，并调用 `hasPurchased(当前钱包地址)`。价格或购买状态未读取成功时禁止购买并提供重试；已购买时按钮显示“已购买”并禁用。
2. 点击初级或高级购买，立即开启同步锁和公共 ContractLoading，禁用购买/等级切换/下拉刷新。
3. 校验钱包地址仍属于当前登录会话，且 chainId 与项目当前链一致；不自动切换用户已配置的本地网络。
4. 重新读取实际价格和支付代币，再次查询 `hasPurchased(owner)`；若已购买则终止，不继续读取余额/额度或发送交易。未购买时检查 USDT 余额。
5. 读取授权额度；不足时复用 `getErc20ApproveAmount` 和 `writeErc20Approve`，当前已确认初始化策略为最大授权。等待授权成功回执后再次校验会话/钱包/网络。
6. 调用 `buy(1/2)` 并等待成功回执。拒签以取消提示处理；回退/余额不足/网络错误有失败提示。
7. 成功反馈后等待共享链上同步间隔（当前 3 秒），再刷新我的信息、直推列表和价格。刷新失败不会把成功购买改报为购买失败；会话已变化则忽略旧页面反馈和刷新。

## 配置与测试入口

- `.env.development` 已配置本次 USDT/NBXXNode 地址。`VITE_RPC_URL` 沿用现有值；已有钱包本地网络直接通过 Provider 请求，不另建 HTTP public client。
- `.env.production` 的 API/RPC 保持为空；当前没有确认生产部署地址，生产 USDT/NBXXNode 地址也保留为空。
- 钱包应选择项目当前本地链（现有代码 chainId `31337`），准备足够 USDT 与原生币 Gas，登录后选择等级购买。授权不足会出现授权和购买两次钱包确认，额度充足只需购买确认。
- 开发者手动验证：初级/高级参数、已购买地址按钮禁用与交易前守卫、授权 spender/金额、拒签、链上回退、账户切换、重复点击、购买成功后信息刷新。
- 本地 mock 测试覆盖 ABI 一致、raw bigint/精度、等级映射、最大授权/跳过授权、余额不足、错误网络/代币、会话切换、重复写入与失败回执。真实部署及钱包交易由开发者验收。

## 本次验证记录

- `pnpm exec node --test tests/nbxx-contract.test.mjs tests/nbxx-purchase.test.mjs tests/home-page.test.mjs`：15/15 通过。
- 浏览器 `/h5/tests/nbxx-purchase-harness.html`：4/4 通过，确认价格绑定、重复购买守卫/加载、成功交易与失败刷新分离、拒签不刷新。所有 RPC/回执均为本地 fixture，没有真实交易。
- `pnpm lint`、`pnpm exec tsc -b`、`git diff --check`：通过。
- 最新完整 `pnpm test`：255/256 通过；唯一失败为已有 Empty 样式宽度 160px 与测试预期 204px 不一致。本次未改动该样式。
- `pnpm build` 在 prebuild 验证阶段失败，未产出通过生产门禁的构建；另行执行品牌检查确认初始化 Logo 仍未就绪，需正式打包前补齐。
- 使用 `dapp-change-review` 检查当前购买范围：等级参数和原始金额正确、公共 getter 未注入 account、用户余额/额度明确 owner、授权与 buy 等待回执、成功与刷新错误独立、无新增依赖/通用钱包逻辑改动。真实钱包交易待开发者验收。
