# DApp services
DApp 服务。

This module contains the wallet and on-chain interaction layer for mobile H5 DApp projects.
这个模块用于移动端 H5 DApp 项目的钱包和链上交互。

The first version focuses on basic wallet capabilities and does not include login or business authentication flows.
第一版只聚焦钱包基础能力，不包含登录或业务认证流程。

This generic module must remain free of real-project ABI bodies, deployed addresses, PHP field names, wallet-authentication protocols, and business transaction sequences. Put those facts in `src/services/contracts` and the relevant feature after reading `docs/dapp-project-integration.md`.
该通用模块必须保持不含真实项目 ABI 内容、部署地址、PHP 字段名、钱包鉴权协议和业务交易顺序。这些事实应在阅读 `docs/dapp-project-integration.md` 后放入 `src/services/contracts` 与对应 feature。

The generic signing helper is only a wallet capability. Its message shape, timestamp/nonce semantics, endpoint, and server verification remain project facts and must follow the current PHP contract.
通用签名辅助方法只是钱包能力。它的消息结构、时间戳/nonce 语义、接口和服务端校验仍属于项目事实，必须遵循当前 PHP 契约。

The normal initialization flow is wallet environment check, chain check, then feature calls.

`getDappUserRejectionMessage()` follows viem `cause` wrappers and recognizes only provider code `4001`. It returns the provider message, an empty string when that message is absent, or `undefined` for other failures. A page can use neutral cancellation feedback while retaining its normal error path.
钱包拒签识别沿 viem 的 `cause` 链查找 `4001`，返回钱包原始消息；消息缺失时返回空字符串，其他错误返回 `undefined`。页面据此显示普通取消提示，并保留其他错误的原有处理。
正常初始化流程是先检查钱包环境，再检查网络，最后再执行具体功能调用。

`initializeDappWallet()` does not bind account or chain listeners by default. Authentication flows should bind them only after an authenticated DApp session exists.
`initializeDappWallet()` 默认不绑定账户和网络监听。认证流程应仅在 DApp 登录态建立后绑定监听。

Development mode skips chain switching by default, because local projects often connect to a LAN test RPC.
开发环境默认跳过强制切链，因为本地项目通常会连接局域网测试 RPC。

Production mode uses `DAPP_PRODUCTION_CHAIN` from `config.ts` and forces the wallet to switch to that chain.
生产环境使用 `config.ts` 中的 `DAPP_PRODUCTION_CHAIN`，并强制钱包切换到该链。

Use a viem chain preset such as `bsc` for standard networks. Use `defineChain` in `config.ts` only for custom or private networks.
标准网络使用 viem 的链预设，例如 `bsc`。只有自定义链或私链才在 `config.ts` 中使用 `defineChain` 配置。

If the wallet does not know the chain, the module adds the chain first and then switches to it.
如果钱包里没有这条链，模块会先添加链，再切换到这条链。

## Design rules
## 设计规则

Use `viem` as the only chain interaction library.
统一使用 `viem` 作为链交互库。

The generic viem overload adapters in `contract.ts` and `batch.ts` are the only allowed `any` compatibility boundary. Keep that exception local, document its reason, and never expose it to pages or business features.
`contract.ts` 与 `batch.ts` 中适配 viem 泛型重载的代码是唯一允许使用 `any` 的兼容边界。该例外必须局限在本地、说明原因，且不得暴露给页面或业务功能。

Do not introduce `ethers` or AppKit into the base template.
基础模板不引入 `ethers` 或 AppKit。

Wallet operations must use the injected `window.ethereum` provider.
钱包操作必须使用注入的 `window.ethereum` provider。

Provider detection can wait up to five seconds for a delayed injected wallet object through `@metamask/detect-provider`. The calling flow chooses whether to wait; a Flutter host can also pre-set `window.__EXPECT_DAPP_PROVIDER__ = true` to explicitly request this wait.
Provider 检测可通过 `@metamask/detect-provider` 最多等待五秒以兼容延迟注入的钱包对象。是否等待由调用流程决定；Flutter 宿主也可以预先设置 `window.__EXPECT_DAPP_PROVIDER__ = true` 来明确要求等待。

Provider detection is a low-level capability. A real project decides whether to retry, show a wallet prompt, or offer another login method after its authentication contract is confirmed.
Provider 检测只是底层能力。真实项目应在鉴权契约确认后，自行决定重试、显示钱包提示或提供其他登录方式。

Do not create an HTTP public client for wallet flows.
钱包流程不要创建 HTTP public client。

This avoids slow or hanging operations observed in TP Wallet App when using an online public client.
这样可以规避 TP 钱包 App 内使用在线 public client 时操作很慢或几乎等不到成功的问题。

The wallet client is created with `createWalletClient`, `custom(provider)` and `publicActions`.
钱包客户端通过 `createWalletClient`、`custom(provider)` 和 `publicActions` 创建。

Gas balance check is controlled by `DAPP_CONFIG.enableGasCheck`.
Gas 余额检查由 `DAPP_CONFIG.enableGasCheck` 控制。

Gas balance check is disabled by default.
Gas 余额检查默认关闭。

Contract writes call the shared gas checker before sending transactions.
写合约方法在发送交易前都会先调用统一 Gas 检查。

Frontend gas estimation and gas submission is controlled by `DAPP_CONFIG.enableGasEstimate`.
前端是否估算并提交 gas 由 `DAPP_CONFIG.enableGasEstimate` 控制。

Frontend gas estimation and gas submission are disabled by default.
前端 gas 估算和 gas 参数提交默认关闭。

Development mode always skips frontend gas estimation and gas submission.
开发环境始终跳过前端 gas 估算和 gas 提交。

Production mode follows `DAPP_CONFIG.enableGasEstimate`.
生产环境按 `DAPP_CONFIG.enableGasEstimate` 判断。

EIP-7702/EIP-5792 helpers are passive wrappers.
EIP-7702/EIP-5792 是被动封装。

They do nothing unless business code calls them.
业务代码不调用时不会生效。

Call `detectDappEip7702Support()` before using batch calls in a real page.
真实页面使用批量调用前，先调用 `detectDappEip7702Support()` 做能力判断。

ERC20 insufficient allowance approval is controlled by `DAPP_CONFIG.enableErc20MaxApprove`.
ERC20 授权额度不足时的授权金额由 `DAPP_CONFIG.enableErc20MaxApprove` 控制。

When enabled, `ensureErc20Allowance()` approves the max amount.
开启时，`ensureErc20Allowance()` 会授权最大额度。

This is enabled by default, so insufficient allowance approves the maximum amount by default.
该项默认开启，因此授权不足时默认授权最大上限。

When disabled, it only approves the passed specific amount.
关闭时，只授权传入的具体数值。

Swap router ABIs and all other protocol-specific contracts belong in `src/services/contracts` after their exact version and address are confirmed.
Swap Router ABI 与其他协议专用合约都应在版本和地址确认后放入 `src/services/contracts`。

Do not omit `account` only because a contract call is a `view` / `pure` read.
不要只因为合约调用是 `view` / `pure` 读取就省略 `account`。

For reads without a `user`, `owner` or `account` parameter, check whether the return value belongs to the current user's assets, orders, rewards, claim eligibility or permissions.
对于没有 `user`、`owner` 或 `account` 参数的读取，要检查返回值是否属于当前用户资产、订单、收益、领取资格或权限。

If the contract uses `msg.sender`, or may depend on `msg.sender` for identity, permission or delegated-account context, pass the connected wallet address with `readContract({ ..., account: connectedAddress })`.
如果合约使用 `msg.sender`，或可能依赖 `msg.sender` 判断身份、权限或委托账户上下文，就用 `readContract({ ..., account: connectedAddress })` 传入当前连接钱包地址。

`readDappContract` only exposes optional `account`; business wrappers decide when to pass it.
`readDappContract` 只暴露可选 `account`，由业务封装决定何时传入。

Do not force-inject the wallet address into every read. Global config, public market data, public行情 and Token metadata stay account-free.
不要把钱包地址强制注入所有读取。全局配置、公共行情、Token 元数据继续不传 `account`。

This matters for EIP-7702 delegated accounts because missing `account` / `from` in `eth_call` may run under an empty-address context and revert.
这对 EIP-7702 委托账户尤其重要，因为 `eth_call` 缺少 `account` / `from` 时可能以空地址上下文执行并回退。

New user-context reads need regression tests for business address passing, wrapper forwarding to viem `readContract`, and public reads without `account`.
新增依赖用户上下文的读取需要补回归测试，覆盖业务层传地址、封装层透传给 viem `readContract`，以及公共读取不传 `account`。

After a successful contract write, call `waitForDappContractDataSync()` before refreshing API data that depends on chain indexing.
写合约成功后，如果要刷新依赖链上索引的接口数据，先调用 `waitForDappContractDataSync()`。

The wait duration is controlled by `DAPP_CONFIG.contractWriteRefreshDelayMs`.
等待时长由 `DAPP_CONFIG.contractWriteRefreshDelayMs` 控制。

DApp amount unit conversion is controlled by `DAPP_CONFIG.amountDecimals`.
DApp 金额单位转换由 `DAPP_CONFIG.amountDecimals` 控制。

The default Token decimals value is 18.
Token 精度默认值为 18。

For networks or assets with other decimals, set `DAPP_CONFIG.amountDecimals` to the confirmed project value.
如果项目使用其他精度的网络或资产，把 `DAPP_CONFIG.amountDecimals` 设置为项目确认值。

## Files
## 文件职责

- `config.ts`: chain config, provider status, delayed-detection timeout, approval amount and gas defaults.
- `config.ts`：链配置、钱包状态、延迟检测超时、授权额度和 gas 默认配置。
- `provider.ts`: waits for and caches the injected provider, then creates the local wallet client.
- `provider.ts`：等待并缓存注入 provider，然后创建本地钱包客户端。
- `wallet.ts`: connects wallet, clears local wallet state, signs messages and manages wallet listeners.
- `wallet.ts`：连接钱包、清理本地钱包状态、签名以及管理钱包监听。
- `chain.ts`: reads chain id, switches chain and adds the chain when the wallet does not know it.
- `chain.ts`：读取链 ID、切链，并在钱包没有目标链时添加链。
- `contract.ts`: wraps common contract read, write, gas estimation and gas balance checks.
- `contract.ts`：封装通用合约读取、写入、gas 估算和 gas 余额检查。
- `units.ts`: converts between display amounts and on-chain integer units by configured decimals.
- `units.ts`：按配置的小数位转换展示金额和链上整数单位。
- `erc20.ts`: wraps common ERC20 balance, allowance, approve and transfer operations.
- `erc20.ts`：封装常用 ERC20 信息读取、余额、授权额度、自动补授权、授权和转账操作。
- `contractRefresh.ts`: centralizes the post-write data-sync wait.
- `contractRefresh.ts`：统一封装写合约后的数据同步等待。
- `batch.ts`: keeps low-level `wallet_sendCalls` and `wallet_getCallsStatus` helpers for future 7702-style flows.
- `batch.ts`：保留底层 `wallet_sendCalls` 和 `wallet_getCallsStatus` 方法，方便后续扩展 7702 类流程。
- `eip7702.ts`: wraps EIP-7702/EIP-5792 support detection, batch call sending and status query.
- `eip7702.ts`：封装 EIP-7702/EIP-5792 能力检测、批量调用发送和状态查询。
- `types.ts`: shared DApp TypeScript types.
- `types.ts`：DApp 共享 TypeScript 类型。

## State
## 状态

Shared wallet state lives in `src/stores/dapp`.
共享钱包状态放在 `src/stores/dapp`。

The store tracks provider status, wallet address, chain id and global DApp loading.
store 维护钱包环境状态、钱包地址、链 ID 和全局 DApp loading。

Wallet address changes are synced to `STORAGE_KEY.walletAddress`.
钱包地址变化会同步到 `STORAGE_KEY.walletAddress`。

## Usage
## 使用

```ts
import {
    connectDappWallet,
    formatDappAmountUnits,
    ensureErc20Allowance,
    initializeDappWallet,
    parseDappAmountUnits,
    signDappMessage,
} from '@/services/dapp'

await initializeDappWallet()
await connectDappWallet()
const challenge = await requestProjectWalletChallenge()
const signInfo = await signDappMessage(challenge.message)

const rawAmount = parseDappAmountUnits('1.23')
const displayAmount = formatDappAmountUnits(rawAmount)

await ensureErc20Allowance(spenderAddress, rawAmount, tokenAddress)
```

`signDappMessage()` signs the supplied text exactly; it never invents a prefix, timestamp or nonce. Business login should be built only after the backend authentication contract is documented.
`signDappMessage()` 会原样签署传入文本，不会自行拼接前缀、时间戳或 nonce。业务登录只能在后端鉴权契约文档确认后继续封装。
