import { APP_CONFIG } from '../config/index.ts'
import { getLanguage } from '../services/storage/index.ts'
import {
    DEFAULT_LANGUAGE_CODE,
    FIXED_LANGUAGE_CODE,
    findAppLanguage,
} from './config.ts'

export function getRequestLanguage(): string {
    if (!APP_CONFIG.enableI18n) return FIXED_LANGUAGE_CODE

    const language = findAppLanguage(getLanguage())
        ?? findAppLanguage(DEFAULT_LANGUAGE_CODE)
    return language?.code ?? DEFAULT_LANGUAGE_CODE
}
