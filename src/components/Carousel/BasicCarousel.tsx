import { Children, type ReactNode } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import './BasicCarousel.scss'

export interface BasicCarouselProps {
    children: ReactNode
}

export function BasicCarousel({ children }: BasicCarouselProps) {
    const slides = Children.toArray(children)

    return (
        <Swiper
            className="carousel"
            slidesPerView={1}
            modules={[Autoplay]}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            loop
            autoHeight
        >
            {slides.map((child, index) => (
                <SwiperSlide key={index}>
                    <div className="carousel__card">{child}</div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
