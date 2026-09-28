import {
    useRef,
    type ReactNode,
} from 'react'
import {
    unstable_HistoryRouter as HistoryRouter,
} from 'react-router'

import { createAppBrowserHistory } from './appBrowserHistory.ts'

type AppBrowserRouterProps = {
    children: ReactNode
}

export function AppBrowserRouter({ children }: AppBrowserRouterProps) {
    const historyRef = useRef<ReturnType<typeof createAppBrowserHistory> | null>(null)

    if (!historyRef.current) {
        historyRef.current = createAppBrowserHistory()
    }

    return (
        <HistoryRouter history={historyRef.current}>
            {children}
        </HistoryRouter>
    )
}
