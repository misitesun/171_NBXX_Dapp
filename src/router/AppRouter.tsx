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

import { HomePage, MainLayout } from '@/pages/main'
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
            <RouteScrollReset />
            <Routes>
                <Route path={ROUTE_PATH.root} element={<Navigate to={ROUTE_PATH.home} replace />} />
                <Route element={<MainLayout />}>
                    <Route path={ROUTE_PATH.home.slice(1)} element={<HomePage />} />
                </Route>

                {SHOWCASE_ROUTE_ELEMENTS}

                <Route path="*" element={<Navigate to={ROUTE_PATH.home} replace />} />
            </Routes>
        </AppBrowserRouter>
    )
}
