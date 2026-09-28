# Project development workflow
# 项目开发流程清单

Use this guide after copying the template into a real project.
复制模板创建真实项目后，按本文档决定下一步该做什么。

This file is the day-to-day route map. `PROJECT_SETUP.md` answers what must be configured, and this file answers when and how to do it.
本文档是日常开发路线图。`PROJECT_SETUP.md` 负责说明必须配置什么，本文档负责说明何时做、怎么做。

## 0. Read these files first
## 0. 先阅读这些文件

Read the documents in this order before changing a real project.
开发真实项目前，按以下顺序阅读文档。

1. `README.md`
1. `README.md`
2. `AGENTS.md`
2. `AGENTS.md`
3. `PROJECT_SETUP.md`
3. `PROJECT_SETUP.md`
4. `PROJECT_TERMS.md`
4. `PROJECT_TERMS.md`
5. `PROJECT_WORKFLOW.md`
5. `PROJECT_WORKFLOW.md`
6. `docs/ai-collaboration.md`
6. `docs/ai-collaboration.md`
7. `docs/architecture.md`
7. `docs/architecture.md`
8. `.env.example`
8. `.env.example`

When the task touches an API, also read `docs/php-api-contracts.md`. When it combines a real PHP flow with a contract flow, also read `docs/dapp-project-integration.md` and select `dapp-project-integration` after the current API and ABI Markdown are available.
任务涉及接口时，还要阅读 `docs/php-api-contracts.md`。任务首次组合真实 PHP 与合约流程时，在当前 API 和 ABI Markdown 到位后还要阅读 `docs/dapp-project-integration.md` 并选择 `dapp-project-integration`。

Do not treat template defaults as project decisions. Confirm them with the developer first.
不要把模板默认值当成真实项目决策。先和开发者确认。

## 1. AI startup prompt
## 1. AI 启动项目提示词

Use this prompt when asking an AI tool to start a real project from the template.
当你让 AI 基于模板启动真实项目时，使用下面的提示词。

### Empty project prompt
### 空项目目录提示词

Use this short prompt when only an empty project folder has been created.
当你只创建了一个空项目文件夹时，复制下面这句即可。

```txt
请使用模板仓库中 `packages/create-template-react/jcy-create-template-react-0.1.0.tgz` 这个本地包，在目标空目录创建 React H5 DApp 项目，并按模板文档开始初始化；如果本地包不存在或不是最新版，请先在 `react_dapp_demo` 仓库执行 `git pull` 和 `pnpm create:local`。
```

The local create command from the template repository is `pnpm dlx ./packages/create-template-react/jcy-create-template-react-0.1.0.tgz ../my-dapp`.
在模板仓库中运行的本地创建命令是 `pnpm dlx ./packages/create-template-react/jcy-create-template-react-0.1.0.tgz ../my-dapp`。

If the local create package is unavailable, the source repository is `https://github.com/misitesun/react_dapp_demo.git`.
如果本地创建包暂不可用，源码仓库是 `https://github.com/misitesun/react_dapp_demo.git`。

After the template is copied, the AI should start the project before asking the first setup question.
模板下载完毕后，AI 应先将项目运行起来，再询问第一个初始化问题。

Do not ask which package manager should be used during setup; pnpm is fixed.
初始化时不要询问包管理器；pnpm 是固定规则。

Run the startup commands first.
先运行启动命令。

```bash
pnpm install
pnpm env:init
pnpm dev
```

When the dev server is ready, report the Vite `Local` and `Network` URLs, including the LAN address, in the same message as the default setup pack question.
开发服务启动成功后，将 Vite 输出的 `Local` 和 `Network` 访问地址，尤其是局域网地址，和默认配置包询问放在同一条消息里发给开发者。

The default setup pack is the only grouped setup question.
默认配置包是唯一可以合并询问的初始化问题。

Do not ask for the project name, project logo, Empty component icon, env values, contract addresses, social meta, page assets or other non-default setup items in that first message.
不要在同一轮询问项目名称、项目 logo、Empty 组件图标、env 值、合约地址、社交 meta、页面切图或其他非默认初始化项。

Ask non-default setup items one at a time after the default setup pack is confirmed.
默认配置包确认后，再对非默认初始化项一次只问一项。

The developer can reply `默认` to accept the default setup pack. If anything should change, they can answer only the changed fields, such as `菜单 tabbar，多语言关闭`.
开发者可以回复 `默认` 接受默认配置包。若需要修改，只回复要改的字段即可，例如 `菜单 tabbar，多语言关闭`。

The default setup pack must show available options and meanings, not only the default values.
默认配置包必须说明可选项和含义，不能只列默认值。

Default setup pack example:
默认配置包示例：

- Route base: default `/h5/`; options are `/h5/`, `/` or a custom prefix.
- 部署目录：默认 `/h5/`；可选项为 `/h5/`、`/` 或自定义前缀。
- Home route: default `/home`; options are `/home` or another first-level home route.
- 首页路由：默认 `/home`；可选项为 `/home` 或其他一级首页路由。
- Layout menu: default `sidebar`; options are `sidebar` side navigation or `tabbar` bottom navigation.
- 布局菜单：默认 `sidebar`；可选项为 `sidebar` 侧边栏导航或 `tabbar` 底部导航。
- Login mode: default `dapp`; options are `dapp` wallet login, `hybrid` wallet and account login, or `account` account/password login.
- 登录模式：默认 `dapp`；可选项为 `dapp` 钱包登录、`hybrid` 钱包与账号登录、`account` 账号密码登录。
- I18n: default enabled; development defaults to `zh-Hans`, and production defaults to `en`; options are enabled language switching or disabled with language locked to `zh-Hans`.
- 多语言：默认启用；开发环境默认 `zh-Hans`，生产环境默认 `en`；可选项为启用语言切换，或关闭多语言功能并固定为 `zh-Hans`。
- Production chain: default BSC; options are BSC or other viem chain.
- 生产网络：默认 BSC；可选项为 BSC 或 other viem chain。
- DApp write policy: default gas check disabled, gas estimate disabled, ERC20 approval uses the maximum amount by default, and Token decimals default to 18; options are enabling the gas switches, approving a passed specific amount, or changing to other decimals confirmed by the project.
- DApp 写合约策略：默认关闭 Gas 检查、关闭 Gas 估算；ERC20 默认授权最大上限；Token 精度默认 18；可选项为开启 Gas 开关、按传入具体数值授权，或改成项目确认的其他精度。

### Template project prompt
### 已复制模板后的提示词

Use this prompt after the template files already exist in the project directory.
当模板文件已经存在于项目目录中时，使用下面的提示词。

```txt
我现在要基于这个 React H5 DApp 模板启动一个真实项目。

请先阅读 README.md、AGENTS.md、PROJECT_SETUP.md、PROJECT_TERMS.md、PROJECT_WORKFLOW.md 和 .env.example。

不要询问包管理器，pnpm 是固定规则。

先运行 pnpm install、pnpm env:init 和 pnpm dev，让项目跑起来。

项目运行起来后，把 Vite 输出的 Local / Network 访问地址，尤其是局域网地址，和默认配置包一起发给我。

默认配置包里的默认项可以一起询问，但每项都要列出默认值、可选项和含义，不要只列默认值。我回复 `默认` 即全部采用；如果需要改，我会只说要改的字段，例如 `菜单 tabbar，多语言关闭`。

默认配置包是唯一可以合并询问的初始化问题。不要在同一轮询问项目名称、项目 Logo、Empty 空状态图标、env 地址、合约地址、社交 meta 或页面切图。

然后按 PROJECT_SETUP.md 继续初始化。除默认配置包外，项目特有配置必须一次只问一项。

不要直接改代码，不要把模板默认值当成我的真实项目选择。

等你收集完初始化答案后，先汇总给我确认；我确认后你再回填项目文件。

初始化完成后，不要停在完成总结；请按 PROJECT_WORKFLOW.md 的固定后续开发顺序继续引导。先写静态页面，再集中配置接口方法，再准备合约模块；第 3 步合约资料未就绪时可以记录跳过并继续接口逻辑。页面实现时需要自动抽取公共颜色到主题 SCSS 配置，不要让我逐个确认颜色。
```

## 2. First run checklist
## 2. 首次运行清单

Run these steps after the project folder is ready. The development server should be started before the first setup question is asked.
项目目录准备好后，按下面步骤运行。第一个初始化问题抛出前，应先启动开发服务。

Do not ask which package manager should be used during setup; pnpm is fixed.
初始化时不要询问包管理器；pnpm 是固定规则。

1. Install dependencies.
1. 安装依赖。

```bash
pnpm install
```

2. Create local env files from `.env.example`.
2. 根据 `.env.example` 创建本地 env 文件。

```bash
pnpm env:init
```

3. Start the development server.
3. 启动开发服务。

```bash
pnpm dev
```

4. Report the Vite `Local` and `Network` URLs, especially the LAN address, together with the default setup pack question.
4. 将 Vite 输出的 `Local` 和 `Network` 访问地址，尤其是局域网地址，和默认配置包询问一起告诉开发者。

- The default setup pack can be accepted by replying `默认`.
- 默认配置包可以直接回复 `默认` 接受。
- The default setup pack is the only grouped setup question.
- 默认配置包是唯一可以合并询问的初始化问题。
- Include available options and meanings for every default setup pack item.
- 默认配置包里的每一项都要写明可选项和含义。
- If defaults need changes, reply only with changed fields, for example `菜单 tabbar，多语言关闭`.
- 如需修改默认项，只回复要改的字段即可，例如 `菜单 tabbar，多语言关闭`。
- Do not ask for the project name, project logo, Empty component icon, env values, contract addresses, social meta or page assets in the same message.
- 不要在同一轮询问项目名称、项目 logo、Empty 组件图标、env 值、合约地址、社交 meta 或页面切图。
- Ask non-default setup items one at a time after the default setup pack is confirmed.
- 默认配置包确认后，再对非默认初始化项一次只问一项。

5. Ask for the project name after the default setup pack is confirmed.
5. 默认配置包确认后，再单独询问项目名称。

6. Keep `.env.production` `VITE_BASE_URL` and `VITE_RPC_URL` empty unless the project rules are changed intentionally.
6. 除非项目规则明确调整，否则 `.env.production` 的 `VITE_BASE_URL` 和 `VITE_RPC_URL` 保持为空。

7. Ask whether the project logo resource is ready.
7. 询问项目 logo 资源是否已准备好：必须是正方形 PNG，建议 100x100。

- Generate the fixed 68x68 favicon from the logo with `pnpm favicon:generate`.
- favicon 由 logo 自动生成固定 68x68 尺寸：运行 `pnpm favicon:generate`，不要再向开发者索要 favicon。
- If there is no logo yet, it can be skipped during early development. Keep `public/brand/brand-status.json` not ready, and production build will be blocked.
- 如果暂时没有 logo，前期开发可先跳过。保持 `public/brand/brand-status.json` 为未就绪，生产构建会被阻止。

8. Ask whether the Empty component icon resource is ready after the logo answer has been handled.
8. 等 logo 回答处理完后，再单独询问 Empty 组件图标资源是否已准备好。

- If there is no Empty component icon yet, it can be skipped during early development and recorded in `PROJECT_SETUP_STATUS.md`.
- 如果暂时没有 Empty 组件图标，前期开发可先跳过，并记录到 `PROJECT_SETUP_STATUS.md`。
- If it is ready, run `pnpm empty:asset -- --input <empty-icon.png>`.
- 如果已准备好，运行 `pnpm empty:asset -- --input <empty-icon.png>`。
- The script detects PNG size from the Figma export: 1x uses the original width, while a large 2x image close to 750px wide or around 500px tall uses half width.
- 脚本会按 Figma 导出 PNG 的宽高自动判断：1x 使用原始宽度；接近 750px 宽或 500px 高的大图按 2x 处理，使用一半宽度。
- Empty image style writes width only and keeps height as auto.
- Empty 图样式只写宽度，高度保持 auto。

9. Confirm project-level settings in `src/config/app.ts`, usually through the default setup pack.
9. 确认 `src/config/app.ts` 中的项目级设置，通常通过默认配置包一次确认。

- The npm package name stays fixed as `@jcy/template-react`.
- npm 包名固定为 `@jcy/template-react`。
- Project name.
- 项目名。
- Route base and home route.
- 路由基础路径与首页路由。
- Layout menu type.
- Layout 菜单类型。
- Login mode.
- 登录模式。
- I18n switch.
- 多语言开关。
- DApp production chain and contract-write policies.
- DApp 生产网络与写合约策略。

10. Keep theme colors developer-transparent during page work.
10. 页面开发时让主题颜色处理对开发者无感。

- Do not create a separate setup question for colors.
- 不要单独为了颜色创建初始化问题。
- If no design reference exists yet, keep the template defaults.
- 如果暂无设计参考，先保留模板默认值。
- During the first designed page, automatically reuse or promote shared colors into `src/styles/color.scss`.
- 开发第一个设计页面时，自动复用或提升公共颜色到 `src/styles/color.scss`。

11. Run the quality gates before starting real page work.
11. 开始真实页面开发前先跑质量门禁。

```bash
pnpm test
pnpm lint
pnpm build
```

## 3. Setup status file
## 3. 初始化状态文件

After setup, create `PROJECT_SETUP_STATUS.md` in the real project.
初始化完成后，在真实项目中创建 `PROJECT_SETUP_STATUS.md`。

Record only confirmed decisions and skipped items with their follow-up stage.
只记录已确认的决策，以及暂时跳过但需要在哪个阶段补齐的事项。

Suggested content:
建议内容：

```md
# Project setup status
# 项目初始化状态

## Confirmed
## 已确认

- Project name:
- Login mode:
- Layout menu type:
- I18n:
- Production chain:

## Local only
## 仅本地

- .env.development VITE_BASE_URL:
- .env.development VITE_RPC_URL:

## Later
## 后续补齐

- Project logo if it was skipped:
- Empty component icon if it was skipped:
- Contract addresses:
- Social share meta:
- Page-specific assets:
```

## 4. After setup next-step guidance
## 4. 初始化后的下一步引导

After project setup is complete, never stop at a setup completion summary.
项目初始化完成后，不要停在完成总结。

Always provide next-step guidance in the same message.
必须在同一条消息里继续给出下一步引导。

The next-step guidance must follow the fixed post-setup development sequence below.
下一步引导必须按下面的固定后续开发顺序执行。

Do not enter the next step until the current step is complete, except that Step 3 is the only skippable step when contract documentation is not ready yet.
当前步骤未完成前，不进入下一步；唯一例外是第 3 步，当合约文档暂未就绪时可以跳过。

### Fixed post-setup development sequence
### 固定后续开发顺序

1. Static pages: implement the designed pages first with static data and local interactions. Ask for the Figma link, exported page assets and page implementation checklist confirmation before writing code. Build each page in normal flow with Flexbox or Grid; positioning is reserved for documented decorative or viewport exceptions. Automatic theme color extraction runs during page implementation.
1. 静态页面：先用静态数据和本地交互把设计页面写出来。写代码前先索要 Figma 链接、页面切图资源，并输出页面实现清单等待确认；每个页面先用正常文档流配合 Flexbox 或 Grid 构建，定位只留给有文档的装饰或视口例外；页面实现时自动抽取公共颜色到主题 SCSS 配置。

At this static stage, `/h5` goes directly to the home page. Do not block page preview on wallet connection, signatures, a backend Token, or a login API.
静态 UI 阶段，`/h5` 直接进入首页。不要让钱包连接、签名、后端 Token 或登录接口阻断页面预览。
2. API documentation: ask the backend developer for an API Markdown document, then centrally configure request methods, request types and response types through `src/features` and `src/services/http`.
2. 接口文档：向后端索要接口 Markdown 文档，然后通过 `src/features` 和 `src/services/http` 集中配置请求方法、请求类型和响应类型。
3. Contract documentation: ask the Node or contract developer for a contract Markdown document, then configure DApp contract method wrappers and related env contract address fields. For a transaction-backed project, complete the chain, asset, ABI, and PHP contract pack in `docs/dapp-project-integration.md`. If API documentation is ready before contract documentation, record the skipped contract step in `PROJECT_SETUP_STATUS.md` and continue to Step 4; do not implement contract-dependent logic until the contract document arrives.
3. 合约文档：向 Node 或合约同事索要合约 Markdown 文档，然后配置 DApp 模块合约方法封装，以及对应的 env 合约地址字段。带交易项目还要补齐 `docs/dapp-project-integration.md` 中的链、资产、ABI 和 PHP 契约包。如果接口文档先出来、合约文档暂未就绪，则把跳过的合约步骤记录到 `PROJECT_SETUP_STATUS.md` 并继续第 4 步；合约相关功能逻辑等合约文档到位后再补。
4. Feature logic integration: connect page logic with the API documentation and any available contract documentation. Use `dapp-project-integration` for the first confirmed PHP-and-contract flow; legacy DApps are flow references only. Before this step starts, ask for the two development LAN env values: `.env.development` `VITE_BASE_URL` for the backend API and `.env.development` `VITE_RPC_URL` for the local or test-chain RPC. If Step 3 was skipped, integrate API-backed logic first and leave contract-backed logic as TODO until the contract document is provided.
4. 功能逻辑联调：根据接口文档和已提供的合约文档对接页面功能逻辑。首次已确认的 PHP 与合约流程使用 `dapp-project-integration`；旧 DApp 只能作为流程参考。开始本步骤前，必须询问两个开发环境内网地址：后端接口 `.env.development` 的 `VITE_BASE_URL`，以及本地或测试链 RPC 的 `VITE_RPC_URL`。如果第 3 步已跳过，则先对接接口驱动的逻辑，合约驱动的逻辑保留 TODO，等合约文档补齐后再做。

If this project requires wallet login, replace the static root redirect only after the PHP authentication contract is confirmed. For a cached Token, first match the currently authorized wallet with its saved owner; for a fresh login, sign exactly the documented challenge and check the wallet again before accepting the returned Token. Register that checked current address with the HTTP client so the session-validation request carries both `Authorization: Bearer <token>` and `Address: <wallet address>`. Start other protected business requests only after validation succeeds. Clear the Token and invalidate that address on account change or 401. Do not copy another project's signature text, endpoints, or redirect behavior.
若项目需要钱包登录，仅在 PHP 鉴权契约确认后替换静态根路由跳转。恢复缓存 Token 时，先将当前已授权钱包与所存账号核对；新登录时原样签署文档规定的消息，并在接受返回的 Token 前再次检查钱包。把核对后的当前地址注册到 HTTP 客户端，让会话验证请求同时携带 `Authorization: Bearer <token>` 和 `Address: <钱包地址>`。验证成功后再发起其他受保护业务请求。账号切换或收到 401 时清理 Token 并使地址失效。不要照搬其他项目的签名文案、接口或跳转行为。
5. Pre-build preparation: before production packaging, add page-specific custom animations or simple `animate.css` animations where needed; ask which i18n languages should be enabled, then unlock those languages and translate all static page copy.
5. 打包前准备：正式打包前，按需要给页面追加自定义动画或简单的 `animate.css` 动画；询问需要解开的多语言有哪些，然后启用对应语言并翻译所有静态页面文案。

Suggested reply format after setup:
初始化后的建议回复格式：

```md
下一步建议：

现在进入固定流程第 1 步：写静态页面。

请发我第一个页面的 Figma 链接和已导出的切图资源。我会先输出页面实现清单，确认后再写代码。

后续流程固定为：
1. 写静态页面
2. 索要后端接口 Markdown 文档并集中配置请求方法
3. 索要 Node / 合约 Markdown 文档并配置合约封装（可跳过并记录待补）
4. 根据接口与合约文档联调功能逻辑，并在开始前询问 VITE_BASE_URL / VITE_RPC_URL 两个内网地址
5. 打包前追加动画、确认多语言并翻译静态文案
```

## 5. Automatic theme color extraction during page work
## 5. 页面实现时自动抽取公共颜色

Theme SCSS setup should be handled automatically while implementing designed pages.
主题 SCSS 配置应在设计页面实现过程中自动处理。

The developer does not need to confirm theme colors one by one.
开发者不需要逐个确认主题颜色。

The developer also does not need a separate color setup step before asking for the page.
开发者在要求实现页面前，也不需要单独走一轮颜色配置步骤。

Common tokens usually include primary color, button text color, page background, header background, card background, box background, main text, secondary text, border or divider, and status colors such as success, warning and error when they appear in the design.
常见 token 通常包括主色、按钮文字色、页面背景、顶部背景、卡片背景、盒子背景、主文字、次级文字、边框或分割线，以及设计中出现的成功、警告、错误等状态色。

During implementation, check `src/styles/color.scss` first, reuse existing tokens when possible, and automatically promote shared colors into `src/styles/color.scss` when needed.
实现页面时，先检查 `src/styles/color.scss`，能复用已有 token 就复用；需要新增公共颜色时，自动提升到 `src/styles/color.scss`。

If no design reference exists yet, keep the current template defaults and wait until the first designed page.
如果暂无设计参考，先保留当前模板默认值，等第一个设计页面再处理。

During page implementation, promote a color to `src/styles/color.scss` when it is a brand color, global background, shared card or box color, common text color, common status color, or appears in multiple pages or reusable components.
页面开发过程中，如果某个颜色属于品牌色、全局背景、共享卡片或盒子色、通用文字色、通用状态色，或在多个页面/可复用组件中出现，就提升到 `src/styles/color.scss`。

Keep decorative gradients, one-off glow colors and page-specific artwork colors in the page SCSS.
装饰渐变、一次性光效颜色、页面专属切图配色留在页面私有 SCSS。

Only ask the developer when the choice changes the project-wide theme direction, such as replacing the main brand color, switching the whole project between dark and light visual systems, or resolving a real design contradiction.
只有当判断会改变全项目主题方向时才询问开发者，例如替换项目主品牌色、整体暗色/亮色体系切换，或设计稿本身出现明显冲突。

Before adding a new custom color in page SCSS, check whether an existing token in `src/styles/color.scss` can be reused.
页面 SCSS 新增自定义颜色前，先检查 `src/styles/color.scss` 里是否已有可复用 token。

## 6. Page implementation from Figma
## 6. 根据 Figma 开发页面

Do not write code immediately after receiving a Figma link.
拿到 Figma 链接后不要直接写代码。

First inspect the design, existing components, global styles, mixins, nearby pages and required assets.
先检查设计稿、已有组件、全局样式、mixin、相近页面和所需切图。

Use Figma layer inspection as the source of truth for visual values. If exact properties are readable, collect and implement the precise font family, weight, size, line height, letter spacing, color, opacity, dimensions, padding, gaps, borders, radii, shadows, blur and gradient parameters. Do not replace readable values with screenshot guesses, convenient defaults or rounded approximations.
使用 Figma 图层检查结果作为视觉数值的事实来源。只要准确属性可读，就必须收集并实现准确的字体族、字重、字号、行高、字间距、颜色、透明度、尺寸、内外间距、gap、边框、圆角、阴影、模糊和渐变参数。不得用截图猜测、方便的默认值或随意取整值替代可读取的准确值。

If a property cannot be read, label its fallback value as an estimate and record the reason. At completion, compare the rendered page with the design at the same frame width and fix measurable differences before reporting success.
如果某项属性无法读取，必须把替代值标记为估算并记录原因。完成时必须在相同画板宽度下对照渲染页面与设计稿，修正可量测差异后才能报告完成。

Ask the developer to manually export the needed page assets before implementation whenever possible.
开发页面前，尽量先让开发者手动导出该页面需要的切图资源。

Figma slicing is too free-form for AI to reliably choose the best export combination, so AI should list semantic asset names and target paths instead of guessing or silently downloading arbitrary slices.
Figma 切图方式太自由，AI 很难稳定判断最合适的导出组合，因此 AI 应列出语义化资源名和目标路径，而不是自己猜或静默下载随意切片。

Shared module overall layout and interaction contracts must not be changed to follow a page design unless there is explicit manual developer intervention.
公共模块的整体布局和交互契约不要为了贴合某个页面设计稿而修改，除非开发者人工手动介入并明确要求。

For shared modules, use content-level adaptation by default: replace resources, update text configuration, hide or show app name, reorder controls inside an existing slot, or adjust project settings.
公共模块默认做内容级适配：替换资源、更新文案配置、隐藏或显示 appname、在已有插槽内调整内容顺序，或调整项目设置。

For example, do not rebuild the shared header structure because Figma shows a single left image instead of logo plus app name, a gradient wallet button, or different icon spacing.
例如，不要因为 Figma 里顶部是单独左侧图片而不是 logo 加 appname、渐变钱包按钮或不同图标间距，就重建公共 header 结构。

If the same overall header layout can match the design by replacing the logo resource, hiding app name, reordering controls inside the existing right slot, or applying an existing button visual variant, do that directly.
如果在整体 header 布局不变的情况下，通过替换 logo 资源、隐藏 appname、在已有右侧插槽内调整控件顺序，或套用已有按钮视觉变体就能贴近设计稿，应直接这样做。

Mobile status bar, carrier, battery, time and other device chrome in Figma frames are not H5 page content.
Figma 画板里的手机信息状态栏、运营商、电量、时间等设备外壳信息不属于 H5 页面内容。

Do not implement device chrome in HTML, reserve height for it, or export it as an asset unless the developer explicitly says it is real in-page artwork.
不要把设备外壳信息写进 HTML、为它预留高度，或把它导出成切图，除非开发者明确说明它是真实页面内装饰图。

### Figma page prompt
### Figma 页面提示词

```txt
这是 Figma 页面链接：<粘贴链接>。

请先阅读 AGENTS.md、PROJECT_TERMS.md 和 PROJECT_WORKFLOW.md。

不要直接写代码。

请先输出页面实现清单，必须包括：

1. 需要我手动导出的切图资源，以及建议放到 src/assets/<page-name>/ 下的语义化文件名；不要自行猜测或静默下载随意切片。
2. 页面语义结构：哪些地方用 button、input、textarea、img、nav 等。
3. 主题颜色处理：自动判断哪些颜色复用或提升到 src/styles/color.scss，哪些只属于页面私有样式。
4. 可复用组件：优先检查 src/components、src/shared/components、src/showcase。
5. 公共模块保护：header、AppBrand、tabbar、sidebar、Popup、Picker 等公共模块保护的是整体布局和交互契约；在整体布局不变时，允许内容级适配，例如替换资源、隐藏 appname、在已有插槽内调整内容顺序或套用已有按钮视觉变体；如确需改变结构，先询问是否创建页面专属组件。
6. 设备外壳过滤：Figma 中的手机信息状态栏、运营商、电量、时间等不写进 H5 页面。
7. 可复用样式：优先检查 src/styles 和已有 showcase。
8. 可复用 mixin。
9. 页面本身必须单独写的特殊样式。
10. 本地交互：tab、输入、展开收起、popup、copy 等。
11. 接口和合约 TODO。
12. 页面布局：先列出正常文档流的 section 顺序、Flex/Grid 方案和间距来源；如需定位，逐项说明是否为背景图、小图标/角标或视口覆盖层，并使用 `layout-exception` 标记。
13. 设计量测表：逐项列出相关图层可读取的字体、字号、字重、行高、字间距、颜色、透明度、宽高、padding、gap、边框、圆角、阴影、模糊和渐变参数；可读取的值必须原样采用，无法读取的值必须明确标注“估算”及原因。
14. 视觉验收：在设计稿画板宽度下截图对照，修正可量测差异后再汇报完成。

等我确认清单后再实现。
```

## 7. Static page development order
## 7. 静态页面开发顺序

Use this order after the page checklist is confirmed.
页面清单确认后，按这个顺序实现。

1. Place required assets under `src/assets/<page-name>/`.
1. 将所需切图放入 `src/assets/<page-name>/`。
2. Create the page module directory.
2. 创建页面模块目录。
3. Create `PageName.tsx` and `PageName.scss`.
3. 创建 `PageName.tsx` 和 `PageName.scss`。
4. Register the route.
4. 注册路由。
5. Build semantic markup first.
5. 先写语义化结构。
6. Build the section layout in normal flow with Flexbox or Grid, gaps and padding before adding decorative layers.
6. 先用正常文档流、Flexbox 或 Grid、间距和内边距完成 section 布局，再添加装饰层。
7. Compose existing utility classes in `className` before writing page SCSS.
7. 写页面 SCSS 前，先在 `className` 中组合已有通用样式。
8. Add page-specific SCSS only for styles that cannot be expressed by utilities; use positioning only for a documented `layout-exception`.
8. 只有通用样式无法表达时，才补页面私有 SCSS；定位只能用于有文档的 `layout-exception`。
9. Implement local interactions even while API data is static.
9. 即使接口数据还没联调，也先实现基础本地交互。

### Page implementation prompt
### 页面实现提示词

```txt
请按刚才确认的页面实现清单开发这个页面。

要求：

1. 页面按模块目录创建。
2. 优先复用 src/components、src/shared、src/styles、src/styles/mixins.scss。
3. 如果 className 可以组合已有通用样式，就不要重复写页面 SCSS。
4. 缺少切图时暂停并告诉我缺哪些文件，不要用 CSS 或 emoji 临时替代。
5. 页面里的用户可见文案必须遵守 PROJECT_TERMS.md。
6. 完成后运行相关测试；如果涉及全局影响，再运行 pnpm test、pnpm lint、pnpm build。
7. 页面结构先使用正常文档流、Flexbox 或 Grid；不要用定位摆放卡片、表单、列表或操作区。背景图、小图标/角标和必要的视口覆盖层才允许定位，并在页面 SCSS 写 `layout-exception` 原因。
```

## 8. Component development order
## 8. 组件开发顺序

Use this route when a page reveals a reusable UI pattern.
当页面里出现可复用 UI 模式时，按这个路线沉淀组件。

1. Confirm the component boundary and props.
1. 确认组件边界和参数。
2. Put reusable components under `src/components`.
2. 通用组件放在 `src/components`。
3. Put small shared display helpers under `src/shared/components`.
3. 小型共享展示组件放在 `src/shared/components`。
4. Add a `README.md` beside the component when the component is meant to be reused.
4. 可复用组件旁边补 `README.md`。
5. Add a showcase page for components that benefit from visual preview.
5. 需要视觉预览的组件补 showcase 页面。

### Component prompt
### 组件提示词

```txt
我想把这个页面里的 <组件描述> 沉淀成通用组件。

请先判断它应该放在 src/components 还是 src/shared/components。

然后总结 props、默认行为、插槽 children、自定义样式方式和使用场景。

确认后再创建组件、README 和 showcase 预览。
```

## 9. API integration order
## 9. 接口联调顺序

Use feature modules for business APIs.
业务接口放在 feature 模块中。

1. Put business API files under `src/features/<feature-name>/`.
1. 业务接口放在 `src/features/<feature-name>/`。
2. Use `src/services/http` for the shared request layer.
2. 统一请求层使用 `src/services/http`。
3. Keep endpoint functions small and named by business meaning.
3. 接口方法保持小而清晰，按业务含义命名。
4. After data integration, register real page refresh with `usePageRefresh()`.
4. 数据联调后，用 `usePageRefresh()` 注册真实页面刷新。
5. Use `useLatestRequest()` or `AbortController` to prevent stale data writes.
5. 使用 `useLatestRequest()` 或 `AbortController` 防止旧请求回写旧数据。

### API prompt
### 接口提示词

```txt
请给这个页面对接接口。

要求：

1. 业务接口放到 src/features/<feature-name>/api.ts。
2. 请求必须走 src/services/http 封装。
3. 页面刷新必须等待真实接口完成。
4. 如果页面有多次请求或定时刷新，使用 useLatestRequest 或 AbortController 防止旧数据覆盖新数据。
5. 接口字段不确定的位置写 TODO 注释，不要擅自编假字段。
```

## 10. DApp and contract integration order
## 10. DApp 与合约联调顺序

Use the DApp service module for wallet and contract behavior.
钱包与合约逻辑走 DApp 服务模块。

For the first real PHP-and-contract flow, read `docs/dapp-project-integration.md` and use `dapp-project-integration`. Treat any old DApp as a behavior reference, not a source for current fields or ABI facts.
首次真实 PHP 与合约流程前，阅读 `docs/dapp-project-integration.md` 并使用 `dapp-project-integration`。旧 DApp 仅作行为参考，不是当前字段或 ABI 事实来源。

1. Confirm the production chain in project config.
1. 在项目配置中确认生产网络。
2. Put reusable contract helpers under `src/services/dapp`.
2. 通用合约辅助逻辑放在 `src/services/dapp`。
3. Put project-specific contract addresses in env.
3. 项目专属合约地址放在 env。
4. Check gas through the shared DApp write flow before contract writes.
4. 写合约前通过共享 DApp 写入流程检查 gas。
5. Use `ContractLoading` for contract writes that must block user interaction.
5. 写合约等待期间需要阻止用户操作时，使用 `ContractLoading`。
6. Refresh page data after contract writes through the same page refresh function.
6. 写合约成功后，复用页面刷新函数刷新数据。
7. Preserve documented server-signed transaction fields without converting their units or rebuilding their argument order.
7. 原样保留已文档化的服务端签名交易字段，不转换其单位，也不重建参数顺序。

### DApp prompt
### DApp 提示词

```txt
请给这个页面对接 DApp / 合约逻辑。

要求：

1. 先检查 src/services/dapp 已有封装，不要重复写钱包连接、网络切换、gas 检查和 ERC20 授权逻辑。
2. 写合约前使用模板已有的 gas 检查和合约写入策略。
3. 写合约等待期间使用 ContractLoading。
4. 写入成功后复用页面的刷新函数重新拉取接口或合约数据。
5. 如果 ABI 或合约地址缺失，暂停并列出缺失项。
6. 如果后端返回已签名交易参数，按当前 PHP 与 ABI 文档原样透传，不从旧项目代码猜测字段、单位或参数顺序。
```

## 11. Daily finish checklist
## 11. 每天收尾清单

Run these commands before saying the work is ready.
声明当天工作可交付前，运行下面命令。

```bash
pnpm test
pnpm lint
pnpm build
```

Then review whether any project changes should be fed back into the template.
然后复盘是否有适合反哺模板的通用改动。

## 12. Template feedback prompt
## 12. 模板反哺提示词

Use this prompt in a real project after several pages or modules have been built.
真实项目开发了一些页面或模块后，可以用下面提示词整理模板反馈。

```txt
请扫描当前项目相对 React H5 DApp 模板做过的改动。

只整理适合沉淀回模板的通用优化，不要包含业务强相关内容。

请重点关注：

1. 新增的通用组件。
2. 新增的 hooks。
3. 新增的样式工具类或 mixin。
4. 请求、登录、DApp、合约、storage、i18n 的通用优化。
5. Figma 页面开发中反复出现的规范问题。
6. 术语规范问题。
7. 新项目启动时容易踩坑的流程问题。

请输出到 docs/template-react-feedback.md，并按 TRF-001 这种编号列出。
```

## 13. What to do when you are unsure
## 13. 不知道下一步做什么时

If the project is not initialized, return to `PROJECT_SETUP.md`.
如果项目还没完成初始化，回到 `PROJECT_SETUP.md`。

If the project can run but no real page exists, start from the first Figma page checklist and handle automatic theme color extraction during implementation.
如果项目能运行但还没有真实页面，从第一个 Figma 页面清单开始，并在实现过程中自动抽取公共颜色。

If the project can run but no design reference exists yet, keep the template theme defaults and start from the first Figma page checklist when the design arrives.
如果项目能运行但暂时没有设计参考，先保留模板主题默认值，等设计图到了再从第一个 Figma 页面清单开始。

If static pages exist but no data exists, start API and contract integration.
如果静态页面已有但没有真实数据，开始接口和合约联调。

If one-off code appears in multiple places, extract a component, hook or shared utility.
如果同类代码在多个地方出现，抽成组件、hook 或共享工具。

If a real project improves the template workflow, write feedback before the details are forgotten.
如果真实项目改进了模板流程，趁还没忘记时写入反馈文档。
