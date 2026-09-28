# Toast
Use `const { message, variant, showToast } = useToast()` and render `<Toast message={message} variant={variant} />`. A portal presents a non-blocking message for 2.5 seconds. New messages replace the current one and restart its timeout; unmount cancels the timer.
使用 `useToast()` 获取消息、状态和展示方法，再将它们传给 `Toast`。轻提示通过 portal 展示，不拦截点击；重复调用重新计时，卸载时清理，不承载接口或交易逻辑。

`Toast` exposes three variants:

- `default`: the existing centered dark message. Keep local validation, empty input, missing data, copy feedback and unavailable-feature notices on this variant.
- `success`: a green message with a check icon, solid border and 50% tint background, offset about 80px from the top to clear navigation controls and entering from right to left.
- `error`: a red assertive message with a cross icon, solid border and 50% tint background, offset about 80px from the top to clear navigation controls and entering from right to left.

`Toast` 提供三种状态：

- `default`：保持原有居中深色提示；输入为空、本地校验、无数据、复制结果和功能暂未开放等继续使用此状态。
- `success`：展示对号图标，使用绿色实色边框和同色 50% 透明背景，距顶部约 80px 以避开导航控件，并从右向左进入。
- `error`：展示错号图标，使用红色实色边框和同色 50% 透明背景，距顶部约 80px 以避开导航控件，并从右向左进入。

成功和失败提示的内容盒最大宽度为屏幕的 80%，只设置最小高度；短文案保持紧凑，长文案会自动换行并向下扩展，不会横向溢出屏幕。

Call `showToast(message, 'success')` after a successful action and `showToast(message, 'error')` for local parsing or fallback errors. Calling `showToast(message)` without a second argument remains `default`.

操作成功后调用 `showToast(message, 'success')`；本地解析或兜底错误调用 `showToast(message, 'error')`。省略第二个参数时保持 `default`。

`HttpErrorToast` is mounted once by `App`. It subscribes to normalized HTTP error notifications and always renders them with the `error` variant for 2.5 seconds. Business pages must not mount another global instance. Callers that also own local feedback can use `wasHttpErrorReported()` to avoid showing the same normalized error twice.

`HttpErrorToast` 由 `App` 唯一挂载，订阅统一 HTTP 错误通知，并始终使用 `error` 状态展示 2.5 秒。业务页面不要重复挂载全局实例；同时拥有局部提示的调用方可通过 `wasHttpErrorReported()` 避免重复展示同一个规范化错误。
