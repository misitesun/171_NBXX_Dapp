# ADR 0001: Layered AI change governance
# ADR 0001：分层 AI 变更治理

- Status: Accepted
- Date: 2026-09-15

## Context
## 背景

The template already had detailed project rules, but an AI or new contributor could still miss the relevant rule, expand a small task into a broad refactor, or treat TypeScript declarations as proof of a dynamic PHP response. The project needs durable constraints that remain close to code and can be checked automatically.
模板已有详细项目规则，但 AI 或新贡献者仍可能遗漏相关规则、把小任务扩展成大范围重构，或把 TypeScript 声明当作动态 PHP 响应的证明。项目需要贴近代码且可自动检查的持久约束。

## Decision
## 决策

Use four cooperating layers:
使用四个协作层：

1. `AGENTS.md` contains compact, mandatory rules and task routing.
2. `docs/` records change workflow, architecture, PHP boundary rules, compatibility records, test standards, and permanent decisions.
3. `.agents/skills/` contains a small set of reusable scoped workflows for delivery, cross-cutting changes, review, and React engineering.
4. Lint and tests validate strict TypeScript baseline, restricted platform boundaries, skill metadata, and required documentation presence.

1. `AGENTS.md` 存放精简且必须遵守的规则与任务路由。
2. `docs/` 记录变更流程、架构、PHP 边界规则、兼容性记录、测试规范和长期决策。
3. `.agents/skills/` 提供少量可复用、范围清晰的交付、跨模块变更、审查和 React 工程化工作流。
4. lint 和测试校验 TypeScript 严格基线、受限平台边界、skill 元数据和必需文档存在性。

The initial compiler baseline is `strict` plus `noImplicitReturns`. More disruptive optional-property and indexed-access flags are intentionally deferred to a separately tested migration rather than used to trigger broad incidental rewrites.
初始编译器基线为 `strict` 加 `noImplicitReturns`。更具破坏性的可选属性与索引访问标志刻意延后到单独测试的迁移中，不能用它们触发大范围附带重写。

## Consequences
## 后果

Changes require a small amount of upfront reading and scope declaration. In exchange, the repository gains visible decision records, machine-checkable guardrails, and a clear route for PHP and wallet/contract integration without forcing an architecture migration or a new runtime dependency.
改动需要少量前置阅读和范围声明。作为交换，仓库获得可见的决策记录、可机器检查的护栏，以及一条清晰的 PHP 与钱包/合约联调路径，同时不强制架构迁移或新增运行时依赖。
