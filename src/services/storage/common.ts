import { STORAGE_DEFAULT, STORAGE_KEY } from './config.ts'
import {
    readLocalStorage,
    removeLocalStorage,
    writeLocalStorage,
} from './localStorage.ts'

export function getWalletAddress(): string {
    return readLocalStorage(STORAGE_KEY.walletAddress)
}

export function setWalletAddress(walletAddress: string): void {
    writeLocalStorage(STORAGE_KEY.walletAddress, walletAddress)
}

export function removeWalletAddress(): void {
    removeLocalStorage(STORAGE_KEY.walletAddress)
}

export function getLanguage(): string {
    return readLocalStorage(STORAGE_KEY.language, STORAGE_DEFAULT.language)
}

export function setLanguage(language: string): void {
    writeLocalStorage(STORAGE_KEY.language, language)
}

export function removeLanguage(): void {
    removeLocalStorage(STORAGE_KEY.language)
}
