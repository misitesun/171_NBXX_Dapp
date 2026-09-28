# ActionButton
Shared action button. Variants: primary gradient, outline, soft gradient; sizes: regular (88 design px) and small (68). Native button props are forwarded. `loading` disables interaction and exposes aria-busy. Optional `icon` is decorative; accessible text belongs in children.
公共操作按钮，颜色取自 `color.scss`，不承载业务请求。

Primary buttons enable the shared animated treatment by default without changing the button's base UI. A clipped parallelogram pseudo-element with a 50%-opacity white center crosses the fixed project gradient from left to right in 1 second, stays hidden for 2 seconds, then starts the next pass. The content remains above the decorative layer. Pass `animated={false}` when a primary action must remain static; non-primary variants stay static by default.
主按钮默认启用公共动态效果，但不会改变按钮原有 UI。上层伪元素裁切为近似棱形的平行四边形，中心白色透明度为 50%，用 1 秒从左向右扫过固定的项目渐变，随后隐藏等待 2 秒，再开始下一轮；按钮内容始终位于装饰层上方。主按钮需要静态展示时传入 `animated={false}`；其他变体默认保持静态。

Outline/soft variants use a masked gradient ring, preserving a transparent or tinted interior. Mask colors are opacity-only, not theme colors. Enabled buttons scale to 97% while pressed and recover on release/cancel. Disabled/loading states pause the shared animation and do not scale; reduced-motion preference disables both continuous animation and scaling.
描边使用透明镂空渐变环，按压缩小、松开恢复；禁用/加载状态不缩放，并尊重系统减少动态效果设置。

`secondary` is the subdued cyan outline action for secondary operations.
`secondary` 是用于次要操作的低强调青色描边变体。
