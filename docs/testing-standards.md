# Testing standards
# 测试规范

Tests protect stable business behavior and module contracts. Do not make a test pass by asserting incidental class names, hand-maintained file ordering, or a temporary visual value.
测试保护稳定的业务行为和模块契约。不要通过断言偶然的 class 名、人工维护的文件顺序或临时视觉数值来让测试通过。

## Test layers
## 测试层次

- Add focused Node tests in `tests/*.test.mjs` for services, features, parsers, configuration, and contract wrappers.
- Test a public entry point or observable side effect rather than an internal implementation detail when possible.
- For PHP integration, separate endpoint/header tests from response parser tests.
- For caller-context contract reads, cover business-layer address passing, `readDappContract` forwarding, and public reads remaining account-free.
- For compatibility workarounds, add a regression test or precise reproducible manual verification in `docs/compatibility.md`.
- Page SCSS positioning exceptions are validated by `pnpm lint`; add focused tests when layout logic itself has meaningful behavior.

- 服务、功能、解析器、配置和合约封装的聚焦 Node 测试放在 `tests/*.test.mjs`。
- 能测公开入口或可观察副作用时，优先不要测内部实现细节。
- PHP 联调时，接口地址/请求头测试与响应解析测试分开。
- 调用者上下文合约读取要覆盖业务层传地址、`readDappContract` 透传，以及公共读取仍不传账户。
- 兼容性规避方案需要回归测试，或在 `docs/compatibility.md` 写出精确可复现的人工验证。
- 页面 SCSS 的定位例外由 `pnpm lint` 校验；布局逻辑本身存在有意义行为时，再补聚焦测试。

## Required commands
## 必需命令

Use pnpm only. Before declaring a change complete, run:
只能使用 pnpm。声明改动完成前，运行：

```bash
pnpm lint
pnpm test
pnpm exec tsc -b
pnpm build
```

`pnpm build` is intentionally guarded by lint, tests, and the project-brand readiness check. Do not bypass that lifecycle. If the template logo guard blocks a build, report the block and still run the independent type check so compiler status is known.
`pnpm build` 会被 lint、测试和项目品牌就绪检查刻意保护。不得绕过该生命周期。模板 logo 护栏阻断构建时，应报告阻塞，并仍运行独立类型检查以明确编译器状态。
