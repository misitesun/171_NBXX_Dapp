import { Icon } from '@/components/Icon'
import { SecondaryHeader } from '@/components/SecondaryHeader'
import { useAppNavigate } from '@/router'

import { SHOWCASE_ROUTE_PATH } from '../router'

interface StyleShowcaseItem {
    title: string
    desc: string
    path: string
}

const STYLE_SHOWCASE_LIST: StyleShowcaseItem[] = [
    {
        title: '布局',
        desc: 'flex、grid、滚动和视口相关的高频布局类。',
        path: SHOWCASE_ROUTE_PATH.styleLayout,
    },
    {
        title: '文字',
        desc: '字号、行高、透明度、字重和省略显示。',
        path: SHOWCASE_ROUTE_PATH.styleText,
    },
    {
        title: '间距',
        desc: 'margin、padding 和大间隔占位类。',
        path: SHOWCASE_ROUTE_PATH.styleSpacing,
    },
    {
        title: '按钮和卡片',
        desc: '项目常用按钮、卡片容器和基础主题色。',
        path: SHOWCASE_ROUTE_PATH.styleButton,
    },
]

export function StylesPage() {
    const { pushRoute } = useAppNavigate()

    function handleStyleClick(path: string) {
        pushRoute(path)
    }

    return (
        <div>
            <SecondaryHeader title="样式" />

            <main className="container">
                {STYLE_SHOWCASE_LIST.map((item, index) => (
                    <div
                        key={item.path}
                        className={index > 0 ? 'app-card mt-30' : 'app-card'}
                        onClick={() => handleStyleClick(item.path)}
                    >
                        <div className="flex-between">
                            <div className="size-28">{item.title}</div>
                            <Icon name="arrow" className="size-30" />
                        </div>
                        <div className="size-22 mt-12 opc-6 lh-32">
                            {item.desc}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    )
}
