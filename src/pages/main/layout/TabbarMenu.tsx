import { NavLink } from 'react-router'
import { Icon } from '@/components/Icon'

import { MAIN_PAGE_ITEMS } from '../config.ts'

export function TabbarMenu() {
    return (
        <nav className="app-tabbar vw-100" aria-label="主导航">
            <div className="app-tabbar__bar flex">
                {MAIN_PAGE_ITEMS.map((item) => {
                    const content = <><span className="app-tabbar__icon flex items-center justify-center"><Icon name={item.icon} className="size-42" /></span><span className="size-24 mt-2">{item.title}</span></>
                    const classes = 'app-tabbar__link flex-1 flex flex-column items-center justify-center'
                    return <NavLink key={item.path} to={item.path} className={({ isActive }) => `${classes}${isActive ? ' app-tabbar__link--active' : ''}`}>{content}</NavLink>
                })}
            </div>
            <div className="safe-bottom" />
        </nav>
    )
}
