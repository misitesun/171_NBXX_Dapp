import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Icon } from '../../Icon'

import './PopupContent.scss'

export interface PopupContentBottomProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClose' | 'title'> {
    title?: ReactNode
    onClose?: () => void
}

export function PopupContentBottom({
    className = '',
    children,
    title = '标题',
    onClose,
    ...props
}: PopupContentBottomProps) {
    const classes = [
        'popup-content',
        'popup-content--bottom',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={classes} {...props}>
            <div className="popup-content__header">
                <div className="popup-content__title size-32 bold-6">{title}</div>
                <Icon name="cross" className="size-48 opc-6" onClick={onClose} />
            </div>

            {children}
        </div>
    )
}
