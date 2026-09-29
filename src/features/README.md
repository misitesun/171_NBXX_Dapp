# Features
业务功能模块。

This directory is intentionally empty in the base template. Real projects place confirmed business capability modules here, grouping API calls, wire parsers, domain types and orchestration by domain.
基础模板中的此目录有意保持为空。真实项目把已确认的业务能力模块放在这里，按领域组织接口调用、wire 解析、领域类型和流程编排。

Create a new feature when a capability has its own API contract or page-facing data model.
当某个能力拥有独立接口契约或面向页面的数据模型时，就创建新的 feature。

当前NodeXX新增auth（钱包登录/会话生命周期）和user（我的信息/直推列表）。具体契约详见各模块README及docs/api.md。

`purchase` 对接已确认的 NBXXNode NFT 购买，细节见模块 README 与 docs/contracts/nbxx-node-purchase.md。
