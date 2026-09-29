import type { IconName } from '@/components/Icon'
import { ROUTE_PATH } from '@/router/routes'

export type MainPageItemPath = typeof ROUTE_PATH.home

export type MainPageItem = {
    path: MainPageItemPath
    titleKey: string
    icon: IconName
}

export const MAIN_PAGE_ITEMS: readonly MainPageItem[] = [
    {
        path: ROUTE_PATH.home,
        titleKey: 'home.nav',
        icon: 'home',
    },
]
