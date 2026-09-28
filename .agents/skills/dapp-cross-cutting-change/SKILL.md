---
name: dapp-cross-cutting-change
description: Plan and implement a controlled React H5 DApp change that crosses shared contracts, infrastructure, configuration, or multiple modules.
---

# DApp cross-cutting change

Use this skill when a change affects more than one feature or a shared contract: routes, app configuration, environment fields, i18n, auth, HTTP, storage, DApp services, contract wrappers, public components, build scripts, lint rules, or governance documentation.

## Required reading

1. Read `AGENTS.md`, `docs/ai-collaboration.md`, `docs/architecture.md`, and `docs/compatibility.md`.
2. Read every affected module README and its tests.
3. Read `docs/php-api-contracts.md` for API boundary changes, and `src/services/dapp/README.md` plus the ABI Markdown for contract changes.
4. Read the latest applicable ADR under `docs/decisions/` before changing an established governance rule.

## Impact map before edits

Write an impact map that identifies:

- The source of truth that changes.
- Direct consumers and runtime entry points.
- Environment, API, ABI, storage, wallet, router, and compatibility effects.
- Required docs, tests, migration behavior, and rollback path.
- What remains explicitly unchanged.

Do not use a cross-cutting task as a reason to migrate the project to a new architecture, redesign unrelated shared UI, or upgrade packages opportunistically.

## Implementation rules

1. Preserve the existing module layout. This template is intentionally not an FSD migration target.
2. Keep raw platform boundaries centralized: HTTP in `src/services/http`, storage in `src/services/storage`, wallet detection and viem interaction in `src/services/dapp`, and native clipboard access in `src/shared/clipboard`.
3. Production API and RPC environment rules in `AGENTS.md` remain mandatory. Never put a production API host in source or `.env.production`.
4. Treat PHP response shapes and contract data as external contracts. Do not infer optionality, numeric representation, or permissions from frontend convenience.
5. When a compatibility-sensitive behavior changes, update `docs/compatibility.md` and add a regression test or a documented manual verification step.
6. Verify each affected layer in dependency order, then run the full mandated quality gates.
7. For a shared layout or style rule, preserve normal-flow page composition and document any legitimate positioning exception in `docs/layout-standards.md`.

## Completion checklist

- The impact map is reflected in tests and documentation.
- Existing consumers either retain behavior or have an explicit migration path.
- No new external side effect, dependency, remote Git action, or production endpoint was introduced without developer authorization.
- The final report separates passed checks from expected environmental blocks.
