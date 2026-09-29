# 用户与直推

依据 `docs/api.md` 集中维护 GET `/api/users/my` 与 GET `/api/users/my/referrals`。GET 均需要 Bearer Token；钱包上下文地址由已核对的 auth 会话提供。`page_no` 从 1 开始，`page_size=20`；条数小于 20 到达末页，无总数字段。

所有响应以 unknown 接收。验证六个文档字段：id、team_count、referral_count 为安全非负整数（id 正数）；node_kpi、team_node_kpi 为六位小数字符串；referral_code 为非空字符串。金额保持原始字符串，不进行浮点换算。返回失败不使用设计稿样例或默认零值替代。

当前文档的“团队信息”是直推列表，并非全层级成员列表；个人信息 team_count 仍统计所有下级。原始 API Markdown 未列出钱包地址，但开发者提供的 2026-09-29 Network Preview 显示直推项包含 `address`。因此解析器兼容无地址的旧响应，并在地址出现时校验 `0x` 加 40 位十六进制格式；首页仅使用已有 `maskWalletAddress` 脱敏显示。没有地址时回退显示用户 ID，不从 ID 推导地址。注册时间仍未提供，不展示。

验证：`pnpm exec node --test tests/nbxx-api.test.mjs`。
