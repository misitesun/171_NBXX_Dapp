import {
    type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

import emptyUrl from '@/assets/common/empty.png'

import './Empty.scss'

export interface EmptyProps {
    text?: ReactNode
    showGap?: boolean
    className?: string
}

export function Empty({
    text,
    showGap = true,
    className = '',
}: EmptyProps) {
    const { t } = useTranslation()
    const classes = [
        'empty',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            {showGap ? <div className="gap-100" /> : null}

            <div className="empty__content">
                <img src={emptyUrl} className="empty__image" alt="" />
                <div className="empty__text size-28">{text ?? t('暂无数据')}</div>
            </div>

            {showGap ? <div className="gap-100" /> : null}
        </div>
    )
}
