import { STORAGE_KEY } from './config.ts'
import {
    readLocalStorage,
    removeLocalStorage,
    writeLocalStorage,
} from './localStorage.ts'

export function getToken(): string {
    return readLocalStorage(STORAGE_KEY.token)
}

export function setToken(token: string): void {
    writeLocalStorage(STORAGE_KEY.token, token)
}

export function removeToken(): void {
    removeLocalStorage(STORAGE_KEY.token)
}
