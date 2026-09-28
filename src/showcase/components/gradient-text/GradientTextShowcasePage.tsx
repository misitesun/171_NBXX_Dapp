import GradientText from '@/components/GradientText'
import { SecondaryHeader } from '@/components/SecondaryHeader'

export function GradientTextShowcasePage() {
    return <div>
        <SecondaryHeader title="渐变文案" />
        <div className="container flex flex-column row-gap-30">
            <section className="app-card">
                <p className="size-24 mb-20">水平渐变 · 3 秒 · 往返</p>
                <GradientText animationSpeed={3} className="size-40 bold-6" data-testid="gradient-default">Add a splash of color!</GradientText>
            </section>
            <section className="app-card">
                <p className="size-24 mb-20">渐变边框 · 悬停暂停</p>
                <GradientText animationSpeed={3} showBorder pauseOnHover className="size-40" data-testid="gradient-border">DApp Template</GradientText>
            </section>
            <section className="app-card">
                <p className="size-24 mb-20">纵向渐变</p>
                <GradientText direction="vertical" animationSpeed={3} className="size-40" data-testid="gradient-vertical">连接数字世界</GradientText>
            </section>
            <section className="app-card">
                <p className="size-24 mb-20">斜向渐变 · 单向循环</p>
                <GradientText direction="diagonal" yoyo={false} animationSpeed={3} className="size-40" data-testid="gradient-diagonal">Explore new possibilities.</GradientText>
            </section>
        </div>
    </div>
}
