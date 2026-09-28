import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('basic carousel uses children as auto-height slides', async () => {
    const component = await readFile(
        'src/components/Carousel/BasicCarousel.tsx',
        'utf8',
    )
    const style = await readFile(
        'src/components/Carousel/BasicCarousel.scss',
        'utf8',
    )
    const entry = await readFile('src/components/Carousel/index.ts', 'utf8')

    assert.match(component, /import \{ Swiper, SwiperSlide \} from 'swiper\/react'/)
    assert.match(component, /Children/)
    assert.match(component, /ReactNode/)
    assert.match(component, /import \{ Autoplay \} from 'swiper\/modules'/)
    assert.match(component, /import 'swiper\/css'/)
    assert.match(component, /className="carousel"/)
    assert.match(component, /modules=\{\[Autoplay\]\}/)
    assert.match(component, /autoplay=\{\{/)
    assert.match(component, /loop/)
    assert.match(component, /autoHeight/)
    assert.match(component, /Children\.toArray\(children\)/)
    assert.match(component, /slides\.map\(\(child, index\) => \(/)
    assert.match(component, /<SwiperSlide key=\{index\}>/)
    assert.match(component, /className="carousel__card"/)
    assert.match(style, /&__card/)
    assert.doesNotMatch(style, /height:/)
    assert.match(entry, /BasicCarousel/)
})
