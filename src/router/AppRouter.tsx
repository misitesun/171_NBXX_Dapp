import {
    useEffect,
    useLayoutEffect,
} from 'react'
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router'

import { MainLayout } from '@/pages/main'
import { AuthenticatedHomePage } from '@/pages/main/home/AuthenticatedHomePage.tsx'
import { LoginPage } from '@/pages/auth/login/LoginPage.tsx'
import { mountAuthSession } from '@/features/auth/session.ts'
import { useAuthStore } from '@/stores/auth/store.ts'
import { SHOWCASE_ROUTE_ELEMENTS } from '@/showcase/router/index.ts'

import { AppBrowserRouter } from './AppBrowserRouter.tsx'
import { registerAppRouteReplacer } from './bridge.ts'
import { ROUTE_PATH } from './routes.ts'

function RouterNavigationBridge() {
    const navigate = useNavigate()

    useEffect(() => registerAppRouteReplacer((path) => {
        void navigate(path, { replace: true })
    }), [navigate])

    return null
}

function AuthSession() {
    useEffect(() => mountAuthSession(), [])
    return null
}

function RequireAuthentication() {
    const status = useAuthStore(state => state.status)
    const location = useLocation()
    if (status !== 'signedIn') return <Navigate to={`${ROUTE_PATH.login}${location.search}`} replace />
    return <MainLayout />
}

function RootRedirect() {
    const { search } = useLocation()
    return <Navigate to={`${ROUTE_PATH.home}${search}`} replace />
}

function RouteScrollReset() {
    const { pathname } = useLocation()

    useEffect(() => {
        if (!('scrollRestoration' in window.history)) return

        const previousScrollRestoration = window.history.scrollRestoration

        window.history.scrollRestoration = 'manual'

        return () => {
            window.history.scrollRestoration = previousScrollRestoration
        }
    }, [])

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

export function AppRouter() {
    return (
        <AppBrowserRouter>
            <RouterNavigationBridge />
            <AuthSession />
            <RouteScrollReset />
            <Routes>
                <Route path={ROUTE_PATH.root} element={<RootRedirect />} />
                <Route path={ROUTE_PATH.login} element={<LoginPage />} />
                <Route element={<RequireAuthentication />}>
                    <Route path={ROUTE_PATH.home.slice(1)} element={<AuthenticatedHomePage />} />
                </Route>

                {SHOWCASE_ROUTE_ELEMENTS}
                <Route path={ROUTE_PATH.referral} element={<LoginPage />} />

                <Route path="*" element={<Navigate to={ROUTE_PATH.home} replace />} />
            </Routes>
        </AppBrowserRouter>
    )
}
