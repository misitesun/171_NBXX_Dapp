# GradientText
Animated gradient text using React and SCSS; no motion dependency or frame-by-frame React renders. Default and named exports are available from `@/components/GradientText`.
React + SCSS 渐变文案组件，无额外动画依赖，无逐帧 React 状态更新。

```tsx
import GradientText from '@/components/GradientText'

<GradientText
    colors={['var(--app-color)', 'var(--app-gradient-blue)', 'var(--app-cyan)']}
    animationSpeed={3}
    showBorder={false}
    className="size-40 bold-6"
>
    Add a splash of color!
</GradientText>
```

| Prop | Default | Meaning |
| --- | --- | --- |
| children | required | Text or inline content |
| colors | project pink/blue/cyan tokens | CSS colors or variables; first color repeated at end |
| animationSpeed | 8 | Seconds per direction; a yoyo round trip takes twice this |
| showBorder | false | Synchronized gradient ring with transparent center |
| direction | horizontal | horizontal / vertical / diagonal |
| pauseOnHover | false | Pause and resume at the same position on hover |
| yoyo | true | Alternate directions; false repeats in one direction |
| className / style | — | Inherited typography, spacing and CSS customization |

Empty palettes fall back to defaults, one color renders as solid text, and non-positive/non-finite speed falls back to 8 seconds. Pass ordinary span attributes for aria/data/test hooks. Content should be text or phrasing elements, not block layout. The component itself is not a button and does not add a pointer cursor, click behavior or tab stop.
空颜色数组回退到默认色；单色保持纯色；无效速度回退 8 秒。支持原生 span 属性，不隐式增加点击行为。

Direction controls the gradient angle; diagonal animation moves horizontally, matching the supplied reference. CSS handles hover pause without state changes. Reduced-motion preference freezes the animation and forced-color mode restores readable system text. Border and text share one animation configuration.
方向控制渐变角度；斜向渐变仍水平移动。支持悬停暂停、减少动态效果和强制颜色模式；文案与边框同步动画。

Preview: `/h5/showcase/components/gradient-text` (development only).
