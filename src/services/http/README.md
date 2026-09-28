# HTTP
请求模块。

`HTTP_HEADER` centralizes request header names. Account-only authentication keeps `Authorization: Bearer <token>` when a local token exists. For wallet authentication, register `registerHttpWalletAddressProvider()` with a callback that returns the currently connected wallet address only after it has been checked against the account associated with the Token. While this provider is registered, the client sends `Authorization` and `Address` together only when both the token and checked address exist. A cached `WALLET_ADDRESS` alone is never proof of the connected account. Remove or invalidate the token and return `undefined` from the provider immediately on wallet change; unregister the provider when its owner unmounts.
`HTTP_HEADER` 统一存放请求头名称。纯账号鉴权在本地有 Token 时发送 `Authorization: Bearer <token>`。钱包鉴权须注册 `registerHttpWalletAddressProvider()`；只有当前连接的钱包地址已经与 Token 所属账号核对后，回调才能返回该地址。注册后，仅当 Token 和已核对地址同时存在时，客户端才一起发送 `Authorization` 与 `Address`。缓存的 `WALLET_ADDRESS` 不能单独证明当前连接账号。钱包切换时应立即清除或作废 Token，并让回调返回 `undefined`；所属模块卸载时取消注册。

The template supports the `Address` header requested for wallet-authenticated projects, but does not enable wallet authentication itself. The project's PHP Markdown must still confirm whether the endpoint uses this header. After checking the current wallet against the Token's owner, the feature may use the paired headers for a session-validation request; other protected business requests wait for that validation to succeed. Public login requests run without these two headers until a Token exists.
模板提供钱包鉴权项目所需的 `Address` 请求头能力，但不自行启用钱包登录。具体接口是否使用该请求头仍须由项目 PHP Markdown 确认。功能层把当前钱包与 Token 所属账号核对后，可用成对请求头发起会话验证；其他受保护业务请求须等验证成功。取得 Token 前的公开登录请求不携带这两个请求头。

`lang` is added only when `APP_CONFIG.enableI18n` is enabled. Disabling i18n removes this header and fixes internal language state to `zh-Hans`.
只有开启 `APP_CONFIG.enableI18n` 时才会添加 `lang`。关闭多语言会移除此请求头，并将内部语言状态固定为 `zh-Hans`。

Register the project-owned 401 behavior with `registerHttpUnauthorizedHandler()`. The HTTP layer normalizes the error but does not import auth features or decide navigation.
通过 `registerHttpUnauthorizedHandler()` 注册项目自己的 401 处理逻辑。HTTP 层只负责标准化错误，不依赖鉴权 feature，也不决定页面跳转。

## Unified error feedback

Every rejected Axios response is normalized to `HttpError`. A non-empty plain-text response body is used verbatim after trimming; JSON `{ message }` and `{ error }` strings are also supported. The response interceptor reports the normalized error to the app-level `HttpErrorToast` before rejecting it, so requests expose the backend message even when their caller catches the Promise.

所有 Axios 失败响应都会统一转换为 `HttpError`。非空纯文本响应去除首尾空白后原样展示，同时支持 JSON 的 `{ message }` 与 `{ error }` 字符串。响应拦截器在继续抛出错误前将其发布给 App 根节点的 `HttpErrorToast`，因此请求即使在调用方捕获 Promise，也能显示后台错误。

Canceled requests are marked as handled but do not produce user feedback. Identical concurrent messages collapse into the currently visible notification. A `401` keeps the registered project callback behavior and also displays the backend message. Page-local Toast remains responsible for validation, success feedback and non-HTTP parsing errors; use `wasHttpErrorReported()` before showing a caught error locally when duplicate feedback is possible.

主动取消的请求会标记为已处理但不会提示；并发产生的相同错误只展示当前一条。`401` 保持已注册的项目回调行为，同时展示后台返回内容。页面自己的 Toast 继续负责校验、成功反馈与非 HTTP 的响应解析错误；捕获错误后若可能产生重复提示，应先通过 `wasHttpErrorReported()` 判断。
