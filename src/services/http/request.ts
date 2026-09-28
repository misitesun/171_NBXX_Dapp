import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { httpClient } from './client.ts'

export type RequestConfig<TBody = never> = Omit<
    AxiosRequestConfig<TBody>,
    'data'
> & {
    data?: TBody
}

export async function request<TResponse, TBody = never>(
    config: RequestConfig<TBody>,
): Promise<TResponse> {
    const response = await httpClient.request<
        TResponse,
        AxiosResponse<TResponse>,
        TBody
    >(config)

    return response.data
}
