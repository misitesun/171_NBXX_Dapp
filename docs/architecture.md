# Project architecture
# 项目架构

This template deliberately uses a small, readable module layout. It is not an FSD migration target. Preserve these boundaries and improve them only through a scoped, documented change.
本模板刻意采用小而清晰的模块布局，并不是 FSD 迁移目标。应保持以下边界，只能通过有范围且有文档的改动来优化它们。

## Module map
## 模块地图

| Area | Responsibility | Public boundary |
| --- | --- | --- |
| `src/app` / `src/main.tsx` | Application bootstrap and root composition | App initialization only |
| `src/router` | Browser-base compatibility, route declarations, navigation helpers | Route and navigation APIs |
| `src/pages` | Route-level page modules and page-local styles | Page components and local helpers |
| `src/features` | Confirmed project API and orchestration modules; empty in the base template | Feature entry functions and feature types |
| `src/components` / `src/shared/components` | Reusable UI with stable layout and interaction contracts | Documented component props |
| `src/hooks` | Reusable lifecycle, refresh, and request-control hooks | Hook APIs |
| `src/services/http` | Axios client, generic request policy, headers and normalized errors | `request` and documented HTTP services |
| `src/services/upload` | Browser file selection and explicit-endpoint upload primitives | Upload service functions and types |
| `src/services/storage` | Browser storage access and typed storage helpers | Storage service functions |
| `src/services/platform` | Host-runtime checks such as Flutter availability | Platform capability helpers |
| `src/services/dapp` | Wallet detection, viem interaction, contract calls, units, 7702 helpers | DApp service functions and types |
| `src/services/contracts` | Project-specific contract ABI, address, and business wrappers | Contract-facing service functions |
| `src/stores` | Cross-page state that has more than one real consumer | Store APIs |
| `src/config`, `src/i18n`, `src/styles` | Project-wide configuration, language, and visual tokens/utilities | Documented configuration and tokens |
| `src/shared` / `src/utils` | Small generic utilities that do not own business or platform policy | Narrow reusable helpers |

## Boundary rules
## 边界规则

- Axios may be imported only inside `src/services/http`; features and upload helpers use its public request boundary.
- Browser storage may be accessed only through `src/services/storage`.
- Direct injected-wallet access and viem imports belong to `src/services/dapp`; project-specific contracts build on its wrappers in `src/services/contracts`.
- Native clipboard APIs belong to `src/shared/clipboard`.
- Page code should compose documented components, features, hooks, and service entry points rather than recreating their lower-level behavior.
- Page layout belongs to normal document flow, Flexbox and Grid; positioned elements are limited to the documented exceptions in `docs/layout-standards.md`.

- Axios 只能在 `src/services/http` 中直接引入；功能模块通过其公开请求方法访问。
- 浏览器存储只能通过 `src/services/storage` 访问。
- 注入钱包的直接访问和 viem 引入属于 `src/services/dapp`；项目合约通过 `src/services/contracts` 中的封装建立在其之上。
- 原生剪贴板 API 属于 `src/shared/clipboard`。
- 页面代码应组合有文档的组件、功能模块、hooks 和服务入口，不要重建其底层行为。
- 页面布局属于正常文档流、Flexbox 和 Grid；定位元素只限于 `docs/layout-standards.md` 中定义的例外。

## Change routing
## 变更路由

Use a feature-local file when one page owns the behavior. Promote code only after a second real consumer needs the same stable contract. A directory becomes a module boundary when it has a public entry, a configuration contract, or external runtime behavior; then it needs a README and focused tests.
单页面拥有的行为保留在功能本地。只有第二个真实消费者需要同一稳定契约时才提升代码。目录拥有公开入口、配置契约或外部运行时行为时才成为模块边界；此时需要 README 和聚焦测试。

## Shared motion boundaries / 公共动效边界

`SegmentedTabs` owns controlled tab selection and the 500ms decorative transition; it never delays business callbacks. `CountUp` owns numeric presentation with a 500ms default, not data fetching or financial arithmetic. `orbit-border` belongs to `src/styles/common/common.scss` and decorates existing containers without adding React state or a new business module. Module READMEs define configuration and reduced-motion behavior.
`SegmentedTabs` 管理受控 Tab 与500 毫秒装饰过渡，不延迟业务回调；`CountUp` 管理500 毫秒数字展示，不负责请求或金额计算；`orbit-border` 属于公共 SCSS，只装饰已有容器，不引入 React 状态或业务模块。配置与低动态行为以模块 README 为准。

### Sidebar shell presentation

MainLayout owns sidebar visibility and passes `sidebarOpen` to HeaderBar. MenuToggleIcon reverses from the current animation frame; SidebarMenu remains a consumer of MAIN_PAGE_ITEMS and the wallet store. WalletOrbitBorder is decorative only. Clipboard access continues through shared/clipboard; no authentication, referral API, route, storage or contract boundary is added.
