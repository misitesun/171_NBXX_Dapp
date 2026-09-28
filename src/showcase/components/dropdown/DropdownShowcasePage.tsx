import { useState } from 'react'

import {
    Dropdown,
    type DropdownOption,
} from '@/components/Dropdown'
import { Icon } from '@/components/Icon'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './DropdownShowcasePage.scss'

const ACTION_OPTIONS: readonly DropdownOption[] = [
    {
        value: 'prompt',
        label: 'Copy prompt',
        icon: <Icon name="scan" className="size-30" />,
    },
    {
        value: 'code',
        label: 'Copy configured code',
        icon: <Icon name="refresh" className="size-30" />,
    },
    {
        value: 'source',
        label: 'Copy component source',
        icon: <Icon name="arrow" className="size-30" />,
    },
]

const LANGUAGE_OPTIONS: readonly DropdownOption[] = [
    { value: 'zh-Hans', label: '简体中文' },
    { value: 'zh-Hant', label: '繁體中文' },
    { value: 'th', label: 'ภาษาไทย' },
]

const LONG_LABEL = '这是一个用于验证超出屏幕宽度后会自动显示省略号的超长下拉选项文案'

const LONG_LABEL_OPTIONS: readonly DropdownOption[] = [
    { value: 'long', label: LONG_LABEL },
    { value: 'short', label: '短文案' },
]

export function DropdownShowcasePage() {
    const [actionValue, setActionValue] = useState('prompt')
    const [languageValue, setLanguageValue] = useState('zh-Hans')
    const [longLabelValue, setLongLabelValue] = useState('long')

    return (
        <div className="dropdown-showcase" data-page="dropdown-showcase">
            <SecondaryHeader title="下拉框" />

            <main className="container">
                <section className="app-card">
                    <div className="size-32 bold-6">左对齐、图标与箭头</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        对应操作菜单场景；触发文案固定，选项带图标。
                    </div>
                    <div className="mt-30">
                        <Dropdown
                            options={ACTION_OPTIONS}
                            value={actionValue}
                            triggerLabel="Copy for AI"
                            contentAlign="left"
                            showArrow
                            onChange={(value) => setActionValue(String(value))}
                        />
                    </div>
                    <div className="size-22 mt-20 opc-5">
                        当前操作：{actionValue}
                    </div>
                </section>

                <section className="app-card mt-30">
                    <div className="size-32 bold-6">居中、无图标</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        用于语言、筛选等文本选项；图标列已关闭。
                    </div>
                    <div className="flex justify-center mt-30">
                        <Dropdown
                            options={LANGUAGE_OPTIONS}
                            value={languageValue}
                            contentAlign="center"
                            showIcon={false}
                            showArrow
                            onChange={(value) => setLanguageValue(String(value))}
                        />
                    </div>
                </section>

                <section className="app-card mt-30">
                    <div className="size-32 bold-6">右对齐与超长文案</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        默认不展示箭头；超出可视区域的文案会在触发按钮和菜单中省略。
                    </div>
                    <div className="flex justify-end mt-30">
                        <Dropdown
                            options={LONG_LABEL_OPTIONS}
                            value={longLabelValue}
                            contentAlign="right"
                            showIcon={false}
                            onChange={(value) => setLongLabelValue(String(value))}
                        />
                    </div>
                </section>
            </main>
        </div>
    )
}
