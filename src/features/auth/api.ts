import { request } from '@/services/http'

export interface LoginBody {
    address: string
    signature: string
    timestamp: number
    ref?: string
}

// The token is required by subsequent protected requests, so validate the success body.
export async function requestWalletLogin(data: LoginBody, signal?: AbortSignal): Promise<string> {
    const value = await request<unknown, LoginBody>({ url: '/api/auth/login', method: 'POST', data, signal })
    if (typeof value !== 'object' || value === null || !('token' in value)
        || typeof value.token !== 'string' || !value.token.trim()) {
        throw new Error('Invalid login response')
    }
    return value.token
}
