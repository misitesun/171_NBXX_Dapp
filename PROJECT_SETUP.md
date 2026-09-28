# New project setup checklist
# 新项目初始化清单

Use this checklist when creating a real project from this template.
使用本模板创建真实项目时，按本清单初始化。

After this checklist is confirmed, follow `PROJECT_WORKFLOW.md` for daily page, API and DApp development.
本清单确认后，按 `PROJECT_WORKFLOW.md` 继续日常页面、接口和 DApp 开发。

After setup is complete, include next-step guidance instead of stopping at a completion summary.
初始化完成后，要继续给出下一步引导，不要停在完成总结。

The next-step guidance must follow the fixed post-setup development sequence in `PROJECT_WORKFLOW.md`. Step 3 can be skipped only when contract documentation is not ready yet, and the skipped contract step must be recorded for later completion.
下一步引导必须按 `PROJECT_WORKFLOW.md` 中的固定后续开发顺序执行。只有合约文档暂未就绪时，第 3 步才可以跳过，并且必须记录为后续补齐事项。

Theme SCSS setup should be handled automatically during designed page implementation.
主题 SCSS 配置应在页面实现时自动抽取公共颜色。

Do not ask the developer to confirm colors one by one or run a separate color setup step.
不要让开发者一个颜色一个颜色确认，也不要单独走一轮颜色配置步骤。

During page implementation, automatically reuse existing tokens or promote shared colors into `src/styles/color.scss`.
页面实现时，自动复用已有 token，或把公共颜色提升到 `src/styles/color.scss`。

AI should ask project-specific unknowns one item at a time. The default setup pack is the only grouped setup question.
AI 应对项目特有且未知的配置一次只问一项。默认配置包是唯一可以合并询问的初始化问题。

After the template is copied, AI should run `pnpm install`, `pnpm env:init` and `pnpm dev` before the first setup question.
模板下载完毕后，AI 应先运行 `pnpm install`、`pnpm env:init` 和 `pnpm dev`，再询问第一个初始化问题。

When the dev server is ready, send the Vite `Local` and `Network` URLs, especially the LAN address, together with the default setup pack question.
开发服务启动成功后，将 Vite 输出的 `Local` 和 `Network` 访问地址，尤其是局域网地址，和默认配置包询问放在同一条消息里发给开发者。

Do not ask for the project name, project logo, Empty component icon, env values, contract addresses, social meta or page assets in the same message as the default setup pack.
不要在默认配置包同一轮里询问项目名称、项目 logo、Empty 组件图标、env 值、合约地址、社交 meta 或页面切图。

If the developer replies `默认`, record all default setup pack values as confirmed, then continue with non-default setup items one at a time.
开发者回复 `默认` 时，记录默认配置包里的所有值为已确认，然后继续对非默认初始化项一次只问一项。

## Fixed constraints
## 固定约束

- Use pnpm only. Do not use npm or yarn.
- 只使用 pnpm，不使用 npm 或 yarn。
- Do not ask which package manager should be used during setup; pnpm is fixed.
- 初始化时不要询问包管理器；pnpm 是固定规则。
- Keep `pnpm-lock.yaml` as the only lock file.
- 只保留 `pnpm-lock.yaml` 作为依赖锁文件。
- Keep the template package name fixed as `@jcy/template-react`; do not ask for or rewrite it during real project setup.
- 模板包名固定为 `@jcy/template-react`；真实项目初始化时不要询问或改写它。
- Keep `.env.production` `VITE_BASE_URL` empty so production API requests use the current site origin.
- `.env.production` 的 `VITE_BASE_URL` 保持为空，生产接口请求使用当前网站同源地址。
- Keep `.env.production` `VITE_RPC_URL` empty because production uses `DAPP_PRODUCTION_CHAIN`.
- `.env.production` 的 `VITE_RPC_URL` 保持为空，生产环境使用 `DAPP_PRODUCTION_CHAIN`。

## Default setup pack
## 默认配置包

Ask these common project defaults together. Most projects can reply `默认`; if a project needs changes, the developer can answer only the changed fields, such as `菜单 tabbar，多语言关闭`.
这些常用项目默认项可以一起询问。大多数项目可以回复 `默认`；如果项目需要修改，开发者只需要回复要改的字段，例如 `菜单 tabbar，多语言关闭`。

When presenting this pack, always include the default value, Available options and short meaning for every item. Do not list defaults only.
抛出这个配置包时，每一项都要同时说明默认值、可选项和简短含义，不能只列默认值。

- Route base: default `/h5/`. Available options: `/h5/` for a common H5 subdirectory deployment, `/` for root deployment, or a custom server prefix.
- 部署目录：默认 `/h5/`。可选项：`/h5/` 用于常见 H5 子目录部署，`/` 用于根目录部署，也可以填写服务端约定的自定义前缀。
- Default home route: `/home`. Available options: `/home` for the normal first page, or another first-level route if the project uses a different home entry.
- 默认首页：`/home`。可选项：`/home` 用于常规首页，如果项目入口不同，也可以改成其他一级路由。
- Layout menu: default `sidebar`. Available options: `sidebar` for side navigation, or `tabbar` for bottom navigation.
- 布局菜单：默认 `sidebar`。可选项：`sidebar` 侧边栏导航，`tabbar` 底部导航。
- Login mode: default `dapp`. Available options: `dapp` for wallet login only, `hybrid` for wallet and account login, or `account` for account/password login only.
- 登录模式：默认 `dapp`。可选项：`dapp` 仅钱包登录，`hybrid` 钱包与账号登录，`account` 仅账号密码登录。
- i18n: default enabled. Development defaults to `zh-Hans`, and production defaults to `en`. Available options: `enabled` for language switching and request `lang`, or `disabled` to hide language switching and lock language to `zh-Hans`.
- 多语言：默认启用。开发环境默认 `zh-Hans`，生产环境默认 `en`。可选项：`enabled` 支持切换语言并在请求中传 `lang`，`disabled` 关闭多语言功能、隐藏语言切换并固定为 `zh-Hans`。
- DApp production chain: default BSC through the viem `bsc` chain preset. Available options: BSC, or another viem built-in chain; write `other viem chain` when the project needs a different production network.
- DApp 生产网络：默认使用 viem 的 `bsc` 链配置。可选项：BSC，或其他 viem 内置链；项目需要其他生产网络时可写 `other viem chain`。
- DApp write defaults: gas check disabled, gas estimate disabled, ERC20 insufficient allowance approves the maximum amount by default, Token decimals default to 18. Available options: gas check and gas estimate can be enabled when the project needs frontend pre-checks; ERC20 approval can be changed to approve the passed specific amount; Token decimals can be changed to other decimals confirmed by the project.
- DApp 写合约默认项：默认关闭 Gas 检查、关闭 Gas 估算；ERC20 授权不足时默认授权最大上限；Token 精度默认 18。可选项：项目需要前端预检查时可开启 Gas 检查和 Gas 估算；ERC20 授权可改为按传入的具体数值授权；Token 精度可改为项目确认的其他精度。

## Required before development
## 开发前必改

1. Run `pnpm env:init`; it reads `.env.example` and creates `.env.development` and `.env.production` without copying example comments.
1. 运行 `pnpm env:init`；它会读取 `.env.example` 并创建 `.env.development` 和 `.env.production`，不要复制 example 里的注释。
2. Confirm the default setup pack. The developer can reply `默认` to accept route base, home route, layout menu, login mode, i18n and DApp production chain defaults together.
2. 确认默认配置包。开发者可回复 `默认`，一次确认部署目录、首页路由、布局菜单、登录模式、多语言和 DApp 生产网络等默认项。
3. Ask for the project name after the default setup pack is confirmed.
3. 默认配置包确认后，再单独询问项目名称。
4. Ask whether the project logo is ready. It must be a square PNG, and the recommended size is 100x100.
4. 询问项目 logo 是否已准备好。必须是正方形 PNG，建议 100x100。
5. If there is no logo yet, tell the developer it can be skipped during early development, and keep `public/brand/brand-status.json` as not ready.
5. 如果暂时没有 logo，告诉开发者前期开发可先跳过，并保持 `public/brand/brand-status.json` 为未就绪。
6. Generate the fixed 68x68 favicon from the logo with `pnpm favicon:generate`; do not ask the developer for favicon.
6. favicon 由 logo 自动生成固定 68x68 尺寸：运行 `pnpm favicon:generate`，不要再向开发者索要 favicon。
7. Production build is blocked until the project logo is replaced and `public/brand/brand-status.json` is marked ready.
7. 生产构建会在项目 logo 替换、并将 `public/brand/brand-status.json` 标记为就绪前被阻止。
8. Ask whether the Empty component icon is ready after the logo answer has been handled. It should be a PNG exported from Figma.
8. 等 logo 回答处理完后，再单独询问 Empty 组件图标是否已准备好。它通常是从 Figma 导出的 PNG。
9. If there is no Empty component icon yet, tell the developer it can be skipped during early development and record it in `PROJECT_SETUP_STATUS.md`.
9. 如果暂时没有 Empty 组件图标，告诉开发者前期开发可先跳过，并记录到 `PROJECT_SETUP_STATUS.md`。
10. If the Empty component icon is provided, run `pnpm empty:asset -- --input <empty-icon.png>`.
10. 如果已提供 Empty 组件图标，运行 `pnpm empty:asset -- --input <empty-icon.png>`。
11. The script reads the PNG width and height automatically. A 1x Figma export uses its original width. A large 2x export, usually close to 750px wide or around 500px tall, uses half of its width. The component writes width only and keeps height as auto.
11. 脚本会自动读取 PNG 宽高。Figma 导出的 1x 图使用原始宽度；较大的 2x 图通常接近 750px 宽或 500px 高，此时使用宽度的一半。组件只写宽度，高度保持 auto。

## Can be skipped until integration
## 可等到联调阶段补充

1. Development API URL in `.env.development` `VITE_BASE_URL`.
1. `.env.development` 中的开发接口地址 `VITE_BASE_URL`。
2. Development RPC URL in `.env.development` `VITE_RPC_URL`.
2. `.env.development` 中的开发 RPC 地址 `VITE_RPC_URL`。
3. Token and contract addresses using keys defined by the confirmed contract documentation.
3. 按已确认合约文档定义对应的 Token 与合约地址键。
4. Social share meta values.
4. 社交分享 meta 配置。

## Before page implementation from Figma
## Figma 页面开发前

1. Let AI handle automatic theme color extraction during page implementation.
1. 页面实现时自动抽取公共颜色到主题 SCSS 配置。
2. Export required page assets into `src/assets/<page-name>/`.
2. 将页面所需切图导出到 `src/assets/<page-name>/`。
3. Check reusable components, utility classes and mixins before writing page SCSS.
3. 写页面 SCSS 前先检查可复用组件、工具类和 mixin。
4. Check `PROJECT_TERMS.md` before copying visible design text.
4. 复制设计稿可见文案前先检查 `PROJECT_TERMS.md`。
5. Implement basic local interactions even if API data is still static.
5. 即使接口数据仍是静态的，也要实现基础本地交互。

## After API and contract integration
## 接口和合约联调后

1. Replace static balances, rewards, quotas and progress numbers with their confirmed data sources.
1. 将静态余额、收益、额度和进度数字替换为已确认的数据来源。
2. Register page-level pull refresh with `usePageRefresh()` for business pages that should refresh.
2. 需要刷新的业务页使用 `usePageRefresh()` 注册页面级下拉刷新。
3. Use `useLatestRequest()` or `AbortController` to prevent stale requests from writing old data back.
3. 使用 `useLatestRequest()` 或 `AbortController` 防止旧请求回写旧数据。
4. Revisit large page files and move data orchestration into page hooks or same-directory services.
4. 复盘体积较大的页面文件，将数据编排回收到页面 hook 或同目录 service 中。
5. If authentication is added, verify its startup gate, wallet-account recovery and authenticated API ordering against the confirmed backend contract.
5. 如果新增鉴权，按已确认后端契约验证启动门槛、钱包账号恢复与鉴权接口请求顺序。

## Status file
## 状态文件

After setup, create `PROJECT_SETUP_STATUS.md` in the real project.
初始化完成后，在真实项目中创建 `PROJECT_SETUP_STATUS.md`。

Only record confirmed items and skipped items with their follow-up stage.
只记录已确认项和跳过项及其补齐阶段。

If the developer skips the logo, record that the project logo is still not replaced and production build cannot pass yet.
如果开发者暂时没有 logo，要记录项目 logo 尚未替换，生产构建暂时不能通过。

If the developer skips the Empty component icon, record that the shared empty-state image still uses the template placeholder.
如果开发者暂时没有 Empty 组件图标，要记录通用空状态图仍使用模板占位资源。
