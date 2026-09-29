import { useLocation } from 'react-router'

import { APP_CONFIG } from '@/config'
import { ROUTE_PATH, useAppNavigate } from '@/router'

import './AppBrand.scss'

type AppBrandProps = {
    staticPreview?: boolean
    className?: string
    onClick?: () => void
}

export function AppBrand({
    staticPreview = false,
    className = '',
    onClick,
}: AppBrandProps) {
    const location = useLocation()
    const { pushRoute } = useAppNavigate()
    const brandClassName = [
        'app-brand',
        APP_CONFIG.brandWordmarkPath ? 'app-brand--wordmark' : '',
        'flex',
        'items-center',
        className,
    ].filter(Boolean).join(' ')

    function handleBrandClick() {
        if (staticPreview) return
        if (location.pathname !== ROUTE_PATH.home) {
            pushRoute(ROUTE_PATH.home)
        }

        onClick?.()
    }

    return (
        <button type="button" className={brandClassName} aria-label={APP_CONFIG.name || 'NodeXX'} onClick={handleBrandClick}>
            <img
                src={APP_CONFIG.brandWordmarkPath
                    ? `${APP_CONFIG.routeBase}${APP_CONFIG.brandWordmarkPath}`
                    : `${APP_CONFIG.routeBase}brand/app-logo.png`}
                className="app-brand__logo"
                alt=""
            />
            <div className="ml-10 size-24 bold-6" hidden={!APP_CONFIG.showBrandName}>
                {APP_CONFIG.name || 'DApp'}
            </div>
        </button>
    )
}
