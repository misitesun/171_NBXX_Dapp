# Popup

基础弹窗组件。

`Popup` is the shared base popup component for this mobile H5 template.
`Popup` 是本移动端 H5 模板的通用基础弹窗组件。

It is similar to using `van-popup` only for popup infrastructure, while keeping business UI in the caller.
它类似于只使用 `van-popup` 的弹出底层能力，具体业务 UI 仍由调用方自己写。

## AI usage contract
## AI 使用契约

- `Popup` only owns popup infrastructure: full-screen overlay, position, animation, body scroll lock, close lifecycle and destroy-after-close.
- `Popup` 只负责弹窗基础设施：全屏遮罩、位置、动画、锁定页面滚动、关闭生命周期，以及关闭后销毁。

- Do not put business login, request calls, wallet logic, or page routing inside `Popup`.
- 不要把登录、接口请求、钱包逻辑或页面路由逻辑写进 `Popup`。

- `center` and `bottom` should use the preset content wrapper in normal cases.
- 普通场景下，`center` 和 `bottom` 应使用预设内容外壳。

- `left` and `right` should be treated as custom side drawers.
- `left` 和 `right` 应按自定义侧边抽屉处理。

- Put page-specific structure and styles in the caller, not in `Popup.scss`.
- 页面专属结构和样式应写在调用方，不要写进 `Popup.scss`。

- Keep `show` state in the caller and close the popup by updating that state from `onClose`.
- `show` 状态由调用方维护，通过 `onClose` 更新状态来关闭弹窗。

## Default behavior
## 默认行为

Every `Popup` uses one shared black mask at 50% opacity. The mask does not blur
or apply a glass effect to the page behind it, and callers cannot replace the
mask with a page-specific visual variant.

所有 `Popup` 统一使用 50% 透明度的黑色蒙层。遮罩不会模糊底部页面，也不添加毛玻璃
效果；调用方不能再替换成页面私有的遮罩视觉。

| Position | Default content | Default animation | Recommended use |
| --- | --- | --- | --- |
| `center` | preset header + custom body | `zoomIn` / `zoomOut` | confirm dialogs, notice dialogs |
| `bottom` | preset header + custom body | `slideInUp` / `slideOutDown` | pickers, action panels |
| `right` | fully custom | `slideInRight` / `slideOutRight` | right drawer, sidebar menu |
| `left` | fully custom | `slideInLeft` / `slideOutLeft` | left drawer, side navigation |

| 位置 | 默认内容 | 默认动画 | 推荐用途 |
| --- | --- | --- | --- |
| `center` | 预设头部 + 自定义主体 | `zoomIn` / `zoomOut` | 确认弹窗、提示弹窗 |
| `bottom` | 预设头部 + 自定义主体 | `slideInUp` / `slideOutDown` | 选择器、操作面板 |
| `right` | 完全自定义 | `slideInRight` / `slideOutRight` | 右侧抽屉、侧边菜单 |
| `left` | 完全自定义 | `slideInLeft` / `slideOutLeft` | 左侧抽屉、侧边导航 |

## Props
## 参数

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `show` | `boolean` | required | Controls whether the popup is visible. |
| `children` | `ReactNode` | required | Popup body content, similar to a Vue slot. |
| `title` | `ReactNode` | `'标题'` in preset content | Only used by preset content wrappers. |
| `onClose` | `() => void` | `undefined` | Called when overlay or preset close icon requests closing. |
| `onAfterClose` | `() => void` | `undefined` | Called after the leave animation finishes and the popup is destroyed. |
| `position` | `'center' \| 'right' \| 'left' \| 'bottom'` | `'center'` | Controls placement and default animation. |
| `closeOnOverlayClick` | `boolean` | `true` | Set to `false` when the user must choose an action. |
| `enterAnimation` | `string` | position default | Custom animate.css enter animation name. |
| `leaveAnimation` | `string` | position default | Custom animate.css leave animation name. |
| `className` | `string` | `''` | Extra class for the root popup node. |
| `contentClassName` | `string` | `''` | Extra class for the content wrapper node. |
| `contentPreset` | `boolean` | `true` | Uses preset content wrappers when the current position supports them. |

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | 必传 | 控制弹窗是否显示。 |
| `children` | `ReactNode` | 必传 | 弹窗主体内容，类似 Vue slot。 |
| `title` | `ReactNode` | 预设内容中为 `'标题'` | 仅预设内容外壳会使用。 |
| `onClose` | `() => void` | `undefined` | 遮罩或预设关闭图标触发关闭时调用。 |
| `onAfterClose` | `() => void` | `undefined` | 关闭动画结束且弹窗销毁后调用。 |
| `position` | `'center' \| 'right' \| 'left' \| 'bottom'` | `'center'` | 控制弹窗位置和默认动画。 |
| `closeOnOverlayClick` | `boolean` | `true` | 必须让用户选择操作时设置为 `false`。 |
| `enterAnimation` | `string` | 位置默认值 | 自定义 animate.css 入场动画名。 |
| `leaveAnimation` | `string` | 位置默认值 | 自定义 animate.css 离场动画名。 |
| `className` | `string` | `''` | 根节点额外类名。 |
| `contentClassName` | `string` | `''` | 内容外层节点额外类名。 |
| `contentPreset` | `boolean` | `true` | 当前位置支持预设内容外壳时是否使用预设。 |

## Use preset center popup
## 使用预设居中弹窗

Use this for regular confirm or notice dialogs.
普通确认弹窗或提示弹窗使用这种写法。

```tsx
import { useState } from 'react'

import { Popup } from '@/components/Popup'

export function ConfirmDemo() {
    const [show, setShow] = useState(false)

    function handleClose() {
        setShow(false)
    }

    return (
        <>
            <button type="button" onClick={() => setShow(true)}>
                打开弹窗
            </button>

            <Popup
                show={show}
                title="确认操作"
                onClose={handleClose}
            >
                <div className="mt-30 size-24">
                    这里写弹窗主体内容。
                </div>
            </Popup>
        </>
    )
}
```

## Use preset bottom popup
## 使用预设底部弹窗

Use this for picker-like or action-panel content.
选择器或底部操作面板使用这种写法。

```tsx
<Popup
    show={show}
    position="bottom"
    title="选择语言"
    onClose={handleClose}
>
    <div className="mt-30">
        底部弹窗内容
    </div>
</Popup>
```

## Use custom side drawer
## 使用自定义侧边抽屉

Use `contentPreset={false}` for `left` and `right`, then provide the full drawer content yourself.
`left` 和 `right` 使用 `contentPreset={false}`，然后由调用方提供完整抽屉内容。

```tsx
<Popup
    show={show}
    position="right"
    contentPreset={false}
    contentClassName="user-drawer-shell"
    onClose={handleClose}
>
    <div className="user-drawer">
        <div className="size-30 bold-6">右侧菜单</div>

        <div className="mt-30 size-24">
            这里写侧边抽屉内容。
        </div>

        <button
            type="button"
            className="user-drawer-close black"
            onClick={handleClose}
        >
            关闭
        </button>
    </div>
</Popup>
```

```scss
.user-drawer-shell {
    height: 100%;
}

.user-drawer {
    width: 560px;
    max-width: 82vw;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 30px;
    border-radius: 30px 0 0 30px;
    background-color: var(--app-card-bg);

    &-close {
        width: 100%;
        height: 80px;
        margin-top: auto;
        border-radius: 20px;
        background-color: var(--app-color);
    }
}
```

## Animation
## 动画

The component uses animate.css class names internally.
组件内部使用 animate.css 类名。

Animation names can be passed with or without the `animate__` prefix.
传入动画名时可以带 `animate__` 前缀，也可以不带。

```tsx
<Popup
    show={show}
    enterAnimation="fadeInUp"
    leaveAnimation="fadeOutDown"
    onClose={handleClose}
>
    <div>自定义动画弹窗</div>
</Popup>
```

## Close lifecycle
## 关闭生命周期

`onClose` should only update the caller state.
`onClose` 通常只负责更新调用方状态。

`onAfterClose` runs after the leave animation finishes, so use it for delayed follow-up work such as refreshing a page after a language change.
`onAfterClose` 会在关闭动画结束后执行，适合语言切换后刷新页面这类需要等待动画结束的后续动作。

```tsx
<Popup
    show={show}
    onClose={() => setShow(false)}
    onAfterClose={handleAfterClose}
>
    <div>弹窗内容</div>
</Popup>
```

## AI implementation rules
## AI 实现规则

1. Prefer preset content for `center` and `bottom`.
1. `center` 和 `bottom` 优先使用预设内容外壳。

1. Prefer custom content for `left` and `right`.
1. `left` 和 `right` 优先使用自定义内容。

1. Do not add business-specific styles to `src/components/Popup/Popup.scss`.
1. 不要把业务专属样式写进 `src/components/Popup/Popup.scss`。

1. Do not add project-specific request, storage, wallet or router logic to this component.
1. 不要把项目专属的请求、缓存、钱包或路由逻辑写进这个组件。

1. If a page needs a special panel design, pass classes from the caller through `className` or `contentClassName`; keep the shared mask unchanged.
1. 如果页面需要特殊面板样式，从调用方通过 `className` 或 `contentClassName` 传入类名；共享遮罩保持不变。

1. If multiple pages repeat the same side drawer structure, create a new shared content component separately instead of expanding `Popup` blindly.
1. 如果多个页面重复使用同一种侧边抽屉结构，应单独创建共享内容组件，不要盲目扩展 `Popup`。

## Showcase
## 演示页面

The component showcase lives in `src/showcase/components/popup/PopupShowcasePage.tsx`.
组件演示页面位于 `src/showcase/components/popup/PopupShowcasePage.tsx`。

Use the showcase as the source of truth for common usage patterns before adding new usage.
新增使用方式前，优先参考该演示页中的常见写法。
