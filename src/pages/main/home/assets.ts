import footerBackground from '@/assets/home/footer-space-background-3e7247.png'
import heroBackground from '@/assets/home/hero-space-background-68905c.png'
import crown from '@/assets/home/nft-crown.png'
import orbLeft from '@/assets/home/hero-orb-left-5ad938.png'
import orbRight from '@/assets/home/hero-orb-right-39d109.png'
import laurelRight from '@/assets/home/laurel-right-6581b6.png'
import laurelLeft from '@/assets/home/laurel-left-6581b6.png'
import basicBackground from '@/assets/home/nft-basic-card-background-7f6f7c.png'
import basicArt from '@/assets/home/nft-basic-art.png'
import premiumBackground from '@/assets/home/nft-premium-card-background-5be090.png'
import premiumArt from '@/assets/home/nft-premium-art.png'
import checked from '@/assets/home/selection-checked-d292b9.png'
import dividendIcon from '@/assets/home/benefit-dividend-63634c.png'
import buyFeeIcon from '@/assets/home/benefit-buy-fee-588b98.png'
import sellFeeIcon from '@/assets/home/benefit-sell-fee-5c4f28.png'
import miningIcon from '@/assets/home/benefit-mining-37ed27.png'
import airdropIcon from '@/assets/home/benefit-airdrop-1f30d9.png'
import voteIcon from '@/assets/home/benefit-vote-54b405.png'
import taxIcon from '@/assets/home/benefit-tax-55d3b1.png'
import creditIcon from '@/assets/home/benefit-credit-46d70f.png'
import contractIcon from '@/assets/home/assurance-contract-274b00.png'
import limitedIcon from '@/assets/home/assurance-limited-784115.png'
import shareholderIcon from '@/assets/home/assurance-shareholder-5b7961.png'
import communityQr from '@/assets/home/community-qr.png'
import twitterIcon from '@/assets/home/twitter-icon.svg'
import inviteIcon from '@/assets/home/invite-friends.svg'
import purchaseBag from '@/assets/home/purchase-bag.svg'
import purchaseArrow from '@/assets/home/purchase-arrow.svg'
import lineLeft from '@/assets/home/section-line-left.svg'
import lineRight from '@/assets/home/section-line-right.svg'
import partner0 from '@/assets/home/media-partner-row-top-01-30129b.png'
import partner1 from '@/assets/home/media-partner-row-top-02-2a9e56.png'
import partner2 from '@/assets/home/media-partner-row-top-03-3858dd.png'
import partner3 from '@/assets/home/media-partner-row-top-04-60434f.png'
import partner4 from '@/assets/home/media-partner-row-top-05-606ce4.png'
import partner5 from '@/assets/home/media-partner-row-top-06-1bdfad.png'
import partner6 from '@/assets/home/media-partner-row-top-07-466e42.png'
import partner7 from '@/assets/home/media-partner-row-top-08-17c787.png'
import partner8 from '@/assets/home/media-partner-row-top-09-2c318a.png'
import partner9 from '@/assets/home/media-partner-row-top-10-590501.png'
import partner10 from '@/assets/home/media-partner-row-bottom-01-5ac36b.png'
import partner11 from '@/assets/home/media-partner-row-bottom-02-620b3b.png'
import partner12 from '@/assets/home/media-partner-row-bottom-03-678cd0.png'
import partner13 from '@/assets/home/media-partner-row-bottom-04-78c8b3.png'
import partner14 from '@/assets/home/media-partner-row-bottom-05-728fe8.png'
import partner15 from '@/assets/home/media-partner-row-bottom-06-2fd57f.png'
import partner16 from '@/assets/home/media-partner-row-bottom-07-19264b.png'
import partner17 from '@/assets/home/media-partner-row-bottom-08-7c9389.png'
import partner18 from '@/assets/home/media-partner-row-bottom-09-388793.png'
import partner19 from '@/assets/home/media-partner-row-bottom-10-4f1fe6.png'

export const HOME_ART = {
    heroBackground, footerBackground, crown, orbLeft, orbRight, laurelLeft, laurelRight,
    checked, communityQr, twitterIcon, inviteIcon, purchaseBag, purchaseArrow, lineLeft, lineRight,
}

export const NFT_ART = {
    basic: { background: basicBackground, image: basicArt },
    premium: { background: premiumBackground, image: premiumArt },
}

export const HOME_BENEFITS = [
    { key: 'dividend', icon: dividendIcon, multiline: true },
    { key: 'buyFee', icon: buyFeeIcon, multiline: false },
    { key: 'sellFee', icon: sellFeeIcon, multiline: false },
    { key: 'mining', icon: miningIcon, multiline: true },
    { key: 'airdrop', icon: airdropIcon, multiline: false },
    { key: 'vote', icon: voteIcon, multiline: true },
    { key: 'tax', icon: taxIcon, multiline: false },
    { key: 'credit', icon: creditIcon, multiline: true },
] as const

export const HOME_ASSURANCES = [
    { key: 'contract', icon: contractIcon },
    { key: 'limited', icon: limitedIcon },
    { key: 'shareholder', icon: shareholderIcon },
] as const

// Figma slot widths are retained independently of the source bitmap dimensions.
// 源图宽高不替代 Figma 槽位尺寸；20 家媒体按原稿分两行展示。
export const MEDIA_PARTNERS = [
    { id: '30204:3430', image: partner0, width: 88, height: 30 },
    { id: '30204:3433', image: partner1, width: 124, height: 15 },
    { id: '30204:3436', image: partner2, width: 88, height: 30 },
    { id: '30204:3439', image: partner3, width: 88, height: 30 },
    { id: '30204:3442', image: partner4, width: 91, height: 30 },
    { id: '30204:3445', image: partner5, width: 88, height: 30 },
    { id: '30204:3448', image: partner6, width: 104, height: 30 },
    { id: '30204:3451', image: partner7, width: 96, height: 30 },
    { id: '30204:3454', image: partner8, width: 88, height: 30 },
    { id: '30204:3457', image: partner9, width: 96, height: 30 },
    { id: '30204:3461', image: partner10, width: 88, height: 30 },
    { id: '30204:3464', image: partner11, width: 100, height: 30 },
    { id: '30204:3467', image: partner12, width: 94, height: 30 },
    { id: '30204:3470', image: partner13, width: 100, height: 30 },
    { id: '30204:3473', image: partner14, width: 90, height: 30 },
    { id: '30204:3476', image: partner15, width: 94, height: 30 },
    { id: '30204:3479', image: partner16, width: 88, height: 30 },
    { id: '30204:3482', image: partner17, width: 96, height: 30 },
    { id: '30204:3486', image: partner18, width: 94, height: 30 },
    { id: '30204:3489', image: partner19, width: 94, height: 30 },
] as const
