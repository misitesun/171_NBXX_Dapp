import axios from 'axios'

import { APP_CONFIG } from '../../config/index.ts'
import { getRequestLanguage } from '../../i18n/getRequestLanguage.ts'
import { getToken, removeToken } from '../storage/token.ts'
import { isFormDataBody } from './body.ts'
import {
    HTTP_AUTH,
    HTTP_CONFIG,
    HTTP_CONTENT_TYPE,
    HTTP_HEADER,
    HTTP_STATUS,
} from './config.ts'
import { toHttpError } from './error.ts'
import { reportHttpError } from './feedback.ts'

export const httpClient = axios.create({
    baseURL: import.meta.env?.VITE_BASE_URL,
    timeout: HTTP_CONFIG.timeout,
})

export type HttpUnauthorizedHandler = () => void
export type HttpWalletAddressProvider = () => string | undefined

let unauthorizedHandler: HttpUnauthorizedHandler | undefined
let walletAddressProvider: HttpWalletAddressProvider | undefined

/** Registers the project-owned reaction to a 401 response. */
export function registerHttpUnauthorizedHandler(
    handler: HttpUnauthorizedHandler,
): () => void {
    unauthorizedHandler = handler

    return () => {
        if (unauthorizedHandler === handler) unauthorizedHandler = undefined
    }
}

/** Returns a connected address; when a Token exists, its owner must also match. */
export function registerHttpWalletAddressProvider(
    provider: HttpWalletAddressProvider,
): () => void {
    walletAddressProvider = provider

    return () => {
        if (walletAddressProvider === provider) walletAddressProvider = undefined
    }
}

httpClient.interceptors.request.use((config) => {
    const token = getToken()
    const walletAddress = walletAddressProvider?.()?.trim()

    if (token && (!walletAddressProvider || walletAddress)) {
        config.headers.set(
            HTTP_HEADER.authorization,
            `${HTTP_AUTH.scheme} ${token}`,
        )
    } else {
        config.headers.delete(HTTP_HEADER.authorization)
    }

    if (walletAddress) {
        config.headers.set(HTTP_HEADER.walletAddress, walletAddress)
    } else {
        config.headers.delete(HTTP_HEADER.walletAddress)
    }

    if (APP_CONFIG.enableI18n) {
        config.headers.set(HTTP_HEADER.language, getRequestLanguage())
    } else {
        config.headers.delete(HTTP_HEADER.language)
    }

    if (isFormDataBody(config.data)) {
        config.headers.delete(HTTP_HEADER.contentType)
    } else if (config.data !== undefined) {
        config.headers.setContentType(HTTP_CONTENT_TYPE.json)
    }

    return config
})

httpClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const httpError = toHttpError(error)

        reportHttpError(httpError)

        if (httpError.status === HTTP_STATUS.unauthorized) {
            removeToken()
            unauthorizedHandler?.()
        }

        return Promise.reject(httpError)
    },
)
