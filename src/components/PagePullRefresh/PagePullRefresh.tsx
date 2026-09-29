import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type TouchEvent,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@/components/Icon'
import { DropletLoading } from '@/components/DropletLoading'

import {
    PageRefreshContext,
    type PageLoadMoreRegistration,
    type PageRefreshHandler,
} from './context.ts'

import './PagePullRefresh.scss'

export interface PagePullRefreshProps {
    children: ReactNode
    enabled?: boolean
    className?: string
    bottomInset?: 'none' | 'tabbar'
    onError?: (error: unknown) => void
}

type PagePullRefreshStatus =
    | 'idle'
    | 'pulling'
    | 'ready'
    | 'refreshing'
    | 'settling'

const PULL_REFRESH_TRIGGER_DISTANCE = 72
const PULL_REFRESH_OPACITY_DISTANCE = PULL_REFRESH_TRIGGER_DISTANCE / 2
const PULL_REFRESH_READY_DISTANCE = 72
const PULL_REFRESH_MAX_DISTANCE = 144
const PULL_REFRESH_MIN_LOADING_MS = 450
const PULL_REFRESH_SETTLE_MS = 180
const PULL_REFRESH_DAMPING = 0.75
const LOAD_MORE_ROOT_MARGIN = '0px 0px 160px 0px'
const LOAD_MORE_SCROLL_OFFSET = 160

function isPageAtTop(): boolean {
    const scrollTop = document.scrollingElement?.scrollTop ?? 0

    return window.scrollY <= 0 && scrollTop <= 0
}

function isFormControl(element: Element | null): element is HTMLElement {
    if (!(element instanceof HTMLElement)) return false

    const tagName = element.tagName.toLowerCase()

    return tagName === 'input'
        || tagName === 'textarea'
        || tagName === 'select'
        || element.isContentEditable
}

function isFocusedFormControlTarget(target: EventTarget | null): boolean {
    const activeElement = document.activeElement

    if (!activeElement || !isFormControl(activeElement)) return false
    if (!(target instanceof Node)) return false

    return activeElement === target || activeElement.contains(target)
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
    })
}

export function PagePullRefresh(props: PagePullRefreshProps) {
    const { t } = useTranslation()
    const {
        children,
        enabled = true,
        className,
        bottomInset = 'none',
        onError,
    } = props
    const [status, setStatus] = useState<PagePullRefreshStatus>('idle')
    const [loadMoreRegistration, setLoadMoreRegistration] = useState<PageLoadMoreRegistration | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const indicatorRef = useRef<HTMLDivElement | null>(null)
    const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null)
    const touchStartYRef = useRef<number | undefined>(undefined)
    const pullDistanceRef = useRef(0)
    const refreshHandlerRef = useRef<PageRefreshHandler | undefined>(undefined)
    const settleTimerRef = useRef<number | undefined>(undefined)
    const isTrackingRef = useRef(false)
    const isRefreshingRef = useRef(false)
    const isLoadingMoreRef = useRef(false)

    const clearSettleTimer = useCallback(() => {
        if (settleTimerRef.current === undefined) return

        window.clearTimeout(settleTimerRef.current)
        settleTimerRef.current = undefined
    }, [])

    const resetPullTracking = useCallback(() => {
        isTrackingRef.current = false
        touchStartYRef.current = undefined
        pullDistanceRef.current = 0
    }, [])

    const updateIndicator = useCallback((
        distance: number,
        opacity: number,
        rotation: number,
    ) => {
        const indicator = indicatorRef.current

        if (!indicator) return

        indicator.style.setProperty('--page-pull-refresh-distance', `${distance}px`)
        indicator.style.setProperty('--page-pull-refresh-opacity', String(opacity))
        indicator.style.setProperty('--page-pull-refresh-rotation', `${rotation}deg`)
    }, [])

    const settleIndicator = useCallback(() => {
        resetPullTracking()
        setStatus('settling')
        updateIndicator(0, 0, 0)
        clearSettleTimer()

        settleTimerRef.current = window.setTimeout(() => {
            setStatus('idle')
            settleTimerRef.current = undefined
        }, PULL_REFRESH_SETTLE_MS)
    }, [clearSettleTimer, resetPullTracking, updateIndicator])

    const runPageRefresh = useCallback(async () => {
        const refreshHandler = refreshHandlerRef.current

        if (!refreshHandler || isRefreshingRef.current) {
            settleIndicator()
            return
        }

        isRefreshingRef.current = true
        setStatus('refreshing')
        updateIndicator(PULL_REFRESH_READY_DISTANCE, 1, 360)

        const startTime = Date.now()

        try {
            await refreshHandler()
        } catch (error) {
            onError?.(error)
        } finally {
            const elapsed = Date.now() - startTime
            const remainingDelay = Math.max(PULL_REFRESH_MIN_LOADING_MS - elapsed, 0)

            if (remainingDelay > 0) {
                await sleep(remainingDelay)
            }

            isRefreshingRef.current = false
            settleIndicator()
        }
    }, [onError, settleIndicator, updateIndicator])

    const registerPageRefresh = useCallback((handler: PageRefreshHandler) => {
        refreshHandlerRef.current = handler

        return () => {
            if (refreshHandlerRef.current === handler) {
                refreshHandlerRef.current = undefined
            }
        }
    }, [])

    const registerPageLoadMore = useCallback((
        handler: PageLoadMoreRegistration['handler'],
        options: Omit<PageLoadMoreRegistration, 'handler'>,
    ) => {
        const registration = { handler, ...options }
        setLoadMoreRegistration(registration)

        return () => {
            setLoadMoreRegistration((current) => current?.handler === handler ? null : current)
        }
    }, [])

    const contextValue = useMemo(() => ({
        registerPageRefresh,
        registerPageLoadMore,
    }), [registerPageLoadMore, registerPageRefresh])

    const runPageLoadMore = useCallback(async () => {
        if (!loadMoreRegistration?.enabled || !loadMoreRegistration.hasMore) return
        if (isLoadingMoreRef.current || isRefreshingRef.current) return

        isLoadingMoreRef.current = true
        setIsLoadingMore(true)

        try {
            await loadMoreRegistration.handler()
        } catch (error) {
            onError?.(error)
        } finally {
            isLoadingMoreRef.current = false
            setIsLoadingMore(false)
        }
    }, [loadMoreRegistration, onError])

    const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
        if (!enabled || refreshHandlerRef.current === undefined || isRefreshingRef.current || isLoadingMoreRef.current) return
        if (!isPageAtTop()) return
        if (isFocusedFormControlTarget(event.target)) return

        const firstTouch = event.touches[0]

        if (!firstTouch) return

        clearSettleTimer()
        updateIndicator(0, 0, 0)
        touchStartYRef.current = firstTouch.clientY
        pullDistanceRef.current = 0
        isTrackingRef.current = true
    }, [clearSettleTimer, enabled, updateIndicator])

    const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
        if (!isTrackingRef.current || touchStartYRef.current === undefined) return

        const firstTouch = event.touches[0]

        if (!firstTouch) {
            settleIndicator()
            return
        }

        const pullDelta = firstTouch.clientY - touchStartYRef.current

        if (pullDelta <= 0) {
            settleIndicator()
            return
        }

        if (!isPageAtTop()) {
            settleIndicator()
            return
        }

        const pullDistance = Math.min(pullDelta * PULL_REFRESH_DAMPING, PULL_REFRESH_MAX_DISTANCE)
        const opacityProgress = Math.min(pullDistance / PULL_REFRESH_OPACITY_DISTANCE, 1)
        const rotationProgress = Math.min(pullDistance / PULL_REFRESH_TRIGGER_DISTANCE, 1)
        const nextStatus: PagePullRefreshStatus = pullDistance >= PULL_REFRESH_TRIGGER_DISTANCE
            ? 'ready'
            : 'pulling'

        pullDistanceRef.current = pullDistance
        setStatus(nextStatus)
        updateIndicator(
            pullDistance,
            opacityProgress,
            rotationProgress * 270,
        )
    }, [settleIndicator, updateIndicator])

    const handleTouchEnd = useCallback(() => {
        if (!isTrackingRef.current) return

        isTrackingRef.current = false
        touchStartYRef.current = undefined

        if (pullDistanceRef.current >= PULL_REFRESH_TRIGGER_DISTANCE) {
            void runPageRefresh()
            return
        }

        settleIndicator()
    }, [runPageRefresh, settleIndicator])

    const handleTouchCancel = useCallback(() => {
        settleIndicator()
    }, [settleIndicator])

    useEffect(() => {
        function handleWindowBlur() {
            if (!isTrackingRef.current && !isRefreshingRef.current && pullDistanceRef.current <= 0) return

            settleIndicator()
        }

        function handleVisibilityChange() {
            if (document.visibilityState !== 'hidden') return
            if (!isTrackingRef.current && !isRefreshingRef.current && pullDistanceRef.current <= 0) return

            settleIndicator()
        }

        window.addEventListener('blur', handleWindowBlur)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('blur', handleWindowBlur)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [settleIndicator])

    useEffect(() => () => {
        clearSettleTimer()
    }, [clearSettleTimer])

    useEffect(() => {
        const sentinel = loadMoreSentinelRef.current

        if (!sentinel || !loadMoreRegistration?.enabled || !loadMoreRegistration.hasMore) return undefined

        const IntersectionObserverConstructor = window.IntersectionObserver

        if (typeof IntersectionObserverConstructor === 'function') {
            let isSentinelNearViewport = false
            let hasUserScrolled = false
            const handleObservedScroll = () => {
                hasUserScrolled = true

                if (hasUserScrolled && isSentinelNearViewport) {
                    void runPageLoadMore()
                }
            }
            const observer = new IntersectionObserverConstructor((entries) => {
                isSentinelNearViewport = entries.some((entry) => entry.isIntersecting)

                if (hasUserScrolled && isSentinelNearViewport) {
                    void runPageLoadMore()
                }
            }, { rootMargin: LOAD_MORE_ROOT_MARGIN })

            observer.observe(sentinel)
            window.addEventListener('scroll', handleObservedScroll, { passive: true })
            return () => {
                observer.disconnect()
                window.removeEventListener('scroll', handleObservedScroll)
            }
        }

        let hasUserScrolled = false

        function isSentinelNearViewport() {
            const documentHeight = document.documentElement.scrollHeight
            const viewportBottom = window.scrollY + window.innerHeight

            return viewportBottom >= documentHeight - LOAD_MORE_SCROLL_OFFSET
        }

        function handleScroll() {
            hasUserScrolled = true

            if (isSentinelNearViewport()) {
                void runPageLoadMore()
            }
        }

        function handleResize() {
            if (hasUserScrolled && isSentinelNearViewport()) {
                void runPageLoadMore()
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [loadMoreRegistration, runPageLoadMore])

    const rootClassName = [
        'page-pull-refresh',
        `page-pull-refresh--${status}`,
        bottomInset === 'tabbar' ? 'page-pull-refresh--tabbar-inset' : null,
        className,
    ].filter(Boolean).join(' ')
    const shouldRenderLoadMore = loadMoreRegistration !== null && (
        isLoadingMore
        || loadMoreRegistration.hasMore
        || loadMoreRegistration.showNoMore
    )

    return (
        <PageRefreshContext.Provider value={contextValue}>
            <div
                className={rootClassName}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
            >
                <div ref={indicatorRef} className="page-pull-refresh__indicator" aria-hidden>
                    <div className="page-pull-refresh__icon-wrap flex-center">
                        <div className="page-pull-refresh__rotation flex-center size-62">
                            <div className="page-pull-refresh__spin flex-center size-62">
                                <Icon name="refresh" className="page-pull-refresh__icon size-62" />
                            </div>
                        </div>
                    </div>
                </div>

                {children}

                {shouldRenderLoadMore && loadMoreRegistration ? (
                    <div
                        ref={loadMoreSentinelRef}
                        className="page-pull-refresh__load-more flex-center size-24"
                        role="status"
                        aria-live="polite"
                    >
                        {isLoadingMore ? (
                            loadMoreRegistration.loadingIndicator === 'droplet' ? (
                                <DropletLoading
                                    size="small"
                                    ariaLabel={t('正在加载更多')}
                                />
                            ) : (
                                <><Icon name="refresh" className="page-pull-refresh__load-more-icon" />{t('加载中...')}</>
                            )
                        ) : loadMoreRegistration.hasMore ? (
                            <span aria-hidden="true" />
                        ) : t('没有更多了')}
                    </div>
                ) : null}
            </div>
        </PageRefreshContext.Provider>
    )
}
