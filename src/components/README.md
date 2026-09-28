# Components
通用组件。

This directory stores reusable UI components that are shared by multiple business modules.
这个目录存放可被多个业务模块复用的通用 UI 组件。

Keep business-specific components inside their feature or page directory until they are reused.
业务专属组件先放在对应 feature 或页面目录中，直到确实被复用后再抽到这里。

`PagePullRefresh` is the page-level pull-refresh and load-more container. Add it only when a real page registers asynchronous work through `usePageRefresh()` or `usePageLoadMore()`.
`PagePullRefresh` 是页面级下拉刷新与上拉加载容器。只有真实页面通过 `usePageRefresh()` 或 `usePageLoadMore()` 注册异步任务后才接入。

`DropletLoading` owns the reusable seven-dot water-droplet animation. Its regular size powers `ContractLoading`; its small 40px size is available for inline list and pagination loading without visible loading copy.
`DropletLoading` 统一封装七水滴旋转动画。标准尺寸用于 `ContractLoading`，40px 小号尺寸用于不显示文字的列表与分页加载状态。

`Dropdown` is an anchored option or action menu with a viewport-clamped glass mask. Use it for lightweight local choices; use `Picker` or `Popup` when the interaction needs a bottom sheet or full-screen overlay.
`Dropdown` 是带视口边界约束和玻璃遮罩的锚定式选项或操作菜单。轻量本地选择使用它；需要底部面板或全屏覆盖层时使用 `Picker` 或 `Popup`。

`Input` is the required wrapper for business text, search, password and numeric inputs. It centralizes the project-wide action-gradient focus border while pages retain control of their dimensions, radii and surface colors through local layout and CSS variables. Native radio inputs remain owned by `Radio`.
业务文本、搜索、密码和数值输入统一使用 `Input`，由它提供全项目一致的操作渐变焦点边框；页面仍可通过局部布局和 CSS 变量控制尺寸、圆角与底色。原生单选框继续由 `Radio` 管理。

`SegmentedTabs` supports two or more options and shares a 500ms droplet transition through `GOOEY_DURATION_MS`. Read its README before changing motion; keep the local `--app-action-gradient`.
`SegmentedTabs` 支持至少两项，统一使用 `GOOEY_DURATION_MS` 的500 毫秒水滴切换；修改动效前阅读组件 README，保留本项目操作渐变。

`CountUp` animates numbers or numeric strings with a shared 500ms default. Omit page-level `duration` overrides, preserve raw numeric strings, and keep loading placeholders outside the component. See `CountUp/README.md`.
`CountUp` 支持数字及数字字符串，公共默认时长500 毫秒。页面省略 `duration`，直接传入原始数字字符串，加载占位由调用方保留；详见 `CountUp/README.md`。

The rotating asset-card highlight is the `orbit-border` style utility, documented in `src/styles/README.md`; it needs no new React wrapper or dependency.
资产卡片转圈光效是 `orbit-border` 公共样式类，用法见 `src/styles/README.md`，无需新建 React 封装或新增依赖。
