import { request } from '../http/request.ts'
import { HTTP_CONFIG } from '../http/config.ts'
import type {
    SelectImageOptions,
    UploadFileOptions,
    UploadResult,
} from './types.ts'

export function selectImageFile(
    options: SelectImageOptions = {},
): Promise<File> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = options.accept ?? 'image/*'
        input.style.display = 'none'

        if (options.capture) input.capture = options.capture

        let settled = false
        let focusTimer: number | undefined

        const cleanup = () => {
            if (focusTimer !== undefined) window.clearTimeout(focusTimer)
            input.removeEventListener('change', handleChange)
            input.removeEventListener('cancel', handleCancel)
            window.removeEventListener('focus', handleWindowFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            input.remove()
        }

        const finish = (file?: File) => {
            if (settled) return
            settled = true
            cleanup()

            if (file) resolve(file)
            else reject(new Error('未选择文件'))
        }

        const handleChange = () => finish(input.files?.[0])
        const handleCancel = () => finish()
        const scheduleCancelCheck = () => {
            if (focusTimer !== undefined) window.clearTimeout(focusTimer)
            focusTimer = window.setTimeout(() => {
                if (!settled && !input.files?.length) finish()
            }, 0)
        }
        const handleWindowFocus = () => scheduleCancelCheck()
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') scheduleCancelCheck()
        }

        input.addEventListener('change', handleChange)
        input.addEventListener('cancel', handleCancel)
        window.addEventListener('focus', handleWindowFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        try {
            document.body.append(input)
            input.click()
        } catch (error) {
            settled = true
            cleanup()
            reject(error instanceof Error ? error : new Error(String(error)))
        }
    })
}

export function uploadFile({
    file,
    url,
    fieldName = 'file',
    fields = {},
    timeout = HTTP_CONFIG.timeout,
    onProgress,
}: UploadFileOptions): Promise<UploadResult> {
    const data = new FormData()
    data.set(fieldName, file, file.name)

    for (const [key, value] of Object.entries(fields)) {
        data.set(key, value)
    }

    return request<UploadResult, FormData>({
        method: 'POST',
        url,
        data,
        timeout,
        onUploadProgress: onProgress
            ? ({ loaded, total }) => {
                    if (!total) return
                    onProgress(Math.round((loaded / total) * 100))
                }
            : undefined,
    })
}

export async function uploadImageWithBrowser(
    options: Omit<UploadFileOptions, 'file'>,
): Promise<UploadResult> {
    const file = await selectImageFile()
    return uploadFile({ ...options, file })
}
