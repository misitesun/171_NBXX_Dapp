import { APP_CONFIG } from '../config/index.ts'
import { setLanguage } from '../services/storage/index.ts'
import { useAppStore } from '../stores/app/index.ts'
import { findAppLanguage } from './config.ts'
import { appI18n } from './instance.ts'

export async function changeAppLanguage(languageCode: string): Promise<boolean> {
    if (!APP_CONFIG.enableI18n) return false

    const language = findAppLanguage(languageCode)
    if (!language) return false

    if (!appI18n.hasResourceBundle(language.code, 'translation')) {
        const messages = await language.load()
        appI18n.addResourceBundle(
            language.code,
            'translation',
            messages,
            true,
            true,
        )
    }

    await appI18n.changeLanguage(language.code)
    setLanguage(language.code)
    useAppStore.getState().setLanguageCode(language.code)
    if (typeof document !== 'undefined') {
        document.documentElement.lang = language.code
    }
    return true
}
