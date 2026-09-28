# ADR 0004: Measured Figma fidelity is mandatory
# ADR 0004：Figma 实测还原是强制要求

- Status: Accepted
- Date: 2026-09-17

## Context
## 背景

A screenshot can show the overall appearance of a page, but it does not reliably reveal exact typography, spacing, opacity, corner radii, effects or gradient stops. When Figma inspection tools already expose those properties, estimating them creates avoidable differences and makes visual review depend on repeated manual corrections.
截图可以展示页面整体外观，但无法可靠提供准确的字体、间距、透明度、圆角、效果或渐变色标。当 Figma 检查工具已经可以读取这些属性时，继续估算会制造本可避免的差异，也会让视觉验收依赖反复人工纠正。

## Decision
## 决策

Measured Figma layer properties are the source of truth for designed-page visuals. Before styling, collect the relevant layer values for typography, colors and opacity, dimensions, padding and gaps, borders and radii, shadows and blur, and complete gradient parameters. If a property is available, use that exact source value and let the repository's existing px-to-vw pipeline perform responsive conversion. Do not replace it with a screenshot guess, framework default, convenient round number or undocumented manual scale.
Figma 图层实测属性是设计页面视觉效果的事实来源。开始写样式前，应收集相关图层的字体、颜色与透明度、尺寸、padding 与 gap、边框与圆角、阴影与模糊，以及完整渐变参数。只要属性可读取，就必须采用准确源数值，并交给仓库现有 px-to-vw 流程完成响应式转换；不得替换为截图猜测、框架默认值、方便的整数或未记录的手动缩放值。

Estimation is a fallback only when a property is unavailable because of permission, tooling, API limitations, rasterized artwork or unresolved responsive semantics. Every estimate must be identified with its reason and evidence. A page is complete only after comparison at the Figma frame width and correction of measurable visual differences.
只有因权限、工具、API 限制、栅格化资源或尚未明确的响应式语义导致属性无法获取时，才允许估算。每个估算值必须连同原因和依据一起标明。页面只有在 Figma 画板宽度下完成对照并修正可量测差异后，才算完成。

Normal document flow, semantic HTML, Flexbox and Grid remain mandatory. They define maintainable implementation structure; they do not permit lower visual fidelity or guessed design tokens.
正常文档流、语义化 HTML、Flexbox 和 Grid 仍是强制要求。它们定义可维护的实现结构，不代表可以降低视觉还原标准或猜测设计参数。

## Consequences
## 后果

Figma page checklists now include a measured-property inventory and explicitly disclosed estimates. Completion reports distinguish measured values from fallbacks and include same-width visual verification. Design implementation may take longer initially, but review becomes objective and repeatable.
Figma 页面清单必须包含图层量测表和明确披露的估算值。完成报告需要区分实测值与替代值，并包含同宽度视觉验收。页面首次实现可能需要更多前置检查，但验收会更客观、可重复。
