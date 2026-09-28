# ADR 0006: Mutation success is not coupled to unused response parsing
# ADR 0006：提交成功不与未使用响应解析绑定

- Status: Accepted
- Date: 2026-09-28

## Context
## 背景

A real project derived from this template observed a backend mutation complete while returning an unused nested field that was incompatible with a parser reused from a read/detail response. The frontend displayed a failure even though the write had succeeded, creating a risk that the user would repeat it.

从本模板派生的真实项目曾出现：后端提交已经完成，但响应中页面不使用的嵌套字段与复用的读取/详情解析器不兼容。前端因此在写入成功后仍提示失败，产生用户重复提交的风险。

## Decision
## 决策

Every mutation response is classified before implementation.
每个提交响应在实现前必须先分类。

- If no next frontend step consumes the success body, the feature method returns `Promise<void>` and awaits the shared request without parsing the body.
- If the next step needs values for a contract call, navigation, a follow-up request or a download, the feature validates and returns only the documented fields actually consumed.
- Pages obtain final display state from authoritative read endpoints. A refresh failure after mutation success must not be reported as mutation failure.
- Regression tests cover incompatible successful unused bodies and preserve strict parsing for required downstream values such as server-signed contract arguments.

- 如果前端下一步不消费成功响应体，feature 方法返回 `Promise<void>`，只等待公共请求，不解析响应体。
- 如果下一步合约调用、跳转、后续请求或下载需要响应数据，feature 只校验并返回实际使用且已文档化的字段。
- 页面最终展示状态来自权威读取接口。提交成功后的刷新失败不能被提示为提交失败。
- 回归测试覆盖成功但不兼容的未使用响应体，并继续严格校验服务端签名合约参数等下游必需数据。

## Consequences
## 后果

Mutation functions have narrower, intention-revealing return types and cannot fail solely because an unused field drifted. HTTP failures remain visible, while backend contract drift is still detected wherever the frontend truly consumes data. Project-specific endpoints and response fields remain in the derived project; only the reusable boundary and test pattern live in this template.

提交函数拥有更窄且表达意图的返回类型，不会仅因未使用字段漂移而失败。HTTP 失败仍会正常展示；前端真正消费的数据发生契约漂移时，依然会被严格解析发现。具体接口和响应字段保留在派生项目中，模板只沉淀可复用的边界与测试模式。
