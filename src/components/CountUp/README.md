# CountUp

`CountUp` animates a number from `from` (default `0`) to `to` in a fixed duration. It accepts finite numbers and numeric strings, allowing API display values to keep meaningful trailing decimal zeroes. It uses `requestAnimationFrame` and writes transient frame values directly to its span, so the animation does not trigger a React render on every frame. No animation dependency is required.
`CountUp` 在固定时长内把数字从 `from`（默认 `0`）平滑更新到 `to`。组件同时接受有限数字和数字字符串，让接口展示值可以保留有意义的小数末尾零。逐帧数字通过 `requestAnimationFrame` 直接写入 span，不会每帧触发 React 重渲染，也不需要新增动画依赖。

```tsx
import { CountUp } from '@/components/CountUp'

// The common API-result case: 0 -> 1000 in 500 milliseconds.
<CountUp to={1000} />

// Decimal precision is inferred from the endpoints.
<CountUp to={12.345} />

// Numeric strings retain API precision while every decimal frame participates.
<CountUp to="0.997490" />

// Use decimalPlaces when a JavaScript number needs explicit display precision.
<CountUp to={1000.5} decimalPlaces={2} separator="," />
```

| Prop | Default | Meaning |
| --- | --- | --- |
| `to` | required | Final finite number or numeric string |
| `from` | `0` | Starting number or numeric string; values above `to` naturally count down |
| `duration` | `0.5` | Animation time in seconds; `0` finishes immediately |
| `delay` | `0` | Delay in seconds before counting starts |
| `decimalPlaces` | inferred | Fixed fraction digits, clamped to `0..20` |
| `separator` | `''` | Custom thousands separator; empty disables grouping |
| `startWhen` | `true` | Keep showing `from` until this becomes true |
| `onStart` / `onEnd` | — | Lifecycle callbacks |

All project pages omit `duration` and share the 500ms `DEFAULT_DURATION_SECONDS` configuration in `CountUp.tsx`. Change that constant to adjust project-wide timing; the optional prop remains available for component API compatibility.
所有项目页面都省略 `duration`，统一使用 `CountUp.tsx` 中的500 毫秒配置 `DEFAULT_DURATION_SECONDS`。修改该常量即可调整全局时长；保留可选属性以兼容组件 API。

The component restarts from `from` when its numeric or formatting contract changes, so an API result arriving after the first render still plays the full animation. The default cubic ease-in-out keeps movement visible across the configured duration. Small values, numeric strings and scientific notation infer their precision; pass a numeric string such as `"1.20"`, or set `decimalPlaces={2}` when the caller only has a JavaScript number.
当接口结果在父组件首次渲染后到达时，`to` 更新会从 `from` 完整重播。默认三次方缓入缓出曲线让变化贯穿设定时长。小数、数字字符串和科学计数法都会自动推断精度；需要保留 `1.20` 这类末尾零时可直接传数字字符串，只有 JavaScript number 时也可显式传 `decimalPlaces={2}`。

The rendered span inherits typography and supports normal span attributes. Its default accessible label is the final formatted value, avoiding frame-by-frame announcements; pass `aria-label` to override it. Users who prefer reduced motion see the final value immediately after any configured delay.
组件继承外部文字样式并支持普通 span 属性。默认无障碍名称为最终格式化结果，避免逐帧播报；可用 `aria-label` 覆盖。系统开启“减少动态效果”时，在配置的延迟后直接显示最终值。
