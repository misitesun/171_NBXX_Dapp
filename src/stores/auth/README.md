# 鉴权状态

跨组件共享 `status`（checking / signedOut / signedIn）与 `user`。由 features/auth/session 管理会话，首页成功读取后更新 user。路由门槛和登录页都依赖 status。Token 通过 services/storage 保存，不把缓存地址直接当作已认证地址。登出清空 user。
