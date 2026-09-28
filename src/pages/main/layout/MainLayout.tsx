import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router'

import {
    DEFAULT_LAYOUT_MENU_TYPE,
    LAYOUT_MENU_TYPE,
    type LayoutMenuType,
} from '@/router/config'

import { HeaderBar } from './HeaderBar/HeaderBar.tsx'
import { SidebarMenu } from './SidebarMenu.tsx'
import { TabbarMenu } from './TabbarMenu.tsx'
import './MainLayout.scss'

type MainLayoutProps = {
    menuType?: LayoutMenuType
    staticPreview?: boolean
    children?: ReactNode
}

export function MainLayout({
    menuType = DEFAULT_LAYOUT_MENU_TYPE,
    staticPreview = false,
    children,
}: MainLayoutProps) {
    const [showSidebarMenu, setShowSidebarMenu] = useState(false)
    const isSidebarLayout = menuType === LAYOUT_MENU_TYPE.sidebar
    const isTabbarLayout = menuType === LAYOUT_MENU_TYPE.tabbar
    const appLayoutClassName = isTabbarLayout
        ? 'app-layout app-layout--tabbar min-vh-100'
        : 'app-layout min-vh-100'

    function handleToggleSidebarMenu() {
        setShowSidebarMenu((isOpen) => !isOpen)
    }

    function handleCloseSidebarMenu() {
        setShowSidebarMenu(false)
    }

    return (
        <div className={appLayoutClassName}>
            <HeaderBar
                staticPreview={staticPreview}
                showGap={!staticPreview}
                showSidebarMenu={isSidebarLayout}
                sidebarOpen={showSidebarMenu}
                onSidebarMenuClick={handleToggleSidebarMenu}
            />

            <div className="app-layout__body">
                <main className="app-layout__main">
                    {children ?? <Outlet />}
                </main>
            </div>

            {isSidebarLayout ? (
                <SidebarMenu
                    show={showSidebarMenu}
                    onClose={handleCloseSidebarMenu}
                    staticPreview={staticPreview}
                />
            ) : null}
            {isTabbarLayout ? <TabbarMenu /> : null}
        </div>
    )
}
