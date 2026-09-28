# Icon
图标组件。

Use this component for local SVG icons that need CSS-controlled color.
需要通过 CSS 控制颜色的本地图标使用这个组件。

It is designed for copying a few common Vant icon paths into the project instead of importing the full icon package.
它适合把少量常用的 Vant 图标 path 复制到项目里，而不是引入整套图标包。

## Usage
用法。

```tsx
<Icon name="cross" className="color-primary" />
<Icon name="arrow-left" size={32} color="#fff" />
```

The icon path uses `currentColor`, so `className`, parent text color, or the `color` prop can change the icon color.
图标 path 使用 `currentColor`，因此可以通过 `className`、父级文字颜色或 `color` 属性改变颜色。

`loading` preserves the original thin gray rotating ring. Use `<Icon name="loading" size={20} />` instead of drawing a page-specific CSS spinner.
`loading` 保留原先的灰色细环旋转样式。使用 `<Icon name="loading" size={20} />`，不要为页面单独绘制 CSS loading。

## Add icons
添加图标。

Add copied SVG path data to `ICON_DEFINITIONS`.
把复制过来的 SVG path 数据添加到 `ICON_DEFINITIONS`。

Current built-in icons are copied from the Vant iconfont glyphs used by the old project and converted to inline SVG paths.
当前内置图标从老项目使用的 Vant iconfont 字形转换为 inline SVG path。

- `arrow`
- `arrow-left`
- `arrow-up`
- `arrow-down`
- `cross`
- `scan`
- `loading`

```ts
export const ICON_DEFINITIONS = {
    close: {
        paths: [
            {
                d: '...',
            },
        ],
    },
} as const satisfies Record<string, IconDefinition>
```
