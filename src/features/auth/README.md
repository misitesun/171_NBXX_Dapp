# 钱包鉴权

事实来源：`docs/api.md`；页面参考 HU_CHAIN 的 splash 钱包入口，协议只取当前项目文档。

- `requestWalletLogin`：POST `/api/auth/login`，JSON `{address, signature, timestamp, ref?}`；签名消息严格为 `Login-{Unix秒}`。token 是后续请求必需输入，因此成功体必须包含非空字符串 token。无临时登录、无假 token、无生产跳过签名逻辑。
- `mountAuthSession`：注册 HTTP 地址及 401 回调；缓存 Token 必须核对连接钱包与持久化地址，然后 GET `/api/users/my` 验证成功才进入首页。
- 按HU开屏流程自动授权（会话恢复结束后等待1秒动画）；页面没有邀请码输入框、语言入口、额外标题或授权按钮，从 `/ref/:ref`、旧query或缓存自动读取 ref。失败原因显示在底部，刷新后重新尝试，不自动循环签名。60 秒签名过期提示重新授权，400/422 由公共 HTTP Toast 展示服务端原文。新用户的邀请码要求由服务端裁定，不阻止已有账号省略邀请码。
- 公共 HTTP 会发送已连接并核对当前状态的钱包 Address，包括无Token的 POST 登录；旧Token先清除，签名完成且账号未变更才提供登录地址。有Token时必须核对所属钱包后一起发送 Bearer 与 Address。切换钱包、切链、401 会立即清 Token、用户信息、钱包缓存、取消请求并使旧签名/请求失效。
- 签名与请求期间的重复提交合并为同一 Promise。Token 登录成功后首页独立加载数据；资料加载失败不会变成登录失败或再次 POST。
- 请求信号由会话拥有，登出/卸载会取消旧请求。卸载只解绑、取消，不删除可恢复 Token。
- `resumeSession` 不自动重新签名；无钱包、地址不一致或会话验证失败回到授权页。依赖通用 services/dapp 能力，PHP 协议不进入通用钱包模块。

验证：`pnpm exec node --test tests/nbxx-api.test.mjs tests/nbxx-auth.test.mjs`。
