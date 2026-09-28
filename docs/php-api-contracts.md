# PHP API contract boundary
# PHP 接口契约边界

PHP being dynamically typed does not reduce the need for strict TypeScript. It increases the importance of treating every network response as untrusted data until the frontend verifies the documented shape.
PHP 是动态类型语言，并不会降低 TypeScript 严格检查的必要性；反而更需要把每个网络响应视为不可信数据，直到前端确认其符合已文档化的结构。

## TypeScript baseline
## TypeScript 基线

Both application and Vite TypeScript configurations enable `strict` and `noImplicitReturns`. These flags protect the frontend implementation, but they cannot prove what a PHP server actually returned at runtime.
应用和 Vite 的 TypeScript 配置都开启 `strict` 与 `noImplicitReturns`。这些标志保护前端实现，但不能证明 PHP 服务在运行时实际返回了什么。

This baseline is deliberately incremental. `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, and `noPropertyAccessFromIndexSignature` remain a separate, module-by-module migration after their current callers have explicit behavior tests. Do not switch them on as a shortcut that forces unrelated business rewrites.
该基线刻意采用渐进式。`exactOptionalPropertyTypes`、`noUncheckedIndexedAccess` 和 `noPropertyAccessFromIndexSignature` 保留为单独的、按模块推进的迁移，前提是其当前调用方已有明确的行为测试。不要把它们当成迫使无关业务重写的快捷开关。

`request<T>()` is a transport convenience, not a runtime parser. A type assertion, `as T`, or a generic parameter must never be used as the only evidence that external JSON matches a domain type.
`request<T>()` 是传输便利方法，而不是运行时解析器。类型断言、`as T` 或泛型参数不能作为外部 JSON 符合领域类型的唯一证据。

## Required API Markdown contract
## 必需的接口 Markdown 契约

Before integrating a real endpoint, obtain a Markdown contract that states:
在对接真实接口前，必须取得明确以下内容的 Markdown 契约：

- Endpoint, HTTP method, authentication and required headers.
- Request field names, types, optionality, defaults, and serialization format.
- Success envelope and payload shape, including nullability and pagination.
- Error envelope, business code semantics, retry behavior, and unauthorized behavior.
- Enum values, timestamp/time-zone format, and whether numeric values arrive as JSON numbers or strings.
- Amount, price, balance, and token-unit representation, especially decimal precision and whether lossless strings are required.

- 接口地址、HTTP 方法、鉴权和必需请求头。
- 请求字段名、类型、可选性、默认值和序列化格式。
- 成功包裹层和 payload 结构，包括可空性与分页。
- 错误包裹层、业务码语义、重试行为和未授权行为。
- 枚举值、时间戳/时区格式，以及数值以 JSON number 还是 string 返回。
- 金额、价格、余额和 Token 单位的表示方式，特别是小数精度与是否必须使用无损字符串。

## Wallet authentication and signed transaction data
## 钱包鉴权与签名交易数据

When an endpoint participates in wallet login or a contract write, its Markdown must additionally state the current authentication protocol: challenge or message source, nonce or timestamp semantics, expiry, chain/domain binding when applicable, signature encoding, and the exact request headers or fields. A timestamp-signing flow inherited from a legacy DApp or starter adapter is not a reusable default; it is implemented only when the current PHP contract requires it.
接口参与钱包登录或写合约时，其 Markdown 还必须说明当前鉴权协议：challenge 或消息来源、nonce 或时间戳语义、有效期、适用时的链/域绑定、签名编码，以及确切的请求头或字段。继承自旧 DApp 或启动适配器的时间戳签名不是可复用默认值；只有当前 PHP 契约要求时才实现。

If the backend returns a server-signed transaction payload, document every raw field, unit, argument order, expiry/deadline, signature, idempotency or order identifier, and whether the frontend must wait for a receipt or indexing result. The frontend may validate the documented shape, but must pass signed raw contract arguments through unchanged rather than converting them to numbers or rebuilding them from UI state.
如果后端返回服务端签名的交易 payload，必须文档化每个原始字段、单位、参数顺序、有效期/deadline、签名、幂等或订单标识，以及前端是否需要等待回执或索引结果。前端可以校验文档化的结构，但必须原样透传已签名的合约参数，不能转换为 number，也不能从 UI 状态重建。

## Implementation pattern
## 实现模式

Keep wire DTOs close to the feature API. At the remote boundary, receive `unknown` where practical, validate discriminators and required fields, then transform a verified DTO into the domain model consumed by UI. Preserve missing or invalid data as an explicit error or loading failure; do not silently substitute business defaults.
将 wire DTO 放在功能 API 附近。在远端边界尽可能以 `unknown` 接收，校验辨别字段和必填字段，再把已验证 DTO 转成 UI 消费的领域模型。缺失或无效数据应作为明确错误或加载失败处理；不要静默填充业务默认值。

For monetary values, do not use JavaScript floating-point arithmetic for contract-sensitive amounts. Keep confirmed API decimal strings intact until they enter the existing decimal or token-unit helpers.
金额相关值不能用 JavaScript 浮点数处理合约敏感金额。已确认的 API 小数字符串应保持完整，直到进入已有 decimal 或 token-unit 工具。

Do not introduce a schema-validation dependency preemptively. Use focused type guards or parsers first; introduce a shared runtime schema tool only after repeated real endpoints demonstrate the need and the developer approves the dependency.
不要预先引入 schema 校验依赖。先使用聚焦的类型守卫或解析器；只有多个真实接口反复证明需要且开发者批准依赖后，才引入共享运行时 schema 工具。

## Mutation success boundaries
## 提交成功边界

Classify every `POST`, `PUT`, `PATCH` and `DELETE` before writing its feature method:
实现每个 `POST`、`PUT`、`PATCH` 和 `DELETE` 的 feature 方法前，先完成以下分类：

| Success body usage | Feature boundary | Parsing rule | Post-success state |
| --- | --- | --- | --- |
| Not used by the next frontend step | `Promise<void>` | Await `request<unknown>(...)`; do not parse the body | Re-read the authoritative GET endpoint if the page needs new state |
| Required for a contract call, navigation, follow-up request or download | Typed result | Validate only the documented fields that the next step consumes | Use the validated result, then refresh if the contract requires it |
| Used only as an optional shortcut before an immediate authoritative refresh | Prefer `Promise<void>` | Do not add failure risk for a value that the refresh will replace | Let the read endpoint own final state |

| 成功响应体用途 | Feature 边界 | 解析规则 | 成功后的状态来源 |
| --- | --- | --- | --- |
| 前端下一步不使用 | `Promise<void>` | 只等待 `request<unknown>(...)`，不解析响应体 | 页面需要新状态时重新请求权威 GET 接口 |
| 合约调用、跳转、后续请求或下载必需 | 类型化结果 | 只校验下一步实际使用且文档化的字段 | 使用校验后的结果，并按契约决定是否刷新 |
| 仅用于立即刷新前的临时状态合并 | 优先 `Promise<void>` | 不为即将被刷新替换的数据增加解析失败风险 | 最终状态以读取接口为准 |

For an unused body, the safe pattern is:
未使用响应体时，采用以下模式：

```ts
export async function submitAction(body: SubmitActionBody): Promise<void> {
    await request<unknown, SubmitActionBody>({
        url: '/api/actions',
        method: 'POST',
        data: body,
    })
}
```

Do not wrap the mutation and a throwing refresh in one `try/catch` that labels every error as submission failure. A refresh failure must not become a submission failure. Show mutation success after the mutation resolves, then run a self-reporting refresh or catch refresh errors separately. A user must not be encouraged to repeat a write that the backend already completed.
不要把提交和可能抛错的刷新放在同一个 `try/catch` 中，并把所有错误都标成提交失败。提交完成后先确认提交成功，再执行内部自行提示错误的刷新，或单独捕获刷新错误。不能因为刷新失败而诱导用户重复执行后端已经完成的写操作。

Server-signed transaction data is the exception, not a reason to parse every mutation. If the next step calls a contract with returned `id`, amount, recipient, deadline or signature, validate those required fields strictly and do not continue when they are missing or malformed.
服务端签名交易数据属于例外，但不能据此解析所有提交响应。如果下一步合约调用依赖返回的 `id`、金额、收款地址、截止时间或签名，必须严格校验这些必需字段；字段缺失或格式错误时不得继续上链。

## Test matrix
## 测试矩阵

For each integrated response parser, cover a valid payload and the meaningful failure modes: missing required field, wrong primitive type, null versus omitted, unsupported enum, malformed timestamp, and numeric string/number ambiguity when the backend contract permits both. Add endpoint and auth/header tests separately from parsing tests.
每个已接入的响应解析器应覆盖有效 payload 与有意义的失败模式：必填字段缺失、原始类型错误、null 与省略的区别、不支持的枚举、错误时间戳，以及后端同时允许数字字符串/数字时的歧义。接口地址和鉴权/请求头测试应与解析测试分开。

For a mutation whose success body is unused, test an HTTP `2xx` response containing an empty, primitive or deliberately incompatible body and assert that the feature method resolves to `undefined`. Separately preserve coverage that non-`2xx` responses reject through the shared HTTP error path. For a consumed mutation response, keep parser failure tests for every required downstream field.
对于不使用成功响应体的提交接口，测试 HTTP `2xx` 返回空值、原始值或故意不兼容的响应体，并断言 feature 方法仍以 `undefined` 完成。另行保留非 `2xx` 通过公共 HTTP 错误链路抛出的覆盖。对于会消费提交响应的流程，继续为每个下游必需字段保留解析失败测试。
