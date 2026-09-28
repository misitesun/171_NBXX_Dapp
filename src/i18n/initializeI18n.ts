import { initReactI18next } from 'react-i18next'

import { APP_CONFIG } from '../config/index.ts'
import { getLanguage, setLanguage } from '../services/storage/index.ts'
import { useAppStore } from '../stores/app/index.ts'
import {
    APP_LANGUAGES,
    DEFAULT_LANGUAGE_CODE,
    FALLBACK_LANGUAGE_CODE,
    FIXED_LANGUAGE_CODE,
    findAppLanguage,
    type AppLanguage,
    type LanguageMessages,
} from './config.ts'
import { appI18n } from './instance.ts'

async function loadResource(language: AppLanguage): Promise<LanguageMessages> {
    return language.load()
}

export async function initializeI18n(): Promise<void> {
    const selectedLanguageCode = APP_CONFIG.enableI18n
        ? getLanguage()
        : FIXED_LANGUAGE_CODE
    const selectedLanguage = findAppLanguage(selectedLanguageCode)
        ?? findAppLanguage(DEFAULT_LANGUAGE_CODE)
        ?? APP_LANGUAGES[0]
    const fallbackLanguage = APP_CONFIG.enableI18n
        ? findAppLanguage(FALLBACK_LANGUAGE_CODE) ?? APP_LANGUAGES[0]
        : selectedLanguage

    const selectedMessages = await loadResource(selectedLanguage)
    const fallbackMessages = selectedLanguage.code === fallbackLanguage.code
        ? selectedMessages
        : await loadResource(fallbackLanguage)

    await appI18n
        .use(initReactI18next)
        .init({
            lng: selectedLanguage.code,
            fallbackLng: fallbackLanguage.code,
            supportedLngs: APP_LANGUAGES.map(({ code }) => code),
            load: 'currentOnly',
            resources: {
                [fallbackLanguage.code]: { translation: fallbackMessages },
                [selectedLanguage.code]: { translation: selectedMessages },
            },
            keySeparator: false,
            interpolation: { escapeValue: false },
            returnNull: false,
        })

    setLanguage(selectedLanguage.code)
    useAppStore.getState().setLanguageCode(selectedLanguage.code)
    if (typeof document !== 'undefined') {
        document.documentElement.lang = selectedLanguage.code
    }
}
