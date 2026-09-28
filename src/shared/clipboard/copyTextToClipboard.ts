function copyWithTemporaryTextarea(text: string): boolean {
    if (typeof document === 'undefined' || !document.body) return false

    let textarea: HTMLTextAreaElement | undefined
    let appended = false

    try {
        textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        appended = true
        textarea.focus()
        textarea.select()
        textarea.setSelectionRange(0, textarea.value.length)
        return document.execCommand('copy')
    } catch {
        return false
    } finally {
        if (textarea && appended) {
            try {
                document.body.removeChild(textarea)
            } catch {
                // The host may synchronously detach the temporary node.
                // 宿主环境可能会同步移除临时节点。
            }
        }
    }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
    if (!text) return false

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            // Some mobile WebViews expose Clipboard API but deny it at runtime.
            // 部分移动端 WebView 暴露了 Clipboard API，但会在运行时拒绝调用。
        }
    }

    return copyWithTemporaryTextarea(text)
}
