# Clipboard
剪贴板模块。

`copyTextToClipboard()` replaces the low-level ability that the old Vue project exposed through `v-copy`.
`copyTextToClipboard()` 对应旧 Vue 项目中 `v-copy` 暴露的底层能力。

In React, call it from an explicit click handler instead of using a custom directive.
在 React 中，通过明确的点击事件调用它，而不是使用自定义指令。

```tsx
const copied = await copyTextToClipboard(walletAddress)

// TODO(feedback): Show copy success or failure after the global toast module is ready.
// TODO(feedback): 接入全局 Toast 后，根据 copied 提示复制成功或失败。
```

```tsx
<button onClick={() => void copyTextToClipboard(walletAddress)}>
  Copy address
</button>
```

The function tries the standard Clipboard API first.
函数会优先尝试标准 Clipboard API。

When the API is unavailable or denied in mobile H5 or WebView environments, it falls back to a temporary `textarea`.
当移动端 H5 或 WebView 中该 API 不可用或被拒绝时，会降级使用临时 `textarea`。

It returns `true` when the copy succeeds.
复制成功时返回 `true`。

It returns `false` when the text is empty or every copy strategy fails.
当文本为空或所有复制方式都失败时返回 `false`。

This function does not show toast directly, so the browser capability layer does not depend on an unfinished UI feedback module.
这个函数不直接显示 Toast，避免浏览器能力层依赖尚未完成的 UI 反馈模块。
