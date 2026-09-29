import type { UserInfo } from '@/features/user'
import { maskWalletAddress } from '@/shared/formatters/maskWalletAddress.ts'
import { ROUTE_PATH } from '@/router/routes.ts'
import { HOME_PAGE_CONFIG, type HomePageConfig } from './config.ts'

export function buildApiHomeConfig(user: UserInfo | null, members: readonly UserInfo[], origin: string): HomePageConfig {
    const metrics: Record<string, string> = {
        'team-count': user ? String(user.team_count) : '—',
        'team-performance': user?.team_node_kpi ?? '—',
        'direct-count': user ? String(user.referral_count) : '—',
        'personal-performance': user?.node_kpi ?? '—',
    }
    return {
        ...HOME_PAGE_CONFIG,
        performanceUnit: 'U',
        metrics: HOME_PAGE_CONFIG.metrics.map(metric => ({ ...metric, value: metrics[metric.id] ?? '—' })),
        invitationText: user ? new URL(ROUTE_PATH.referral.replace(':ref', encodeURIComponent(user.referral_code)), origin).href : '',
        teamMembers: members.map(member => ({
            id: String(member.id), address: member.address ? maskWalletAddress(member.address) : `ID: ${member.id}`, joinedAt: '',
            personalPerformance: member.node_kpi, teamPerformance: member.team_node_kpi,
        })),
    }
}
