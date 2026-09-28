import { create } from 'zustand'

import { APP_CONFIG } from '../../config/index.ts'
import {
    DEFAULT_LANGUAGE_CODE,
    FIXED_LANGUAGE_CODE,
    findAppLanguage,
} from '../../i18n/config.ts'
import { getLanguage } from '../../services/storage/index.ts'
import type { AppStoreState } from './types.ts'

function getInitialLanguageCode(): string {
    if (!APP_CONFIG.enableI18n) return FIXED_LANGUAGE_CODE

    const language = findAppLanguage(getLanguage())
        ?? findAppLanguage(DEFAULT_LANGUAGE_CODE)

    return language?.code ?? DEFAULT_LANGUAGE_CODE
}

export const useAppStore = create<AppStoreState>()((set) => ({
    languageCode: getInitialLanguageCode(),

    setLanguageCode(languageCode) {
        if (!APP_CONFIG.enableI18n) {
            set({ languageCode: FIXED_LANGUAGE_CODE })
            return
        }

        const language = findAppLanguage(languageCode)
        if (!language) return

        set({ languageCode: language.code })
    },
}))
