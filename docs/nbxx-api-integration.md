# NodeXX 登录、用户与直推接口对接

## 范围和事实

来源：开发者提供的 `/Users/sly/Downloads/api.md`，原文归档在 `docs/api.md`。开发接口地址以开发者本轮指令为准：`http://192.168.110.11:9520`。`.env.production` API/RPC 保持空，生产走同源 `/api/...`。

| 接口 | 鉴权/请求 | 消费的成功数据 |
| --- | --- | --- |
| POST /api/auth/login | personal_sign `Login-{timestamp}`；address、signature、秒级timestamp、可选ref | token，后续 Bearer 请求必需，严格校验 |
| GET /api/users/my | Bearer + 已核对 Address | 6个用户字段；金额保留6位小数字符串 |
| GET /api/users/my/referrals | Bearer + Address；page_no从1开始、page_size20 | referrals数组；返回不足20条为末页 |

HTTP错误通过状态码、纯文本传入公共错误提示。SSO旧Token失效及钱包切换均需重新登录。前端五种语言保留；请求lang映射：zh-Hans→zh-CN、zh-Hant→zh-TW、en/ja/ko→en-US。

## 入口及消费者

新增 auth/user feature、auth store、独立授权页和首页 API 组合层。HTTP/钱包/存储平台边界继续使用现有封装。恢复会话读取我的信息成功后进入首页；公开登录请求不携带旧Token，但携带已连接并核对的钱包Address（开发者2026-09-29确认全局传入）。邀请码优先由 `/ref/:ref` 路径读取，兼容旧query及缓存；邀请链接使用当前用户referral_code生成站点根路径 `/ref/邀请码`，服务器转发至 `/h5/ref/**`，不使用登录缓存。应用仍以 `/h5/` 为打包目录。按HU开屏自动授权，没有多余输入框。

首页四指标分别映射 team_count、team_node_kpi、referral_count、node_kpi，单位U。原始 API Markdown 的直推字段列表未包含钱包地址，但开发者 2026-09-29 提供的 Network Preview 显示 referral 对象含 `address`；前端兼容该字段并在出现时验证格式、默认脱敏展示，旧响应缺少地址时显示 ID，不推导钱包地址或注册时间。读取失败可重试，不回退到Figma样例；分页由团队成员框内触底滚动触发，加载、末页提示和手动加载按钮均在框内；仅监听框内的新滚动事件，加载期间禁止重复，失败保留同页供按钮重试。刷新同步清空列表/页码/hasMore后加载第一页，旧请求无法覆盖新结果。下拉刷新等待实际两个GET结束；加载下一页期间关闭刷新。结束提示仅在非空列表末页显示。

## 验证与后续

运行 pnpm lint、pnpm test、pnpm exec tsc -b、pnpm build，以及新接口/登录行为回归。真实后端目前已验证无登录GET返回401纯文本；成功登录/邀请码绑定及SSO验收需真实钱包签名，不使用文档提及的后端跳过签名选项伪造前端会话。

API阶段曾暂跳过第3步，先完成第4步的API驱动逻辑。2026-09-29 已补充 NBXXNode ABI/地址与购买规则，开发者要求沿用已有本地网络并自行测试，购买已接入；价格读取实际链上值，权益和供应仍为静态设计参数。详见 docs/contracts/nbxx-node-purchase.md。

回滚路径：移除项目auth路由门槛和AuthenticatedHomePage绑定后可恢复静态首页；通用HTTP/DApp协议没有迁移，既有静态HomePage依然可用于showcase。

## 2026-09-29 初次接口对接验证记录

- pnpm lint：通过，无警告；pnpm exec tsc -b：通过；git diff --check：通过。
- pnpm test / pnpm build的verify：242项中241项通过。唯一失败为既有Empty测试仍断言204px，而本轮开始前工作区Empty.scss已经是160px；本轮保留已有资源及样式。构建在该测试门禁停止，不报告生产构建成功。
- 独立检查品牌门禁：isProjectLogoReady=false，正方形真实logo仍待补齐；未绕过生产构建生命周期。
- 新nbxx-api/nbxx-auth：12项通过（本地adapter/provider fixture），覆盖请求与响应、精确签名、重复提交、账户变化、迟到POST、缓存恢复、SSO401、签名过期。
- 浏览器真实React hook回归：`/h5/tests/nbxx-home-harness.html`，点击Run pagination checks，6/6通过。本地fixture覆盖第一页/资料绑定、重复分页、刷新与旧第二页竞态、末页、第一页失败、重试；所有响应在浏览器本地拦截，不请求后端。该入口仅供Vite开发检查，标准生产index构建不包含它。
- 授权页375px/750px：无横向溢出；查询邀请码自动回填，无钱包点击授权提示正确；中英文文案已检查。
- 真实后端：GET我的信息及直推分页无Token均返回401/Unauthorized.；POST登录空参数返回422/The address field is required.。没有创建测试用户，没有利用非生产签名跳过建立会话。
- 真实钱包成功签名、有效邀请码注册、成功GET及服务端SSO仍待钱包环境验收。当前浏览器未提供注入钱包，不能将fixture回归等同于真实用户联调通过。

## 2026-09-29 邀请路径与授权开屏改动验证

- 邀请链接为 `/ref/邀请码`，不带部署目录并保留参数编码；服务器负责转发至 `/h5/ref/**`。授权自动读取路径邀请码并保留旧query与缓存兼容，无邀请码输入框。
- 登录POST发送已连接Address，不携带旧Token；缓存会话恢复仍核对钱包，不匹配时不发送受保护请求。
- 相关28项回归、pnpm exec tsc -b、pnpm lint、git diff --check通过；pnpm build预检的完整256项测试中255项通过，仍被既有Empty宽度160px/测试204px不一致阻断。品牌ready仍为false，未绕过构建门禁。
- 浏览器375px/750px无横向溢出、无输入框；无钱包自动提示、中英文切换正常。请求及签名为本地fixture验证，真实钱包有效邀请码注册绑定仍待现场验收。
- 按dapp-change-review只读复核：参数来源、缓存生命周期、登录成功体必需token校验、旧钱包/迟到请求失效、公开登录Address与Bearer绑定均保持预期边界。
