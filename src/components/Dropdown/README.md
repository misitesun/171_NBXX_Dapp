# Dropdown
锚定式下拉菜单。

`Dropdown` 用于轻量选择或操作菜单。它会从触发按钮附近展开，不替代底部 `Picker` 或全屏 `Popup`。

## Contract

- `options` 是唯一的数据来源，`value` 和 `open` 分别支持受控与非受控用法。
- `contentAlign` 可设为 `left`、`center` 或 `right`，同时影响触发内容和菜单行的对齐方式。
- `showIcon` 默认开启，只控制菜单选项中的图标；没有任一选项图标时不会预留图标列。
- `showArrow` 默认关闭；开启后会在触发按钮右侧展示下拉指示箭头。
- `triggerLabel` 可固定触发按钮文案，适用于动作菜单；未传时优先展示已选项，再回退到 `placeholder`。
- `renderTrigger` 可用于图标型或项目自定义触发器。它会提供锚点 ref、展开状态、禁用状态、菜单 id 和切换函数；自定义触发器负责自己的语义和键盘交互。
- `maskClassName` 可给 Portal 中的 mask 追加业务 class，仅覆盖视觉样式，不改变点击遮罩关闭菜单的行为。

## Overlay behavior

菜单和玻璃 mask 通过 Portal 挂到 `document.body`，以免受页面容器裁切影响。它们的层级低于共享 `Popup`，不会覆盖真正的全屏弹窗。

点击 mask、选择可用选项或按下 Escape 都会关闭菜单。菜单宽度由内容决定，最大宽度只受视口边距限制；超长触发文案和选项文案会使用单行省略号。

菜单在打开、滚动和视口变化时重新计算锚点位置，并在下方空间不足时优先向上展开。

## Custom trigger

```tsx
<Dropdown
    options={options}
    renderTrigger={({ setTriggerElement, isOpen, panelId, onToggle }) => (
        <button
            ref={setTriggerElement}
            type="button"
            aria-haspopup="listbox"
            aria-controls={isOpen ? panelId : undefined}
            aria-expanded={isOpen}
            onClick={onToggle}
        >
            <LanguageIcon />
        </button>
    )}
/>
```

传入 `renderTrigger` 时，触发器的 className 和视觉状态由调用方维护；默认触发按钮及其 `triggerClassName` 仅用于未传该属性的场景。

## Usage

```tsx
import { Dropdown, type DropdownOption } from '@/components/Dropdown'

const options: readonly DropdownOption[] = [
    { value: 'copy', label: '复制内容', icon: <CopyIcon /> },
    { value: 'share', label: '分享链接', icon: <ShareIcon /> },
]

<Dropdown
    options={options}
    value={selectedValue}
    contentAlign="left"
    showArrow
    onChange={(value) => setSelectedValue(String(value))}
/>
```

将业务动作保留在 `onChange` 中；组件不会自行调用接口、钱包、路由或 Toast。
