let isDappWalletListenerActive = false
let controlledDappChainId: number | undefined

export function setDappWalletListenerActive(active: boolean): void {
    isDappWalletListenerActive = active

    if (!active) {
        controlledDappChainId = undefined
    }
}

export function markControlledDappChainChange(chainId: number): boolean {
    if (!isDappWalletListenerActive) return false

    controlledDappChainId = chainId
    return true
}

export function clearControlledDappChainChange(): void {
    controlledDappChainId = undefined
}

export function consumeControlledDappChainChange(chainId: number | undefined): boolean {
    if (chainId === undefined || controlledDappChainId !== chainId) {
        return false
    }

    controlledDappChainId = undefined
    return true
}
