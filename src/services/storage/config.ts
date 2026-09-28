import { APP_CONFIG } from '../../config/index.ts'

export const STORAGE_KEY = {
    walletAddress: 'WALLET_ADDRESS',
    token: 'TOKEN',
    language: 'LANG',
} as const

export const STORAGE_DEFAULT = {
    language: APP_CONFIG.defaultLanguageCode,
} as const
