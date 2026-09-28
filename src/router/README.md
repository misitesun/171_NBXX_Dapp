# Router

The app uses browser history through `AppBrowserRouter`. It accepts incoming URLs both with and without the configured `/h5` prefix, while internal route constants always stay prefix-free.

应用通过 `AppBrowserRouter` 使用 browser history。入口地址可带或不带 `/h5` 前缀；应用内部路由常量始终不带前缀。

Use `useAppNavigate()` inside React components and `buildRouteHref()` only when code outside React needs an href. Never prepend `/h5` manually.

React 组件内使用 `useAppNavigate()`；只有组件外代码需要链接时才使用 `buildRouteHref()`。不要手动拼接 `/h5`。

```tsx
import { ROUTE_PATH, useAppNavigate } from '@/router'

function Demo() {
    const { pushRoute, backRoute } = useAppNavigate()

    return (
        <>
            <button onClick={() => pushRoute(ROUTE_PATH.home)}>Go home</button>
            <button onClick={() => backRoute()}>Go back</button>
        </>
    )
}
```

The blank production route table intentionally contains only `/home`. Add confirmed routes in `routes.ts` and `AppRouter.tsx`. Component and style showcases are isolated under development-only `/showcase` routes.

空白模板的生产路由表有意只保留 `/home`。确认页面后再在 `routes.ts` 与 `AppRouter.tsx` 添加路由；组件和样式演示只存在于开发环境 `/showcase`。

During static UI development, opening `/h5` redirects directly to `/home` without a wallet, signature, Token, or backend request. When a project's documented login is integrated, its startup gate may take over the root route and send users to the home page only after session validation. Keep this change in the real project, not in the blank template.

静态 UI 开发时，打开 `/h5` 直接进入 `/home`，不要求钱包、签名、Token 或后端请求。项目依据已确认文档接入登录后，启动门槛可以接管根路由，并在会话校验完成后进入首页；此变更留在真实项目，不写入空白模板。

Every normalized pathname change resets the shared window scroll position to the top before the destination route is painted. This applies to first-level navigation, secondary pages, redirects, and browser back or forward navigation. Search-parameter and hash-only updates keep the current scroll position because they do not represent a page change.

每次标准化后的 pathname 变化都会在目标路由绘制前，把共用 window 滚动位置重置到页面顶部。一级导航、二级页面、重定向以及浏览器前进/后退都遵循该规则；仅 query 或 hash 变化时保留当前位置，因为它们不视为页面切换。
