import { SecondaryHeader } from '@/components/SecondaryHeader'

import '../StyleShowcase.scss'

const NUMBER_CLASS_SAMPLE_LIST = [50, 100, 150, 200]

export function TextStylesPage() {
    return (
        <div data-page="text-styles-showcase">
            <SecondaryHeader title="文字样式" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">字号 / 行高</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        size-* 和 lh-* 是 1 到 200 的循环类，这里只展示 50、100、150、200。
                    </div>

                    <div className="mt-30 word-nowrap">
                        {NUMBER_CLASS_SAMPLE_LIST.map((value) => (
                            <div
                                key={value}
                                className={`style-showcase-demo-text-sample mt-20 inline-flex flex-center size-${value} lh-${value} mr-20`}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">透明度 / 字重</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        opc-* 控制透明度，bold-* 控制字重，适合弱化说明文字或突出金额。
                    </div>

                    <div className="grid grid-2 row-gap-20 column-gap-20 mt-30">
                        <div className="app-row-card tc size-26 opc-5">opc-5</div>
                        <div className="app-row-card tc size-26 opc-8">opc-8</div>
                        <div className="app-row-card tc size-26 bold-4">bold-4</div>
                        <div className="app-row-card tc size-26 bold-8">bold-8</div>
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-32 bold-6">省略 / 换行</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        地址、hash、标题等长文本可以直接使用 word-ellipsis-*。
                    </div>

                    <div className="app-row-card mt-30 size-24 word-ellipsis-1">
                        word-ellipsis-1：0xF1B7b70C63Aa2B9E6f62546F8B2C4eCC6aF82199
                    </div>
                    <div className="app-row-card mt-20">
                        <div className="size-24 lh-34 word-ellipsis-2">
                            word-ellipsis-2：这是一段较长的说明文字，用来模拟活动规则、DApp 提示语、
                            资产说明等常见的移动端多行省略场景。
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
