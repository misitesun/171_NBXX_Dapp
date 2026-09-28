import { Icon } from '@/components/Icon'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { SecondaryHeader } from '@/components/SecondaryHeader'
import { useAppStore } from '@/stores/app/store.ts'

import './LanguageSwitchShowcasePage.scss'

export function LanguageSwitchShowcasePage() {
    const languageCode = useAppStore((state) => state.languageCode)

    return (
        <div className="language-switch-showcase" data-page="language-switch-showcase">
            <SecondaryHeader title="语言切换" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">LanguageSwitch 演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        用于打开多语言下拉菜单。默认是语言图标，也可以替换成项目自己的按钮样式。
                    </div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        当前语言：{languageCode}
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-28 bold-6">默认图标入口</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        不传展示内容时，组件会显示默认语言图标，并通过 Dropdown 展示语言列表。
                    </div>

                    <div className="flex items-center mt-30">
                        <LanguageSwitch />
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-28 bold-6">自定义按钮入口</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        传入自定义展示内容时，可以保留项目自己的按钮外观。
                    </div>

                    <LanguageSwitch>
                        <div className="full-btn mt-30">
                            <span className="size-28 bold">切换语言</span>
                            <Icon name="arrow-down" className="size-30 ml-12" />
                        </div>
                    </LanguageSwitch>
                </div>
            </main>
        </div>
    )
}
