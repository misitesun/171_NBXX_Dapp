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
    // PHP supports these three locale values; Japanese/Korean use its English errors.
    const code = language?.code ?? DEFAULT_LANGUAGE_CODE
    return code === 'zh-Hans' ? 'zh-CN' : code === 'zh-Hant' ? 'zh-TW' : 'en-US'
}
