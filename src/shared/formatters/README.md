# Display formatters
展示格式化。

These helpers convert API or on-chain data into page text.
这些函数负责把接口或链上数据转换成页面文本。

They do not mutate the original data or manipulate the DOM directly.
它们不会修改原始数据，也不会直接操作 DOM。

```tsx
formatAmount(balance)                 // Money: zero is displayed as 0.00
                                      // 金额：零显示 0.00
formatQuantity(stock)                 // Quantity: zero is displayed as 0
                                      // 数量：零显示 0
maskWalletAddress(walletAddress)      // Mask wallet address
                                      // 钱包地址脱敏
maskPhoneNumber(phoneNumber)          // Mask phone number
                                      // 手机号脱敏
maskEmailAddress(emailAddress)        // Mask email address
                                      // 邮箱脱敏
formatRelativeTime(createdAt)         // Today, yesterday or date
                                      // 今天、昨天或日期
formatTwoDigitNumber(month)           // Pad a single digit with a leading zero
                                      // 个位整数前置补零
```

Amount and quantity formatters handle strings directly.
金额和数量格式化会直接处理字符串。

They can safely display values beyond JavaScript `number` precision.
它们可以安全展示超出 JavaScript `number` 精度范围的值。

Use them only for display text.
它们只用于展示文本。

Do not use formatted strings for amount calculations, token decimal conversion or on-chain transaction parameters.
金额计算、Token decimals 换算和链上交易参数不能使用格式化后的字符串。

When adding a formatter, use an action-plus-object name such as `formatXxx` or `maskXxx`.
新增格式化能力时，使用 `formatXxx` 或 `maskXxx` 这种“动作 + 明确对象”的命名。

Keep the file name aligned with the primary exported function.
文件名应与主导出函数保持一致。

Do not recreate a generic Vue-style `v-init` entry point.
不要重新创建类似 Vue `v-init` 的万能入口。

`formatRelativeTime()` currently outputs the Chinese word `昨天` directly.
`formatRelativeTime()` 当前会直接输出中文“昨天”。

TODO(i18n): Provide this copy through the translation function after the i18n module is connected to formatters.
TODO(i18n)：格式化模块接入国际化后，通过翻译函数提供该文案。

`formatTwoDigitNumber()` only pads non-negative integers from `0` to `9`.
`formatTwoDigitNumber()` 只给 `0` 到 `9` 的非负整数补零。

Two-digit numbers, decimals, negative numbers and non-numeric text stay unchanged.
两位数、小数、负数和非数字文本保持原样。

Empty values are displayed as `--`.
空值显示为 `--`。
