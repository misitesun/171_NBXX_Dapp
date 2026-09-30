import { useState, type CSSProperties } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Toast, useToast } from '@/components/Toast'
import { DropletLoading } from '@/components/DropletLoading'
import { Empty } from '@/components/Empty'
import { APP_CONFIG } from '@/config'
import { copyTextToClipboard } from '@/shared/clipboard/copyTextToClipboard'

import { HOME_ART, HOME_ASSURANCES, HOME_BENEFITS, MEDIA_PARTNERS, NFT_ART } from './assets'
import { HOME_PAGE_CONFIG, getHomeTier, type HomePageConfig, type NftTier, type NftTierId, type TeamMember } from './config'
import { useTeamScrollPagination } from './teamScrollPagination'
import './HomePage.scss'

export interface HomePageProps {
    config?: HomePageConfig
    purchasing?: boolean
    purchaseUnavailable?: boolean
    alreadyPurchased?: boolean
    purchaseStatusFailed?: boolean
    pricesFailed?: boolean
    onPurchase?: (tier: NftTier) => void
    teamLoading?: boolean
    teamFailed?: boolean
    profileFailed?: boolean
    loadingMore?: boolean
    hasMore?: boolean
    onLoadMore?: () => Promise<void> | void
    onRetry?: () => void
}

function SectionHeading({ title }: { title: string }) {
    return (
        <h2 className="home-page__section-title flex items-center justify-center size-32 bold-6">
            <img src={HOME_ART.lineLeft} alt="" /><span>{title}</span><img src={HOME_ART.lineRight} alt="" />
        </h2>
    )
}

function NftCard({ tier, currency, selected, disabled, onSelect }: {
    tier: NftTier; currency: string; selected: boolean; disabled: boolean; onSelect: () => void
}) {
    const { t } = useTranslation()
    const art = NFT_ART[tier.id]
    return (
        <button
            type="button"
            className={`home-page__nft home-page__nft--${tier.id}${selected ? ' home-page__nft--selected' : ''}`}
            style={{ '--nft-background': `url("${selected ? NFT_ART.premium.background : NFT_ART.basic.background}")` } as CSSProperties}
            aria-pressed={selected}
            disabled={disabled || tier.soldOut}
            onClick={onSelect}
        >
            <span className="home-page__selection" aria-hidden="true">{selected ? <img src={HOME_ART.checked} alt="" /> : null}</span>
            <img className="home-page__nft-art" src={art.image} alt={t(`home.tier.${tier.id}`)} />
            <span className="home-page__nft-info">
                <span className="home-page__nft-name size-24 bold-6">{t(`home.tier.${tier.id}`)}</span>
                <span className="home-page__price"><span className="size-24">{currency}</span><strong>{tier.price}</strong></span>
                <span className={`home-page__supply size-20${selected ? ' home-page__supply--selected' : ''}`}>{tier.soldOut ? t('home.soldOut') : t('home.limitedSupply', { supply: tier.supply })}</span>
            </span>
        </button>
    )
}

function BenefitsColumn({ tier, currency, selected }: { tier: NftTier; currency: string; selected: boolean }) {
    const { t } = useTranslation()
    return (
        <div className={`home-page__benefit-column home-page__benefit-column--${tier.id}${selected ? ' home-page__benefit-column--selected' : ''}`}>
            <h3 className="home-page__benefit-heading size-24">{t('home.tierBenefits', { tier: t(`home.tier.${tier.id}`) })}</h3>
            <ul className="home-page__benefit-list">
                {HOME_BENEFITS.map((benefit) => (
                    <li className={`home-page__benefit${benefit.multiline ? ' home-page__benefit--multiline' : ''}`} key={benefit.key}>
                        <span className="home-page__benefit-icon flex items-center justify-center"><img src={benefit.icon} alt="" /></span>
                        <p className="home-page__benefit-text size-24">
                            <Trans
                                i18nKey={`home.benefit.${benefit.key}`}
                                values={{ rate: tier.dividendRate, buyFee: tier.buyFee, sellFee: tier.sellFee, dailyRate: tier.dailyMiningRate, votes: tier.daoVotes, tax: tier.taxRate, credit: tier.credit, currency }}
                                components={{ green: <span className="home-page__green" />, red: <span className="home-page__red" />, gold: <span className="home-page__gold" /> }}
                            />
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PartnerRow({ start }: { start: number }) {
    return (
        <div className={`home-page__partner-row home-page__partner-row--${start === 0 ? 'top' : 'bottom'}`}>
            {[0, 1].map((copy) => (
                <div className="home-page__partner-group" key={copy} aria-hidden={copy === 1 || undefined}>
                    {MEDIA_PARTNERS.slice(start, start + 10).map((partner) => (
                        <div className="home-page__partner flex items-center justify-center" key={partner.id}>
                            <img src={partner.image} alt="" style={{ '--partner-width': `${partner.width / 750 * 100}vw`, '--partner-height': `${partner.height / 750 * 100}vw` } as CSSProperties} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

function MetricValue({ value }: { value: string }) {
    const decimalIndex = value.indexOf('.')
    return decimalIndex < 0 ? value : <>{value.slice(0, decimalIndex)}<span className="home-page__metric-decimal">{value.slice(decimalIndex)}</span></>
}

function TeamMembers({ members, unit, loading, failed, loadingMore, hasMore, purchasing, onLoadMore, onRetry }: {
    members: readonly TeamMember[]; unit: string; loading: boolean; failed: boolean;
    loadingMore: boolean; hasMore: boolean; purchasing: boolean; onLoadMore?: () => Promise<void> | void; onRetry?: () => void
}) {
    const { t } = useTranslation()
    const { scrollRef, sentinelRef } = useTeamScrollPagination({
        loading,
        enabled: !loading && !failed && !loadingMore && !purchasing && hasMore && members.length > 0,
        onLoadMore,
    })
    return (
        <section className="home-page__members-section">
            <SectionHeading title={t('home.team.membersTitle')} />
            <div
                ref={scrollRef}
                className="home-page__members-scroll"
                role="region"
                aria-label={t('home.team.membersTitle')}
                aria-busy={loading || loadingMore}
                tabIndex={members.length ? 0 : undefined}
                onTouchStart={event => { if (event.currentTarget.scrollTop > 0) event.stopPropagation() }}
            >
                <ul className="home-page__members" aria-label={t('home.team.membersTitle')}>
                    {members.map((member) => (
                        <li className="home-page__member" key={member.id}>
                            <div className="home-page__member-header">
                                <span className="home-page__member-address" title={member.address}>{member.address}</span>
                                {member.joinedAt ? <time className="home-page__member-time">{member.joinedAt}</time> : null}
                            </div>
                            <dl className="home-page__member-performance">
                                <div><dt>{t('home.team.performance')}</dt><dd className="home-page__member-team-value">{member.teamPerformance} {unit}</dd></div>
                                <div><dt>{t('home.team.personalPerformance')}</dt><dd>{member.personalPerformance} {unit}</dd></div>
                            </dl>
                        </li>
                    ))}
                </ul>
                <div ref={sentinelRef}>
                    {loading || loadingMore ? <div className="home-page__data-status"><DropletLoading ariaLabel={t('加载中...')} /></div> : failed ? <button type="button" className="home-page__data-status" onClick={onRetry}>{t('home.retry')}</button> : !members.length ? <Empty text={t('home.team.noMembers')} /> : hasMore ? <button type="button" className="home-page__data-status" disabled={purchasing} onClick={onLoadMore}>{t('home.loadMore')}</button> : onLoadMore ? <p className="home-page__members-empty">{t('home.noMore')}</p> : null}
                </div>
            </div>
        </section>
    )
}

export function HomePage({ config = HOME_PAGE_CONFIG, purchasing = false, purchaseUnavailable = false, alreadyPurchased = false, purchaseStatusFailed = false, pricesFailed = false, onPurchase, teamLoading = false, teamFailed = false, profileFailed = false, loadingMore = false, hasMore = false, onLoadMore, onRetry }: HomePageProps) {
    const { t, i18n } = useTranslation()
    const [selectedId, setSelectedId] = useState<NftTierId>(config.defaultTier)
    const selectedTier = getHomeTier(config, selectedId)
    const { message, variant, showToast } = useToast()
    const totalSupply = config.tiers.reduce((total, tier) => total + tier.supply, 0)

    function handlePurchase() {
        if (!selectedTier || selectedTier.soldOut || purchasing || purchaseUnavailable || alreadyPurchased) return
        if (onPurchase) { onPurchase(selectedTier); return }
        showToast(t('home.comingSoon'))
    }

    return (
        <div className={`home-page${i18n.language.startsWith('zh') ? '' : ' home-page--translated'}`} aria-label={t('home.pageTitle')} style={{ '--home-hero-background': `url("${HOME_ART.heroBackground}")`, '--home-footer-background': `url("${HOME_ART.footerBackground}")` } as CSSProperties}>
            <section className="home-page__hero" aria-labelledby="home-title">
                <h1 id="home-title" className="home-page__title tc bold-6">{t('home.title')}</h1>
                <div className="home-page__limited-align">
                    <div className="home-page__limited flex items-center">
                        <img className="home-page__laurel" src={HOME_ART.laurelLeft} alt="" />
                        <span className="home-page__limited-label size-28">{t('home.totalSupply', { supply: totalSupply })}</span>
                        <img className="home-page__laurel home-page__laurel--right" src={HOME_ART.laurelRight} alt="" />
                    </div>
                </div>
                <div className="home-page__art" aria-hidden="true">
                    <img className="home-page__crown" src={HOME_ART.crown} alt="" fetchPriority="high" />
                    <img className="home-page__orb home-page__orb--left" src={HOME_ART.orbLeft} alt="" />
                    <img className="home-page__orb home-page__orb--right" src={HOME_ART.orbRight} alt="" />
                </div>
            </section>
            <section className="home-page__purchase-section" aria-label={t('home.chooseNft')}>
                <div className="home-page__nft-grid">
                    {config.tiers.map((tier) => <NftCard key={tier.id} tier={tier} currency={config.currencySymbol} selected={selectedTier?.id === tier.id} disabled={purchasing} onSelect={() => setSelectedId(tier.id)} />)}
                </div>
                <div className="home-page__purchase-frame">
                    <button type="button" className={`home-page__purchase flex items-center justify-center size-28 bold-6${alreadyPurchased ? ' home-page__purchase--purchased' : ''}`} aria-busy={purchasing || undefined} disabled={!selectedTier || selectedTier.soldOut || purchasing || purchaseUnavailable || alreadyPurchased} onClick={handlePurchase}>
                        <img src={HOME_ART.purchaseBag} alt="" />
                        <span>{purchasing ? t('home.processing') : alreadyPurchased ? t('purchase.alreadyPurchased') : t('home.purchase', { tier: selectedTier ? t(`home.tier.${selectedTier.id}`) : '' })}</span>
                        <img src={HOME_ART.purchaseArrow} alt="" />
                    </button>
                </div>
                {pricesFailed || purchaseStatusFailed ? <button type="button" className="home-page__data-status" disabled={purchasing} onClick={onRetry}>{t(pricesFailed ? 'purchase.priceRetry' : 'purchase.statusRetry')}</button> : null}
                <ul className="home-page__assurances flex items-center justify-center">
                    {HOME_ASSURANCES.map((item) => <li className="flex items-center size-24" key={item.key}><img src={item.icon} alt="" /><span>{t(`home.assurance.${item.key}`)}</span></li>)}
                </ul>
            </section>
            <section className="home-page__comparison-section">
                <SectionHeading title={t('home.benefitsTitle')} />
                <p className="home-page__description home-page__description--benefits tc size-24">{t('home.benefitsDescription')}</p>
                <div className="home-page__comparison">{config.tiers.map((tier) => <BenefitsColumn key={tier.id} tier={tier} currency={config.currencySymbol} selected={selectedTier?.id === tier.id} />)}</div>
            </section>
            <section className="home-page__metrics-section">
                <SectionHeading title={t('home.team.title')} />
                <p className="home-page__description tc size-24">{t('home.metricsDescription')}</p>
                <div className="home-page__metrics">
                    {config.metrics.map((metric) => (
                        <article className={`home-page__metric${metric.featured ? ' home-page__metric--featured' : ''}`} key={metric.id}>
                            <strong className="home-page__metric-value bold-6"><MetricValue value={metric.value} /></strong>
                            <h3 className="home-page__metric-label size-24">{t(metric.labelKey, { unit: config.performanceUnit })}</h3>
                        </article>
                    ))}
                </div>
                {profileFailed ? <button type="button" className="home-page__data-status" onClick={onRetry}>{t('home.retry')}</button> : null}
            </section>
            <section className="home-page__invitation" aria-labelledby="home-invitation-title">
                <h2 id="home-invitation-title" className="home-page__invitation-title"><img src={HOME_ART.inviteIcon} alt="" />{t('home.invitation.title')}</h2>
                <p className="home-page__invitation-description">{t('home.invitation.description')}</p>
                <div className="home-page__invitation-actions">
                    <span className="home-page__invitation-text" title={config.invitationText}>{config.invitationText}</span>
                    <button type="button" className="home-page__copy" disabled={!config.invitationText} onClick={async () => {
                        const copied = await copyTextToClipboard(config.invitationText)
                        showToast(t(copied ? 'home.invitation.copied' : 'home.invitation.copyFailed'))
                    }}>{t('home.invitation.copy')}</button>
                </div>
            </section>
            <TeamMembers members={config.teamMembers} unit={config.performanceUnit} loading={teamLoading} failed={teamFailed} loadingMore={loadingMore} hasMore={hasMore} purchasing={purchasing} onLoadMore={onLoadMore} onRetry={onRetry} />
            <section className="home-page__media-section">
                <SectionHeading title={t('home.mediaTitle')} />
                <p className="home-page__description tc size-24">{t('home.mediaDescription')}</p>
                <div className="home-page__partners" aria-label={t('home.mediaTitle')} style={{ '--media-scroll-duration': `${config.mediaScrollDurationSeconds}s` } as CSSProperties}><PartnerRow start={0} /><PartnerRow start={10} /></div>
            </section>
            <footer className="home-page__footer">
                <img className="home-page__footer-brand" src={`${APP_CONFIG.routeBase}${APP_CONFIG.brandWordmarkPath}`} alt={APP_CONFIG.name || 'NodeXX'} loading="lazy" />
                <p className="home-page__tagline tc size-24">{t('home.tagline')}</p>
                <div className="home-page__contacts">
                    <div className="home-page__links">
                        <div><h3 className="home-page__link-heading size-24">{t('home.websiteLabel')}</h3><a className="home-page__link size-24" href={config.links.website} target="_blank" rel="noopener noreferrer">{config.links.website}</a></div>
                        <a className="home-page__twitter" href={config.links.social} target="_blank" rel="noopener noreferrer" aria-label={t('home.twitterLabel')}>
                            <span className="home-page__twitter-icon"><img src={HOME_ART.twitterIcon} alt="" /></span>
                            <span className="home-page__twitter-text">{t('home.twitter')}</span>
                        </a>
                    </div>
                    <div className="home-page__qr flex items-center justify-center"><img src={HOME_ART.communityQr} alt={t('home.communityQr')} loading="lazy" /></div>
                </div>
            </footer>
            <Toast message={message} variant={variant} />
        </div>
    )
}
