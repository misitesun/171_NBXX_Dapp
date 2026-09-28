# Countdown
Defaults to a running 24-hour local countdown, rendered as hours:minutes:seconds. Each mount or duration change starts a new deadline; refresh resets it. `durationSeconds` configures the duration; optional `value` retains a fixed preview without a timer. Pink/cyan tones share the same behavior.
默认进入页面后开始 24 小时倒计时，刷新重置；可传 durationSeconds，自定义静态预览仍可传 value。
Remaining time is computed from the deadline, rather than subtracting interval ticks. Visibility changes reconcile background throttling. Zero stops the interval; unmount cleans up the interval and listener. This is demonstration time, not a server or contract deadline.
按截止时间计算剩余值，后台恢复自动校时；归零停止，卸载清理。此为本地演示倒计时，不代表真实减半或上所时间。
