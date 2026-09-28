# ADR 0003: Real-project DApp integration stays contract-first
# ADR 0003：真实项目 DApp 联调坚持契约优先

- Status: Accepted
- Date: 2026-09-16

## Context
## 背景

Older DApps often contain valuable implementation experience, such as a purchase or approval sequence, post-transaction refresh timing, and wallet interaction UX. They can also be stale: their ABI, server fields, authentication method, token decimals, addresses, or transaction names may no longer describe a new project.
旧 DApp 往往含有有价值的实现经验，例如购买或授权顺序、交易后刷新时机和钱包交互体验。但它们也可能已过时：ABI、服务端字段、鉴权方式、Token 精度、地址或交易名称未必仍适用于新项目。

This repository is intended to be copied as a reusable demo/template. Project business facts must not leak into its generic wallet and chain infrastructure.
本仓库将作为可复制的 demo/模板。项目业务事实不能泄漏进通用钱包与链基础设施。

## Decision
## 决策

Current project ABI Markdown and PHP API Markdown are the source of truth. Legacy DApp code is a behavior reference only and may create questions, never facts.
当前项目的 ABI Markdown 与 PHP 接口 Markdown 是事实来源。旧 DApp 代码只能作为行为参考，可以提出问题，不能提供事实。

Generic wallet, viem, chain, ERC20, and shared write primitives stay under `src/services/dapp`. Project ABI, env-backed addresses, and typed contract wrappers stay under `src/services/contracts`. PHP DTO parsing and project transaction orchestration stay in the relevant feature; pages consume those public methods without direct platform access.
通用钱包、viem、链、ERC20 和共享写入基础能力保留在 `src/services/dapp`。项目 ABI、env 地址和类型化合约封装放在 `src/services/contracts`。PHP DTO 解析与项目交易编排放在对应 feature；页面通过公开方法使用它们，不直接触及平台边界。

The template ships a repeatable project-integration playbook and local skill. A new shared abstraction requires evidence from multiple real consumers instead of being extracted from one project's flow.
模板提供可重复的项目联调手册和本地 skill。新的共享抽象必须有多个真实消费者的证据，不能从单一项目流程中直接抽取。

## Consequences
## 后果

Real project integration asks for clearer source documents before implementation, and legacy migrations may pause when their current contracts are missing. In return, the template remains reusable, PHP and ABI assumptions become testable, and future projects do not inherit accidental business behavior.
真实项目联调会在实现前索要更清晰的事实文档；旧项目迁移在当前契约缺失时可能暂停。作为回报，模板保持可复用，PHP 与 ABI 假设可测试，未来项目不会继承偶然的业务行为。
