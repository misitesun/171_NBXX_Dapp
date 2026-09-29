import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '../../Icon'

import './PopupContent.scss'

export interface PopupContentCenterProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClose' | 'title'> {
    title?: ReactNode
    onClose?: () => void
}

export function PopupContentCenter({
    className = '',
    children,
    title,
    onClose,
    ...props
}: PopupContentCenterProps) {
    const { t } = useTranslation()
    const classes = [
        'popup-content',
        'popup-content--center',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={classes} {...props}>
            <div className="popup-content__header">
                <div className="popup-content__title size-32 bold-6">{title ?? t('标题')}</div>
                <Icon name="cross" className="size-48 opc-6" onClick={onClose} />
            </div>

            {children}
        </div>
    )
}
