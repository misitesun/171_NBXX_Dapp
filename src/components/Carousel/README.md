# Carousel
轮播图组件。

This directory stores reusable carousel variants powered by Swiper.
这个目录存放基于 Swiper 的可复用轮播图类型。

`BasicCarousel` is the first minimal variant. Every child is one slide, and the carousel height follows the active child.
`BasicCarousel` 是第一个基础类型，每个子元素都是一张 slide，轮播图高度跟随当前子元素。

```tsx
import { BasicCarousel } from '@/components/Carousel'

<BasicCarousel>
    <div className="banner-one">第一张内容</div>
    <div className="banner-two">第二张内容</div>
    <div className="banner-three">第三张内容</div>
</BasicCarousel>
```

`NoticeCarousel` accepts an array of local text items and scrolls vertically every three seconds. One item remains static. Its fixed single-line height is independent of BasicCarousel's auto-height behavior.
公告轮播使用 NoticeCarousel，上下切换、三秒一条；只有一条时不自动播放。

The notice carousel's accessible name follows the active common locale.
公告轮播的无障碍名称跟随当前通用语言包。
