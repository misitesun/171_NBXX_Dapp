# SegmentedTabs
顶部胶囊分段切换组件。

`SegmentedTabs` is a controlled tab list with at least two items. It uses native
buttons with tab semantics, supports pointer and arrow-key selection, and keeps
the shared theme-colored selected gradient transition inside the component. After a
controlled value change, twelve temporary theme-colored droplets gather into the new
selected pill. The decorative layer is hidden from assistive technology, cleans
up after every transition and is skipped when reduced motion is requested. A
page-local text-only variant that intentionally hides the selected `::before`
surface also skips the pill effect. The settled selected surface always remains
the unchanged `--app-action-gradient` token.

The effect uses an instance-local SVG alpha threshold filter on a transparent
layer. It does not use a black backing surface, RGB contrast or blend modes.
Random droplets appear outside the pill, then merge inward while the selected
surface settles within 500 milliseconds. Resizing, scrolling the tab strip, rapid selection
and unmounting clear the transient layer. Filter size follows the rendered tab
height so mobile and design-width previews use the same proportions.

All instances share `GOOEY_DURATION_MS = 500` in `SegmentedTabs.tsx`. CSS timing,
particle duration, stagger and cleanup derive from this single configuration.
Droplet translation runs continuously from start to end with at most 12.5ms of
stagger and finishes within 450ms. Pill growth uses one uninterrupted 390ms easing curve, separate from
opacity, so an intermediate fade keyframe cannot restart the scale easing.
The remaining animation time finishes the decorative fade. An invisible 50ms
cleanup buffer removes transient DOM after the 500ms visual transition.

`SegmentedTabs` 是至少包含两项的受控 Tab。组件使用原生按钮与 Tab 语义，支持点击及方向键切换，并在组件内部统一处理主题选中渐变过渡。受控值变化后，十二颗临时主题水滴会向新的选中胶囊聚集；装饰层对辅助技术隐藏，每次动效结束后都会清理，并在系统要求减少动态效果时跳过。页面若明确隐藏选中态 `::before` 底板形成纯文字 Tab，也会同步跳过胶囊水滴。动效结束后的选中底色始终保持原有 `--app-action-gradient` 不变。页面可以通过局部类名调整每项宽度与间距，但应保留组件提供的选中渐变、焦点和键盘交互。

水滴在胶囊外围随机出现，再向内融合，底板在 500 毫秒内完成成形。所有实例统一使用 `SegmentedTabs.tsx` 中的 `GOOEY_DURATION_MS = 500`，CSS 时长、粒子移动、错峰与清理时间均由这一配置派生。每个实例使用独立 SVG 透明度阈值滤镜，不使用黑色衬底、RGB 对比度或混合模式，避免页面层叠上下文出现黑块或渐变变成纯青色。滤镜尺寸按实际按钮高度缩放；窗口缩放、Tab 横向滚动、快速切换和卸载时清理临时动效。

水滴从起点连续向终点移动，错峰启动最多 12.5ms，并在 450ms 内结束，不设置中途停留点。胶囊缩放使用独立、连续的 390ms 缓动曲线，与透明度关键帧分离，避免中间阶段反复减速再启动；剩余动画时间完成装饰层淡出。500 毫秒可见动效结束后保留 50ms 不可见清理缓冲，再移除临时 DOM。

```tsx
const items = [
    { value: 'active', label: '进行中' },
    { value: 'done', label: '已完成' },
] as const

<SegmentedTabs
    items={items}
    value={status}
    onChange={setStatus}
    ariaLabel="订单状态"
/>
```
