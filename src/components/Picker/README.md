# Picker

选择器组件。

`Picker` is the shared mobile single-column selector built from `Popup`, Swiper and `Empty`.
`Picker` 是项目内基于 `Popup`、Swiper 和 `Empty` 封装的移动端单列选择器。

It follows the old Vue `CusPicker` behavior: open a bottom popup, slide or tap to choose an item, then confirm and return the selected index and option.
它延续老 Vue `CusPicker` 的行为：底部弹窗打开，滑动或点击选择，点击确认后返回选中下标和选项。

## AI usage contract
## AI 使用契约

- `Picker` only owns picker infrastructure: bottom popup, vertical Swiper list, active index, confirm callback, close lifecycle and empty state.
- `Picker` 只负责选择器基础设施：底部弹窗、竖向 Swiper 列表、当前选中下标、确认回调、关闭生命周期和空数据状态。

- Do not put business request, wallet, login, route navigation, or page-specific option data inside `Picker`.
- 不要把业务请求、钱包、登录、路由跳转或页面专属选项数据写进 `Picker`。

- Keep option data, selected value state and business side effects in the caller.
- 选项数据、选中值状态和业务副作用都应保留在调用方。

- Use `renderOption` when the option needs icons, multi-line text, token metadata or any custom visual structure.
- 当选项需要图标、多行文本、资产元数据或任何自定义视觉结构时，使用 `renderOption`。

- Use `onAfterClose` only for work that must wait until the popup close animation finishes.
- 只有必须等待弹窗关闭动画结束的后续动作才使用 `onAfterClose`。

## Default behavior
## 默认行为

| Feature | Behavior |
| --- | --- |
| Popup position | Always bottom. |
| Content preset | Disabled; `Picker` owns its own bottom panel structure. |
| List engine | Swiper vertical slider. |
| Empty state | Uses the shared `Empty` component. |
| Confirm | Emits `{ index, option }`, then calls `onClose`. |

| 功能 | 行为 |
| --- | --- |
| 弹窗位置 | 固定底部弹出。 |
| 内容预设 | 关闭；`Picker` 自己管理底部面板结构。 |
| 列表能力 | 使用 Swiper 竖向滑动。 |
| 空数据 | 使用项目通用 `Empty` 组件。 |
| 确认 | 抛出 `{ index, option }`，然后调用 `onClose`。 |

## Props
## 参数

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `show` | `boolean` | required | Controls whether the picker is visible. |
| `options` | `PickerOption[]` | required | Option list. |
| `title` | `ReactNode` | localized `Please select` | Header title. |
| `confirmText` | `ReactNode` | localized `OK` | Confirm button text. |
| `emptyText` | `ReactNode` | `undefined` | Text passed to `Empty` when `options` is empty. |
| `value` | `number` | `undefined` | Controlled selected index. |
| `defaultIndex` | `number` | `0` | Initial selected index in uncontrolled mode. |
| `allowEmpty` | `boolean` | `false` | Allows an empty selected index of `-1`. |
| `closeOnOverlayClick` | `boolean` | `true` | Passed to `Popup`. |
| `className` | `string` | `''` | Extra class for the picker panel. |
| `onClose` | `() => void` | `undefined` | Called when the picker requests closing. |
| `onAfterClose` | `() => void` | `undefined` | Called after the popup close animation finishes. |
| `onChange` | `(payload) => void` | `undefined` | Called when Swiper or click changes the active option. |
| `onConfirm` | `(payload) => void` | `undefined` | Called when the confirm button is clicked. |
| `renderOption` | `(option, index, isActive) => ReactNode` | `undefined` | Custom option renderer. |

Omitted `title` and `confirmText` use the active locale's shared default translations. Explicit props continue to override these defaults.
省略 `title` 和 `confirmText` 时，默认使用当前语言的通用翻译；显式传入时仍以调用方文案为准。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | 必传 | 控制选择器是否显示。 |
| `options` | `PickerOption[]` | 必传 | 选项列表。 |
| `title` | `ReactNode` | 当前语言的“请选择” | 顶部标题。 |
| `confirmText` | `ReactNode` | 当前语言的“确定” | 确认按钮文案。 |
| `emptyText` | `ReactNode` | `undefined` | `options` 为空时传给 `Empty` 的文案。 |
| `value` | `number` | `undefined` | 受控模式下的选中下标。 |
| `defaultIndex` | `number` | `0` | 非受控模式下的初始选中下标。 |
| `allowEmpty` | `boolean` | `false` | 是否允许选中下标为 `-1` 的空选择状态。 |
| `closeOnOverlayClick` | `boolean` | `true` | 透传给 `Popup`。 |
| `className` | `string` | `''` | 面板额外类名。 |
| `onClose` | `() => void` | `undefined` | 选择器请求关闭时调用。 |
| `onAfterClose` | `() => void` | `undefined` | 弹窗关闭动画结束后调用。 |
| `onChange` | `(payload) => void` | `undefined` | 滑动或点击导致当前选项变化时调用。 |
| `onConfirm` | `(payload) => void` | `undefined` | 点击确认按钮时调用。 |
| `renderOption` | `(option, index, isActive) => ReactNode` | `undefined` | 自定义选项渲染。 |

## Basic usage
## 基础用法

```tsx
import { useState } from 'react'

import { Picker, type PickerOption } from '@/components/Picker'

const coinOptions: PickerOption[] = [
    { label: 'USDC', value: 'USDC' },
    { label: 'BNB', value: 'BNB' },
    { label: 'ETH', value: 'ETH' },
]

export function CoinPickerDemo() {
    const [showPicker, setShowPicker] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <Picker
            show={showPicker}
            options={coinOptions}
            value={currentIndex}
            title="选择资产"
            onClose={() => setShowPicker(false)}
            onConfirm={({ index }) => {
                setCurrentIndex(index)
            }}
        />
    )
}
```

## Custom option content
## 自定义选项内容

Use `renderOption` for token icons, descriptions or project-specific layout.
资产图标、说明文本或项目专属布局使用 `renderOption`。

```tsx
<Picker
    show={showPicker}
    options={coinOptions}
    value={currentIndex}
    title="选择资产"
    onClose={() => setShowPicker(false)}
    onConfirm={({ index }) => {
        setCurrentIndex(index)
    }}
    renderOption={(option, index, isActive) => (
        <div className="asset-picker-option">
            <img src={String(option.icon)} className="img-44" alt="" />
            <div>
                <div>{option.label}</div>
                <div className={isActive ? 'opc-7' : 'opc-5'}>
                    第 {index + 1} 项
                </div>
            </div>
        </div>
    )}
/>
```

## Empty state
## 空数据

When `options` is empty, `Picker` renders the shared `Empty` component and disables confirm.
当 `options` 为空时，`Picker` 会渲染通用 `Empty` 组件，并禁用确认按钮。

```tsx
<Picker
    show={showPicker}
    options={[]}
    emptyText="暂无可选择数据"
    onClose={() => setShowPicker(false)}
/>
```

## Controlled and uncontrolled mode
## 受控和非受控模式

Use `value` when the selected index is owned by the page or store.
当选中下标由页面或仓库维护时，使用 `value`。

Use `defaultIndex` for simple one-time initial selection.
只需要一次性初始选中值时，使用 `defaultIndex`。

Do not pass both unless you intentionally want `value` to take priority.
不要同时传入二者，除非你明确希望 `value` 优先。

## AI implementation rules
## AI 实现规则

1. Keep `Picker` as a reusable component, not a business selector.
1. 保持 `Picker` 是通用组件，不要改成某个业务专属选择器。

1. Do not add project-specific API calls, storage writes, wallet logic or route navigation to `src/components/Picker/Picker.tsx`.
1. 不要把项目专属接口、缓存写入、钱包逻辑或路由跳转写进 `src/components/Picker/Picker.tsx`。

1. If a page needs special option visuals, pass `renderOption` from the caller.
1. 如果页面需要特殊选项样式，从调用方传入 `renderOption`。

1. If multiple pages repeat the same option renderer, create a separate shared renderer component instead of expanding `Picker`.
1. 如果多个页面重复使用同一种选项渲染，应单独抽共享渲染组件，不要扩展 `Picker` 本体。

1. If close animation timing matters, put delayed follow-up logic in `onAfterClose`.
1. 如果后续逻辑必须等待关闭动画结束，放到 `onAfterClose`。

## Showcase
## 演示页面

The component showcase lives in `src/showcase/components/picker/PickerShowcasePage.tsx`.
组件演示页面位于 `src/showcase/components/picker/PickerShowcasePage.tsx`。

Use the showcase as the source of truth for common usage patterns before adding new usage.
新增使用方式前，优先参考该演示页中的常见写法。
