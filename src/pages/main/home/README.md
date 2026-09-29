# NodeXX 首页

依据 Figma NVwAAv12WZx1LiCTqPMNWD / 30192:718 实现静态首页。完整量测、资源来源和验收记录位于 docs/design/home/implementation-checklist.md。

## 参数与链上边界

- config.ts 的 HOME_PAGE_CONFIG 集中维护币种符号、默认等级、价格、供应量、权益比例、票数、配资额度、指标和外链。
- HomePage 接收 config，可由未来链上读取结果替换展示参数；NFT展示参数来自设计稿，不代表实时链上状态；正式路由的团队指标由API配置替换。
- onPurchase(tier) 接收已选 NFT 等级。未提供回调时复用 Toast 提示“敬请期待”；purchasing 控制卡片和购买按钮的禁用状态，soldOut 控制售罄状态。
- 价格及比例是展示字符串，不参与交易精度换算。未来合约适配层需依据确认的 ABI、网络、地址、币种精度构造交易参数。
- 静态HomePage组件不拥有 API 请求、链上读写或购买鉴权；正式路由的AuthenticatedHomePage负责API读取及下拉刷新。现有 MainLayout 与钱包状态契约继续保留；侧栏入口按开发者要求关闭。

## 文案与布局

项目文案放在 src/i18n/locales/project/，五种语言使用相同插值参数，数值和外链不写入翻译文案。静态媒体图标作为原稿资源保留。

所有源尺寸使用 Figma 750px 画板数值，经现有 px-to-vw 流程转换。Grid/Flex 承担内容排版；装饰背景、星球及角标使用带 layout-exception 注释的定位。长翻译允许正常换行和卡片增高。

## 验证

pnpm lint、pnpm test、pnpm exec tsc -b；浏览器检查 750px 和 375px、五种语言、NFT 切换与未接交易时的提示。pnpm build 仍要求真实初始化 Logo 就绪。

## 选择与媒体滚动

NFT卡片背景、勾选标记、权益栏背景及高亮文案由同一个选中等级控制。NFT主体图与等级价格保持所属等级。媒体两行采用两组相同资源首尾衔接，上行向左、下行向右；config.mediaScrollDurationSeconds 控制每轮时间（正数，默认40秒）。CSS线性循环，不触发逐帧React更新。系统减少动态效果时停止滚动。媒体图像提前加载，避免移动到视口时才请求资源。

## 推特入口

页脚 Twitter 胶囊入口沿用 `config.links.social`，原稿 SVG 图标保存在 `src/assets/home/twitter-icon.svg`。品牌名称保留 Twitter，可访问名称支持五种语言。详细量测见 `docs/design/home/twitter-update.md`。

## 团队与邀请

最新稿的四张团队指标通过 `config.metrics` 注入，金额保留展示字符串，小数部分按原稿使用28px字号。`performanceUnit` 控制业绩单位；`teamMembers` 提供稳定 id、地址展示值、加入时间展示值及两类业绩。四个默认成员仅为 Figma 样例，无真实用户数据或时间转换。

`invitationText` 作为原始复制值，使用公共 `copyTextToClipboard` 并通过现有 Toast 提示成功或失败；为空时禁止复制。默认值是设计稿文字，不是生成的邀请链接，真实值由后续已确认业务来源传入。成员列表最多显示1075源像素并支持内部滚动，原稿末卡裁切部分可滚动查看；少量/空成员按内容收缩，空列表复用公共 `Empty` 组件的图标与默认上下间距，保留本地化“暂无团队成员”文案。量测见 `docs/design/home/team-update.md`。

## 已接入API数据

生产路由使用AuthenticatedHomePage组合HomePage，静态showcase仍传原配置。API来源和字段映射见docs/nbxx-api-integration.md。四项指标、邀请链接与直推列表使用真实GET数据；Network Preview 新增的 `address` 字段出现时用 `maskWalletAddress` 默认脱敏显示，缺失时保留 ID 展示，不推导地址；未提供的注册时间不显示。金额原样保留6位小数，单位U。列表在成员框内滚动至距底部不足容器高度15%时加载下一页，加载提示、手动加载按钮与末页提示均留在框内，并复用DropletLoading；团队框最大高度为1816.5源像素，对应6.5张261px成员卡及六个20px间隔，较少数据时自然收缩。下拉刷新等待真实GET，刷新先重置分页，旧请求结果被丢弃。未加载时显示破折号，失败可重试，不展示样例为真实数据。购买通过useNftPurchase对接NBXXNode：初级buy(1)、高级buy(2)。真实价格/USDT精度由链上读取，`hasPurchased(当前钱包地址)` 决定单次购买状态；状态读取中或失败时禁用购买，失败可重试，已购买时按钮显示“已购买”并禁用。提交前再次查询合约状态，已购买地址不会进入余额、授权或购买交易。价格读取失败也会禁用购买；授权不足时按初始化策略最大授权。公共ContractLoading覆盖提交，购买期间禁用下拉刷新，成功回执后等待同步再刷新数据。详见docs/contracts/nbxx-node-purchase.md。

## 框内滚动分页

`teamScrollPagination.ts` 仅观察成员框自身滚动，IntersectionObserver 的 root 为该容器；不支持观察器时仍使用容器 scroll 事件与实际滚动距离。注册时不根据历史滚动位置加载，每次请求后需再次滚动才能继续；第一页加载、加载下一页、读取失败、末页及购买期间关闭自动分页。刷新第一页时滚动位置回到顶部。`onLoadMore` 返回实际请求 Promise，由数据层报告请求错误并维持页码，框内按钮可手动重试。内部已滚动时隔离 touchstart，避免外层页面下拉刷新误接管手势。

回归：`pnpm exec node --test tests/team-scroll-pagination.test.mjs tests/home-page.test.mjs`；浏览器本地 fixture 见 `tests/nbxx-home-harness.html`，不代表真实钱包/API 验收。
