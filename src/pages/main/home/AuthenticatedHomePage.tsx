import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PagePullRefresh, usePageRefresh } from '@/components/PagePullRefresh'
import { Toast, useToast } from '@/components/Toast'
import { ContractLoading } from '@/components/ContractLoading'
import { useNftPurchase } from '@/features/purchase/useNftPurchase.ts'
import { HomePage } from './HomePage.tsx'
import { buildApiHomeConfig } from './apiConfig.ts'
import { useHomeData } from './useHomeData.ts'

function HomeDataContent() {
    const { t } = useTranslation()
    const { message, variant, showToast } = useToast()
    const report = useCallback(() => showToast(t('home.dataFailed'), 'error'), [showToast, t])
    const data = useHomeData(report)
    const { reload } = data
    const purchase = useNftPurchase(reload, showToast)
    const { reloadPrices } = purchase
    const refreshPurchaseStatus = purchase.reloadPurchaseStatus
    const refresh = useCallback(async () => { await Promise.all([reload(), reloadPrices(), refreshPurchaseStatus()]) }, [reload, reloadPrices, refreshPurchaseStatus])
    usePageRefresh(refresh, !data.loadingMore && !purchase.purchasing)
    const config = buildApiHomeConfig(data.user, data.members, window.location.origin)
    return <>
        <HomePage
            config={{ ...config, tiers: config.tiers.map(tier => ({ ...tier, price: purchase.prices?.[tier.id] ?? '—' })) }}
            purchasing={purchase.purchasing}
            purchaseUnavailable={!purchase.prices || purchase.purchaseStatusLoading || purchase.purchaseStatusFailed || purchase.hasPurchased !== false}
            alreadyPurchased={purchase.hasPurchased === true}
            purchaseStatusFailed={purchase.purchaseStatusFailed}
            pricesFailed={purchase.pricesFailed}
            onPurchase={tier => { void purchase.purchase(tier.id) }}
            teamLoading={data.loading}
            teamFailed={data.teamFailed}
            profileFailed={data.profileFailed}
            loadingMore={data.loadingMore}
            hasMore={data.hasMore}
            onLoadMore={data.loadMore}
            onRetry={() => { void refresh() }}
        />
        <ContractLoading show={purchase.purchasing} tone="green" />
        <Toast message={message} variant={variant} />
    </>
}

export function AuthenticatedHomePage() {
    return <PagePullRefresh><HomeDataContent /></PagePullRefresh>
}
