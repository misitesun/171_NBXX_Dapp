# React H5 DApp Template
React 移动端 H5 DApp 模板。

This repository is a business-neutral, ready-to-extend React template for mobile H5 DApp projects.
这是一个不携带业务假设、可直接扩展的 React 移动端 H5 DApp 模板。

The stack uses React, TypeScript, Vite, Oxlint, SCSS, PostCSS viewport conversion, React Router, Zustand, Axios and i18next.
技术栈使用 React、TypeScript、Vite、Oxlint、SCSS、PostCSS 视口转换、React Router、Zustand、Axios 和 i18next。

It ships an empty production home route, reusable application chrome, component showcases, wallet and contract primitives, request/storage/platform boundaries, project setup governance, and release checks. It intentionally ships no product pages, mock business data, backend endpoint contracts, deployed addresses, or product-specific ABI.
模板提供空白生产首页、可复用应用外壳、组件演示、钱包与合约基础能力、请求/存储/平台边界、项目初始化治理和发布检查；不包含产品页面、业务 Mock、后端接口契约、已部署地址或产品专用 ABI。

## Agent rules
## AI 协作规则

AI tools and collaborating engineers should read `AGENTS.md` before changing code.
AI 工具和协作工程师修改代码前应先阅读 `AGENTS.md`。

Project conventions such as import paths, page modules, styles and asset naming are recorded there.
引入路径、页面模块、样式和资源命名等项目规范都记录在其中。

## Governance assets
## 协作治理资产

The project keeps the reusable/non-reusable boundary in `docs/template-boundary.md`, implementation rules in `docs/ai-collaboration.md`, module boundaries in `docs/architecture.md`, normal-flow page layout rules in `docs/layout-standards.md`, PHP API boundary rules in `docs/php-api-contracts.md`, real-project DApp integration rules in `docs/dapp-project-integration.md`, and compatibility-sensitive behavior in `docs/compatibility.md`.
项目把模板保留/排除边界放在 `docs/template-boundary.md`，实现协作规则放在 `docs/ai-collaboration.md`，模块边界放在 `docs/architecture.md`，正常文档流页面布局规则放在 `docs/layout-standards.md`，PHP 接口边界规则放在 `docs/php-api-contracts.md`，真实项目 DApp 联调规则放在 `docs/dapp-project-integration.md`，兼容性敏感行为放在 `docs/compatibility.md`。

Reusable AI workflows live in `.agents/skills/`. They narrow work scope and routing, but never replace `AGENTS.md`, real API or contract Markdown documents, tests or lint checks.
可复用的 AI 工作流位于 `.agents/skills/`。它们用于收窄工作范围和路由，但不能替代 `AGENTS.md`、真实接口或合约 Markdown、测试和 lint 检查。

## New project setup
## 新项目初始化

Build the local create package first.
先在本机模板目录生成本地创建包。

```bash
git clone https://github.com/misitesun/react_dapp_demo.git
cd react_dapp_demo
git pull
pnpm create:local
```

Then create a project from the local package.
然后在新项目空目录中使用本地包创建项目。

```bash
pnpm dlx ./packages/create-template-react/jcy-create-template-react-0.1.0.tgz ../my-dapp
```

The source repository is `https://github.com/misitesun/react_dapp_demo.git`.
源码仓库为 `https://github.com/misitesun/react_dapp_demo.git`。

Before using this template for a real project, read `PROJECT_SETUP.md`.
使用本模板创建真实项目前，先阅读 `PROJECT_SETUP.md`。

After setup, follow `PROJECT_WORKFLOW.md` to decide the next development step.
初始化后，按照 `PROJECT_WORKFLOW.md` 判断下一步开发该做什么。

Project-facing terms are recorded in `PROJECT_TERMS.md`.
面向项目用户的术语规范记录在 `PROJECT_TERMS.md`。

## Included template guards
## 内置模板防护

Authenticated business pages can use `PagePullRefresh` and `usePageRefresh()` for page-level pull refresh that waits for real data loading.
已登录业务页可使用 `PagePullRefresh` 和 `usePageRefresh()` 做页面级下拉刷新，并等待真实数据加载完成。

Pages can use `useLatestRequest()` to prevent old API or contract reads from writing stale data back after a newer refresh starts.
页面可使用 `useLatestRequest()`，避免旧接口或合约读取在新刷新后回写旧数据。

Authentication is intentionally not prewired because endpoint fields, challenge format, signature message, session recovery and redirects are project contracts. Add that flow only after the current backend Markdown is confirmed.
模板不会预置鉴权流程，因为接口字段、challenge 格式、签名原文、会话恢复与跳转都属于项目契约；只有当前后端 Markdown 确认后才实现。

`AppBrowserRouter` accepts URLs with or without `/h5`, then adds `/h5` for app navigations.
`AppBrowserRouter` 兼容带 `/h5` 与不带 `/h5` 的访问路径，并在应用内跳转时补回 `/h5`。

## Development
## 开发命令

This template uses pnpm as the package manager.
本模板使用 pnpm 作为依赖管理工具。

pnpm keeps one global content-addressable store, which is friendlier when many projects are created from the same template.
pnpm 会复用全局内容寻址存储，对基于同一模板创建多个项目的场景更友好。

The project rejects npm and yarn for dependency installation and common scripts.
项目会拒绝使用 npm 和 yarn 安装依赖或运行常用脚本。

The template package name is fixed as `@jcy/template-react`.
模板包名固定为 `@jcy/template-react`。

Do not rename it during real project setup; use project config and env values for business project names.
真实项目初始化时不要改这个包名；业务项目名通过项目配置和 env 配置控制。

## Environment files
## 环境变量文件

Only `.env.example` is tracked by git.
只有 `.env.example` 会被 git 追踪。

After downloading or copying this template, create local runtime env files with the init script.
下载或复制本模板后，使用初始化脚本创建本地运行用的 env 文件。

```bash
pnpm env:init
```

The script reads `.env.example`, removes documentation comments, and creates `.env.development` and `.env.production` if they do not already exist.
脚本会读取 `.env.example`，移除说明注释，并在 `.env.development` 和 `.env.production` 不存在时创建它们。

Then fill the generated values for the current project.
然后根据当前项目填写生成后的配置值。

Keep `.env.development` and `.env.production` local only.
`.env.development` 和 `.env.production` 只保留在本地，不提交到 git。

Install dependencies before running the project.
运行项目前先安装依赖。

```bash
pnpm install
```

Start the local development server.
启动本地开发服务。

```bash
pnpm dev
```

Build the production bundle.
构建生产包。

```bash
pnpm build
```

Run the test suite.
运行测试。

```bash
pnpm test
```

Run Oxlint.
运行 Oxlint。

```bash
pnpm lint
```

Run every quality gate together.
一次运行全部质量门禁。

```bash
pnpm verify
pnpm exec tsc -b
```

Production `pnpm build` additionally requires a confirmed project logo. The create-package test also extracts the generated archive and verifies that the created project type-checks and bundles independently.
生产 `pnpm build` 还要求项目 Logo 已确认。创建包测试会额外解压模板归档，并验证新建项目能够独立通过类型检查和 Vite 打包。

## VS Code extensions
## VS Code 扩展

Install `IntelliSense for CSS class names in HTML` by `Zignd` for `className` style suggestions.
安装 `Zignd` 的 `IntelliSense for CSS class names in HTML`，用于在 `className` 中提示样式类名。

This project recommends it through `.vscode/extensions.json`.
本项目已经通过 `.vscode/extensions.json` 推荐该插件。

If the command `Cache CSS class definitions` is missing, check whether the extension is globally disabled.
如果搜不到 `Cache CSS class definitions` 命令，检查插件是否被全局禁用。

## Documentation style
## 文档风格

Module notes use English first and Chinese directly below.
模块说明采用英文在上、中文紧跟下一行的形式。

AI tools should read the English text first.
AI 工具可以优先读取英文内容。

Engineers can read the Chinese line below for the same meaning.
工程师可以阅读下方中文行来理解相同含义。

Keep tutorials and module conventions in Markdown files.
教程和模块约定应放在 Markdown 文件中。

Keep code comments focused on local reasons, TODOs and important constraints.
代码注释只解释局部原因、TODO 和重要约束。

## Mobile H5 adaptation
## 移动端 H5 适配

SCSS can be written with 750px design draft values.
SCSS 可以按照 750 设计稿直接写 px。

PostCSS converts eligible `px` values into `vw`.
PostCSS 会把符合条件的 `px` 转换成 `vw`。

When a third-party component needs real numeric pixels, use the viewport helper module.
当三方组件需要真实数字像素时，使用 viewport 辅助模块。

## Social share cards
## 社交分享卡片

Social share meta tags are disabled by default and are injected into the HTML entry only when `VITE_ENABLE_SOCIAL_META=1`.
社交分享 meta 默认关闭，只有 `VITE_ENABLE_SOCIAL_META=1` 时才会注入 HTML 入口。

Social values are configured through env variables and stay blank in the template.
社交分享值通过环境变量配置，模板中保持空值。

Fill them with public absolute URLs before a real production launch.
真实项目上线前应填写公网可访问的绝对地址。
