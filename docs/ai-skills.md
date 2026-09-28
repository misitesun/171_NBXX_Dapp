# Local AI skills
# 本地 AI skills

Local skills are versioned workflow instructions under `.agents/skills/`. They make common AI tasks predictable and reviewable; they do not grant authority beyond the developer request or the repository rules.
本地 skill 是位于 `.agents/skills/` 下、受版本管理的工作流说明。它们让常见 AI 任务可预测、可审查；不会扩大开发者请求或仓库规则授予的权限。

| Skill | Use it for | Do not use it to |
| --- | --- | --- |
| `dapp-feature-delivery` | One bounded page, feature, API, wallet, contract, or bug-fix task | Bundle unrelated refactors or guess undocumented contracts |
| `dapp-cross-cutting-change` | Shared services, config, router, environment, i18n, infrastructure, or multiple consumers | Justify an architecture migration or package upgrade by default |
| `dapp-change-review` | Read-only diff and contract review | Edit files, stage, commit, push, or install packages |
| `dapp-react-engineering` | React/TSX, hooks, page behavior, async effects, and focused React refactors | Replace existing SCSS or service conventions with a foreign architecture |
| `dapp-project-integration` | The first real PHP-and-ABI project flow or a controlled legacy DApp migration | Treat legacy code as a current API, ABI, address, or business specification |

## Selection rule
## 选择规则

Read `AGENTS.md` and `docs/ai-collaboration.md` first. Select one primary skill based on the actual change boundary. A task may consult a second skill only when both boundaries are genuinely present; do not accumulate skills as ceremony.
先阅读 `AGENTS.md` 与 `docs/ai-collaboration.md`。按实际变更边界选择一个主要 skill。只有两个边界确实同时存在时才可参考第二个 skill；不要把 skill 叠加成形式主义。

When a real project combines PHP and contract behavior for the first time, choose `dapp-project-integration` after the current API and ABI Markdown are available. It routes facts into the project boundary; it does not make legacy code authoritative.
真实项目首次组合 PHP 与合约行为时，在当前 API 与 ABI Markdown 就绪后选择 `dapp-project-integration`。它把事实路由到项目边界，不会让旧代码变成权威来源。

## Validation and maintenance
## 校验与维护

`pnpm lint` runs the skill, module-documentation, and page-layout validators. Every skill must have a kebab-case directory, a matching `SKILL.md` frontmatter name, meaningful description, and `agents/openai.yaml` metadata with an implicit-invocation prompt.
`pnpm lint` 会执行 skill、模块文档和页面布局校验。每个 skill 都必须有 kebab-case 目录、名称匹配的 `SKILL.md` frontmatter、有意义的描述，以及包含隐式调用提示的 `agents/openai.yaml` 元数据。

Create a skill only for a stable, repeatable workflow. One-off project facts belong in a module README, API/ABI Markdown, compatibility record, ADR, or TODO instead.
只为稳定且可重复的工作流创建 skill。一次性的项目事实应放到模块 README、API/ABI Markdown、兼容性记录、ADR 或 TODO。
