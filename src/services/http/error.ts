import axios from 'axios'

import { HTTP_ERROR_MESSAGE } from './config.ts'

interface HttpErrorOptions {
    status?: number
    code?: string
    data?: unknown
    cause?: unknown
}

export class HttpError extends Error {
    readonly status?: number
    readonly code?: string
    readonly data?: unknown
    override readonly cause?: unknown

    constructor(message: string, options: HttpErrorOptions = {}) {
        super(message)
        this.name = 'HttpError'
        this.status = options.status
        this.code = options.code
        this.data = options.data
        this.cause = options.cause
    }
}

function getResponseMessage(data: unknown): string | undefined {
    if (typeof data === 'string' && data.trim()) return data

    if (data && typeof data === 'object') {
        const body = data as Record<string, unknown>
        if (typeof body.message === 'string' && body.message.trim()) {
            return body.message
        }
        if (typeof body.error === 'string' && body.error.trim()) {
            return body.error
        }
    }

    return undefined
}

export function toHttpError(error: unknown): HttpError {
    if (error instanceof HttpError) return error

    if (axios.isAxiosError(error)) {
        const data: unknown = error.response?.data
        return new HttpError(
            getResponseMessage(data) || error.message || HTTP_ERROR_MESSAGE.requestFailed,
            {
                status: error.response?.status,
                code: error.code,
                data,
                cause: error,
            },
        )
    }

    if (error instanceof Error) {
        return new HttpError(error.message, { cause: error })
    }

    return new HttpError(HTTP_ERROR_MESSAGE.unknown, { cause: error })
}
