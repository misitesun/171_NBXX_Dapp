# Normal-flow page layout
# 正常文档流页面布局

Visual hierarchy must follow the DOM hierarchy. A page should read as page shell, sections, cards, controls, and actions in source order; CSS should refine that structure rather than place every block by coordinates.
视觉层级必须跟随 DOM 层级。页面源码应按页面骨架、section、卡片、控件和操作区的顺序组织；CSS 应细化该结构，而不是用坐标摆放每个区块。

## Default layout method
## 默认布局方式

Build ordinary page content in normal document flow. Use semantic `section`, `header`, `main`, `nav`, `form`, `button`, and list elements as appropriate, then use `display: flex` or `display: grid`, `gap`, padding, margins, width constraints, and responsive sizing to arrange them.
普通页面内容必须按正常文档流构建。按语义使用 `section`、`header`、`main`、`nav`、`form`、`button` 和列表元素，再用 `display: flex` 或 `display: grid`、`gap`、内边距、外边距、宽度约束和响应式尺寸安排它们。

Do not use `top`, `left`, `right`, `bottom`, transforms, or hard-coded viewport coordinates to arrange headings, cards, forms, lists, tab panels, or page action areas. A Figma frame is a visual reference, not a command to reproduce every pixel position.
不要用 `top`、`left`、`right`、`bottom`、transform 或写死的视口坐标来排列标题、卡片、表单、列表、tab 面板或页面操作区。Figma 画板是视觉参考，不是要求复刻每个像素位置的命令。

## Narrow positioning exceptions
## 狭义定位例外

`position: relative` may establish a local containing block or stacking context. It must not become a way to nudge sequential content into place.
`position: relative` 可以建立局部包含块或层叠上下文，但不能成为微调顺序内容位置的手段。

`position: absolute` is allowed only for non-interactive background art, a small icon overlay, or a small badge overlay. The positioned element must not own the size or placement of meaningful flowing content.
`position: absolute` 只允许用于非交互背景装饰、小图标覆盖层或小角标覆盖层。被定位的元素不能决定有意义的文档流内容的尺寸或位置。

`position: fixed` and `sticky` are for maintained shared application chrome or a real viewport overlay. For modal, loading, picker, and navigation behavior, reuse the shared component instead of building a page-local fixed layer. A page-level `viewport-overlay` is limited to rare cases such as the existing splash animation.
`position: fixed` 和 `sticky` 用于已维护的公共应用外壳或真正的视口覆盖层。弹窗、loading、picker 和导航行为应复用公共组件，不能构建页面本地 fixed 层。页面级 `viewport-overlay` 仅限于现有开屏动画这类少数情况。

## Required exception marker
## 必需的例外标记

For every `absolute`, `fixed`, or `sticky` declaration in a page stylesheet, add this comment immediately above it. The category must be one of `background-art`, `icon-overlay`, `badge-overlay`, or `viewport-overlay`, followed by a concrete reason.
页面样式中的每个 `absolute`、`fixed` 或 `sticky` 声明都必须在正上方添加此注释。类别只能为 `background-art`、`icon-overlay`、`badge-overlay` 或 `viewport-overlay` 之一，并且必须跟随具体原因。

```scss
.home-page__glow {
    /* layout-exception: background-art decorative glow stays behind flowing content */
    position: absolute;
    inset: 0;
    pointer-events: none;
}
```

`pnpm lint` validates the marker for page SCSS files. The shared app shell under `src/pages/main/layout/` is excluded because it maintains already-established header and tabbar behavior; it is not an exception available to ordinary pages.
`pnpm lint` 会校验页面 SCSS 文件的标记。`src/pages/main/layout/` 下的公共应用外壳因维护既有 Header 和 Tabbar 行为而被排除；这不代表普通页面可以使用同类例外。

## Page checklist
## 页面清单

Before writing page SCSS, state the section order, the Flex/Grid relationship, shared utilities to reuse, and each positioned decorative exception. During review, ask whether removing every positioned decorative element would leave the primary content readable and correctly ordered; if not, the layout must return to normal flow.
编写页面 SCSS 前，先说明 section 顺序、Flex/Grid 关系、要复用的通用样式，以及每个定位装饰例外。审查时问：移除所有定位装饰后，主要内容是否仍可读且顺序正确；若否，布局必须回到正常文档流。

### Sidebar shell positioning exceptions

The first-level sidebar is a viewport overlay below the fixed 100px design header. Its wallet badge may overlap the card edge; the header decorative divider is absolutely positioned inside the existing header bounds. These scoped layout exceptions preserve normal-flow page composition and do not apply to business pages or other Popup consumers.
