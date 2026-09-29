import { DropletLoading } from '@/components/DropletLoading'
import { Popup } from '@/components/Popup'

import './ContractLoading.scss'

export interface ContractLoadingProps {
    show: boolean
    className?: string
    tone?: 'default' | 'green'
}

export function ContractLoading({
    show,
    className = '',
    tone = 'default',
}: ContractLoadingProps) {
    return (
        <Popup
            show={show}
            position="center"
            contentPreset={false}
            closeOnOverlayClick={false}
            enterAnimation="fadeIn"
            leaveAnimation="fadeOut"
            className="contract-loading-popup"
            contentClassName="contract-loading-popup__content"
        >
            <DropletLoading
                className={`contract-loading${tone === 'green' ? ' contract-loading--green' : ''} ${className}`.trim()}
                ariaLabel="Contract loading"
            />
        </Popup>
    )
}
