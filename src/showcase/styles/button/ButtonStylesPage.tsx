import { SecondaryHeader } from '@/components/SecondaryHeader'

import '../StyleShowcase.scss'

export function ButtonStylesPage() {
    return (
        <div data-page="button-styles-showcase">
            <SecondaryHeader title="按钮和卡片" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">按钮</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        full-btn 用于通栏主按钮，auto-btn 用于内容自适应的小按钮。
                    </div>

                    <button type="button" className="full-btn mt-30">
                        full-btn
                    </button>

                    <button type="button" className="auto-btn mt-30">
                        auto-btn
                    </button>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">卡片</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        app-card 适合作为大区块容器，app-row-card 适合列表项、表单项和小卡片。
                    </div>

                    <div className="app-row-card mt-30 flex-between">
                        <div className="size-26">app-row-card</div>
                        <div className="size-24 opc-6">列表项</div>
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">颜色</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        常用主题色直接组合文字颜色类，按钮文字颜色由 --app-btn-color 控制。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        <div className="app-row-card tc app-color">app-color</div>
                        <div className="app-row-card tc green">green</div>
                        <div className="app-row-card tc red">red</div>
                        <div className="app-row-card tc blue">blue</div>
                    </div>
                </div>
            </main>
        </div>
    )
}
