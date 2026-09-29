import { useEffect } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'

import walletLinkIcon from '@/assets/common/wallet-link.png'
import { Icon } from '@/components/Icon'
import { Popup } from '@/components/Popup'
import { Toast, useToast } from '@/components/Toast'
import { APP_CONFIG } from '@/config'
import { copyTextToClipboard } from '@/shared/clipboard/copyTextToClipboard.ts'
import { maskWalletAddress } from '@/shared/formatters/maskWalletAddress.ts'
import { useDappStore } from '@/stores/dapp/index.ts'

import { MAIN_PAGE_ITEMS } from '../config.ts'
import { WalletOrbitBorder } from './WalletOrbitBorder.tsx'

const getMenuLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    isActive ? 'app-menu__link app-menu__link--active' : 'app-menu__link'

type SidebarMenuProps = {
    show: boolean
    onClose: () => void
    staticPreview?: boolean
}

export function SidebarMenu({ show, onClose, staticPreview = false }: SidebarMenuProps) {
    const { t } = useTranslation()
    const walletAddress = useDappStore((state) => state.walletAddress)
    const { message, variant, showToast } = useToast()

    useEffect(() => {
        if (!show) return
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [show, onClose])

    function handleMenuLinkClick() {
        onClose()
    }

    async function handleCopyWalletAddress() {
        if (!walletAddress) return
        const copied = await copyTextToClipboard(walletAddress)
        if (useDappStore.getState().walletAddress !== walletAddress) return
        showToast(copied ? t('复制成功') : t('复制失败'), copied ? 'success' : 'error')
    }

    return (
        <Popup
            show={show}
            onClose={onClose}
            position="right"
            contentPreset={false}
            className="app-sidebar-popup"
        >
            <aside id="app-sidebar-menu" className="app-sidebar-menu" aria-label={t('导航菜单')}>
                <nav className="app-menu">
                    {MAIN_PAGE_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={getMenuLinkClassName}
                            onClick={handleMenuLinkClick}
                        >
                            <span className="app-menu__icon-box"><Icon name={item.icon} className="app-menu__icon" /></span>
                            <span className="app-menu__label">{t(item.titleKey)}</span>
                            <Icon name="arrow" className="app-menu__chevron" />
                        </NavLink>
                    ))}
                </nav>
                {!staticPreview && walletAddress ? (
                    <section className="app-sidebar-wallet" aria-label={t('钱包信息')}>
                        <img className="app-sidebar-wallet__badge" src={`${APP_CONFIG.routeBase}brand/app-logo.png`} alt="" />
                        <div className="app-sidebar-wallet__card">
                            <WalletOrbitBorder />
                            <div className="app-sidebar-wallet__identity">
                                <span className="app-sidebar-wallet__name">{maskWalletAddress(walletAddress)}</span>
                                <span className="app-sidebar-wallet__status">
                                    <span className="app-sidebar-wallet__status-dot" aria-hidden="true" />
                                    {t('已连接钱包')}
                                </span>
                            </div>
                            <div className="app-sidebar-wallet__address">
                                <img className="app-sidebar-wallet__link-icon" src={walletLinkIcon} alt="" />
                                <span className="app-sidebar-wallet__address-text" title={walletAddress}>{walletAddress}</span>
                                <span className="app-sidebar-wallet__address-divider" aria-hidden="true" />
                                <button
                                    type="button"
                                    className="app-sidebar-wallet__copy"
                                    aria-label={t('复制钱包地址')}
                                    onClick={() => void handleCopyWalletAddress()}
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v12H8zM4 16V4h12" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                                </button>
                            </div>
                        </div>
                    </section>
                ) : null}
            </aside>
            <Toast message={message} variant={variant} />
        </Popup>
    )
}
