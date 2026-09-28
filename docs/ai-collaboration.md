# AI collaboration rules
# AI 协作规则

This document turns `AGENTS.md` into a repeatable change workflow. It narrows AI work; it does not replace project decisions, backend contracts, ABI documents, tests, or human review.
本文把 `AGENTS.md` 转成可重复执行的变更工作流。它用于收窄 AI 工作范围，不能替代项目决策、后端契约、ABI 文档、测试或人工审查。

## Change sequence
## 变更顺序

1. Read `AGENTS.md`, this document, and the relevant module README.
2. Read the source-of-truth document for the task: Figma checklist, PHP API Markdown, contract/ABI Markdown, environment note, or existing compatibility record.
3. Select the matching skill in `.agents/skills/`.
4. Inspect current behavior, tests, and working-tree status before editing.
5. Declare scope, make the smallest complete change, update affected documentation and tests, then run the required checks.
6. Use `dapp-change-review` for an independent read-only review when a change crosses contracts or has elevated risk.

1. 阅读 `AGENTS.md`、本文和相关模块 README。
2. 阅读任务的事实来源：Figma 清单、PHP 接口 Markdown、合约/ABI Markdown、环境说明或已有兼容性记录。
3. 选择 `.agents/skills/` 中匹配的 skill。
4. 修改前检查当前行为、测试和工作区状态。
5. 声明范围，做最小但完整的改动，更新受影响的文档和测试，再运行必需检查。
6. 跨契约或高风险变更使用 `dapp-change-review` 做独立只读审查。

## Scope declaration
## 范围声明

Every implementation should state this compact contract before edits:
每次实现前都应声明以下简短契约：

```md
目标：
允许修改：
明确不做：
事实依据：
验收与验证：
```

An unexpected need to change a shared service, route, environment field, dependency, global style, build rule, or another feature is a scope change. Stop, explain the impact, and obtain a new scope instead of silently broadening the patch.
出现需要修改共享服务、路由、环境字段、依赖、全局样式、构建规则或其他功能的意外需求时，即构成范围变化。应暂停说明影响并重新确认，而不是静默扩大补丁。

## Sources of truth
## 事实来源

For Figma page work, inspectable layer properties are the visual source of truth. If the available Figma tooling exposes an exact value, implementation must use that measured value rather than a screenshot-based approximation. The required property inventory covers typography, colors and opacity, dimensions, spacing, borders, radii, shadows, blur and complete gradient parameters. Record those measurements in the confirmed implementation checklist before styling.
开发 Figma 页面时，可读取的图层属性是视觉事实来源。如果当前 Figma 工具能给出准确值，实现必须采用该实测值，不能用截图目测值替代。必需的属性清单覆盖字体、颜色与透明度、尺寸、间距、边框、圆角、阴影、模糊和完整渐变参数。开始写样式前，应把这些量测结果写入待确认的实现清单。

An estimate is acceptable only when the exact property cannot be retrieved. Identify the value as estimated, state why it is unavailable and retain the evidence used. Completion requires visual comparison at the Figma frame width; measurable differences must be corrected. Normal-flow, Flexbox and Grid requirements govern implementation structure and do not relax the visual-fidelity requirement.
只有准确属性无法获取时才允许估算。必须标明该值为估算值、说明无法读取的原因并保留所依据的证据。完成验收必须在 Figma 画板宽度下进行视觉对照；可量测差异必须修正。正常文档流、Flexbox 和 Grid 约束的是实现结构，不会降低视觉还原要求。

- Do not infer PHP fields, nullable behavior, error codes, enum values, timestamps, number formats, or pagination from a UI mockup or a TypeScript interface.
- Do not infer ABI methods, contract addresses, decimals, chain IDs, write permissions, or `msg.sender` behavior from names alone.
- Do not treat a TypeScript assertion, a `request<T>()` generic, or a test fixture as proof of a remote contract.
- Do not treat a legacy DApp, demo page, or old backend implementation as proof of a current API, ABI, authentication protocol, asset setting, or transaction rule.
- If a required fact is missing, record the blocking question or TODO at the proper integration stage; do not fabricate a value to unblock coding.
- For every mutation endpoint, record whether the next frontend step consumes its success body. An unused body is transport acknowledgement, not a domain object that must be parsed.

- 不要从 UI 稿或 TypeScript 接口推断 PHP 字段、可空语义、错误码、枚举、时间、数字格式或分页。
- 不要只从名称推断 ABI 方法、合约地址、精度、链 ID、写权限或 `msg.sender` 行为。
- 不要把 TypeScript 断言、`request<T>()` 泛型或测试 fixture 当作远端契约的证据。
- 不要把旧 DApp、演示页或旧后端实现当作当前接口、ABI、鉴权协议、资产配置或交易规则的证据。
- 必要事实缺失时，在正确的联调阶段记录阻塞问题或 TODO；不要捏造值来继续编码。
- 每个提交接口都必须记录前端下一步是否消费成功响应体。未使用的响应体只是传输成功确认，不是必须解析的领域对象。

## Documentation routing
## 文档路由

| Change | Required documentation update or check |
| --- | --- |
| New or changed PHP endpoint | API Markdown, `docs/php-api-contracts.md`, mutation response-consumption classification, feature/service README, response tests |
| Contract wrapper or account-context read | ABI Markdown, `src/services/dapp/README.md`, contract tests, `docs/compatibility.md` when behavior is runtime-sensitive |
| First project PHP-and-contract transaction flow or legacy DApp migration | `docs/dapp-project-integration.md`, current PHP and ABI Markdown, project wrapper/parser tests, and `dapp-project-integration` |
| Shared service, router, config, storage, i18n, or component contract | Affected README and `docs/architecture.md` if its public boundary changes |
| Page structure or positioned visual layer | `docs/layout-standards.md`, the page checklist, and a `layout-exception` marker for any allowed positioned page element |
| Runtime workaround or browser/wallet/host behavior | `docs/compatibility.md` and a regression test or reproducible manual verification |
| Governance rule or permanent trade-off | A new ADR under `docs/decisions/` |

## Non-negotiable guardrails
## 不可突破的护栏

Use pnpm only. Keep the current architecture and public module boundaries unless a scoped change explicitly changes them. Do not add packages, change remote Git state, write production API hosts, or modify unrelated code without explicit developer authorization.
只能使用 pnpm。除非范围明确要求，保持当前架构和公开模块边界。没有开发者明确授权时，不要新增包、修改远程 Git 状态、写入生产接口域名或修改无关代码。

For a DApp read that depends on the caller, pass `account`; for a public read, do not force it. Follow the full rule and tests in `src/services/dapp/README.md`.
依赖调用者上下文的 DApp 读取必须传 `account`；公共读取不要强加它。完整规则和测试要求以 `src/services/dapp/README.md` 为准。

## Reporting completion
## 完成汇报

Report the implemented outcome first, then the files or contracts changed, validation commands and their actual results, known blocks, and the smallest safe next step. Never label a build as passed when a required environment guard prevented it.
汇报时先给出实现结果，再说明改动的文件或契约、验证命令及真实结果、已知阻塞和最小安全下一步。必需环境护栏阻断构建时，不能将构建标记为通过。
