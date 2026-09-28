import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('picker wraps popup and swiper into a reusable mobile picker', async () => {
    const [
        component,
        styles,
        entry,
        readme,
        showcasePage,
        showcaseStyle,
        packageJson,
    ] = await Promise.all([
        readFile('src/components/Picker/Picker.tsx', 'utf8'),
        readFile('src/components/Picker/Picker.scss', 'utf8'),
        readFile('src/components/Picker/index.ts', 'utf8'),
        readFile('src/components/Picker/README.md', 'utf8'),
        readFile('src/showcase/components/picker/PickerShowcasePage.tsx', 'utf8'),
        readFile('src/showcase/components/picker/PickerShowcasePage.scss', 'utf8'),
        readFile('package.json', 'utf8'),
    ])

    assert.match(packageJson, /"swiper":/)
    assert.match(component, /import \{ Swiper, SwiperSlide \} from 'swiper\/react'/)
    assert.match(component, /import 'swiper\/css'/)
    assert.match(component, /import \{ Empty \} from '@\/components\/Empty'/)
    assert.match(component, /import \{ Popup \} from '@\/components\/Popup'/)
    assert.match(component, /show:\s*boolean/)
    assert.match(component, /options:\s*PickerOption\[\]/)
    assert.match(component, /defaultIndex\?:\s*number/)
    assert.match(component, /value\?:\s*number/)
    assert.match(component, /allowEmpty\?:\s*boolean/)
    assert.match(component, /renderOption\?:/)
    assert.match(component, /onChange\?:/)
    assert.match(component, /onConfirm\?:/)
    assert.match(component, /onAfterClose\?:/)
    assert.match(component, /onAfterClose=\{onAfterClose\}/)
    assert.match(component, /contentPreset=\{false\}/)
    assert.match(component, /position="bottom"/)
    assert.match(component, /direction="vertical"/)
    assert.match(component, /slidesPerView="auto"/)
    assert.match(component, /centeredSlides/)
    assert.match(component, /onSwiper=\{handleSwiper\}/)
    assert.match(component, /onSlideChange=\{handleSlideChange\}/)
    assert.match(component, /swiperRef\.current\?\.slideTo/)
    assert.match(component, /handleConfirm/)
    assert.match(component, /Icon name="cross"/)
    assert.match(component, /<Empty text=\{emptyText\} \/>/)
    assert.doesNotMatch(component, /picker__empty/)

    assert.match(styles, /\.picker\s*\{/)
    assert.match(styles, /&__swiper/)
    assert.match(styles, /\.swiper-slide-active/)
    assert.doesNotMatch(styles, /&__empty/)
    assert.match(entry, /export \{ Picker \} from '\.\/Picker\.tsx'/)
    assert.match(entry, /export type \{ PickerConfirmPayload, PickerOption, PickerProps \} from '\.\/Picker\.tsx'/)
    assert.match(readme, /Popup/)
    assert.match(readme, /Swiper/)
    assert.match(readme, /AI usage contract/)
    assert.match(readme, /Do not put business request, wallet, login, route navigation, or page-specific option data inside `Picker`/)
    assert.match(readme, /Use `renderOption` when the option needs icons, multi-line text, token metadata or any custom visual structure/)
    assert.match(readme, /src\/showcase\/components\/picker\/PickerShowcasePage\.tsx/)
    assert.match(showcasePage, /export function PickerShowcasePage/)
    assert.match(showcasePage, /<SecondaryHeader title="选择器" \/>/)
    assert.match(showcasePage, /PICKER_DEMO_LIST/)
    assert.match(showcasePage, /title: '基础选择器'/)
    assert.match(showcasePage, /title: '自定义选项'/)
    assert.match(showcasePage, /title: '空数据'/)
    assert.match(showcasePage, /renderOption=\{isCustomDemo \? renderTokenOption : undefined\}/)
    assert.match(showcasePage, /emptyText="暂无可选择数据"/)
    assert.match(showcasePage, /className="full-btn"/)
    assert.match(showcasePage, /className="picker-showcase-option flex-center gap-16"/)
    assert.match(showcasePage, /className="picker-showcase-token-icon img-44 flex-center black size-22 bold"/)
    assert.match(showcaseStyle, /\.picker-showcase\s*\{/)
    assert.doesNotMatch(showcaseStyle, /&-trigger/)
})
