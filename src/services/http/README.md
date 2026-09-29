# HTTP
请求模块。

`HTTP_HEADER` centralizes request header names. Account-only authentication keeps Bearer when a token exists. A registered wallet provider supplies the connected Address even before login. When a token exists, that address must first match the token owner before the provider returns it; otherwise neither header is sent. Cached wallet storage alone is never proof of the current account. Invalidate the token and provider address on wallet changes and unregister on unmount.
`HTTP_HEADER` 统一存放请求头名称。纯账号鉴权有Token时发送Bearer。钱包提供者返回已连接且核对当前状态的Address，无Token时也发送Address。有Token时必须先核对其所属账号，才能返回地址并发送成对请求头；核对前两个头都不发送。缓存的钱包地址不能单独证明当前账号。钱包切换时清除Token并让提供者返回undefined，卸载时取消注册。

The feature owns wallet validation and the provider lifecycle; HTTP does not detect wallets itself. NodeXX's developer confirmed Address on all wallet requests, including login. Login clears the old token and exposes the freshly connected address after signing. Session restoration matches the current wallet against the cached token owner before validating it with paired headers; protected business requests wait for successful validation.
功能层拥有钱包核对和提供者生命周期，HTTP不自行探测钱包。NodeXX开发者已确认所有钱包请求（包括登录）携带Address。登录先清旧Token，签名后核对当前钱包并提供地址；恢复会话先核对当前钱包与缓存Token所属账号，再用成对请求头验证会话。受保护业务请求仍等待验证成功。

`lang` is added only when `APP_CONFIG.enableI18n` is enabled. Disabling i18n removes this header and fixes internal language state to `zh-Hans`.
只有开启 `APP_CONFIG.enableI18n` 时才会添加 `lang`。关闭多语言会移除此请求头，并将内部语言状态固定为 `zh-Hans`。

Register the project-owned 401 behavior with `registerHttpUnauthorizedHandler()`. The HTTP layer normalizes the error but does not import auth features or decide navigation.
通过 `registerHttpUnauthorizedHandler()` 注册项目自己的 401 处理逻辑。HTTP 层只负责标准化错误，不依赖鉴权 feature，也不决定页面跳转。

## Unified error feedback

Every rejected Axios response is normalized to `HttpError`. A non-empty plain-text response body is used verbatim after trimming; JSON `{ message }` and `{ error }` strings are also supported. The response interceptor reports the normalized error to the app-level `HttpErrorToast` before rejecting it, so requests expose the backend message even when their caller catches the Promise.

所有 Axios 失败响应都会统一转换为 `HttpError`。非空纯文本响应去除首尾空白后原样展示，同时支持 JSON 的 `{ message }` 与 `{ error }` 字符串。响应拦截器在继续抛出错误前将其发布给 App 根节点的 `HttpErrorToast`，因此请求即使在调用方捕获 Promise，也能显示后台错误。

Canceled requests are marked as handled but do not produce user feedback. Identical concurrent messages collapse into the currently visible notification. A `401` keeps the registered project callback behavior and also displays the backend message. Page-local Toast remains responsible for validation, success feedback and non-HTTP parsing errors; use `wasHttpErrorReported()` before showing a caught error locally when duplicate feedback is possible.

主动取消的请求会标记为已处理但不会提示；并发产生的相同错误只展示当前一条。`401` 保持已注册的项目回调行为，同时展示后台返回内容。页面自己的 Toast 继续负责校验、成功反馈与非 HTTP 的响应解析错误；捕获错误后若可能产生重复提示，应先通过 `wasHttpErrorReported()` 判断。
