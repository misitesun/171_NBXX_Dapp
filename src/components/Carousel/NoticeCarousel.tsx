import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useTranslation } from 'react-i18next'
import 'swiper/css'
import './NoticeCarousel.scss'

export function NoticeCarousel({ items }: { items: readonly string[] }) {
    const { t } = useTranslation()
    return (
        <Swiper className="notice-carousel" direction="vertical" slidesPerView={1}
            modules={[Autoplay]} loop={items.length > 1} speed={500}
            autoplay={items.length > 1 ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            aria-label={t('公告轮播')}>
            {items.map((text, index) => <SwiperSlide key={index}>
                <p className="word-ellipsis-1 size-26" title={text}>{text}</p>
            </SwiperSlide>)}
        </Swiper>
    )
}
