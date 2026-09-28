---
name: dapp-change-review
description: Review a React H5 DApp change against project contracts without mutating files, Git state, dependencies, or external systems.
---

# DApp change review

Use this skill for a read-only review of a current diff, a proposed implementation plan, or a focused module change.

## Review boundaries

- Do not edit files, stage changes, install packages, commit, push, or call external write APIs.
- Review only the requested diff and the minimum surrounding code and documentation needed to establish its contract.
- Do not turn a review into an unsolicited refactor plan. Report concrete defects with evidence and priority.

## Required checks

1. Read `AGENTS.md`, `docs/ai-collaboration.md`, and the target module README.
2. Inspect the change scope, affected tests, public consumers, and relevant compatibility entries.
3. For PHP integrations, compare request and response handling with the supplied API Markdown contract and `docs/php-api-contracts.md`. Trace each mutation result to its consumer: flag parsing of an unused success body, and flag any shared `try/catch` that can relabel post-success refresh failure as mutation failure. Do not weaken parsing when the response supplies required contract, navigation, follow-up or download data.
4. For contract changes, inspect whether user-context reads correctly forward `account` and whether public reads remain account-free.
5. Check for direct use of restricted boundaries, unchecked casts, non-null assertions, stale-request races, missing refresh behavior, duplicate-write risk after misleading failure feedback, and unrequested scope expansion.
6. Separate blocking correctness issues from optional follow-ups. If no issue is found, say so and list the checks performed.

## Finding format

Each finding should name the affected file or contract, explain the runtime consequence, state the evidence, and give the smallest safe remediation. Do not report speculative risks without a path from the actual diff to the failure.
