export function readLocalStorage(
    key: string,
    fallback = '',
): string {
    try {
        if (typeof window === 'undefined') return fallback
        return window.localStorage.getItem(key) ?? fallback
    } catch {
        return fallback
    }
}

export function writeLocalStorage(key: string, value: string): void {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value)
        }
    } catch {
        // Storage may be blocked in private or restricted WebViews.
        // 隐私模式或受限制的 WebView 中可能会禁用 Storage。
    }
}

export function removeLocalStorage(key: string): void {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key)
        }
    } catch {
        // Removing optional cache must never interrupt the application flow.
        // 删除可选缓存失败时不能中断应用流程。
    }
}
