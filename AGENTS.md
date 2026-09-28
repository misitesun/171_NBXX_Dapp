# Agent Project Rules
# AI 协作项目规则

Read this file before changing code in this template.
修改本模板代码前先阅读本文件。

These rules are part of the template and should be preserved when creating new projects from it.
这些规则属于模板的一部分，基于模板创建新项目时应保留。

## Package manager
## 依赖管理

Use pnpm for dependency installation, scripts, tests, builds and lint checks.
依赖安装、脚本运行、测试、构建和 lint 检查统一使用 pnpm。

Do not ask which package manager should be used during setup; pnpm is fixed.
初始化时不要询问包管理器；pnpm 是固定规则。

Keep `pnpm-lock.yaml` as the only package lock file.
只保留 `pnpm-lock.yaml` 作为依赖锁文件。

Do not create or commit `package-lock.json` or `yarn.lock`.
不要创建或提交 `package-lock.json` 或 `yarn.lock`。

Keep the package-manager guard enabled so npm and yarn fail fast.
保留包管理器校验脚本，让 npm 和 yarn 尽早失败。

Keep the template package name fixed as `@jcy/template-react`.
模板包名固定为 `@jcy/template-react`。

Do not ask for or rewrite the package name during real project setup.
真实项目初始化时不要询问或改写包名。

## AI governance
## AI 协作治理

Before changing source code, configuration, dependencies, scripts or automation, read `docs/ai-collaboration.md` and the relevant module documentation.
修改源码、配置、依赖、脚本或自动化前，先阅读 `docs/ai-collaboration.md` 和相关模块文档。

Select the matching local skill under `.agents/skills/` before implementation: use `dapp-feature-delivery` for a scoped business feature, `dapp-cross-cutting-change` for shared contracts or infrastructure, `dapp-change-review` for read-only review, `dapp-react-engineering` for React implementation or refactoring, and `dapp-project-integration` for a first real project flow that combines confirmed PHP and ABI contracts.
实现前选择 `.agents/skills/` 中匹配的本地 skill：范围明确的业务功能使用 `dapp-feature-delivery`，共享契约或基础设施改动使用 `dapp-cross-cutting-change`，只读审查使用 `dapp-change-review`，React 实现或重构使用 `dapp-react-engineering`；首次基于已确认 PHP 与 ABI 契约开展真实项目联调时使用 `dapp-project-integration`。

Declare the objective, allowed files or modules, explicit non-goals, source documents and validation commands before editing. If the task expands beyond that declaration, pause and obtain a new scope instead of folding unrelated refactors into the same change.
修改前声明目标、允许改动的文件或模块、明确不做的事项、依据文档和验证命令。任务超出该声明时，应暂停并重新确认范围，不要把无关重构混入同一改动。

Do not invent PHP API fields, response envelopes, error semantics, contract ABI details, addresses, Token decimals or chain assumptions. Read `docs/php-api-contracts.md` before adding or changing API integration, and wait for the corresponding Markdown contract when project facts are missing.
不要猜测 PHP 接口字段、响应包裹层、错误语义、合约 ABI 细节、地址、Token 精度或链配置。新增或修改接口联调前先阅读 `docs/php-api-contracts.md`；项目事实缺失时等待对应 Markdown 契约。

For a real PHP-and-contract flow, read `docs/dapp-project-integration.md` and use `dapp-project-integration` after both source contracts are available. A legacy DApp or template starter adapter can explain an interaction flow, but never establishes current API, ABI, address, asset, or authentication facts.
真实 PHP 与合约联调时，在两类事实文档到位后阅读 `docs/dapp-project-integration.md` 并使用 `dapp-project-integration`。旧 DApp 或模板启动适配器可以说明交互流程，但不能确立当前接口、ABI、地址、资产或鉴权事实。

Keep changes narrow. Do not add dependencies, alter remote Git state, migrate architecture, or rewrite unrelated modules unless the developer explicitly requests it.
保持改动范围收敛。除非开发者明确要求，不要新增依赖、修改远程 Git 状态、迁移架构或重写无关模块。

## New project setup
## 新项目初始化

Before developing a real project from this template, read `PROJECT_SETUP.md` and complete the setup checklist with the developer.
基于本模板开发真实项目前，先阅读 `PROJECT_SETUP.md` 并与开发者完成初始化清单。

After setup, follow `PROJECT_WORKFLOW.md` to decide the next development step instead of guessing from template defaults.
初始化后，按 `PROJECT_WORKFLOW.md` 判断下一步开发内容，不要根据模板默认值猜测。

After setup is complete, send next-step guidance in the same message and do not stop at a completion summary.
初始化完成后，必须在同一条消息里给出下一步引导，不要停在完成总结。

The next-step guidance must follow the fixed post-setup development sequence from `PROJECT_WORKFLOW.md`.
下一步引导必须按 `PROJECT_WORKFLOW.md` 中的固定后续开发顺序执行。

Do not enter the next step until the current step is complete.
当前步骤未完成前，不进入下一步。

The fixed post-setup development sequence is: 1) static pages, 2) backend API Markdown documentation and centralized request method setup, 3) Node or contract Markdown documentation and DApp contract wrapper plus env contract address setup, 4) feature logic integration after asking for `.env.development` `VITE_BASE_URL` and `VITE_RPC_URL`, 5) pre-build animations, i18n language unlock and static page copy translation.
固定后续开发顺序为：1）静态页面，2）索要后端接口 Markdown 文档并集中配置请求方法，3）索要 Node 或合约 Markdown 文档并配置 DApp 合约封装与 env 合约地址，4）询问 `.env.development` 的 `VITE_BASE_URL` 和 `VITE_RPC_URL` 后对接功能逻辑，5）打包前处理动画、多语言解开和静态页面文案翻译。

Step 3 is the only skippable step. If contract documentation is not ready but API documentation is ready, record the skipped contract step in `PROJECT_SETUP_STATUS.md`, continue to Step 4 with API-backed logic, and leave contract-backed logic as TODO until the contract document is provided.
第 3 步是唯一可跳过步骤。如果合约文档暂未就绪但接口文档已就绪，则把跳过的合约步骤记录到 `PROJECT_SETUP_STATUS.md`，继续第 4 步先对接接口驱动逻辑，合约驱动逻辑保留 TODO，等合约文档补齐后再做。

Theme SCSS setup should be handled automatically during designed page implementation.
主题 SCSS 配置应在页面实现时自动抽取公共颜色。

Do not ask the developer to confirm colors one by one or run a separate color setup step.
不要让开发者一个颜色一个颜色确认，也不要单独走一轮颜色配置步骤。

If no design reference exists yet, keep the template defaults and defer shared color extraction until page implementation.
如果暂无设计参考，先保留模板默认值，等页面实现时再抽取公共颜色。

During page implementation, automatically reuse existing tokens or promote brand colors, global backgrounds, shared card or box colors, common text colors, common status colors and repeated page or component colors to `src/styles/color.scss`.
页面实现时自动抽取公共颜色：先复用已有 token；品牌色、全局背景、共享卡片或盒子色、通用文字色、通用状态色，以及多个页面或组件重复出现的颜色，应自动提升到 `src/styles/color.scss`。

Keep decorative gradients, one-off glow colors and page-specific artwork colors in page SCSS.
装饰渐变、一次性光效颜色和页面专属切图配色留在页面私有 SCSS。

Only ask the developer when the decision changes the project-wide theme direction, such as replacing the main brand color, switching the whole project between dark and light visual systems, or resolving a real design contradiction.
只有当判断会改变全项目主题方向时才询问开发者，例如替换项目主品牌色、整体暗色/亮色体系切换，或设计稿本身出现明显冲突。

Ask project-specific unknowns one setup item at a time. The default setup pack is the only grouped setup question.
项目特有且未知的配置一次只问一项。默认配置包是唯一可以合并询问的初始化问题。

The default setup pack may include route base `/h5/`, home route `/home`, layout menu `sidebar`, login mode `dapp`, i18n enabled with development `zh-Hans` and production `en`, BSC production chain and the standard DApp write defaults.
默认配置包可以包含部署目录 `/h5/`、首页 `/home`、布局菜单 `sidebar`、登录模式 `dapp`、启用多语言且开发环境默认 `zh-Hans`、生产环境默认 `en`、BSC 生产网络和标准 DApp 写合约默认项。

When presenting the default setup pack, include available options and short meanings for each item, not only the default values.
询问默认配置包时，必须同时列出可选项和简短含义，不能只列默认值。

At minimum, explain `sidebar` side navigation, `tabbar` bottom navigation, `dapp` wallet login, `hybrid` wallet and account login, `account` account/password login, i18n enabled or disabled, development `zh-Hans`, production `en`, BSC, other viem chain, gas check disabled by default, gas estimate disabled by default, ERC20 maximum approval by default, passed specific amount approval as an option, and token decimals such as 18 or other decimals.
至少说明 `sidebar` 侧边栏导航、`tabbar` 底部导航、`dapp` 钱包登录、`hybrid` 钱包与账号登录、`account` 账号密码登录、多语言启用或关闭、开发环境 `zh-Hans`、生产环境 `en`、BSC、other viem chain、Gas 检查默认关闭、Gas 估算默认关闭、ERC20 默认最大授权、可选按传入具体数值授权，以及 18 或其他 Token 精度含义。

If the developer replies `默认`, record the whole default setup pack as confirmed. If they provide changed fields such as `菜单 tabbar，多语言关闭`, only change those fields.
如果开发者回复 `默认`，记录整个默认配置包为已确认。如果开发者提供 `菜单 tabbar，多语言关闭` 这类修改字段，则只改这些字段。

After the template is copied into a real project, run `pnpm install`, `pnpm env:init` and `pnpm dev` before asking the first setup question.
模板复制到真实项目后，先运行 `pnpm install`、`pnpm env:init` 和 `pnpm dev`，再询问第一个初始化问题。

When the dev server is ready, report the Vite `Local` and `Network` URLs, especially the LAN address, in the same message as the default setup pack question.
开发服务启动成功后，将 Vite 输出的 `Local` 和 `Network` 访问地址，尤其是局域网地址，和默认配置包询问放在同一条消息里发给开发者。

Do not ask for the project name, project logo, Empty component icon, env values, contract addresses, social meta, page assets or other non-default setup items in the same message as the default setup pack.
不要在默认配置包同一轮里询问项目名称、项目 logo、Empty 组件图标、env 值、合约地址、社交 meta、页面切图或其他非默认初始化项。

After the default setup pack is confirmed, ask non-default setup items one at a time.
默认配置包确认后，再对非默认初始化项一次只问一项。

Ask for the project logo resource only; generate favicon from the logo and do not ask the developer for favicon.
只向开发者索要项目 logo 资源；favicon 由 logo 生成，不要再向开发者索要 favicon。

Ask whether the Empty component icon is ready only after the project logo answer has been handled.
只有项目 logo 的回答处理完后，才单独询问 Empty 组件图标是否已准备好。

If the developer has no Empty component icon yet, tell them it can be skipped during early development and record it in `PROJECT_SETUP_STATUS.md`.
如果开发者暂时没有 Empty 组件图标，告诉他前期开发可先跳过，并记录到 `PROJECT_SETUP_STATUS.md`。

If the Empty component icon is provided, run `pnpm empty:asset -- --input <empty-icon.png>`.
如果已提供 Empty 组件图标，运行 `pnpm empty:asset -- --input <empty-icon.png>`。

The Empty asset script must read the PNG width and height automatically. A 1x Figma export uses its original width. A large 2x export, usually close to 750px wide or around 500px tall, uses half width. The component writes width only and keeps height as auto.
Empty 图标脚本必须自动读取 PNG 宽高。Figma 导出的 1x 图使用原始宽度；较大的 2x 图通常接近 750px 宽或 500px 高，此时使用一半宽度。组件只写宽度，高度保持 auto。

If the developer has no project logo yet, tell them it can be skipped during early development, keep `public/brand/brand-status.json` not ready, and do not mark it ready until the real logo is replaced.
如果开发者暂时没有项目 logo，告诉他前期开发可先跳过，保持 `public/brand/brand-status.json` 为未就绪，直到替换真实 logo 后才能标记为就绪。

Production build must fail while `public/brand/brand-status.json` says the project logo is not ready.
当 `public/brand/brand-status.json` 表示项目 logo 未就绪时，生产构建必须失败。

Do not treat template defaults as confirmed project decisions.
不要把模板默认值当成项目已经确认的决策。

## Project terminology
## 项目术语

Read `PROJECT_TERMS.md` before copying visible text from Figma or old project code.
从 Figma 或旧项目代码复制可见文案前，先阅读 `PROJECT_TERMS.md`。

The base template defines no product vocabulary. Add a source term, approved term, scope and reason only after the developer confirms a project-specific rule.
基础模板不预置产品词汇。只有开发者确认项目专属规则后，才添加原词、推荐词、适用范围和原因。

If Figma or legacy code conflicts with a confirmed term, use the approved term in UI source and record the mismatch in the implementation checklist.
如果 Figma 或旧代码与已确认术语冲突，UI 源码使用推荐词，并在实现清单中记录差异。

## Production API origin
## 生产接口地址

Keep `VITE_BASE_URL` empty in `.env.production`.
`.env.production` 中的 `VITE_BASE_URL` 必须保持为空。

Production API requests must use relative `/api/...` paths against the current site origin.
生产接口请求必须使用相对 `/api/...` 路径并访问当前网站同源地址。

Do not write a production API domain into source code or production env.
不要在源码或生产环境变量中填写正式接口域名。

Keep `VITE_RPC_URL` empty in `.env.production` because production uses `DAPP_PRODUCTION_CHAIN` and does not read the local-chain RPC setting.
`.env.production` 中的 `VITE_RPC_URL` 必须保持为空，因为生产环境使用 `DAPP_PRODUCTION_CHAIN`，不会读取本地测试链 RPC 配置。

These rules do not apply to `.env.development`, which may use a LAN API URL and local-chain RPC URL during integration.
这些规则不适用于 `.env.development`，开发联调时可以填写局域网接口地址和本地测试链 RPC 地址。

## API mutation response boundaries
## API 提交响应边界

Before implementing a button-triggered `POST`, `PUT`, `PATCH` or `DELETE`, decide whether the success response body is required by the next frontend step.
实现按钮触发的 `POST`、`PUT`、`PATCH` 或 `DELETE` 前，必须先判断成功响应体是否是前端下一步操作的必需输入。

If the page only needs to know that the HTTP request succeeded, the feature method must return `Promise<void>`, await `request<unknown>(...)`, and must not parse, destructure or validate the unused success body. Do not parse a mutation response merely because the API documentation lists its fields. Keep non-2xx handling in the shared HTTP error path, then refresh authoritative state through the documented read endpoint when needed.
如果页面只需要知道 HTTP 请求成功，feature 方法必须返回 `Promise<void>`，只等待 `request<unknown>(...)`，不得解析、解构或校验未使用的成功响应体。不能仅因为接口文档列出了返回字段就解析提交响应。非 2xx 仍走公共 HTTP 错误链路；需要更新页面时，再通过已文档化的读取接口刷新权威数据。

If the response is required for a contract call, navigation target, follow-up request key, download URL or other immediate behavior, validate and return only the documented fields actually consumed. Server-signed contract arguments remain strictly validated and passed through unchanged.
如果响应是合约调用参数、跳转目标、后续请求标识、下载地址或其他即时行为的必需输入，则只校验并返回实际使用且已文档化的字段。服务端签名的合约参数仍必须严格校验并原样透传。

Do not let a post-success refresh or display update turn a completed mutation into a failure Toast. Mutation failure and refresh failure need separate error boundaries unless the refresh helper catches and reports its own errors. Add a regression test in which a successful unused response body is empty or incompatible and the mutation still resolves, while HTTP failures still reject.
提交成功后的刷新或展示更新，不能把已经完成的提交改报成失败 Toast。除非刷新函数内部已经自行捕获并提示错误，否则提交失败与刷新失败必须使用不同的错误边界。回归测试必须覆盖：HTTP 成功但未使用的响应体为空或类型不兼容时，提交仍成功完成；HTTP 失败仍正常抛错。

## DApp contract reads
## DApp 合约读取

Do not omit `account` only because a contract call is a `view` / `pure` read.
不要只因为合约调用是 `view` / `pure` 读取就省略 `account`。

Before implementing a page or contract wrapper read, check whether the contract function has no `user`, `owner` or `account` address parameter but returns data related to the current user's assets, orders, rewards, claim eligibility or permissions.
实现页面或合约读取封装前，先检查该合约方法是否没有 `user`、`owner` 或 `account` 等地址参数，但返回值却与当前用户资产、订单、收益、领取资格或权限有关。

Also check whether the contract implementation uses `msg.sender`, or may depend on `msg.sender` for identity, permission or delegated-account context.
同时检查合约实现是否使用 `msg.sender`，或可能依赖 `msg.sender` 判断身份、权限或委托账户上下文。

If any user-context condition applies, explicitly pass the current connected wallet address, for example `readContract({ ..., account: connectedAddress })`.
如果满足任一用户上下文条件，必须显式传入当前连接钱包地址，例如 `readContract({ ..., account: connectedAddress })`。

`readDappContract` supports an optional `account`, and the business layer must pass it only when the read depends on the caller context.
`readDappContract` 支持可选 `account`，业务层只在读取依赖调用者上下文时传入。

Do not force-inject the current wallet address into every contract read.
不要把当前钱包地址强制注入所有合约读取。

Public reads such as global config, public market data, public行情 and Token metadata should keep no `account`.
全局配置、公共行情、Token 元数据等与调用者无关的公共读取应保持不传 `account`。

EIP-7702 delegated accounts need extra care: missing `account` / `from` in `eth_call` may execute under an empty-address context and revert, even when transaction simulation or wallet-side calls succeed.
EIP-7702 委托账户要特别注意：`eth_call` 缺少 `account` / `from` 时，可能以空地址上下文执行并回退，即使实际交易模拟或钱包内调用可以成功。

Every new user-context read must add regression tests covering business-layer address passing, `readDappContract` forwarding to viem `readContract`, and public reads not requiring `account`.
每次新增依赖用户上下文的读取，都必须补回归测试，覆盖业务层传入钱包地址、`readDappContract` 透传给 viem `readContract`，以及公共读取不要求传 `account`。

## Import paths
## 引入路径

Use relative imports for files in the same directory or nearby parent directories.
同目录或较近上级目录的文件可以使用相对路径。

`./`, `../` and `../../` are acceptable.
可以接受 `./`、`../` 和 `../../`。

Use the `@/` alias once an import would need three or more parent jumps.
当引入路径需要三级或更多上级跳转时，必须使用 `@/` 别名。

Do not write imports such as `../../../services/...`.
不要写 `../../../services/...` 这类引入。

Use `@/services/...`, `@/shared/...`, `@/router/...`, `@/assets/...` instead.
改用 `@/services/...`、`@/shared/...`、`@/router/...`、`@/assets/...`。

## Page modules
## 页面模块

Treat each route page as a small module directory.
把每个路由页面当成一个小模块目录。

A normal page should start with a `PageName.tsx` file and a `PageName.scss` file.
普通页面通常从 `PageName.tsx` 和 `PageName.scss` 两个文件开始。

Keep same-directory page helpers next to the page and import them with `./`.
页面同目录辅助逻辑放在页面旁边，并使用 `./` 引入。

Use optional files only when the page needs them, such as `types.ts`, `utils.ts`, `service.ts` or `components/`.
仅在页面需要时增加 `types.ts`、`utils.ts`、`service.ts` 或 `components/` 等可选文件。

## Figma page implementation workflow
## Figma 页面生成流程

Before implementing a page from a Figma link, do not write code immediately.
根据 Figma 链接开发页面前，不要直接开始写代码。

First inspect the design and the current project, then provide an implementation checklist for developer confirmation.
先分析设计稿和当前项目，再输出实现清单给开发者确认。

Strict visual fidelity is a mandatory acceptance criterion. When Figma inspection tools can expose a layer's exact properties, read and use those values instead of estimating them from a screenshot. This includes typography (font family, weight, size, line height and letter spacing), colors and opacity, width and height, padding, gaps, borders, corner radii, shadows, blur, and gradient type, angle, stops, positions and opacity.
严格视觉还原是强制验收标准。当 Figma 检查工具可以读取图层的准确属性时，必须读取并采用这些数值，不能根据截图猜测或大概估算。范围包括字体（字体族、字重、字号、行高、字间距）、颜色与透明度、宽高、内外间距、gap、边框、圆角、阴影、模糊，以及渐变类型、角度、色标、位置和透明度。

Before styling, record the measured design properties for the relevant layers in the implementation checklist. Preserve the Figma frame values as the source values for the project's existing px-to-vw pipeline; do not manually rescale or round them unless an exported asset scale or responsive rule is explicitly documented.
开始写样式前，必须在实现清单中记录相关图层的设计量测值。Figma 画板值应作为项目现有 px-to-vw 流程的源数值；除非切图倍数或响应式规则已有明确说明，否则不得手动缩放或随意取整。

Estimation is allowed only when an exact property is genuinely unavailable because of permission, tool, API, rasterization or ambiguous responsive behavior. Mark every estimated value and its reason in the checklist or completion report; never present an estimate as a measured Figma value. Validate the finished page at the design frame width with a screenshot comparison and correct measurable visual differences before declaring the page complete.
只有因权限、工具、API、栅格化资源或响应式语义不明确而确实无法读取准确属性时，才允许估算。每个估算值及其原因都必须在实现清单或完成报告中标明；不得把估算值描述成 Figma 实测值。页面完成前，必须在设计稿画板宽度下截图对照，并修正可量测的视觉差异后才能宣布完成。

Before implementing a designed page, ask the developer to manually export the page assets first whenever possible.
开发设计稿页面前，尽量先让开发者手动导出该页面需要的切图资源。

Figma export and slicing choices are very flexible, so AI should not guess the best asset combination or silently download arbitrary slices.
Figma 的切图和导出组合太自由，AI 不应猜测最合适的切图组合，也不要静默下载随意切片。

AI should list the required semantic asset names and target paths, then wait for the exported assets before writing the page.
AI 应先列出需要的语义化资源名和目标路径，等切图资源准备好后再写页面。

Shared module overall layout and interaction contracts must stay stable regardless of the page design, unless there is explicit manual developer intervention.
不管项目设计稿看起来怎样，公共模块的整体布局和交互契约都必须保持稳定，除非有开发者人工手动介入并明确要求修改。

For shared modules such as app layout, header, AppBrand, tabbar, sidebar, language switch, Popup and Picker, use content-level adaptation by default: replace resources, update text configuration, hide or show app name, reorder controls inside an existing slot, or adjust project settings.
对于 app layout、header、AppBrand、tabbar、sidebar、language switch、Popup、Picker 等公共模块，默认做内容级适配：替换资源、更新文案配置、隐藏或显示 appname、在已有插槽内调整内容顺序，或调整项目设置。

Do not rebuild a shared header structure just because Figma shows a single left image instead of logo plus app name, a gradient wallet button, or a different icon arrangement.
不要因为 Figma 顶部展示的是单独左侧图片而不是 logo 加 appname、渐变钱包按钮或不同图标排列，就重建公共 header 结构。

If the same overall header layout can match the design by replacing the logo resource, hiding app name, reordering controls inside the existing right slot, or applying an existing button visual variant, do that without asking.
如果在整体 header 布局不变的情况下，通过替换 logo 资源、隐藏 appname、在已有右侧插槽内调整控件顺序，或套用已有按钮视觉变体就能贴近设计稿，应直接这样做，不需要询问。

If a design truly needs a one-off header or navigation area, pause and ask whether to create a page-specific component instead of changing the shared module.
如果设计确实需要一次性的顶部或导航区域，应暂停并询问是否创建页面专属组件，而不是改公共模块。

Treat mobile status bar, carrier, battery, time and other device chrome in Figma frames as design-frame annotations, not H5 page content.
Figma 画板里的手机信息状态栏、运营商、电量、时间等设备外壳信息属于设计稿标注，不属于 H5 页面内容。

Do not implement device chrome in HTML, reserve layout height for it, or export it as a page asset unless the developer explicitly says it is real in-page artwork.
不要把设备外壳信息写进 HTML、为它预留布局高度，或把它当页面切图导出，除非开发者明确说明它是真实页面内的装饰图。

The checklist must include required exported assets, semantic UI elements, reusable components, reusable style classes, reusable mixins and page-specific exceptions.
清单必须包含所需切图资源、语义化 UI 元素、可复用组件、可复用样式类、可复用 mixin 以及页面特例。

Check existing components, `src/styles`, `src/styles/mixins.scss`, showcase pages and nearby page implementations before adding new page SCSS.
新增页面私有 SCSS 前，先检查已有组件、`src/styles`、`src/styles/mixins.scss`、演示页面和相近页面实现。

Map visual controls to semantic elements before styling them: inputs use `input` or `textarea`, actions use `button`, links use route/navigation helpers, and progress uses shared progress components when available.
样式实现前先确认控件语义：输入区使用 `input` 或 `textarea`，操作使用 `button`，跳转使用路由/导航封装，进度展示优先使用已有进度组件。

Static pages still implement basic local interactions when the design includes interactive controls, such as tab switching, inputs, expand-collapse areas, popups and copy buttons.
静态页面如果设计里包含交互控件，仍应实现基础本地交互，例如 tab 切换、输入框、展开收起、弹窗开关和复制按钮。

If the checklist is incomplete or required assets are missing, pause and report the gap instead of filling it with improvised CSS or placeholder markup.
如果清单不完整或必需资源缺失，应暂停并报告缺口，不要用临时 CSS 或占位结构硬补。

## Page data refresh
## 页面数据刷新

Business routes that need whole-screen refresh may be wrapped by `PagePullRefresh`; splash, login and other flow pages must not be wrapped. The blank template route is not wrapped until real data loading exists.
需要整屏刷新的业务路由可由 `PagePullRefresh` 包裹；开屏页、登录页和其他流程页不能包裹下拉刷新。空白模板路由在没有真实数据加载前不包裹刷新组件。

Pages that support pull refresh must register a real refresh function with `usePageRefresh()`.
支持下拉刷新的页面必须通过 `usePageRefresh()` 注册真实刷新函数。

The refresh function must return or await the actual page data loading work, such as API requests, contract reads, list reloads or timer-driven screen refreshes.
刷新函数必须返回或等待真实页面数据加载，例如接口请求、合约读取、列表重载或定时整屏刷新。

Do not use a refresh handler that only increments a version value while the refresh component cannot know when data has actually finished loading.
不要只在刷新函数里递增版本号却让刷新组件无法知道真实数据何时完成。

Disable `usePageRefresh()` while the page is submitting, writing a contract or otherwise unable to safely refresh.
页面提交中、写合约中或其他不适合刷新时，应临时禁用 `usePageRefresh()`。

Paged pages must keep `usePageLoadMore()` disabled and `hasMore=false` while page one is loading or a filter or Tab is replacing the current data set. Reset the rendered list, page cursor, `hasMore` and loading guards synchronously before starting the replacement page-one request, then derive `hasMore` only from that response.
分页页面在第一页加载中，或筛选条件、Tab 正在替换当前数据集时，必须关闭 `usePageLoadMore()` 并保持 `hasMore=false`。发起替换型第一页请求前，应同步重置已渲染列表、页码游标、`hasMore` 和加载门控，再仅根据该第一页响应更新 `hasMore`。

`PagePullRefresh` load-more observation must begin disarmed for every pagination registration and may arm only after a new scroll event. Never reuse historical `window.scrollY` from another Tab or run an immediate fallback proximity check on registration, because either behavior can race page two against the replacement page-one request.
`PagePullRefresh` 的每次分页注册都必须从未启用状态开始，并且只能由之后的新滚动事件启用。不得复用其他 Tab 留下的历史 `window.scrollY`，也不得在注册时立即执行 fallback 距离检测；这两种行为都会让第二页与替换型第一页发生竞态。

Use the shared `DropletLoading` through `loadingIndicator: 'droplet'` for inline paginated loading without visible loading copy. When an empty first page already has its own empty state, set `showNoMore` from the rendered item count so `没有更多了` appears only after a non-empty list has reached its end.
分页的内联加载应通过 `loadingIndicator: 'droplet'` 复用公共 `DropletLoading`，不显示加载中文字。第一页为空且页面已有空状态时，应根据当前已渲染数据量设置 `showNoMore`，只在非空列表真正到达末尾后显示“没有更多了”。

After API or contract integration, use `useLatestRequest()` or `AbortController` to prevent stale async requests from writing old data back into the page.
接口或合约联调后，使用 `useLatestRequest()` 或 `AbortController` 防止旧异步请求把旧数据回写到页面。

When a page has timers, manual pull refresh and post-write refresh should reuse the same screen refresh function and guard timer restart with mounted or lifecycle tokens.
页面存在定时器时，手动下拉刷新和写入成功后的刷新应复用同一个整屏刷新函数，并用 mounted 或生命周期 token 防止离页后旧异步重启定时器。

## Authentication integration
## 鉴权集成

The blank template does not implement splash, login, referral, backend session recovery or protected routes. Do not invent these flows from deleted demo code or template defaults.
空白模板不实现开屏、登录、邀请、后端会话恢复或受保护路由。不要根据已删除演示代码或模板默认值猜测这些流程。

During static UI development, opening `/h5` must go directly to the home page without wallet connection or API authentication. Replace that root redirect only during documented authentication integration in the real project.
静态 UI 开发阶段，打开 `/h5` 必须直接进入首页，不依赖钱包连接或接口鉴权。只有真实项目进入有文档依据的鉴权联调阶段，才能替换根路由跳转。

Implement authentication only after the current PHP Markdown confirms endpoints, request and response fields, challenge/message source, nonce or timestamp semantics, signature encoding, token storage, account-change behavior and redirect rules.
只有当前 PHP Markdown 明确接口、请求与响应字段、challenge/message 来源、nonce 或时间戳语义、签名编码、Token 存储、账户切换行为和跳转规则后，才能实现鉴权。

`signDappMessage()` signs the exact caller-supplied message. Never append a prefix, timestamp or nonce unless the confirmed backend contract requires the caller to construct that exact text.
`signDappMessage()` 原样签署调用方传入的消息。除非已确认后端契约要求调用方构造该确切文本，否则不得自行拼接前缀、时间戳或 nonce。

When DApp session recovery is implemented, validate and resume the current wallet account before authenticated APIs run. A cached token belonging to another wallet must be cleared before starting the documented login flow.
实现 DApp 会话恢复后，必须先校验并恢复当前钱包账号，再请求鉴权接口。缓存 Token 属于其他钱包时，应先清理旧会话，再执行文档化的登录流程。

For wallet-authenticated APIs whose confirmed PHP contract requires `Address`, register the currently connected address through the HTTP service only after checking it against the account associated with the Token. Send `Authorization: Bearer <token>` and `Address: <address>` together for session validation; wait for that validation before other protected business requests. Invalidate both on account change or 401. The cached wallet address alone must not be sent as proof; account-only authentication keeps its own Bearer-only behavior.
若已确认的 PHP 契约要求钱包鉴权接口携带 `Address`，只有将当前连接地址与 Token 关联账号核对后，才能通过 HTTP 服务注册。会话验证请求成对发送 `Authorization: Bearer <token>` 和 `Address: <address>`；验证成功后才发起其他受保护业务请求。账号切换或 401 时令两者失效。缓存地址本身不能作为证明发送；纯账号鉴权保持独立的 Bearer 行为。

## History route fallback
## history 路由 fallback

Use `AppBrowserRouter` instead of a strict `BrowserRouter basename="/h5"`.
使用 `AppBrowserRouter`，不要使用严格的 `BrowserRouter basename="/h5"`。

The router must accept browser URLs both with and without the `/h5` prefix because some H5 servers return the same entry HTML for `/`, `/ref/...` and `/h5/...` without HTTP redirects.
路由必须同时兼容带 `/h5` 和不带 `/h5` 的浏览器地址，因为部分 H5 服务端会把 `/`、`/ref/...` 和 `/h5/...` 都直接返回同一份入口 HTML，而不做 HTTP 重定向。

Keep internal route paths prefix-free and let navigation helpers or `AppBrowserRouter` add the browser base path.
内部路由路径保持不带前缀，由导航辅助方法或 `AppBrowserRouter` 负责补浏览器基础路径。

## Styles
## 样式

Use SCSS for page styles.
页面样式使用 SCSS。

React has no Vue-style `scoped`, so page styles should start from a page-level class prefix.
React 没有 Vue 的 `scoped`，页面样式应从页面级类名前缀开始。

Prefer names like `.splash-page`, `.home-page` and nested element classes under them.
优先使用 `.splash-page`、`.home-page` 这类页面根类名，并在其下编写子元素类名。

Reuse existing global utility classes from `src/styles` before writing new page CSS.
编写新的页面 CSS 前，优先复用 `src/styles` 中已有的全局工具类。

If a visual result can be built by combining existing utility classes, compose those classes in `className` instead of adding a custom selector.
如果某个视觉效果可以通过组合已有通用类实现，就在 `className` 中组合这些类，不要额外新增自定义选择器。

If a style already exists as a utility class, put that class directly in `className`.
如果某个样式已经有对应工具类，直接把该类写到 `className` 中。

Do not duplicate utility styles in page or component SCSS.
不要在页面或组件 SCSS 中重复编写已有工具类的等价样式。

Only write custom SCSS for styles that are genuinely page-specific or hard to express with utilities, such as special positioning, unusual shapes, complex backgrounds, state selectors, animations or component internals.
只有确实属于页面特有、或很难用通用类表达的样式才写自定义 SCSS，例如特殊定位、特殊形状、复杂背景、状态选择器、动画或组件内部结构。

For example, use `className="flex items-center justify-center tc size-24"` instead of rewriting the same flex, alignment, text-align or font-size CSS.
例如，使用 `className="flex items-center justify-center tc size-24"`，不要重复编写同等的 flex、对齐、文本居中或字号 CSS。

## Page layout
## 页面布局

Build page structure in normal document flow first. Use semantic sections with `padding`, `margin`, `gap`, Flexbox and Grid for page shells, content blocks, cards, forms, lists, tabs and action areas.
页面结构必须先按正常文档流构建。页面骨架、内容区块、卡片、表单、列表、tab 和操作区应使用语义化区块配合 `padding`、`margin`、`gap`、Flexbox 和 Grid 实现。

Do not use `position: absolute`, `fixed`, `sticky`, or `top` / `left` / `right` / `bottom` coordinates to arrange normal sequential content or to reproduce a Figma screenshot by placement.
不要使用 `position: absolute`、`fixed`、`sticky`，或 `top` / `left` / `right` / `bottom` 坐标来排列正常顺序的内容，也不要靠定位复刻 Figma 截图。

`position: relative` is allowed only to establish a local anchor or stacking context. `absolute` is limited to a small icon, badge, or non-interactive decorative background; regular page content must remain in flow.
`position: relative` 只用于建立局部锚点或层叠上下文。`absolute` 只限于小图标、角标或非交互装饰背景；常规页面内容必须留在文档流中。

`fixed` and `sticky` are reserved for shared app chrome or true viewport overlays. Reuse `Popup`, `ContractLoading` and other shared components instead of building page-local fixed layers; a splash-style exception must be rare and explicit.
`fixed` 和 `sticky` 保留给公共应用外壳或真正的视口覆盖层。应复用 `Popup`、`ContractLoading` 等公共组件，而不是创建页面本地 fixed 层；开屏类例外必须很少且明确。

For every `absolute`, `fixed`, or `sticky` declaration in page SCSS, add an immediately preceding `layout-exception` comment with one allowed category: `background-art`, `icon-overlay`, `badge-overlay`, or `viewport-overlay`, followed by a concrete reason. `pnpm lint` validates this for page styles.
页面 SCSS 中每个 `absolute`、`fixed` 或 `sticky` 声明前一行必须加 `layout-exception` 注释：类别只能是 `background-art`、`icon-overlay`、`badge-overlay` 或 `viewport-overlay` 之一，并写明具体原因。`pnpm lint` 会校验页面样式。

```scss
/* layout-exception: background-art decorative glow stays behind flowing content */
position: absolute;
```

Read `docs/layout-standards.md` before implementing a designed page. The existing shared navigation layout under `src/pages/main/layout/` is a maintained infrastructure exception, not a pattern for normal page content.
开发设计页面前先阅读 `docs/layout-standards.md`。`src/pages/main/layout/` 下现有的公共导航布局是已维护的基础设施例外，不能作为普通页面内容的范式。

## Editor tools
## 编辑器工具

VS Code users should install `IntelliSense for CSS class names in HTML` by `Zignd`.
VS Code 用户建议安装 `Zignd` 的 `IntelliSense for CSS class names in HTML`。

This extension provides class name suggestions in `className`, including SCSS utility classes from `src/styles`.
这个插件用于在 `className` 中提示样式类名，包括 `src/styles` 中的 SCSS 工具类。

If suggestions do not appear, make sure the extension is enabled globally and run `Cache CSS class definitions`.
如果没有提示，确认插件已全局启用，然后执行 `Cache CSS class definitions`。

## Assets
## 资源

Use semantic asset names instead of numeric names.
资源命名使用语义化名称，不使用数字名称。

Good examples are `splash-logo.png`, `token-usdt.png` and `home-banner.png`.
推荐示例：`splash-logo.png`、`token-usdt.png`、`home-banner.png`。

Use SVG for clean icons and vector graphics when available.
干净的图标和矢量图优先使用 SVG。

Use PNG or WebP for complex raster images, screenshots, glow effects and exported design slices.
复杂位图、截图、发光效果和设计稿切图使用 PNG 或 WebP。

Before implementing a designed page, confirm that required exported page assets are already available in the project.
开发设计稿页面前，先确认页面所需切图资源已经放入项目。

Prefer human-exported Figma slices for complex images, decorative frames, glow effects, page backgrounds and non-trivial icons.
复杂图片、装饰边框、光效、页面背景和非常规图标优先使用人工从 Figma 导出的切图。

Decorative design slices do not require `alt`; do not treat missing `alt` on page artwork as a blocking issue.
装饰性设计切图不强制要求编写 `alt`；不要把页面视觉图缺少 `alt` 当作阻塞问题。

Do not replace missing designed assets with CSS drawings, text, emoji or temporary symbols unless the developer explicitly asks for a placeholder prototype.
缺少设计资源时，不要擅自用 CSS 绘制、文字、表情或临时符号顶替，除非开发者明确要求先做占位原型。

If required assets are missing, pause page implementation and list the missing semantic asset names and suggested target paths.
如果必需资源缺失，应暂停页面实现，并列出缺少的语义化资源名和建议放置路径。

Place private page images in a dedicated page directory under `src/assets/` (for example, `src/assets/<page-name>/`); keep initialization brand assets under `public/brand/`.
页面私有图片必须放在 `src/assets/` 下为该页面创建的专属目录中（例如 `src/assets/<page-name>/`）；初始化品牌资源继续放在 `public/brand/`。

Keep public, reusable images and icons as one semantic file under `src/assets/common/`; import that file instead of exporting or copying the same image into multiple page directories.
公共类型、可跨页面复用的图片和图标统一以语义化文件名存放在 `src/assets/common/`，各页面引用同一份资源，不要在不同页面重复导出或复制同一图片。

## Verification
## 验证

Run tests, build and lint before claiming a change is complete.
声明改动完成前需要运行测试、构建和 lint。

At minimum, run `pnpm test`, `pnpm build` and `pnpm lint`.
至少运行 `pnpm test`、`pnpm build` 和 `pnpm lint`。

`pnpm build` is a hard quality gate: its prebuild lifecycle runs `pnpm verify`, which runs lint and tests before TypeScript and Vite can emit production assets. Do not bypass or remove this lifecycle.
`pnpm build` 是强制质量门禁：prebuild 生命周期会先运行 `pnpm verify`，由它执行 lint 和测试，全部通过后 TypeScript 和 Vite 才能生成生产产物。不得绕过或删除该生命周期。

## Test design
## 测试设计

Test stable business behavior and module contracts, not incidental presentation values or human-maintained file ordering.
测试稳定的业务行为和模块契约，不测试偶然的展示数值或人工维护的文件排序。

For configurable settings, verify that code reads the setting and behaves consistently with its current value. Do not hard-code a chosen size, color, switch value, env field list, or env order unless it is an explicit immutable requirement.
对于可配置项，验证代码确实读取该设置且行为与当前值一致。除非用户明确要求其不可变，否则不要写死尺寸、颜色、开关值、env 字段清单或 env 排序。
