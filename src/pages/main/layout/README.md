# Main application layout

`MainLayout` is the reusable first-level shell. It combines the project brand, language switch, optional wallet-address chip, and exactly one navigation mode: `tabbar` or `sidebar`.

`MainLayout` 是可复用的一级页面外壳，组合项目品牌、多语言切换、可选钱包地址摘要，以及 `tabbar` 或 `sidebar` 二选一的导航模式。

Both menus read `MAIN_PAGE_ITEMS`; add each confirmed first-level page there once instead of maintaining separate route lists. Items use the local `Icon` registry and must not depend on product artwork.

两种菜单统一读取 `MAIN_PAGE_ITEMS`；每个已确认的一级页面只需在该配置中添加一次。菜单图标使用本地 `Icon` 注册表，不依赖业务切图。

Menu labels use project translation keys from `src/i18n/locales/project/` and are resolved by either navigation mode.
菜单标题使用 `src/i18n/locales/project/` 中的项目翻译 key，由两种导航模式统一解析。

`staticPreview` disables brand navigation and wallet data for isolated visual checks. It does not emulate device chrome or a real authentication state.

`staticPreview` 仅用于隔离视觉检查时关闭品牌跳转和钱包数据，不模拟设备外壳或真实登录态。

## Sidebar presentation

侧栏从固定顶部栏下方向右侧滑入，铺满剩余视口；保留模板 100px（750px 设计宽度）顶部栏，不复制业务项目的路由或 API。`HeaderBar.sidebarOpen` 驱动菜单图标 250ms 连续反向动画与控件隐藏；品牌及关闭按钮留在顶部栏。菜单仍读取 `MAIN_PAGE_ITEMS` 和本地 Icon。

钱包卡片读取现有 `useDappStore.walletAddress`，使用模板品牌资源，复制完整钱包地址；没有邀请接口。`WalletOrbitBorder` 提供双向对称环绕高光，减少动态效果时静止。侧栏颜色使用专用主题 token，目前采用 NodeXX 绿色与深色背景。`staticPreview` 隐藏钱包卡片。

侧栏局部允许透明 Popup 遮罩以衔接顶部栏，其他 Popup 保持共享遮罩契约；Popup 负责锁滚动与退出卸载。Escape、菜单项、顶部关闭按钮关闭侧栏。

## NodeXX 内容适配

顶部仍高100px，保留钱包地址格式化与语言切换。侧栏入口及渲染由 APP_CONFIG.sidebarMenuEnabled 控制，当前按开发者要求关闭。AppBrand 使用金牛 NBXX 正方形 Logo，图片尺寸80×80px（750px基准），隐藏独立名称；原图地球作为语言控件内容。未连接显示本地化状态，不伪造设计示例钱包地址。staticPreview 仍隐藏钱包数据。
