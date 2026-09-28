import { SecondaryHeader } from '@/components/SecondaryHeader'
import { Icon } from '@/components/Icon'
import { useAppNavigate } from '@/router'

import { SHOWCASE_ROUTE_PATH } from './router'

export function ShowcasePage() {
    const { pushRoute } = useAppNavigate()

    function handleComponentsClick() {
        pushRoute(SHOWCASE_ROUTE_PATH.components)
    }

    function handleStylesClick() {
        pushRoute(SHOWCASE_ROUTE_PATH.styles)
    }

    return (
        <div>
            <SecondaryHeader title='演示'></SecondaryHeader>
            <div className='container'>

                <div className='app-card flex-between' onClick={handleComponentsClick}>
                    <div className='size-28'>组件</div>
                    <Icon name="arrow" className="size-30" />
                </div>

                <div className='app-card flex-between mt-30' onClick={handleStylesClick}>
                    <div className='size-28'>样式</div>
                    <Icon name="arrow" className="size-30" />
                </div>

            </div>
        </div>

    )
}
