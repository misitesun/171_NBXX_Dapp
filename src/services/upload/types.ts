export interface UploadResult {
    url: string
    [key: string]: unknown
}

export interface SelectImageOptions {
    accept?: string
    capture?: 'user' | 'environment'
}

export interface UploadFileOptions {
    file: File
    url: string
    fieldName?: string
    fields?: Record<string, string | Blob>
    timeout?: number
    onProgress?: (percent: number) => void
}
