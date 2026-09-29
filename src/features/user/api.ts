import { request } from '@/services/http'
import type { UserInfo } from './types.ts'

export const REFERRAL_PAGE_SIZE = 20

export function parseUserInfo(value: unknown): UserInfo {
    if (typeof value !== 'object' || value === null) throw new Error('Invalid user response')
    const data = value as Record<string, unknown>
    const integer = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    const amount = (value: unknown): value is string => typeof value === 'string' && /^\d+\.\d{6}$/.test(value)
    const walletAddress = (value: unknown): value is string => typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)
    const address = data.address
    if (address !== undefined && !walletAddress(address)) throw new Error('Invalid user response')
    if (!integer(data.id) || data.id < 1 || !integer(data.team_count) || !integer(data.referral_count)
        || !amount(data.node_kpi) || !amount(data.team_node_kpi)
        || typeof data.referral_code !== 'string' || !data.referral_code.trim()) {
        throw new Error('Invalid user response')
    }
    return {
        id: data.id, ...(address === undefined ? {} : { address }),
        team_count: data.team_count, referral_count: data.referral_count,
        node_kpi: data.node_kpi, team_node_kpi: data.team_node_kpi, referral_code: data.referral_code,
    }
}

export async function getMyInfo(signal?: AbortSignal): Promise<UserInfo> {
    return parseUserInfo(await request<unknown>({ url: '/api/users/my', signal }))
}

export function parseReferrals(value: unknown): UserInfo[] {
    if (typeof value !== 'object' || value === null || !('referrals' in value) || !Array.isArray(value.referrals)) {
        throw new Error('Invalid referrals response')
    }
    return value.referrals.map(parseUserInfo)
}

export async function getMyReferrals(pageNo: number, signal?: AbortSignal): Promise<UserInfo[]> {
    if (!Number.isSafeInteger(pageNo) || pageNo < 1) throw new Error('Invalid referral page')
    return parseReferrals(await request<unknown>({
        url: '/api/users/my/referrals', params: { page_no: pageNo, page_size: REFERRAL_PAGE_SIZE }, signal,
    }))
}
