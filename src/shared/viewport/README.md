# Viewport physical pixels
视口真实像素。

PostCSS converts CSS `px` from a 750px design draft into `vw`.
PostCSS 会把 750 设计稿中的 CSS `px` 转换成 `vw`。

Use these helpers when a third-party component such as Swiper or Canvas requires a real numeric pixel value.
当 Swiper、Canvas 等第三方组件必须接收真实数字像素时，使用这些方法。

```ts
getViewportWidthPx(30)       // Returns 15 on a 375px-wide screen.
                             // 在 375 宽屏幕上得到 15。
getViewportHeightPx(100, 812)
```

`getViewportWidthPx()` uses 750 as the default design width.
`getViewportWidthPx()` 默认设计稿宽度为 750。

`getViewportHeightPx()` must receive the design height explicitly because each page may use a different design height.
`getViewportHeightPx()` 必须明确传入设计稿高度，因为不同页面的设计稿高度可能不同。

Both helpers read `window.innerWidth` or `window.innerHeight` only once per call.
两个函数每次调用只读取一次 `window.innerWidth` 或 `window.innerHeight`。

They do not listen to resize, orientation changes or keyboard changes.
它们不会监听 resize、横竖屏或软键盘变化。

Calculate once when the React page first enters, usually with lazy `useState`.
React 页面通常在首次进入时计算一次，可使用 `useState` 惰性初始化。

```tsx
const [spaceBetween] = useState(() => getViewportWidthPx(30))
```

Do not call it directly at the top level of a component function.
不要直接写在组件函数顶层。

```tsx
const spaceBetween = getViewportWidthPx(30) // Runs again on every render.
                                           // 每次重新渲染都会再次调用。
```

When `window` is unavailable in SSR or tests, the helpers use the design size as the viewport size.
服务端渲染或测试环境没有 `window` 时，方法会使用设计稿尺寸作为视口尺寸。

In that case, the returned value is the original design pixel value.
在这种情况下，返回值就是设计稿原始像素值。

PostCSS `px → vw` conversion is based on width.
PostCSS 的 `px → vw` 转换基于宽度。

The height helper is an explicit special ratio conversion and is not equivalent to generated CSS.
高度方法是明确的特殊比例换算，并不等价于 PostCSS 生成的 CSS。
