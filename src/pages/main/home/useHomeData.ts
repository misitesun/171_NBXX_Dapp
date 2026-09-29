import { useCallback, useEffect, useRef, useState } from 'react'
import { getMyInfo, getMyReferrals, REFERRAL_PAGE_SIZE, type UserInfo } from '@/features/user'
import { getAuthRequestSignal } from '@/features/auth/session.ts'
import { useAuthStore } from '@/stores/auth/store.ts'
import { wasHttpErrorReported } from '@/services/http'

export function useHomeData(onError: (error: unknown) => void) {
    const user = useAuthStore(state => state.user)
    const [members, setMembers] = useState<UserInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [profileFailed, setProfileFailed] = useState(false)
    const [teamFailed, setTeamFailed] = useState(false)
    const generation = useRef(0)
    const paging = useRef({ page: 0, busy: true, hasMore: false })

    const report = useCallback((error: unknown) => {
        if (!getAuthRequestSignal().aborted && useAuthStore.getState().status === 'signedIn' && !wasHttpErrorReported(error)) onError(error)
    }, [onError])

    const reload = useCallback(async (useCachedProfile = false) => {
        const current = ++generation.current
        // Reset cursor and synchronous gates before requesting replacement page one.
        paging.current = { page: 0, busy: true, hasMore: false }
        setMembers([]); setHasMore(false); setLoading(true); setLoadingMore(false)
        setProfileFailed(false); setTeamFailed(false)
        const active = () => generation.current === current && useAuthStore.getState().status === 'signedIn'
        const signal = getAuthRequestSignal()
        const profile = useCachedProfile && useAuthStore.getState().user ? Promise.resolve() : getMyInfo(signal).then(value => {
            if (active()) useAuthStore.setState({ user: value })
        }).catch(error => {
            if (active()) { setProfileFailed(true); report(error) }
        })
        const team = getMyReferrals(1, signal).then(value => {
            if (!active()) return
            paging.current = { page: 1, busy: false, hasMore: value.length === REFERRAL_PAGE_SIZE }
            setMembers(value); setHasMore(paging.current.hasMore)
        }).catch(error => {
            if (active()) { paging.current.busy = false; setTeamFailed(true); report(error) }
        })
        await Promise.all([profile, team])
        if (active()) setLoading(false)
    }, [report])

    const loadMore = useCallback(async () => {
        if (paging.current.busy || !paging.current.hasMore) return
        paging.current.busy = true
        setLoadingMore(true)
        const current = generation.current
        const next = paging.current.page + 1
        try {
            const value = await getMyReferrals(next, getAuthRequestSignal())
            if (current !== generation.current || useAuthStore.getState().status !== 'signedIn') return
            setMembers(previous => {
                const ids = new Set(previous.map(member => member.id))
                return [...previous, ...value.filter(member => !ids.has(member.id))]
            })
            paging.current.page = next
            paging.current.hasMore = value.length === REFERRAL_PAGE_SIZE
            setHasMore(paging.current.hasMore)
        } catch (error) {
            if (current === generation.current) report(error)
        } finally {
            if (current === generation.current) { paging.current.busy = false; setLoadingMore(false) }
        }
    }, [report])

    useEffect(() => {
        void reload(true)
        return () => { generation.current += 1 }
    }, [reload])

    return { user, members, loading, loadingMore, hasMore, profileFailed, teamFailed, reload, loadMore }
}
