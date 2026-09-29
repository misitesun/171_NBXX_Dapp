import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/Icon'
import { APP_CONFIG } from '@/config'
import { loginWithWallet } from '@/features/auth/session.ts'
import { getDappUserRejectionMessage } from '@/services/dapp'
import { wasHttpErrorReported } from '@/services/http'
import { resolveReferralCode, setReferralCode } from '@/services/storage/referral.ts'
import { useAuthStore } from '@/stores/auth/store.ts'
import { ROUTE_PATH } from '@/router/routes.ts'
import Galaxy from './Galaxy.tsx'
import './LoginPage.scss'

export function LoginPage() {
    const { t } = useTranslation()
    const location = useLocation()
    const { ref: pathRef } = useParams<{ ref?: string }>()
    const referral = useMemo(() => resolveReferralCode(pathRef, location.search), [pathRef, location.search])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [failed, setFailed] = useState(false)
    const status = useAuthStore(state => state.status)
    const busy = useRef(false)
    const started = useRef(false)

    useEffect(() => {
        if (referral) setReferralCode(referral)
    }, [referral])

    const authorize = useCallback(async () => {
        if (busy.current || useAuthStore.getState().status !== 'signedOut') return
        busy.current = true
        setSubmitting(true); setError(''); setFailed(false)
        try {
            await loginWithWallet(referral)
        } catch (cause) {
            setFailed(true)
            if (!wasHttpErrorReported(cause)) {
                const rejected = getDappUserRejectionMessage(cause)
                setError(rejected !== undefined ? 'auth.cancelled' : cause instanceof Error && cause.message.startsWith('auth.') ? cause.message : 'auth.failed')
            }
        } finally { busy.current = false; setSubmitting(false) }
    }, [referral])

    useEffect(() => {
        if (status !== 'signedOut' || started.current) return
        // HU splash allows one second for its opening animation before wallet authorization.
        const timer = window.setTimeout(() => {
            started.current = true
            void authorize()
        }, 1000)
        return () => window.clearTimeout(timer)
    }, [status, authorize])

    if (status === 'signedIn') return <Navigate to={ROUTE_PATH.home} replace />

    const loading = status === 'checking' || submitting || !failed
    const statusMessage = error ? t(error) : failed ? t('auth.failed') : t('auth.welcome', { name: APP_CONFIG.name })

    return <main className="authorization-page" data-page="login">
        <div className="authorization-page__galaxy" aria-hidden="true"><Galaxy /></div>
        <div className="authorization-page__content animate__animated animate__zoomIn">
            <img className="authorization-page__logo" src={`${APP_CONFIG.routeBase}${APP_CONFIG.brandWordmarkPath}`} alt={APP_CONFIG.name} />
        </div>
        <p className="authorization-page__tips size-20 tc animate__animated animate__slideInUp" role="status">
            <span>{statusMessage}</span>
            {loading ? <Icon name="loading" size={15} ariaLabel={t(status === 'checking' ? 'auth.checking' : 'auth.signing')} /> : null}
        </p>
    </main>
}
