# LanguageSwitch
语言切换入口组件。

`LanguageSwitch` is the shared entry component for opening the language dropdown.
`LanguageSwitch` 是用于打开多语言下拉菜单的通用入口组件。

When `children` is omitted, it renders the default language icon trigger.
当不传 `children` 时，组件会渲染默认的语言图标入口。

When `children` is provided, it uses that custom content as the clickable trigger, such as a project button.
当传入 `children` 时，组件会使用自定义内容作为可点击入口，例如项目自己的按钮样式。

When `APP_CONFIG.enableI18n` is disabled, the component returns only a hidden `div`; Dropdown, state and event logic are not mounted, so calling pages do not need conditional rendering.
当 `APP_CONFIG.enableI18n` 关闭时，组件只返回一个隐藏的 `div`；Dropdown、状态和事件逻辑都不会挂载，调用页面无需自行增加条件渲染。

The language list comes directly from `APP_LANGUAGES` and is rendered by the shared `Dropdown`. The trigger keeps the original default language icon, while `children` keeps supporting a custom trigger appearance.
语言列表直接来自 `APP_LANGUAGES` 并由通用 `Dropdown` 渲染。默认入口保持原有语言图标，`children` 仍可自定义触发器外观。

The enabled options are Simplified Chinese, Traditional Chinese, Japanese, Korean and English. This dropdown uses a transparent, non-blurred mask so the page below remains clearly visible; other `Dropdown` instances keep their default mask.
当前开放简体中文、繁體中文、日本語、한국어和 English。语言下拉使用透明且无模糊的遮罩，让底部页面保持清晰可见；其他 `Dropdown` 仍使用默认遮罩。

面板通过已有 panelClassName 使用 language-switch__panel 私有样式：深色半透明玻璃背景、24px背景模糊、2px项目绿色边框，选中及悬停项复用项目绿色半透明渐变。尺寸仍经750px设计基准转换，375px对应12px模糊；边框沿用项目转换规则保持2px。保留原有圆角、内边距、选项尺寸、锚点定位和关闭行为，不修改其它 Dropdown 实例。

上述玻璃透明度和模糊为本次样式实现选择，用户截图仅用于指出现有面板及修改方向，没有提供可量测的玻璃参数。

Changing language goes through `changeAppLanguage()`, which updates i18next, localStorage, `<html lang>` and the app store together.
切换语言会统一走 `changeAppLanguage()`，它会同时更新 i18next、localStorage、`<html lang>` 和 app store。

Selecting a different language closes the dropdown immediately. After its resource package loads and `changeAppLanguage()` succeeds, the page reloads so page-level APIs can request fresh data with the new `lang` header.
选择不同语言后下拉框会立即关闭；资源包加载完成且 `changeAppLanguage()` 成功后，页面会刷新，让页面级接口用新的 `lang` 请求头重新拉取数据。

`onOpen` is exposed for analytics, temporary wiring or tests.
组件保留 `onOpen`，方便埋点、临时接入或测试。

Default icon trigger:
默认图标入口：

```tsx
import { LanguageSwitch } from '@/components/LanguageSwitch'

<LanguageSwitch />
```

Custom button trigger:
自定义按钮入口：

```tsx
import { LanguageSwitch } from '@/components/LanguageSwitch'

<LanguageSwitch>
    <button type="button">切换语言</button>
</LanguageSwitch>
```
