# Empty
空状态组件。

This component shows the shared no-data image and one line of empty text.
这个组件展示通用无数据占位图和一行空状态文案。

The default text is `暂无数据`, and it follows the project i18n resources.
默认文案是 `暂无数据`，并走项目多语言资源。

It renders `gap-100` blocks above and below by default, so it can naturally separate itself from nearby content and stretch the layout.
组件默认在上下各渲染一个 `gap-100` 占位块，方便和附近内容拉开距离并撑开布局。

Use `pnpm empty:asset -- --input <empty-icon.png>` when replacing the shared image. The script updates the image width from the PNG size and keeps height as auto.
替换通用空状态图时使用 `pnpm empty:asset -- --input <empty-icon.png>`。脚本会根据 PNG 尺寸更新图片宽度，并保持高度为 auto。

```tsx
import { Empty } from '@/components/Empty'

<Empty />
<Empty text="暂无记录" />
<Empty showGap={false} />
```
