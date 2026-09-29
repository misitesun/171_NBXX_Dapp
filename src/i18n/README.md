# Internationalization
国际化模块。

The project uses `i18next` and `react-i18next`.
项目使用 `i18next` 和 `react-i18next`。

Chinese text is allowed as the translation key because it matches the team's daily development language.
允许使用中文作为翻译 key，因为这符合团队日常开发语言。

```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
return <button>{t('确定')}</button>
```

Use `translate()` outside React components.
在 React 组件外使用 `translate()`。

```ts
import { translate } from '@/i18n'

translate('复制成功')
```

Use `changeAppLanguage()` to switch languages.
使用 `changeAppLanguage()` 切换语言。

```ts
await changeAppLanguage('zh-Hant')
```

## Language list
## 语言列表

All enabled languages are defined in `APP_LANGUAGES` inside `config.ts`.
所有启用语言都集中定义在 `config.ts` 的 `APP_LANGUAGES` 中。

This project currently enables Simplified Chinese (`zh-Hans`), Traditional Chinese (`zh-Hant`), Japanese (`ja`), Korean (`ko`) and English (`en`).
当前项目只开放简体中文（`zh-Hans`）、繁體中文（`zh-Hant`）、日本語（`ja`）、한국어（`ko`）和 English（`en`）。

Each item dynamically loads two common packages and the matching project package.
每个数组项动态加载两个 common 资源包和对应 project 资源包；合并顺序为 common、dappH5、project。

The template enables i18n by default through `APP_CONFIG.enableI18n`.
模板通过 `APP_CONFIG.enableI18n` 默认开启多语言。

When i18n is enabled, development defaults to `zh-Hans`, and production defaults to `en`.
开启多语言时，开发环境默认 `zh-Hans`，生产环境默认 `en`。

When `enableI18n` is `false`, initialization, local storage and the app store are fixed to `zh-Hans`. Translation calls remain available, but language switching and the request `lang` header are disabled.
当 `enableI18n` 为 `false` 时，初始化、本地缓存和 app store 都固定为 `zh-Hans`。翻译调用仍可正常使用，但语言切换和请求 `lang` 头会关闭。

Only enabled language files are retained in the base template. Add another locale only when the project confirms that language and translates every shared key.
基础模板只保留已启用语言文件。项目确认新增语言、并补齐全部共享 key 后再添加 locale。

Language codes use standard values such as `zh-Hans`, `zh-Hant`, `ja`, `ko` and `en`.
语言代码使用标准值，例如 `zh-Hans`、`zh-Hant`、`ja`、`ko` 和 `en`。

Do not restore legacy custom codes such as `zh`, `hk` or `ma`.
不要恢复旧项目中的 `zh`、`hk` 或 `ma` 这类自定义代码。

## Copy groups
## 文案分类

- `locales/common/*.json`: shared button, status, copy, refresh and time text.
- `locales/common/*.json`：通用按钮、状态、复制、刷新和时间文案。
- `locales/common/dappH5/*.json`: DApp wallet, network, signature, approval, transaction, H5 network, empty state, upload and submit text.
- `locales/common/dappH5/*.json`：DApp 钱包、网络、签名、授权、交易，以及 H5 网络、空状态、上传和提交文案。
- Project-only copy lives under `locales/project/` and is merged by each language loader.
- 项目独有文案保存在 `locales/project/`，并在对应语言 loader 中合并。首页使用 home.* key 和插值参数。
- Shared component defaults and accessibility labels use keys from `locales/common/`; project navigation labels use `locales/project/`.
- 公共组件默认文案和无障碍标签使用 `locales/common/`；项目导航文案使用 `locales/project/`。
- Do not put one-off business copy into common resources.
- 不要把一次性业务文案加入 common 资源。

Initialization only loads the current language and the English fallback language.
初始化只加载当前语言和英文回退语言。

Other language chunks are loaded dynamically only when the user switches language.
只有用户切换语言时，才动态加载其他语言 chunk。

Language changes are synchronized to localStorage, `<html lang>` and the app store.
语言切换会同步到 localStorage、`<html lang>` 和 app store。

The frontend and backend should use the same standard language codes.
前后端应统一使用同一套标准语言代码。

When i18n is enabled, the request layer reads the current language and sends it through the `lang` request header.
开启多语言时，请求层会读取当前语言，并通过 `lang` 请求头传给后端。

## 当前PHP语言契约

当前docs/api.md支持zh-CN/zh-TW/en-US，请求层getRequestLanguage将zh-Hans映射为zh-CN，zh-Hant映射为zh-TW，en/ja/ko使用en-US错误文案。UI及缓存继续使用原有五种标准语言代码；关闭i18n仍不发送lang头。
