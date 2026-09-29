# 授权登录页

独立 `/login`，不使用 MainLayout 或 PagePullRefresh。参考 `/Users/sly/react_work/HU_CHAIN_Dapp/src/pages/splash/` 的钱包开屏；不是其账号密码登录页。

参考源样式：背景 #040404、底部提示 20px/#8D9094、进入动画延迟 0.3s。保留当前项目横向字标，用 320×160px 容器适配。

排列：居中品牌图片、底部状态提示及 loading，使用 Flex 正常流。星空是唯一 absolute 背景装饰。会话恢复结束后等待1秒入场动画，自动连接钱包、请求签名并登录；无钱包时底部提示使用钱包环境打开。按照开发者红框要求移除语言图标、NodeXX文字标题和所有授权按钮，没有邀请码输入框或授权表单。失败原因显示在底部；刷新后重新尝试，不循环弹签名。复用 Icon；外侧30px padding、品牌320px宽是当前横向资源适配值，不是 HU 原页实测尺寸。

Galaxy shader 原样取自指定项目，参数与 splash 一致：density1.5、glow0.5、saturation0.8、hueShift240；使用原生 WebGL，无新增 ogl 依赖。WebGL不可用时保留黑底，隐藏页面/卸载释放动画，减少动态效果时静止。

本人邀请链接使用站点根路径 `/ref/邀请码`，不包含应用部署目录 `/h5/`；服务器会将 `/ref/**` 转发到 `/h5/ref/**`。路径参数编码后分享，React Router 解码后直接读取。邀请码优先级为非空路径参数、旧 `?ref=` 参数、缓存；非空来源覆盖 NBXX_REFERRAL_CODE，授权时传给登录接口 ref。邀请码不再手动输入；缓存只用于登录 ref，本人邀请链接仍使用 GET 我的信息返回的 referral_code。

验证：nbxx-referral/nbxx-auth 回归、五语言渲染、375px/750px、无钱包自动提示；真实钱包成功签名及服务端成功登录需真实用户环境验证。
