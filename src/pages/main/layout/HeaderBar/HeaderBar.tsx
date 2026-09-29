import { useTranslation } from 'react-i18next'

import languageGlobe from '@/assets/common/language-globe.svg'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { maskWalletAddress } from '@/shared/formatters/maskWalletAddress.ts'
import { useDappStore } from '@/stores/dapp/index.ts'

import { AppBrand } from '../AppBrand/AppBrand.tsx'
import { MenuToggleIcon } from '../MenuToggleIcon.tsx'

import './HeaderBar.scss'

type HeaderBarProps = {
    staticPreview?: boolean
    showGap?: boolean
    showSidebarMenu?: boolean
    sidebarOpen?: boolean
    onSidebarMenuClick?: () => void
}

export function HeaderBar({
    staticPreview = false,
    showGap = true,
    showSidebarMenu = false,
    sidebarOpen = false,
    onSidebarMenuClick,
}: HeaderBarProps) {
    const { t } = useTranslation()
    const walletAddress = useDappStore((state) => state.walletAddress)
    const showWalletAddress = !staticPreview && walletAddress

    return (
        <header>
            <div className={`app-header-bar${sidebarOpen ? ' app-header-bar--sidebar-open' : ''}`}>

                {/* 导航栏 */}
                <div className="flex justify-between items-center header">
                    {/* 左侧 */}
                    <AppBrand staticPreview={staticPreview} onClick={sidebarOpen ? onSidebarMenuClick : undefined} />
                    {/* 右侧 */}
                    <div className="app-header-bar__actions flex items-center">
                        {staticPreview ? (
                            <button type="button" className="app-header-bar__control flex items-center justify-center" aria-label={t('语言')} title={t('静态展示')}><img src={languageGlobe} alt="" /></button>
                        ) : <LanguageSwitch className="app-header-bar__control flex items-center justify-center"><img src={languageGlobe} alt={t('语言')} /></LanguageSwitch>}
                        {showWalletAddress ? (
                            <div className="auto-btn size-24 bold-6 ml-20">
                                {maskWalletAddress(walletAddress)}
                            </div>
                        ) : !staticPreview ? <div className="auto-btn size-24 bold-6 ml-20">{t('未连接')}</div> : null}
                        {showSidebarMenu ? (
                            <button
                                type="button"
                                className="app-header-bar__menu flex items-center justify-center ml-20"
                                aria-label={t(sidebarOpen ? '关闭侧边栏' : '打开侧边栏')}
                                aria-expanded={sidebarOpen}
                                aria-controls="app-sidebar-menu"
                                onClick={onSidebarMenuClick}
                            ><MenuToggleIcon open={sidebarOpen} /></button>
                        ) : null}
                    </div>
                </div>
                <div className="app-header-bar__divider" aria-hidden="true" />
            </div>
            {showGap ? <div className="gap-100" /> : null}
        </header>
    )
}
