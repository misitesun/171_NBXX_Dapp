# Real-project DApp integration playbook
# 真实项目 DApp 联调手册

This template is a reusable React H5 DApp base. A real project's PHP endpoints, contracts, assets, chain, wallet-authentication protocol, and transaction sequence belong to that project; they must not be copied into the generic base.
本模板是可复用的 React H5 DApp 基座。真实项目的 PHP 接口、合约、资产、链、钱包鉴权协议和交易顺序属于该项目，不能复制进通用基座。

Use this document when a project starts real API and contract integration, or when an older DApp is used as a behavior reference. It defines how to preserve useful flow knowledge without turning legacy business code into an unverified specification.
当项目开始真实接口与合约联调，或以旧 DApp 作为行为参考时使用本文。它规定如何保留有价值的流程经验，同时不把旧业务代码误当成未经验证的规范。

## Source-of-truth order
## 事实来源优先级

Resolve a conflict using this order:
发生冲突时，按以下优先级处理：

1. Confirmed current project ABI / contract Markdown, including version, deployed address source, units, permissions, and caller context.
2. Confirmed current project PHP API Markdown, including auth, request and response wire shapes, signed data, order state, and error behavior.
3. Current project wrappers, parsers, and behavior tests that implement those documents.
4. A legacy DApp, design file, demo page, or old backend code, only as a question generator or interaction-flow reference.

1. 已确认的当前项目 ABI / 合约 Markdown，包括版本、部署地址来源、单位、权限和调用者上下文。
2. 已确认的当前项目 PHP 接口 Markdown，包括鉴权、请求和响应 wire 结构、签名数据、订单状态和错误行为。
3. 实现上述文档的当前项目封装、解析器和行为测试。
4. 旧 DApp、设计稿、演示页或旧后端代码，只能作为提问清单或交互流程参考。

Legacy code must never supply a method name, ABI, address, chain ID, Token decimals, API field, response envelope, approval policy, or error semantic that the current contracts do not confirm.
旧代码绝不能为当前项目补充未确认的方法名、ABI、地址、链 ID、Token 精度、接口字段、响应包裹层、授权策略或错误语义。

## Required integration contract pack
## 必需联调契约包

Before a transaction-backed feature starts, collect the following project facts in Markdown. Missing facts are a blocker or an explicitly recorded TODO, not permission to guess.
开始带交易的功能前，应以 Markdown 收集以下项目事实。缺失事实应成为阻塞项或明确记录的 TODO，不能据此猜测实现。

| Contract | It must state |
| --- | --- |
| Chain profile | Production and development chain IDs, native currency, wallet switch/add-chain data when needed, and RPC ownership. |
| Asset registry | Each asset's env key or address source, decimals, display format, spender, approval policy, and any zero-reset requirement. |
| ABI / contract definition | ABI version or hash, address env key, function signatures, argument units and order, payable value, events/errors, `msg.sender` use, and whether reads require the caller account. |
| PHP API contract | Endpoint, auth/challenge protocol, DTO and envelope, whether each mutation success body is consumed, lossless amount format, error and order-state semantics, retry/idempotency behavior, and signed transaction payload semantics. |
| Feature flow matrix | User preconditions, API request, server-signed fields if any, wallet write, receipt/indexing wait, refresh targets, cancellation and failure UX. |

The template signs only an exact message supplied by its caller; it does not establish any project's authentication protocol. If a legacy login signs a timestamp, or a legacy page sends backend parameters directly into a write, ask whether that behavior remains current. Do not promote it to a template default.
模板只会原样签署调用方传入的消息，不能确立任何项目的鉴权协议。若旧登录通过时间戳签名，或旧页面直接把后端参数传给写合约，必须确认该行为是否仍有效；不能把它提升为模板默认规则。

Static UI development keeps `/h5` directed to the home page so page previews work without a wallet or backend. After a project's PHP authentication contract is confirmed, a real project may mount its startup/login gate at `/h5`. For a cached Token, restore the currently authorized wallet and match it to the saved account before contacting the backend. For a fresh login, sign only the documented message, then recheck the wallet before accepting the returned Token. When the PHP contract requires it, register the checked current address with the HTTP client so the session-validation request carries `Authorization: Bearer <token>` and `Address: <address>` together. Other protected business calls wait until session validation succeeds. Account changes, rejected sessions and 401 responses clear the Token and invalidate the registered address. Route destinations and referral handling remain project-specific.
静态 UI 开发保持 `/h5` 直达首页，让页面不依赖钱包或后端即可预览。项目 PHP 鉴权契约确认后，真实项目可在 `/h5` 挂载启动或登录门槛。恢复缓存 Token 时，先恢复当前已授权钱包并与所存账号核对，再联系后端。新登录只签署文档规定的原文，并在接受返回的 Token 前再次检查钱包。若 PHP 契约要求，向 HTTP 客户端注册已核对的当前地址，让会话验证请求成对携带 `Authorization: Bearer <token>` 和 `Address: <address>`。其他受保护业务请求须等会话验证成功。账号切换、会话被拒绝及 401 都应清理 Token 并使注册地址失效。目标路由和邀请处理仍由具体项目决定。

When a real project accepts a referral link and one wallet app may switch between addresses, keep the confirmed non-empty referral code in project-owned `localStorage` through the storage service. A code on the current link takes priority and replaces the saved code; without a link code, login reads the saved value. Account switching, Token invalidation and successful login must not erase that referral code, so another address can still log in. Pass the current link code through route state as well when storage may be unavailable. The key name, referral request field and any explicit removal policy belong in the real project's documented authentication contract; the blank template adds no referral route or business key.
真实项目若接受邀请链接，且同一钱包 App 可能切换多个地址，应通过存储服务把已确认的非空邀请码保存在项目专属的 `localStorage` 键中。当前链接有邀请码时优先使用并覆盖保存值；链接没有邀请码时，登录读取本地保存值。账号切换、Token 失效和登录成功均不清理邀请码，以便其他地址继续登录。存储可能受限时，本次链接的邀请码还应通过路由状态传递。键名、登录请求字段及明确的删除策略由真实项目鉴权契约记录；空白模板不添加邀请路由或业务键。

## Code boundaries
## 代码边界

| Location | Owns | Must not own |
| --- | --- | --- |
| `src/services/dapp` | Generic injected-wallet detection, viem client access, chain switching, shared ERC20 primitives, common read/write helpers | Project ABI, project addresses, PHP DTOs, endpoint names, business transaction sequence |
| `src/services/contracts` | Current project ABI files, env-backed addresses, typed project read/write wrappers | Page rendering, raw HTTP calls, guessed ABI facts |
| `src/features/<feature>` | PHP wire DTO parsing, domain mapping, project-specific orchestration and refresh policy | Direct `window.ethereum`, direct viem imports, browser-storage access from pages |
| `src/pages/<page>` | Semantic UI, local state, user input, calling public feature methods, existing loading and refresh components | Contract arguments assembled from guesses, endpoint parsing, duplicate wallet logic |

Keep the generic DApp layer reusable. A helper may move into it only after at least two real project consumers demonstrate the same stable need and its generic inputs and error semantics are documented.
通用 DApp 层必须保持可复用。只有至少两个真实项目消费者证明同一稳定需求，并且通用输入与错误语义已文档化时，辅助方法才能上移到该层。

## Safe transaction sequence
## 安全交易顺序

1. Read confirmed asset decimals and validation rules. Parse only user-entered display input with the confirmed unit helper; never use JavaScript floating-point math for contract-sensitive amounts.
2. Verify wallet/provider state and the confirmed chain through existing DApp services.
3. Classify the feature API mutation response before parsing it. If the next step does not consume the success body, return `Promise<void>` and do not parse it. If the documented response contains required server-signed contract arguments, validate only those consumed fields and keep every raw value, deadline, signature, and argument order exactly as returned.
4. Call the project contract wrapper. The wrapper maps named, documented inputs to the confirmed ABI; it does not reinterpret or silently alter a signed payload.
5. Await the documented transaction outcome. If a backend indexer is involved, use the shared post-write synchronization delay only when the project flow documents that dependency.
6. Reuse the page's real refresh function to reload the relevant API and contract data. Guard against stale async responses and avoid duplicate submissions while a write is active.

Mutation success and post-success refresh have separate error boundaries. A failed refresh must not turn an already completed API or contract write into failure feedback that encourages the user to submit it again. Final display state comes from the documented authoritative read endpoint.
提交成功与成功后的刷新必须使用不同的错误边界。刷新失败不能把已经完成的接口或合约写入改报成失败，并诱导用户再次提交。页面最终展示状态来自已文档化的权威读取接口。

For a read whose result depends on `msg.sender`, pass the connected account through the project wrapper. Public configuration, market data, and metadata reads stay account-free.
若读取结果依赖 `msg.sender`，应通过项目封装传入已连接账户。公共配置、行情和元数据读取保持不传账户。

## Review checklist
## 审查清单

- Every project field, address, unit, and method can be traced to a current Markdown contract.
- Server-signed raw data is preserved rather than parsed into JavaScript numbers or reconstructed in a page.
- Approval, gas, wallet-login, and retry behavior follow the documented project choice, not a legacy default.
- Contract wrappers have tests for ABI argument mapping; user-context reads test account forwarding, while public reads test that no account is required.
- PHP parsers test valid and malformed payloads separately from auth/header behavior.
- Unused mutation bodies resolve successfully for empty or incompatible `2xx` payloads, while consumed contract or navigation values retain strict parser tests.
- A wallet-capable manual pass covers connect, wrong-chain handling, user rejection, success, account change, and refresh when the required environment is available.

## Reusable project handoff
## 可复用项目交接

When handing a real project back to this template, contribute only a demonstrated generic improvement: a documented service boundary, a reusable test pattern, a stable workflow rule, or a compatibility record. Keep project addresses, ABI bodies, endpoint fields, UI copy, and business transaction rules inside the real project.
真实项目反哺模板时，只沉淀已经验证过的通用改进：文档化的服务边界、可复用测试模式、稳定工作流规则或兼容性记录。项目地址、ABI 内容、接口字段、页面文案和业务交易规则应留在真实项目中。
