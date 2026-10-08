# Project setup status
# 项目初始化状态

初始化默认配置与展示名称已确认并回填。Logo 已补齐，Empty 资源仍保留生产前补齐项。2026-09-28 开发者授权直接开展首页静态页面开发。

## Confirmed
## 已确认

- Project display name / 项目展示名称：`NBXX`，2026-10-08 开发者确认更名，用于浏览器标题和应用文案。
- Route base / 部署目录：`/h5/`。
- Home route / 首页路由：`/home`。
- Layout menu / 导航模式：`sidebar`；开发者后续要求关闭侧栏图标，`sidebarMenuEnabled=false`，暂不显示入口及侧栏。
- Login mode / 登录模式：`dapp`，钱包登录；实际鉴权等待当前项目接口文档。
- I18n / 多语言：启用；开发默认 `zh-Hans`，生产默认 `en`。
- Production chain / 生产网络：viem `bsc`，BSC。
- Gas check / Gas 检查：关闭。
- Gas estimate / Gas 估算：关闭。
- ERC20 approval / ERC20 授权：授权不足时使用最大额度。
- Default Token decimals / 默认 Token 精度：18；具体资产联调仍以当前项目合约文档为准。

The package name remains fixed as `@jcy/template-react`. These confirmed defaults already match the current app and DApp configuration.
包名固定为 `@jcy/template-react`。上述已确认默认项与当前应用及 DApp 配置一致。

## Skipped items and follow-up
## 已跳过项与补齐阶段

- Project initialization logo / 项目初始化 Logo：2026-10-06 开发者提供500×500透明PNG金牛 NBXX Logo，替换 `public/brand/app-logo.png`，顶部、登录页及页脚统一引用并按正方形等比显示；已通过 `pnpm favicon:generate` 生成favicon，`isProjectLogoReady=true`。2026-10-08 展示名称更新为NBXX。
- Empty-state icon / Empty 空状态图标：开发者确认早期开发先跳过，通用 Empty 组件继续使用模板占位资源；项目专属 PNG 图标准备好后，通过 `pnpm empty:asset -- --input <empty-icon.png>` 更新，并在正式页面验收前补齐。

## 当前开发阶段

首页静态展示已实现并完成本地交互、多语言与375px/750px浏览器检查。下一步继续完成项目所需静态页面。首页参数位于 src/pages/main/home/config.ts，未来链上购买由 onPurchase 回调接入。

2026-09-29 已收到 api.md，集中配置登录、我的信息和直推列表请求。开发 VITE_BASE_URL 已确认为 http://192.168.110.11:9520。第3步合约文档尚未提供，按开发者要求记录暂时跳过；第4步先接 API 驱动登录和首页数据，开发 VITE_RPC_URL 保留空，待链上阶段确认。合约读取与交易应在当前项目 ABI/地址/精度文档到位后实现，不将模板 BSC 默认值当作已确认的具体合约事实。

2026-09-29 开发者补充 NBXXNode ABI 和 USDT/NBXXNode 地址，并确认初级 buy(1)、高级 buy(2)、授权 NBXXNode 及 raw PRICE_TYPE_1/2 购买金额。后续明确沿用现有本地网络，要求直接完成代码，由开发者测试。第3步补入项目 ABI/地址封装，第4步接入购买；链上价格和 USDT 精度实际读取，复用最大授权及成功回执后的延迟刷新。开发链沿用项目已有 chainId 31337，不把钱包截图视为部署证明。生产地址仍待确认，真实钱包交易待开发者验收。
