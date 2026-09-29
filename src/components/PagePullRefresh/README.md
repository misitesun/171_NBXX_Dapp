# PagePullRefresh
# 页面级下拉刷新与上拉加载

`PagePullRefresh` is a mobile page container for routes that need pull-to-refresh or incremental loading.
`PagePullRefresh` 是给需要下拉刷新或增量加载的移动端页面使用的容器。

Pages register their real refresh function through `usePageRefresh()`.
页面通过 `usePageRefresh()` 注册真实刷新函数。

Paged pages register their next-page function through `usePageLoadMore()`. The
container observes its bottom sentinel and runs only one load at a time. Existing
pages that do not register this hook render no load-more footer and keep their
original behavior.
分页页面通过 `usePageLoadMore()` 注册下一页加载函数。容器观察底部哨兵，同一时间只执行一次加载；未注册此 Hook 的已有页面不会渲染上拉区域，行为保持不变。

The initial page does not auto-load while the document remains at scroll position
zero. Loading is armed only by a scroll event after the current pagination
registration becomes active. A previous tab or data set's historical scroll
position never starts the new data set's next-page request.
页面停留在顶部时不会自动请求下一页；只有当前分页注册生效后发生的新滚动事件才会启用加载。
上一个 Tab 或上一份数据的历史滚动位置不会触发新数据集的下一页请求。

The registered function should return `Promise<void>` when it loads API data, contract data or timers.
如果刷新函数会加载接口、合约或定时器数据，应返回 `Promise<void>`。

The refresh indicator settles only after the registered function finishes.
刷新图标会等注册函数执行完成后再收起。

Refresh and load-more status copy is resolved through the active common locale, including loading, loading-more and finished states.
刷新及加载更多状态文案会按当前通用语言包显示，包括加载中、加载更多和已完成状态。

Pass `onError` to observe rejected refresh or load-more work. The container catches event-driven promise rejections, reports them through this callback and always restores its idle state.
通过 `onError` 接收刷新或加载更多的失败。容器会捕获事件触发的 Promise 拒绝、交给该回调处理，并始终恢复空闲状态。

The pull-refresh indicator uses a 134px outer frame, a 102px circular surface
and a 62px refresh icon. These visual dimensions do not change the 72px trigger
distance or refresh timing.
下拉刷新指示器使用 134px 外框、102px 圆形主体和 62px 刷新图标；这些视觉尺寸
不会改变 72px 触发距离或刷新时序。

```tsx
import { useCallback } from 'react'

import { usePageRefresh } from '@/components/PagePullRefresh'

export function DemoPage() {
    const refreshPageData = useCallback(async () => {
        await Promise.all([
            loadUserInfo(),
            loadList(),
        ])
    }, [])

    usePageRefresh(refreshPageData)

    return <section>...</section>
}
```

Disable refresh while a page is submitting a form or writing a contract.
页面正在提交表单或写合约时，可以临时禁用下拉刷新。

```tsx
usePageRefresh(refreshPageData, !submitting)
```

Register pagination with an explicit `hasMore` value. Resolve the returned promise
only after the next page has been applied to the screen.
注册分页时应明确传入 `hasMore`，并在下一页数据已经写入页面后再结束 Promise。

```tsx
usePageLoadMore(loadNextPage, {
    enabled: !isInitialLoading && !submitting,
    hasMore,
})
```

Keep incremental loading disabled while page one is loading or a filter/tab is
resetting. Reset `hasMore` to `false` before starting the replacement page-one
request, then derive its next value from that response. This prevents page two
from racing and invalidating the replacement request.

第一页加载中或筛选/Tab 正在重置时，应关闭增量加载。发起替换型第一页请求前先把
`hasMore` 重置为 `false`，再根据第一页响应更新它，避免第二页并发并淘汰第一页请求。

Use `loadingIndicator: 'droplet'` for the shared 40px water-droplet spinner without visible loading copy. Set `showNoMore` from the current rendered item count when an empty first page should show only its empty state; later empty pages can still show the finished message because the list is non-empty.

使用 `loadingIndicator: 'droplet'` 可显示不带可见文字的通用 40px 水滴加载动画。当接口第一页为空时只应显示空状态，可根据当前已渲染数据量设置 `showNoMore`；已有列表数据后遇到空的后续页，仍可显示结束提示。

```tsx
usePageLoadMore(loadNextPage, {
    hasMore,
    loadingIndicator: 'droplet',
    showNoMore: items.length > 0,
})
```

Modern browsers use `IntersectionObserver`; older H5 hosts fall back to passive
window scroll and resize listeners.
现代浏览器使用 `IntersectionObserver`；旧版 H5 宿主会回退到被动的 window scroll 与 resize 监听。

When a fixed shared Tabbar is present, pass `bottomInset="tabbar"`. The load-more
footer then reserves the Tabbar height and the device safe area, so loading and
finished messages remain visible above the navigation.
页面存在固定公共 Tabbar 时传入 `bottomInset="tabbar"`。上拉加载区域会预留 Tabbar
高度和设备底部安全区，让加载中与没有更多提示始终显示在导航栏上方。

Do not wrap splash, login or other flow pages with this component.
不要把开屏页、登录页或其他流程页包进这个组件。
