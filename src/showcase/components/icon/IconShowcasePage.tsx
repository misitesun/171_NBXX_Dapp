import { Icon, ICON_DEFINITIONS, type IconName } from '@/components/Icon'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './IconShowcasePage.scss'

const ICON_NAME_LIST = Object.keys(ICON_DEFINITIONS) as IconName[]

export function IconShowcasePage() {
    return (
        <div className="icon-showcase" data-page="icon-showcase">
            <SecondaryHeader title="图标" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">Icon 演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        图标默认使用 currentColor，可直接通过 className 或 color 参数控制颜色。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        {ICON_NAME_LIST.map((name) => (
                            <div key={name} className="icon-showcase-item flex-center flex-column">
                                <Icon name={name} className="size-52 app-color" />
                                <div className="size-22 mt-12 opc-7">{name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-28 bold-6">尺寸和颜色</div>
                    <div className="flex items-center mt-30">
                        <Icon name="arrow-left" size={32} color="var(--app-color)" />
                        <Icon name="scan" size={44} color="var(--app-blue)" className="ml-30" />
                        <Icon name="loading" size={44} className="ml-30" />
                        <Icon name="cross" size={44} color="var(--app-red)" className="ml-30" />
                    </div>
                </div>
            </main>
        </div>
    )
}
