import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DAPP_ERROR_MESSAGE, getConnectedDappAddress, getDappUserRejectionMessage, waitForDappContractDataSync } from '@/services/dapp'
import { useDappStore } from '@/stores/dapp'
import { getAuthRequestSignal } from '@/features/auth/session.ts'
import { getHasPurchased, getPurchasePrices, purchaseNft, type PurchasePrices, type PurchaseTier } from './index.ts'

type Feedback = (message: string, variant?: 'default' | 'error' | 'success') => void

export function useNftPurchase(reload: () => Promise<void>, showToast: Feedback) {
    const { t } = useTranslation()
    const [prices, setPrices] = useState<PurchasePrices | null>(null)
    const [pricesFailed, setPricesFailed] = useState(false)
    const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
    const [purchaseStatusFailed, setPurchaseStatusFailed] = useState(false)
    const [purchaseStatusLoading, setPurchaseStatusLoading] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const walletAddress = useDappStore(state => state.walletAddress)
    const active = useRef(false)
    const mounted = useRef(false)
    const generation = useRef(0)
    const purchaseStatusGeneration = useRef(0)

    const reloadPrices = useCallback(async () => {
        const requestGeneration = ++generation.current
        const signal = getAuthRequestSignal()
        setPricesFailed(false)
        try {
            const next = await getPurchasePrices()
            if (mounted.current && !signal.aborted && generation.current === requestGeneration) setPrices(next)
        } catch {
            if (mounted.current && !signal.aborted && generation.current === requestGeneration) {
                setPrices(null)
                setPricesFailed(true)
            }
        }
    }, [])

    const reloadPurchaseStatus = useCallback(async () => {
        const requestGeneration = ++purchaseStatusGeneration.current
        const owner = walletAddress
        const signal = getAuthRequestSignal()
        const isCurrent = () => mounted.current && !signal.aborted
            && purchaseStatusGeneration.current === requestGeneration
            && owner.toLowerCase() === useDappStore.getState().walletAddress.toLowerCase()
        setPurchaseStatusLoading(true)
        setPurchaseStatusFailed(false)
        setHasPurchased(null)
        if (!owner) {
            if (mounted.current && purchaseStatusGeneration.current === requestGeneration) {
                setPurchaseStatusLoading(false)
                setPurchaseStatusFailed(true)
            }
            return
        }
        try {
            const connectedAddress = await getConnectedDappAddress()
            if (connectedAddress.toLowerCase() !== owner.toLowerCase()) throw new Error('auth.sessionChanged')
            const purchased = await getHasPurchased(connectedAddress)
            if (isCurrent()) setHasPurchased(purchased)
        } catch {
            if (isCurrent()) setPurchaseStatusFailed(true)
        } finally {
            if (isCurrent()) setPurchaseStatusLoading(false)
        }
    }, [walletAddress])

    useEffect(() => {
        mounted.current = true
        void reloadPrices()
        return () => { mounted.current = false; generation.current += 1 }
    }, [reloadPrices])

    useEffect(() => {
        void reloadPurchaseStatus()
        return () => { purchaseStatusGeneration.current += 1 }
    }, [reloadPurchaseStatus])

    const purchase = useCallback(async (tier: PurchaseTier) => {
        if (active.current) return
        active.current = true
        setPurchasing(true)
        const signal = getAuthRequestSignal()
        const isCurrent = () => mounted.current && !signal.aborted
        try {
            try {
                await purchaseNft(tier)
            } catch (error) {
                if (!isCurrent()) return
                const rejection = getDappUserRejectionMessage(error)
                if (rejection !== undefined) { showToast(t('purchase.cancelled')); return }
                const message = error instanceof Error ? error.message : ''
                if (message === 'purchase.alreadyPurchased') { showToast(t(message)); return }
                const key = message === DAPP_ERROR_MESSAGE.erc20BalanceInsufficient ? 'purchase.insufficientBalance'
                    : ['purchase.wrongNetwork', 'purchase.tokenMismatch', 'purchase.unavailable', 'auth.sessionChanged'].includes(message) ? message
                        : 'purchase.failed'
                showToast(t(key), 'error')
                return
            }
            if (!isCurrent()) return
            showToast(t('purchase.success'), 'success')
            // A confirmed buy stays successful even when indexing/read refresh fails.
            try {
                await waitForDappContractDataSync()
                if (isCurrent()) await Promise.all([reload(), reloadPrices(), reloadPurchaseStatus()])
            } catch {
                if (isCurrent()) showToast(t('home.dataFailed'), 'error')
            }
        } finally {
            active.current = false
            if (mounted.current) setPurchasing(false)
        }
    }, [reload, reloadPrices, reloadPurchaseStatus, showToast, t])

    return { prices, pricesFailed, hasPurchased, purchaseStatusFailed, purchaseStatusLoading, purchasing, purchase, reloadPrices, reloadPurchaseStatus }
}
