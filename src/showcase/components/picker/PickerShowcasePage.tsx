import { useState } from 'react'

import {
    Picker,
    type PickerConfirmPayload,
    type PickerOption,
} from '@/components/Picker'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './PickerShowcasePage.scss'

type PickerDemoKey = 'basic' | 'custom' | 'empty'

interface PickerDemo {
    key: PickerDemoKey
    title: string
    desc: string
}

const BASIC_OPTION_LIST: PickerOption[] = [
    { label: '中文', value: 'zh-Hans' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
]

const TOKEN_OPTION_LIST: PickerOption[] = [
    { label: 'USDC', value: 'USDC', name: 'USD Coin', color: '#2775CA' },
    { label: 'BNB', value: 'BNB', name: 'BNB Smart Chain', color: '#F3BA2F' },
    { label: 'ETH', value: 'ETH', name: 'Ethereum', color: '#627EEA' },
]

const PICKER_DEMO_LIST: PickerDemo[] = [
    {
        key: 'basic',
        title: '基础选择器',
        desc: '最常用的单列选择，适合语言、地区、类型等简单数据。',
    },
    {
        key: 'custom',
        title: '自定义选项',
        desc: '通过 renderOption 自定义选项内容，适合资产图标、多行文案。',
    },
    {
        key: 'empty',
        title: '空数据',
        desc: '当列表为空时展示通用 Empty 占位，不需要页面单独处理。',
    },
]

function getOptionText(option?: PickerOption) {
    if (!option) {
        return '未选择'
    }

    if (typeof option.label === 'string' || typeof option.label === 'number') {
        return String(option.label)
    }

    return String(option.value ?? '未选择')
}

export function PickerShowcasePage() {
    const [show, setShow] = useState(false)
    const [activeDemo, setActiveDemo] = useState(PICKER_DEMO_LIST[0])
    const [basicIndex, setBasicIndex] = useState(0)
    const [tokenIndex, setTokenIndex] = useState(0)

    const isBasicDemo = activeDemo.key === 'basic'
    const isCustomDemo = activeDemo.key === 'custom'
    const activeOptions = isCustomDemo
        ? TOKEN_OPTION_LIST
        : isBasicDemo
            ? BASIC_OPTION_LIST
            : []
    const activeIndex = isCustomDemo ? tokenIndex : basicIndex
    const selectedBasicText = getOptionText(BASIC_OPTION_LIST[basicIndex])
    const selectedTokenText = getOptionText(TOKEN_OPTION_LIST[tokenIndex])

    function handleOpen(demo: PickerDemo) {
        setActiveDemo(demo)
        setShow(true)
    }

    function handleClose() {
        setShow(false)
    }

    function handleConfirm({ index }: PickerConfirmPayload) {
        if (activeDemo.key === 'basic') {
            setBasicIndex(index)
            return
        }

        if (activeDemo.key === 'custom') {
            setTokenIndex(index)
        }
    }

    function renderTokenOption(option: PickerOption, index: number, isActive: boolean) {
        return (
            <div className="picker-showcase-option flex-center gap-16">
                <div
                    className="picker-showcase-token-icon img-44 flex-center black size-22 bold"
                    style={{ backgroundColor: String(option.color ?? 'var(--app-color)') }}
                >
                    {String(option.value ?? '').slice(0, 1)}
                </div>
                <div className="picker-showcase-option-name tl">
                    <div className="size-26 bold-6">{option.label}</div>
                    <div className={isActive ? 'size-20 opc-7' : 'size-20 opc-5'}>
                        {String(option.name ?? `第 ${index + 1} 项`)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="picker-showcase" data-page="picker-showcase">
            <SecondaryHeader title="选择器" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">Picker 演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        点击下面按钮查看基础选择、自定义选项和空数据状态。
                    </div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        当前语言：{selectedBasicText}；当前资产：{selectedTokenText}
                    </div>

                    <div className="grid grid-1 row-gap-20 mt-30">
                        {PICKER_DEMO_LIST.map((demo) => (
                            <button
                                key={demo.key}
                                type="button"
                                className="full-btn"
                                onClick={() => handleOpen(demo)}
                            >
                                {demo.title}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <Picker
                show={show}
                title={activeDemo.title}
                options={activeOptions}
                value={activeIndex}
                emptyText="暂无可选择数据"
                onClose={handleClose}
                onConfirm={handleConfirm}
                renderOption={isCustomDemo ? renderTokenOption : undefined}
            />
        </div>
    )
}
