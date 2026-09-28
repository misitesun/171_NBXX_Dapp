---
name: dapp-feature-delivery
description: Deliver one scoped React H5 DApp feature without expanding into unrelated refactors or undocumented backend and contract assumptions.
---

# DApp feature delivery

Use this skill for a clearly bounded page, feature API, wallet flow, contract wrapper, or bug fix.

## Required reading

1. Read `AGENTS.md`, `docs/ai-collaboration.md`, and `docs/architecture.md`.
2. Read the target module README and nearby tests before editing.
3. For PHP API work, read `docs/php-api-contracts.md` and the supplied API Markdown contract.
4. For DApp work, read `src/services/dapp/README.md` and the supplied ABI or contract Markdown contract.

## Scope contract

State these five items before changing code:

- Objective and observable acceptance criteria.
- Files or modules allowed to change.
- Explicit non-goals and protected shared modules.
- API, ABI, design, or existing-code evidence used as the source of truth.
- Validation commands and focused regression tests.

If a needed change is outside that contract, stop and request a new scope or use `dapp-cross-cutting-change`. Do not add a dependency, perform a broad cleanup, invent a server field, or alter unrelated styling to make the task easier.

## Delivery flow

1. Inspect the existing public entry points and reuse them. Pages should not instantiate Axios clients, access browser storage, detect `window.ethereum`, or import viem directly.
2. For page work, read `docs/layout-standards.md` and describe the normal-flow section order before styling. Use Flexbox or Grid for structure; positioning is only for documented decorative or overlay exceptions.
3. For Figma page work, inspect the relevant layers and record exact typography, color, opacity, dimensions, spacing, borders, radii, effects and gradient parameters before styling. When a value is readable, use it exactly instead of estimating from a screenshot. Mark any unavailable value as an estimate with its reason, then verify the result at the design frame width with a screenshot comparison.
4. For a PHP response, keep remote JSON untrusted until the feature-specific DTO is checked or parsed. A TypeScript generic is not runtime validation. Before parsing a mutation response, classify whether the next frontend step consumes it: unused success bodies return `Promise<void>` without parsing, while contract, navigation, follow-up or download inputs validate only their documented required fields. Keep mutation failure separate from post-success refresh failure as required by `AGENTS.md` and `docs/php-api-contracts.md`.
5. For a user-context contract read, decide whether the contract depends on `msg.sender`; pass `account` only when it does, and add the three required account-forwarding regressions.
6. Keep page styles under the page root class and reuse existing style utilities, components, routes, hooks, and service wrappers.
7. Add or update focused tests for the changed business behavior. Update the module README, API contract note, compatibility note, or ADR when their contract changes.
8. Run the validation commands declared in the scope contract. Report commands that were blocked and why; never claim a blocked command passed.

## Completion checklist

- The diff is limited to the stated scope.
- Data, contract, and environment assumptions are backed by documentation or an explicit developer decision.
- Every mutation response is classified as consumed or unused, and an unused body cannot turn HTTP success into a feature failure.
- No unchecked `any`, non-null assertion, or direct platform boundary was introduced.
- Tests cover behavior rather than incidental markup or visual values.
- Figma-derived visual values are measured when available; every estimate is disclosed and the page has been compared at the design frame width.
- Lint, test, and build results are reported accurately.
