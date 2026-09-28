import { useState } from 'react'

import { Popup, type PopupPosition } from '@/components/Popup'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './PopupShowcasePage.scss'

interface PopupDemo {
    title: string
    position: PopupPosition
    desc: string
    contentPreset: boolean
}

const POPUP_DEMO_LIST: PopupDemo[] = [
    {
        title: '居中弹窗',
        position: 'center',
        desc: '页面居中弹出，适合确认弹窗、提示弹窗。',
        contentPreset: true,
    },
    {
        title: '右侧弹窗',
        position: 'right',
        desc: '从右侧滑出，适合侧边栏、菜单。',
        contentPreset: false,
    },
    {
        title: '左侧弹窗',
        position: 'left',
        desc: '从左侧滑出，适合左侧导航。',
        contentPreset: false,
    },
    {
        title: '底部弹窗',
        position: 'bottom',
        desc: '从底部弹出，适合选择器、操作面板。',
        contentPreset: true,
    },
]

export function PopupShowcasePage() {
    const [show, setShow] = useState(false)
    const [activeDemo, setActiveDemo] = useState(POPUP_DEMO_LIST[0])
    const isSidePopup = activeDemo.position === 'left' || activeDemo.position === 'right'

    function handleOpen(demo: PopupDemo) {
        setActiveDemo(demo)
        setShow(true)
    }

    function handleClose() {
        setShow(false)
    }

    return (
        <div className="popup-showcase" data-page="popup-showcase">
            <SecondaryHeader title="弹窗" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">弹窗演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        点击下面按钮查看不同方向的弹窗效果。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        {POPUP_DEMO_LIST.map((demo) => (
                            <button
                                key={demo.position}
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

            <Popup
                show={show}
                position={activeDemo.position}
                title={activeDemo.title}
                contentPreset={activeDemo.contentPreset}
                contentClassName={isSidePopup ? 'full-view' : ''}
                onClose={handleClose}
            >
                {activeDemo.contentPreset ? (
                    <div className="popup-showcase-preset-body">
                        <div className="size-24 mt-30 opc-6 lh-36">
                            {activeDemo.desc}
                        </div>
                        <button
                            type="button"
                            className="full-btn mt-40"
                            onClick={handleClose}
                        >
                            关闭
                        </button>
                    </div>
                ) : (
                    <div className={`app-card popup-showcase-drawer popup-showcase-drawer--${activeDemo.position} flex flex-column`}>
                        <div className="size-30 bold-6">{activeDemo.title}</div>
                        <div className="size-24 mt-20 opc-6 lh-36">
                            {activeDemo.desc}
                        </div>
                        <button
                            type="button"
                            className="popup-showcase-close full-btn"
                            onClick={handleClose}
                        >
                            关闭
                        </button>
                    </div>
                )}
            </Popup>
        </div>
    )
}
