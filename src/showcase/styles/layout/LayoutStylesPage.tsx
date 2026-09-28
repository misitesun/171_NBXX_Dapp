import { SecondaryHeader } from '@/components/SecondaryHeader'

import '../StyleShowcase.scss'

export function LayoutStylesPage() {
    return (
        <div data-page="layout-styles-showcase">
            <SecondaryHeader title="布局样式" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">Flex</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        高频页面布局直接组合 flex、flex-center、flex-between 等类。
                    </div>

                    <div className="style-showcase-demo-box flex-center mt-30">
                        <div className="style-showcase-demo-dot flex-center size-24 bold-6">
                            center
                        </div>
                    </div>

                    <div className="style-showcase-demo-box flex-between mt-30 pl-30 pr-30">
                        <div className="style-showcase-demo-dot flex-center size-24 bold-6">
                            left
                        </div>
                        <div className="style-showcase-demo-dot flex-center size-24 bold-6">
                            right
                        </div>
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">Grid</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        常见宫格用 grid + grid-2 / grid-3，再组合 row-gap 和 column-gap。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        <div className="style-showcase-demo-grid-item flex-center size-24">grid-2</div>
                        <div className="style-showcase-demo-grid-item flex-center size-24">grid-2</div>
                        <div className="style-showcase-demo-grid-item flex-center size-24">grid-2</div>
                        <div className="style-showcase-demo-grid-item flex-center size-24">grid-2</div>
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">Scroll / View</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        横向列表用 scroll-x，页面局部撑满父元素用 full-view。
                    </div>

                    <div className="scroll-x mt-30">
                        <div className="style-showcase-demo-scroll-inner flex">
                            <div className="style-showcase-demo-block flex-center size-24 flex-1 mr-20">scroll-x</div>
                            <div className="style-showcase-demo-block flex-center size-24 flex-1 mr-20">隐藏滚动条</div>
                            <div className="style-showcase-demo-block flex-center size-24 flex-1">移动端滑动</div>
                        </div>
                    </div>

                    <div className="style-showcase-demo-box mt-30">
                        <div className="full-view flex-center size-24 opc-7">
                            full-view 撑满父元素
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
