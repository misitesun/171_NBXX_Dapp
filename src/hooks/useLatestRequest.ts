import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'

export type LatestRequestGuard = () => boolean

export interface LatestRequestControls {
    createLatestRequestGuard: () => LatestRequestGuard
    invalidateLatestRequest: () => void
}

export function useLatestRequest(): LatestRequestControls {
    const latestRequestIdRef = useRef(0)

    const createLatestRequestGuard = useCallback(() => {
        const requestId = latestRequestIdRef.current + 1
        latestRequestIdRef.current = requestId

        return () => requestId === latestRequestIdRef.current
    }, [])

    const invalidateLatestRequest = useCallback(() => {
        latestRequestIdRef.current += 1
    }, [])

    useEffect(() => invalidateLatestRequest, [invalidateLatestRequest])

    return useMemo(() => ({
        createLatestRequestGuard,
        invalidateLatestRequest,
    }), [createLatestRequestGuard, invalidateLatestRequest])
}
