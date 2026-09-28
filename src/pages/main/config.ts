import type { IconName } from '@/components/Icon'
import { ROUTE_PATH } from '@/router/routes'

export type MainPageItemPath = typeof ROUTE_PATH.home

export type MainPageItem = {
    path: MainPageItemPath
    title: string
    icon: IconName
}

export const MAIN_PAGE_ITEMS: readonly MainPageItem[] = [
    {
        path: ROUTE_PATH.home,
        title: '首页',
        icon: 'home',
    },
]
