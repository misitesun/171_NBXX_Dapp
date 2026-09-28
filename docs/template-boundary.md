# Template boundary
# 模板边界

This repository is a reusable React H5 DApp foundation, not a demo product. A clean clone must start, type-check and expose its development showcases without inheriting a previous project's routes, copy, API fields, assets, addresses or protocol ABIs.
本仓库是可复用的 React H5 DApp 基础框架，不是演示产品。干净克隆后应能启动、通过类型检查并访问开发演示，同时不能继承旧项目的路由、文案、接口字段、切图、地址或协议 ABI。

## Included
## 模板保留

- React, TypeScript, Vite, pnpm, Oxlint, SCSS and the 750px-to-vw pipeline.
- `/h5` history fallback, route/navigation helpers and an intentionally empty `/home` route.
- Shared header, brand, sidebar/tabbar modes, language switching and documented UI components.
- Axios request/error primitives, SSR-safe storage, browser upload primitives and host-runtime checks.
- Injected-wallet detection, chain switching, exact-message signing, viem contract read/write helpers, ERC20 primitives and EIP-7702/EIP-5792 helpers.
- Development-only component/style showcases, setup workflow, AI collaboration rules, tests and packaging scripts.

- React、TypeScript、Vite、pnpm、Oxlint、SCSS 与 750px-to-vw 适配链路。
- `/h5` history fallback、路由/导航辅助方法，以及有意保持空白的 `/home`。
- 公共 Header、品牌、sidebar/tabbar 模式、语言切换与有文档的 UI 组件。
- Axios 请求/错误基础能力、SSR 安全存储、浏览器上传基础能力与宿主环境判断。
- 注入钱包检测、切链、原文签名、viem 合约读写、ERC20 与 EIP-7702/EIP-5792 基础能力。
- 仅开发环境启用的组件/样式演示、初始化流程、AI 协作规则、测试与打包脚本。

## Excluded by design
## 有意不包含

- Product pages, static product copy, mock orders, balances, referrals or product artwork.
- Backend endpoints, DTOs, response envelopes, wallet-authentication challenge formats or 401 navigation policy.
- Project ABI, deployed contract/token/router addresses, swap protocols or transaction sequences.
- Native upload message protocols, product terminology and production domains.

- 产品页面、静态业务文案、Mock 订单、余额、邀请关系或产品切图。
- 后端端点、DTO、响应包裹层、钱包鉴权 challenge 格式或 401 跳转策略。
- 项目 ABI、已部署合约/Token/Router 地址、Swap 协议或交易顺序。
- 原生上传消息协议、产品术语和生产域名。

## Extension points
## 扩展入口

Add pages under `src/pages`, confirmed backend modules under `src/features`, and project contract wrappers under `src/services/contracts`. Add first-level navigation once in `src/pages/main/config.ts`. Register project-owned 401/auth behavior from application composition instead of importing features into `src/services/http`.
页面放在 `src/pages`，已确认后端能力放在 `src/features`，项目合约封装放在 `src/services/contracts`。一级导航只在 `src/pages/main/config.ts` 添加一次。项目 401/鉴权行为从应用组合层注册，不让 `src/services/http` 反向依赖 feature。

Follow `PROJECT_SETUP.md` before making real-project choices, then execute `PROJECT_WORKFLOW.md` in order. Missing remote contracts are blockers or recorded TODOs, never permission to guess.
真实项目决策前先完成 `PROJECT_SETUP.md`，再按顺序执行 `PROJECT_WORKFLOW.md`。远端契约缺失时应阻塞或记录 TODO，不能靠猜测补齐。
