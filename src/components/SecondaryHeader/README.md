# SecondaryHeader
二级页面顶部导航组件。

`SecondaryHeader` is the shared fixed header for second-level pages.
`SecondaryHeader` 是二级页面使用的固定顶部导航。

It renders the top safe area, a back icon, a centered title, an optional right-side action slot and an optional layout gap.
它会渲染顶部安全区、返回图标、居中标题、可选的右侧操作插槽，以及可选的布局占位。

When the browser has no route history, the back icon redirects to the configured home route.
当浏览器没有路由历史时，返回图标会重定向到项目配置的首页路由。

```tsx
import { SecondaryHeader } from '@/components/SecondaryHeader'

<SecondaryHeader title="详情" />

<SecondaryHeader
    title="表单"
    right={<button type="button">记录</button>}
/>
```

`right` only supplies content inside the existing right slot. Pages must not rebuild or reposition the shared header to add a single action.
`right` 仅向既有右侧插槽提供内容。页面不能为了增加单个操作而重建或重新定位公共导航。
