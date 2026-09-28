import { SecondaryHeader } from '@/components/SecondaryHeader'

import '../StyleShowcase.scss'

const NUMBER_CLASS_SAMPLE_LIST = [50, 100, 150, 200]

export function SpacingStylesPage() {
    return (
        <div data-page="spacing-styles-showcase">
            <SecondaryHeader title="间距样式" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">间隔占位</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        gap-* 可作为垂直占位元素使用，这里只展示 50、100、150、200。
                    </div>

                    {NUMBER_CLASS_SAMPLE_LIST.map((value) => (
                        <div key={value} className="mt-30">
                            <div className="size-24 opc-6">gap-{value}</div>
                            <div className={`gap-${value} style-showcase-demo-gap mt-20`} />
                        </div>
                    ))}
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">Margin</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        ml / mt / mr / mb 覆盖 1 到 200 的常用数字类。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        {NUMBER_CLASS_SAMPLE_LIST.map((value) => (
                            <div key={value} className="style-showcase-demo-frame">
                                <div className={`style-showcase-demo-block flex-center size-22 mt-${value}`}>
                                    mt-{value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">Padding</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        pl / pt / pr / pb 用于页面块内部留白，按设计稿 px 直接写。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        {NUMBER_CLASS_SAMPLE_LIST.map((value) => (
                            <div key={value} className={`style-showcase-demo-frame pt-${value}`}>
                                <div className="style-showcase-demo-block flex-center size-22">
                                    pt-{value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
