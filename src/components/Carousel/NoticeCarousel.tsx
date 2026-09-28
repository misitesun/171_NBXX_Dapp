import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './NoticeCarousel.scss'

export function NoticeCarousel({ items }: { items: readonly string[] }) {
    return (
        <Swiper className="notice-carousel" direction="vertical" slidesPerView={1}
            modules={[Autoplay]} loop={items.length > 1} speed={500}
            autoplay={items.length > 1 ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            aria-label="公告轮播">
            {items.map((text, index) => <SwiperSlide key={index}>
                <p className="word-ellipsis-1 size-26" title={text}>{text}</p>
            </SwiperSlide>)}
        </Swiper>
    )
}
