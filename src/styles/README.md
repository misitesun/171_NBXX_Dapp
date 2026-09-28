# Shared styles / 公共样式

Global styles enter through `src/styles/index.scss`; `common/common.scss` is already loaded. Reuse utilities before adding page-specific SCSS. Keep the demo's `color.scss` tokens and existing px-to-vw pipeline.
公共样式由 `src/styles/index.scss` 统一引入，已包含 `common/common.scss`。优先复用工具类，保留 demo 主题 token 与 px-to-vw 流程。

## Orbit border / 卡片转圈光效

`orbit-border` is the reusable asset-card border effect, not a React component. It uses a masked conic gradient and a registered angle property to move the highlight along the container border. It adds no layout dimensions; the card owns its size, radius and content.
`orbit-border` 是资产卡片转圈光效的公共样式类，而非独立 React 组件。遮罩后的锥形渐变沿容器边框旋转；卡片自行定义尺寸、圆角与内容。

```tsx
<article className="balance-card orbit-border">
    <h2>Balance</h2>
    <CountUp to="12.3400" />
</article>
```

```scss
.balance-card {
    border-radius: 32px;
    --orbit-border-start-angle: 41deg;
    --orbit-border-color-start: var(--app-cyan);
    --orbit-border-color-peak: var(--app-cyan);
}

.balance-card--reverse {
    --orbit-border-start-angle: 319deg;
    --orbit-border-direction: reverse;
    --orbit-border-color-start: var(--app-violet);
    --orbit-border-color-peak: var(--app-violet);
}
```

These angles illustrate mirrored highlights; they are not requirements for every card. Apply page overrides after the global utility.
示例角度用于镜像起点，并非所有卡片的固定设计要求；页面覆盖样式应在公共工具类之后加载。

| Variable | Default | Purpose |
| --- | --- | --- |
| `--orbit-border-start-angle` | `0deg` | Brightest point's initial angle / 最亮点起始角 |
| `--orbit-border-direction` | `normal` | Clockwise; `reverse` for counterclockwise / 顺时针或逆时针 |
| `--orbit-border-speed` | `5s` | One revolution / 每圈时长 |
| `--orbit-border-delay` | `0s` | Start delay / 启动延迟 |
| `--orbit-border-width` | `1px` | Highlight thickness / 高亮线宽 |
| `--orbit-border-color-start` | `var(--app-cyan)` | Highlight edges / 高亮两端 |
| `--orbit-border-color-peak` | `var(--app-violet)` | Brightest color / 最亮颜色 |
| `--orbit-border-glow` | `6px` | Glow radius / 光晕半径 |

The utility owns `::before`, establishes relative positioning/isolation and clips overflow. Do not put it on a container that already uses `::before` (including `SegmentedTabs` buttons); use a separate decorative wrapper if needed. It does not intercept pointer events. Reduced-motion users see a stationary highlight.
工具类占用 `::before`，建立相对定位与独立叠层，并裁切溢出；不要与已有 `::before` 的样式（包括 Tab 按钮）直接叠加，必要时使用独立装饰容器。不拦截点击；减少动态效果时保留静止高亮。

Tab and CountUp use 500ms transitions; the continuous orbit keeps its independent five-second cycle. Do not change orbit speed merely to match switching animations.
Tab 与 CountUp 是500 毫秒过渡；持续转圈仍使用独立的五秒周期，不因切换动效统一而改快。浏览器验证步骤见 `docs/compatibility.md`。
