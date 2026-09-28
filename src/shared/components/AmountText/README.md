# AmountText
金额文本组件。

`AmountText` is used for high-frequency amount display in JSX.
`AmountText` 用于 JSX 中高频出现的金额展示。

It calls `formatAmount()` internally so amount display stays consistent across pages.
它内部统一调用 `formatAmount()`，让页面金额展示保持一致。

```tsx
<AmountText value={user.balance_usdt} />

<AmountText
  value={order.total_amount}
  className="orderAmount"
  data-token="USDT"
/>
```

The component forwards normal `span` attributes.
组件会透传普通 `span` 属性。

It does not accept `children`, because callers should not override the unified amount text.
组件不接收 `children`，避免调用方覆盖统一的金额文本。

Use `formatAmount()` directly when the formatted result must be inserted into a sentence, form hint or chart option.
如果需要把格式化结果拼进一段文字、表单提示或图表配置，直接使用 `formatAmount()`。

Do not force component usage just to reuse amount formatting.
不要为了复用格式化逻辑而强行使用组件。
