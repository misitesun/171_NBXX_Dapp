import { appI18n } from './instance.ts'

export function translate(key: string): string {
    return appI18n.t(key)
}
