# 接口文档

## 通用说明

### 地址

| 环境 | Base URL |
|------|----------|
| 本地 | `http://127.0.0.1:9520` |

### 鉴权

需要登录的接口，在请求头中携带登录接口返回的 token：

```
Authorization: Bearer <token>
```

- 单点登录（SSO）：同一用户重新登录后，之前的 token 失效。
- 可选请求头 `address`：传入当前钱包地址时，服务端会校验它与 token 对应的用户地址是否一致，不一致返回 401。前端切换钱包后应重新登录。

### 多语言

请求头 `lang` 控制错误提示语言：`zh-CN` / `zh-TW` / `en-US`。

### 错误响应

所有错误都通过 **HTTP 状态码** 区分，响应体是**纯文本**错误信息（不是 JSON）。

| HTTP 状态码 | 说明 | 响应体示例 |
|------------|------|-----------|
| 400 | 业务前置条件不满足 | `邀请码不能为空` |
| 401 | 未登录 / token 无效 / 地址校验失败 / 账号被封禁 | `Unauthorized.`、`签名验证失败`、`账号被封禁` |
| 404 | 资源不存在 | `not found` |
| 422 | 参数校验失败（返回第一条错误） | `The page size field is required.` |
| 500 | 服务器内部错误 | `Internal Server Error.` |

---

## 1. 钱包登录

`POST /api/auth/login`

无需登录。地址首次登录时自动注册，并绑定邀请人。

### 请求参数（JSON Body）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| address | string | 是 | 钱包地址，大小写均可，服务端会转换为校验和格式 |
| signature | string | 是 | 钱包对消息 `Login-{timestamp}` 的签名（`personal_sign`） |
| timestamp | integer | 是 | 签名时的 Unix 时间戳（秒），必须在 60 秒以内 |
| ref | string | 否 | 邀请人的邀请码（即邀请人的 `referral_code`）。**系统中已有用户时，新用户注册必须填写** |

签名消息示例：

```
Login-1790668800
```

### 请求示例

```json
{
  "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "signature": "0x5f3c...1b",
  "timestamp": 1790668800,
  "ref": "a1B2c3"
}
```

### 响应示例

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
}
```

### 错误

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 401 | `签名验证失败` | 签名与地址不匹配 |
| 400 | `邀请码不能为空` | 新用户注册时 `ref` 为空或邀请码无效 |
| 422 | 校验信息 | 缺少参数，或 `timestamp` 已超过 60 秒 |

> 非生产环境（`APP_ENV` 不为 `prod`）会跳过签名校验，方便联调。

---

## 2. 我的信息

`GET /api/users/my`

需要登录。

### 请求参数

无

### 响应示例

```json
{
  "id": 1,
  "team_count": 12,
  "node_kpi": "1000.000000",
  "team_node_kpi": "5500.000000",
  "referral_code": "a1B2c3",
  "referral_count": 3
}
```

### 响应字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户 ID |
| team_count | integer | 团队人数（所有下级，不含自己） |
| node_kpi | string | 个人节点业绩（U），6 位小数 |
| team_node_kpi | string | 团队节点业绩（U），6 位小数，不含自己 |
| referral_code | string | 我的邀请码，作为下级登录时的 `ref` |
| referral_count | integer | 直推人数 |

---

## 3. 我的直推列表

`GET /api/users/my/referrals`

需要登录。按注册时间倒序返回直推下级。

### 请求参数（Query）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page_no | integer | 是 | 页码，从 1 开始 |
| page_size | integer | 是 | 每页条数，1 ~ 20 |

### 请求示例

```
GET /api/users/my/referrals?page_no=1&page_size=20
```

### 响应示例

```json
{
  "referrals": [
    {
      "id": 5,
      "team_count": 2,
      "node_kpi": "500.000000",
      "team_node_kpi": "1000.000000",
      "referral_code": "x9Y8z7",
      "referral_count": 2
    }
  ]
}
```

### 响应字段

`referrals` 为数组，每一项字段与 [我的信息](#2-我的信息) 相同。不返回总数；返回条数小于 `page_size` 即为最后一页。

开发者于 2026-09-29 提供的浏览器 Network Preview 中，直推对象额外包含钱包 `address`（`0x` 前缀加 40 位十六进制字符）。原始接口文档未列出该字段，因此前端将它作为可选字段兼容：出现时校验并用于脱敏展示，缺少时仍显示用户 ID。

---

## 4. NFT 元数据

`GET /nfts/{id}`

无需登录。供合约 `tokenURI` 使用，**路径不带 `/api` 前缀**。

### 路径参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 链上 nftId |

### 请求示例

```
GET /nfts/1
```

### 响应示例

```json
{
  "name": "NBXX #10001",
  "description": "",
  "image": "http://192.168.31.215:9000/uploads/20260929/xxx.png"
}
```

### 响应字段

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | `NBXX #` + (nftId + 10000) |
| description | string | 描述，目前固定为空 |
| image | string | NFT 图片地址，按节点类型取 `setting` 表中的 `nft_image_1`（小节点）/ `nft_image_2`（大节点）；未配置时为空字符串 |

### 错误

| HTTP 状态码 | 响应体 | 说明 |
|------------|--------|------|
| 404 | `not found` | 该 NFT 尚未被监听入库 |
