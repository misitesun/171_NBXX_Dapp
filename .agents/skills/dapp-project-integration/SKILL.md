---
name: dapp-project-integration
description: Integrate a real React H5 DApp from confirmed PHP and contract documentation while preserving reusable wallet infrastructure and avoiding legacy business assumptions.
---

# DApp project integration

Use this skill for the first real API-and-contract integration of a copied template, or for a controlled migration whose legacy DApp is only a behavior reference.

Do not use it for a simple isolated feature, a read-only review, or generic template work with no real project contracts. Use `dapp-feature-delivery`, `dapp-change-review`, or `dapp-cross-cutting-change` for those cases.

## Required reading

1. Read `AGENTS.md`, `docs/ai-collaboration.md`, `docs/architecture.md`, and `docs/dapp-project-integration.md`.
2. Read `docs/php-api-contracts.md`, `src/services/dapp/README.md`, and `src/services/contracts/README.md`.
3. Read the supplied PHP API Markdown and ABI / contract Markdown in full before adding integration code.
4. Read the target feature, page, service README, and focused tests. Read `docs/compatibility.md` when wallet, browser, or host behavior may affect the flow.

## Scope contract

Declare before editing:

- The feature flow and observable acceptance result.
- The allowed feature, contract-wrapper, configuration, page, documentation, and test files.
- Explicit non-goals, including protected generic DApp modules and unverified legacy behavior.
- The exact PHP and ABI source documents, plus any legacy code used only as an interaction reference.
- Validation commands and the wallet/manual cases that are available.

If the PHP or ABI contract pack is incomplete, list the missing facts and pause the affected integration. Do not invent fields, ABI items, addresses, chain data, Token decimals, approval rules, signatures, or error behavior.

## Contract-first delivery flow

1. Build a source map. Current ABI and PHP Markdown outrank project code; current tested wrappers outrank legacy code; legacy code can only reveal a question or a UX sequence.
2. Keep generic provider, chain, viem, ERC20, and write primitives in `src/services/dapp`. Put project ABI, env-backed addresses, and typed methods in `src/services/contracts`. Keep PHP DTO parsing and feature orchestration near the relevant feature.
3. Parse only user-entered display amounts with confirmed decimals. Preserve backend amounts, signed fields, deadlines, argument order, and signatures as documented raw values; never reconstruct a signed payload in a page or coerce it through JavaScript floating-point values.
4. Classify every mutation success body before adding a parser. If the next frontend step does not consume it, return `Promise<void>`, await the request without parsing, and refresh through the authoritative read endpoint. If it supplies required contract, navigation, follow-up or download data, validate only the documented consumed fields. Never report a completed mutation as failed because a later refresh failed.
5. For reads affected by `msg.sender`, pass the current connected address through the wrapper and add account-forwarding regressions. Keep public reads account-free.
6. Reuse the existing DApp initialization, loading, write, synchronization, and page refresh mechanisms. Prevent duplicate writes and stale post-write data. Do not add a generic transaction runner, public client, EIP-5792 flow, or package unless demonstrated project needs and a new scope authorize it.
7. Treat wallet authentication as a project protocol. Implement a challenge, nonce, timestamp, or signature only when the PHP contract explicitly documents it; a timestamp-signing flow inherited from legacy code or a starter adapter is not a new default.
8. Keep page code semantic and thin: it calls public feature methods and renders known states, but does not import viem, touch `window.ethereum`, parse arbitrary HTTP JSON, or assemble undocumented contract arguments.

## Required evidence and tests

- PHP parser tests cover valid and meaningful malformed responses separately from request/auth headers.
- Unused mutation bodies have HTTP-success tests with empty or incompatible payloads; consumed mutation responses have parser tests for every required downstream field.
- Contract-wrapper tests cover documented argument mapping, receipt/error behavior where mockable, and user-context versus public read account handling.
- The flow has loading, user rejection, wrong-chain, backend failure, contract failure, and refresh behavior appropriate to the documented feature.
- When a wallet-capable environment is available, manually verify connect, chain handling, transaction confirmation, account change, and post-write refresh.
- Run the declared pnpm checks and accurately report passed checks, expected guards, and unavailable external verification.

## Completion checklist

- The diff adds only confirmed project behavior and preserves the template's generic boundaries.
- No legacy API/ABI/address/value was copied as an unverified fact.
- Project-specific facts remain out of generic DApp services and reusable template documentation.
- Any demonstrated cross-project improvement is documented before it is promoted into the template.
