# ADR 0002: Normal-flow page layout by default
# ADR 0002：默认使用正常文档流布局

- Status: Accepted
- Date: 2026-09-15

## Context
## 背景

AI-generated pages can imitate a design screenshot by using many absolute or fixed coordinates. That approach breaks when content length, screen size, localization, keyboard state, or dynamic data changes, and makes ordinary page maintenance unnecessarily difficult.
AI 生成的页面可能用大量 absolute 或 fixed 坐标模仿设计截图。这种方式在内容长度、屏幕尺寸、多语言、键盘状态或动态数据变化时容易失效，也会让普通页面难以维护。

## Decision
## 决策

Page structure uses normal document flow with semantic DOM, Flexbox, Grid, gaps, and spacing by default. Absolute positioning is limited to decorative background art and small icon or badge overlays. Fixed and sticky positioning is limited to maintained shared chrome and rare true viewport overlays. Each positioned declaration in page SCSS carries a machine-checked `layout-exception` category and reason.
页面结构默认使用语义化 DOM、正常文档流、Flexbox、Grid、间距和留白。绝对定位仅限于装饰背景图和小图标或角标覆盖层。固定和 sticky 定位仅限于已维护的公共外壳和少数真正的视口覆盖层。页面 SCSS 中每个定位声明都必须携带可机器校验的 `layout-exception` 类别和原因。

## Consequences
## 后果

Pages take slightly more deliberate DOM and Flex/Grid planning before styling, but become responsive to dynamic content and easier to review. Existing shared navigation and overlay components remain intact; this decision does not mandate a visual refactor of them.
页面在样式前需要多一些 DOM 与 Flex/Grid 规划，但会更适应动态内容且更容易审查。现有公共导航和覆盖层组件保持不变；本决策不要求对它们做视觉重构。
