# DropletLoading

Reusable water-droplet spinner shared by blocking contract writes and inline page loading states.

可复用的水滴旋转加载图形，同时供合约写入遮罩和页面内联加载状态使用。

`regular` preserves the original 300px contract-loading artwork by default. `small` uses a 40px outer frame for centered list and pagination indicators. Both variants keep the same seven-dot gradient, easing and staggered rotation. `ContractLoading` can override the regular gradient for a specific transaction tone; the inline small variant remains unchanged.

`regular` 默认保留原合约 Loading 的 300px 图形；`small` 使用 40px 外框，用于列表与分页的居中加载状态。两种尺寸共用同一套七水滴渐变、缓动与错峰旋转。`ContractLoading` 可以按交易色调覆盖标准尺寸的渐变，列表内联的小尺寸保持原色。

When `ariaLabel` is omitted, the accessible loading label follows the active locale. Explicit labels remain caller-controlled.
省略 `ariaLabel` 时，无障碍加载名称跟随当前语言；显式传入的文案仍由调用方控制。

```tsx
import { DropletLoading } from '@/components/DropletLoading'

<DropletLoading size="small" ariaLabel="订单加载中" />
```
