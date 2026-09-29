import { readLocalStorage, writeLocalStorage } from './localStorage.ts'

const REFERRAL_KEY = 'NBXX_REFERRAL_CODE'

export function getReferralCode(): string {
    return readLocalStorage(REFERRAL_KEY)
}

export function setReferralCode(value: string): void {
    writeLocalStorage(REFERRAL_KEY, value.trim())
}

/** Router params are already decoded; decode legacy query values only through URLSearchParams. */
export function resolveReferralCode(pathRef: string | undefined, search: string): string {
    return pathRef?.trim() || new URLSearchParams(search).get('ref')?.trim() || getReferralCode()
}
