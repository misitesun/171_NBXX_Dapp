# Decimal business calculations
业务小数计算。

This module provides exact calculations for API amounts, on-chain quantities and form numbers.
这个模块用于接口金额、链上数量和表单数字的精确计算。

It does not convert string input into JavaScript `number`.
它不会把字符串输入转换为 JavaScript `number`。

```ts
addDecimalNumbers('0.1', '0.2')       // '0.3'
subtractDecimalNumbers('10', '1.5')  // '8.5'
multiplyDecimalNumbers('2.5', '4')   // '10'
divideDecimalNumbers('1', '3')       // '0.333333333333333333'
divideDecimalNumbers('1', '3', 6)    // '0.333333'
calculatePercentage('545', '1000')   // 54
```

The return value is always a plain string without thousands separators.
返回值始终是没有千分位的普通字符串。

Use the returned string for further calculation or API submission.
返回值适合继续计算或提交接口。

Use `formatAmount()` or `formatQuantity()` only when rendering display text.
只有页面展示时才交给 `formatAmount()` 或 `formatQuantity()`。

## Project-specific empty and zero rules
## 项目特有的空值和零值规则

These helpers are business-tolerant calculations, not strict mathematical functions.
这些方法是带业务容错的计算函数，不是严格数学函数。

```ts
subtractDecimalNumbers(null, 10) // '10', not '-10'
subtractDecimalNumbers(0, 10)    // '10', use the non-zero side directly
multiplyDecimalNumbers(null, 10) // '10'
divideDecimalNumbers(10, null)   // '10', not a division-by-zero error
divideDecimalNumbers(10, 0)      // '0'
```

Empty values include `null`, `undefined`, empty strings and whitespace-only strings.
空值包括 `null`、`undefined`、空字符串和纯空格字符串。

Invalid non-empty values are not treated as empty values.
非空非法值不会被当成空值。

Values such as `'abc'`, `NaN` and `Infinity` return `'0'`.
例如 `'abc'`、`NaN` 和 `Infinity` 会让结果返回 `'0'`。

Addition and subtraction return the other side directly when one side is empty or zero.
加减遇到空值或零值时直接返回另一侧。

Multiplication and division return the other side when one side is empty, and return `'0'` when one side is zero.
乘除遇到空值时返回另一侧，遇到零值时返回 `'0'`。

When both sides are empty, the result is `'0'`.
两侧都是空值时返回 `'0'`。

## Precision rules
## 精度约定

Strings, integers and `bigint` values are handled exactly.
字符串、整数和 `bigint` 会被精确处理。

Scientific notation is supported.
科学计数法也受支持。

Floating-point `number` values may have already lost precision before they enter this module.
浮点型 `number` 在传入前可能已经丢失精度。

The calculation module cannot recover precision that has already been lost.
计算模块无法恢复已经丢失的精度。

DApp amount calculations should prefer string input.
DApp 金额计算应优先使用字符串输入。

```ts
addDecimalNumbers('999999999999999999.1', '0.9') // recommended
addDecimalNumbers(999999999999999999.1, 0.9)     // not recommended
```

Division keeps at most 18 decimal places by default and truncates directly.
除法默认最多保留 18 位小数并直接截断。

The third argument can change the decimal length, with a maximum of 100 places.
第三个参数可以调整小数位数，最高允许 100 位。

To avoid freezing the browser with abnormal API data, a single input can contain at most 10,000 characters.
为了避免接口异常数据让浏览器同步卡死，单个输入最多允许 10,000 个字符。

Scientific notation scale and internal decimal scale are also capped at 10,000.
科学计数指数和内部小数位规模也最多允许 10,000。

Values beyond the safe boundary are treated as invalid input and return `'0'`.
超过安全边界的值会按非法输入处理并返回 `'0'`。

## Integer percentage
## 整数占比。

`calculatePercentage(currentValue, totalValue)` returns an integer from `0` to `100`.
`calculatePercentage(currentValue, totalValue)` 返回 `0` 到 `100` 的整数。

It reuses exact division and multiplication internally.
它内部复用精确除法和乘法。

```ts
calculatePercentage(54.5, 100)      // 54, truncated directly
calculatePercentage(120, 100)       // 100, capped at the maximum value
calculatePercentage(null, 100)      // 0
calculatePercentage(10, 0)          // 0
calculatePercentage(-1, 100)        // 0
```

The percentage helper validates both arguments before division.
占比函数会在除法前严格校验两个参数。

It does not reuse the general division rule that returns the other side when one side is empty.
它不会沿用通用除法“空值返回另一侧”的特殊业务规则。
