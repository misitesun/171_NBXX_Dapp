import { SecondaryHeader } from '@/components/SecondaryHeader'
import { Icon } from '@/components/Icon'
import { useAppNavigate } from '@/router'

import { SHOWCASE_ROUTE_PATH } from '../router'

type ShowcaseRoutePath = (typeof SHOWCASE_ROUTE_PATH)[keyof typeof SHOWCASE_ROUTE_PATH]

const COMPONENT_SHOWCASE_LIST = [
    { title: '渐变文案', path: SHOWCASE_ROUTE_PATH.gradientText },
    {
        title: '弹窗',
        path: SHOWCASE_ROUTE_PATH.popup,
    },
    {
        title: '选择器',
        path: SHOWCASE_ROUTE_PATH.picker,
    },
    {
        title: '下拉框',
        path: SHOWCASE_ROUTE_PATH.dropdown,
    },
    {
        title: '图标',
        path: SHOWCASE_ROUTE_PATH.icon,
    },
    {
        title: '空数据',
        path: SHOWCASE_ROUTE_PATH.empty,
    },
    {
        title: '语言切换',
        path: SHOWCASE_ROUTE_PATH.languageSwitch,
    },
    {
        title: '合约 Loading',
        path: SHOWCASE_ROUTE_PATH.contractLoading,
    },
]

export function ComponentsPage() {
    const { pushRoute } = useAppNavigate()

    function handleComponentClick(path: ShowcaseRoutePath) {
        pushRoute(path)
    }

    return (
        <div>
            <SecondaryHeader title='组件'></SecondaryHeader>
            <div className="container">

                {COMPONENT_SHOWCASE_LIST.map((item, index) => (
                    <div
                        key={item.path}
                        className={index > 0 ? 'app-card flex-between mt-30' : 'app-card flex-between'}
                        onClick={() => handleComponentClick(item.path)}
                    >
                        <div className='size-28'>{item.title}</div>
                        <Icon name="arrow" className="size-30" />
                    </div>
                ))}

            </div>
        </div>
        
    )
}
