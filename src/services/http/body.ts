export function isFormDataBody(data: unknown): data is FormData {
    if (typeof FormData !== 'undefined' && data instanceof FormData) return true
    return Object.prototype.toString.call(data) === '[object FormData]'
}
