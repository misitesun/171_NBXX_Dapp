import {
    useEffect,
    useRef,
    useState,
} from 'react'

import { ContractLoading } from '@/components/ContractLoading'
import { SecondaryHeader } from '@/components/SecondaryHeader'

import './ContractLoadingShowcasePage.scss'

export function ContractLoadingShowcasePage() {
    const [showLoading, setShowLoading] = useState(false)
    const closeTimerRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        return () => {
            if (closeTimerRef.current === undefined) return

            window.clearTimeout(closeTimerRef.current)
        }
    }, [])

    function handleOpenLoading() {
        if (closeTimerRef.current !== undefined) {
            window.clearTimeout(closeTimerRef.current)
        }

        setShowLoading(true)
        closeTimerRef.current = window.setTimeout(() => {
            setShowLoading(false)
            closeTimerRef.current = undefined
        }, 10000)
    }

    return (
        <div className="contract-loading-showcase" data-page="contract-loading-showcase">
            <SecondaryHeader title="合约 Loading" />

            <main className="container">
                <div className="app-card">
                    <div className="size-32 bold-6">ContractLoading 演示</div>
                    <div className="size-24 mt-20 opc-6 lh-36">
                        用于写合约等待期间全屏阻塞操作。演示中会在 2 秒后自动关闭。
                    </div>

                    <button
                        type="button"
                        className="full-btn mt-30"
                        onClick={handleOpenLoading}
                    >
                        打开合约 Loading
                    </button>
                </div>
            </main>

            <ContractLoading show={showLoading} />
        </div>
    )
}
