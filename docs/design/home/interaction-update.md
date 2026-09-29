# 首页交互修正

## 范围与依据

2026-09-28 开发者明确要求关闭侧栏图标、NFT 卡片和权益背景随等级选择切换、媒体资源横向衔接滚动。复用 dapp-feature-delivery、dapp-react-engineering 和 figma-design-to-code 工作流。

允许改动首页 TSX/SCSS/config、公共顶部入口配置及 MainLayout 的配置读取、对应模块文档与验证。没有新增依赖、接口、合约、其它页面或远程 Git 操作。

## 实现清单与量测

- 侧栏模式配置保留，通过 sidebarMenuEnabled=false 关闭入口及侧栏渲染；顶部品牌、语言、钱包槽位保持现有结构。
- NFT 图和等级价格不交换；两张背景资源分别表示未选中与选中状态，根据同一个 selectedTier 选择。
- 权益栏的绿色渐变、内阴影、绿色描边与正文高亮同样由 selectedTier 驱动，使用原稿已量测样式。
- 媒体依据 Figma 节点30204:3164，20张原图与已有裁切资源一致；单卡180×60，圆角10，白色10%背景、20%边框1px；卡间20，两行相隔20。保留首页原始轨道起点-220/-320。
- 原稿媒体图像槽位宽度及高度复用 assets.ts，第一行第二张124×15，其余按原节点尺寸。资源记录为 media-figma-data.yaml，参考截图为 media-figma-reference.png。
- 每行10张复制为两组。每组尾部补20px间距，组宽2000px；4000px轨道移动自身50%，保证首尾衔接。复制组 aria-hidden，不重复语义内容。
- 上行向左、下行向右，使用 CSS transform 线性无限动画，不新增逐帧 JavaScript 状态。40秒/轮由 config.mediaScrollDurationSeconds 提供。
- 滚动方向和时长是本次实现选择，静态稿未给出对应动效量测；prefers-reduced-motion: reduce 时停止滚动。
- 验证：NFT初级/高级双向切换，背景和权益同步；无侧栏按钮；动画随时间运行、循环周期衔接；375/750布局无横向溢出；pnpm lint、pnpm test、pnpm exec tsc -b，生产Logo构建门禁保留。

## 浏览器验证

- 375px：侧栏按钮数量0；初级和高级双向切换后，卡片背景和权益栏高亮同步到所选等级。
- 375px：两行各2000px轨道，由两个1000px的相同资源组组成，组内间距和尾间距都是10px（750源值缩放）；所有40张媒体图加载完成。动画实测40s，分别 normal/reverse。
- 复制组资源内容与首组完全一致，循环移动半条轨道后回到同一图像排列，不引入额外组间空隙。
- 750px：轨道4000px、每组2000px，两张NFT卡宽338px；页面scrollWidth=750。媒体轨道置于页脚装饰背景上方，避免下行末尾被背景遮住。
- 相隔约21秒的实际采样，上行translateX从-451.313px变为-975.894px，下行从-548.687px变为-24.1059px，符合25px/s的375px缩放速度。采样结果见 media-motion-check.json。
- pnpm lint、pnpm exec tsc -b、git diff --check通过，pnpm build 的verify阶段229项测试全部通过，随后由初始化Logo门禁阻止。
