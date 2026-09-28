import {
    useEffect,
    useMemo,
    useState,
    type AnimationEvent,
    type MouseEvent,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { getPopupContentComponent } from './PopupContent/index.ts'
import './Popup.scss'

export type PopupPosition = 'center' | 'right' | 'left' | 'bottom'

interface PopupAnimation {
    enter: string
    leave: string
}

const POPUP_POSITION_ANIMATION: Record<PopupPosition, PopupAnimation> = {
    center: { enter: 'zoomIn', leave: 'zoomOut' },
    right: { enter: 'slideInRight', leave: 'slideOutRight' },
    left: { enter: 'slideInLeft', leave: 'slideOutLeft' },
    bottom: { enter: 'slideInUp', leave: 'slideOutDown' },
}

let popupBodyLockCount = 0
let popupPreviousBodyOverflow = ''

export interface PopupProps {
    show: boolean
    children: ReactNode
    title?: ReactNode
    onClose?: () => void
    onAfterClose?: () => void
    position?: PopupPosition
    closeOnOverlayClick?: boolean
    enterAnimation?: string
    leaveAnimation?: string
    className?: string
    contentClassName?: string
    contentPreset?: boolean
}

function getAnimateClassName(animationName: string): string {
    return animationName.startsWith('animate__')
        ? animationName
        : `animate__${animationName}`
}

function lockBodyScroll() {
    if (typeof document === 'undefined') return () => {}

    if (popupBodyLockCount === 0) {
        popupPreviousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
    }

    popupBodyLockCount += 1

    return () => {
        popupBodyLockCount = Math.max(0, popupBodyLockCount - 1)

        if (popupBodyLockCount === 0) {
            document.body.style.overflow = popupPreviousBodyOverflow
        }
    }
}

export function Popup({
    show,
    children,
    title,
    onClose,
    onAfterClose,
    position = 'center',
    closeOnOverlayClick = true,
    enterAnimation,
    leaveAnimation,
    className = '',
    contentClassName = '',
    contentPreset = true,
}: PopupProps) {
    const [shouldRender, setShouldRender] = useState(show)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        if (show) {
            setShouldRender(true)
            setIsLeaving(false)
            return
        }

        if (shouldRender) {
            setIsLeaving(true)
        }
    }, [show, shouldRender])

    useEffect(() => {
        if (!shouldRender) return

        return lockBodyScroll()
    }, [shouldRender])

    const animationClassName = useMemo(() => {
        const defaultAnimation = POPUP_POSITION_ANIMATION[position]
        const animation = isLeaving
            ? leaveAnimation ?? defaultAnimation.leave
            : enterAnimation ?? defaultAnimation.enter

        return getAnimateClassName(animation)
    }, [enterAnimation, isLeaving, leaveAnimation, position])
    const PopupContentComponent = contentPreset
        ? getPopupContentComponent(position)
        : undefined

    function handleOverlayClick() {
        if (!closeOnOverlayClick) return

        onClose?.()
    }

    function handleContentClick(event: MouseEvent<HTMLDivElement>) {
        event.stopPropagation()
    }

    function handleContentAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
        if (event.currentTarget !== event.target) return
        if (!isLeaving) return

        setShouldRender(false)
        setIsLeaving(false)
        onAfterClose?.()
    }

    if (!shouldRender || typeof document === 'undefined') return null

    const popupClassName = [
        'popup',
        `popup--${position}`,
        className,
    ].filter(Boolean).join(' ')

    const overlayAnimationClassName = isLeaving
        ? getAnimateClassName('fadeOut')
        : getAnimateClassName('fadeIn')

    const popupOverlayClassName = [
        'popup__overlay',
        'animate__animated',
        overlayAnimationClassName,
    ].filter(Boolean).join(' ')

    const popupContentClassName = [
        'popup__content',
        'animate__animated',
        animationClassName,
        contentClassName,
    ].filter(Boolean).join(' ')

    return createPortal(
        <div className={popupClassName}>
            <div
                className={popupOverlayClassName}
                onClick={handleOverlayClick}
            >
                {!PopupContentComponent ? (
                    <div
                        className={popupContentClassName}
                        onClick={handleContentClick}
                        onAnimationEnd={handleContentAnimationEnd}
                    >
                        {children}
                    </div>
                ) : (
                    <PopupContentComponent
                        className={popupContentClassName}
                        title={title}
                        onClose={onClose}
                        onClick={handleContentClick}
                        onAnimationEnd={handleContentAnimationEnd}
                    >
                        {children}
                    </PopupContentComponent>
                )}
            </div>
        </div>,
        document.body,
    )
}
