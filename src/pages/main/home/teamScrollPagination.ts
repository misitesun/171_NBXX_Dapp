import { useEffect, useRef } from 'react'

type LoadNextPage = () => Promise<void> | void

// Page-local registration: historical scroll position never arms a new data set.
export function observeTeamScroll(root: HTMLElement, sentinel: HTMLElement, loadNextPage: LoadNextPage) {
    let armed = false
    let busy = false
    let disposed = false
    const nearBottom = () => root.scrollTop > 0
        && root.scrollHeight - root.scrollTop - root.clientHeight <= root.clientHeight * 0.15

    async function tryLoad() {
        if (disposed || !armed || busy || !nearBottom()) return
        armed = false
        busy = true
        try {
            await loadNextPage()
        } finally {
            busy = false
        }
    }

    function handleScroll() {
        if (busy || disposed) return
        armed = true
        void tryLoad()
    }

    const Observer = window.IntersectionObserver
    const observer = typeof Observer === 'function' ? new Observer(entries => {
        if (entries.some(entry => entry.isIntersecting)) void tryLoad()
    }, { root }) : undefined
    observer?.observe(sentinel)

    // The same container-distance check also works without IntersectionObserver.
    root.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
        disposed = true
        observer?.disconnect()
        root.removeEventListener('scroll', handleScroll)
    }
}

export function useTeamScrollPagination({ loading, enabled, onLoadMore }: {
    loading: boolean
    enabled: boolean
    onLoadMore?: LoadNextPage
}) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (loading && scrollRef.current) scrollRef.current.scrollTop = 0
    }, [loading])

    useEffect(() => {
        if (!enabled || !onLoadMore || !scrollRef.current || !sentinelRef.current) return undefined
        return observeTeamScroll(scrollRef.current, sentinelRef.current, onLoadMore)
    }, [enabled, onLoadMore])

    return { scrollRef, sentinelRef }
}
