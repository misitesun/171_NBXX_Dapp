export type NftTierId = 'basic' | 'premium'

export interface NftTier {
    id: NftTierId
    price: string
    supply: number
    dividendRate: string
    buyFee: string
    sellFee: string
    dailyMiningRate: string
    daoVotes: number
    taxRate: string
    credit: string
    soldOut?: boolean
}

export interface PlatformMetric {
    id: string
    labelKey: string
    value: string
    featured: boolean
}

export interface TeamMember {
    id: string
    address: string
    joinedAt: string
    teamPerformance: string
    personalPerformance: string
}

export interface HomePageConfig {
    currencySymbol: string
    defaultTier: NftTierId
    tiers: readonly NftTier[]
    metrics: readonly PlatformMetric[]
    performanceUnit: string
    invitationText: string
    teamMembers: readonly TeamMember[]
    mediaScrollDurationSeconds: number
    links: { website: string; social: string }
}

// Display values from Figma, not contract amounts or live platform statistics.
// Figma 展示参数；价格字符串不参与链上单位转换，指标尚非实时数据。
export const HOME_PAGE_CONFIG: HomePageConfig = {
    currencySymbol: '$',
    defaultTier: 'basic',
    mediaScrollDurationSeconds: 40,
    performanceUnit: 'USDT',
    invitationText: '0xalifuiewhgouerg564vbfd8sv69a45s8xc4asc4as86cs48sd15sa1c5s',
    teamMembers: ['30285:3008', '30285:3095', '30285:3108', '30285:3121'].map((id) => ({
        id, address: '0xd34w...6i4j', joinedAt: '2026.04.26 12:08:44',
        teamPerformance: '0.00', personalPerformance: '0.00',
    })),
    tiers: [
        {
            id: 'basic', price: '500', supply: 1500,
            dividendRate: '3%', buyFee: '1.5%', sellFee: '1.5%',
            dailyMiningRate: '0.5%', daoVotes: 5, taxRate: '2%', credit: '1000',
        },
        {
            id: 'premium', price: '1000', supply: 500,
            dividendRate: '4%', buyFee: '1.5%', sellFee: '1.5%',
            dailyMiningRate: '1%', daoVotes: 10, taxRate: '3%', credit: '3000',
        },
    ],
    metrics: [
        { id: 'team-count', labelKey: 'home.team.totalMembers', value: '1000', featured: false },
        { id: 'team-performance', labelKey: 'home.team.performanceUnit', value: '128,000.97', featured: true },
        { id: 'direct-count', labelKey: 'home.team.directMembers', value: '200', featured: true },
        { id: 'personal-performance', labelKey: 'home.team.personalPerformanceUnit', value: '74,000.62', featured: false },
    ],
    links: {
        website: 'https://www.nodexx.co/zh-CN',
        social: 'https://x.com/NodeXX_cn',
    },
}

export function getHomeTier(config: HomePageConfig, id: NftTierId): NftTier | undefined {
    return config.tiers.find((tier) => tier.id === id) ?? config.tiers[0]
}
