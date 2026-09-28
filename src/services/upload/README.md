# Upload service

The base upload service provides browser file selection and multipart upload primitives. Every upload call must supply its endpoint explicitly; the template does not assume an API path, field name, response envelope or native-host protocol.

基础上传服务提供浏览器文件选择和 multipart 上传能力。每次上传必须显式传入端点；模板不猜测 API 路径、字段名、响应包裹层或原生宿主协议。

```ts
const file = await selectImageFile({ accept: 'image/*' })
const result = await uploadFile({
    file,
    url: '/api/confirmed-upload-endpoint',
    fieldName: 'confirmedFieldName',
})
```

`UploadResult` only guarantees a `url` because that is the public helper contract. If the backend uses another response shape, parse and map it in a project feature after its API Markdown is confirmed.

`UploadResult` 的公共契约只保证 `url`。后端响应结构不同时，应在接口 Markdown 确认后由项目 feature 负责解析和映射。

Flutter or other native upload bridges are project contracts. Add a project-owned adapter after its outbound message, callback format, timeout, authentication and concurrency rules are documented.

Flutter 或其他原生上传 Bridge 属于项目契约。只有发送消息、回调格式、超时、鉴权和并发规则都有文档后，才新增项目适配器。
