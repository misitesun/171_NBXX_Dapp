import { Empty } from '@/components/Empty'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './EmptyShowcasePage.scss'

export function EmptyShowcasePage() {
    return (
        <div className="empty-showcase" data-page="empty-showcase">
            <SecondaryHeader title="空数据" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">Empty 演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        用于接口列表为空、暂无记录、暂无可选项等空状态。
                    </div>

                    <div className="empty-showcase-box mt-30">
                        <Empty />
                    </div>
                </div>

                <div className="app-card mt-30">
                    <div className="size-28 bold-6">自定义文案</div>
                    <div className="empty-showcase-box mt-30">
                        <Empty text="暂无收益记录" showGap={false} />
                    </div>
                </div>
            </main>
        </div>
    )
}
