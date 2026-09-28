import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import type { Swiper as SwiperInstance } from 'swiper/types'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Empty } from '@/components/Empty'
import { Icon } from '@/components/Icon'
import { Popup } from '@/components/Popup'

import 'swiper/css'
import './Picker.scss'

export interface PickerOption {
    label?: ReactNode
    value?: string | number
    disabled?: boolean
    [key: string]: unknown
}

export interface PickerConfirmPayload {
    index: number
    option?: PickerOption
}

export interface PickerProps {
    show: boolean
    options: PickerOption[]
    title?: ReactNode
    confirmText?: ReactNode
    emptyText?: ReactNode
    value?: number
    defaultIndex?: number
    allowEmpty?: boolean
    closeOnOverlayClick?: boolean
    className?: string
    onClose?: () => void
    onAfterClose?: () => void
    onChange?: (payload: PickerConfirmPayload) => void
    onConfirm?: (payload: PickerConfirmPayload) => void
    renderOption?: (option: PickerOption, index: number, isActive: boolean) => ReactNode
}

function clampIndex(index: number, optionsLength: number, allowEmpty: boolean): number {
    if (allowEmpty && index < 0) {
        return -1
    }

    if (optionsLength <= 0) {
        return allowEmpty ? -1 : 0
    }

    return Math.min(Math.max(index, 0), optionsLength - 1)
}

function getSlideIndex(index: number, optionsLength: number): number {
    if (optionsLength <= 0) {
        return 0
    }

    return Math.min(Math.max(index, 0), optionsLength - 1)
}

function getOptionLabel(option: PickerOption): ReactNode {
    if (option.label !== undefined) {
        return option.label
    }

    if (typeof option.name === 'string' || typeof option.name === 'number') {
        return option.name
    }

    return option.value ?? ''
}

export function Picker({
    show,
    options,
    title = '请选择',
    confirmText = '确定',
    emptyText,
    value,
    defaultIndex = 0,
    allowEmpty = false,
    closeOnOverlayClick = true,
    className = '',
    onClose,
    onAfterClose,
    onChange,
    onConfirm,
    renderOption,
}: PickerProps) {
    const swiperRef = useRef<SwiperInstance | null>(null)
    const isControlled = value !== undefined
    const [innerIndex, setInnerIndex] = useState(() => clampIndex(defaultIndex, options.length, allowEmpty))
    const currentIndex = isControlled
        ? clampIndex(value, options.length, allowEmpty)
        : innerIndex
    const currentOption = currentIndex >= 0 ? options[currentIndex] : undefined
    const isCurrentEmpty = allowEmpty && currentIndex < 0

    const pickerClassName = [
        'picker',
        className,
    ].filter(Boolean).join(' ')

    const swiperClassName = [
        'picker__swiper',
        isCurrentEmpty ? 'picker__swiper--empty-current' : '',
    ].filter(Boolean).join(' ')

    const slideToIndex = useMemo(() => {
        return (index: number, speed = 300) => {
            if (!swiperRef.current) return
            if (options.length <= 0) return

            swiperRef.current.slideTo(getSlideIndex(index, options.length), speed)
        }
    }, [options.length])

    useEffect(() => {
        if (!isControlled) {
            setInnerIndex(clampIndex(defaultIndex, options.length, allowEmpty))
        }
    }, [allowEmpty, defaultIndex, isControlled, options.length])

    useEffect(() => {
        if (!show) return

        slideToIndex(currentIndex, 0)
    }, [currentIndex, show, slideToIndex])

    function updateCurrentIndex(nextIndex: number) {
        const safeIndex = clampIndex(nextIndex, options.length, allowEmpty)

        if (!isControlled) {
            setInnerIndex(safeIndex)
        }

        onChange?.({
            index: safeIndex,
            option: safeIndex >= 0 ? options[safeIndex] : undefined,
        })
    }

    function handleSwiper(swiper: SwiperInstance) {
        swiperRef.current = swiper
        slideToIndex(currentIndex, 0)
    }

    function handleSlideChange(swiper: SwiperInstance) {
        updateCurrentIndex(swiper.activeIndex)
    }

    function handleSlideClick(index: number) {
        updateCurrentIndex(index)
        swiperRef.current?.slideTo(index)
    }

    function handleConfirm() {
        if (options.length <= 0) return

        onConfirm?.({
            index: currentIndex,
            option: currentOption,
        })

        onClose?.()
    }

    return (
        <Popup
            show={show}
            position="bottom"
            contentPreset={false}
            closeOnOverlayClick={closeOnOverlayClick}
            onClose={onClose}
            onAfterClose={onAfterClose}
        >
            <div className={pickerClassName}>
                <div className="picker__header">
                    <div className="picker__title size-32 bold-6">{title}</div>
                    <button
                        type="button"
                        className="picker__close"
                        onClick={onClose}
                        aria-label="Close picker"
                    >
                        <Icon name="cross" className="size-48 opc-6" />
                    </button>
                </div>

                {options.length <= 0 ? (
                    <Empty text={emptyText} />
                ) : (
                    <Swiper
                        className={swiperClassName}
                        direction="vertical"
                        slidesPerView="auto"
                        centeredSlides
                        spaceBetween={10}
                        onSwiper={handleSwiper}
                        onSlideChange={handleSlideChange}
                    >
                        {options.map((option, index) => (
                            <SwiperSlide
                                key={`${String(option.value ?? getOptionLabel(option))}-${index}`}
                                className="picker__option"
                                onClick={() => handleSlideClick(index)}
                            >
                                {renderOption
                                    ? renderOption(option, index, currentIndex === index)
                                    : getOptionLabel(option)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                <div className="picker__footer">
                    <button
                        type="button"
                        className="picker__confirm size-30 bold"
                        onClick={handleConfirm}
                        disabled={options.length <= 0}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Popup>
    )
}
