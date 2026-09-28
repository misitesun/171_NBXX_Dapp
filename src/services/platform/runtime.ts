export type RuntimeHost = 'browser' | 'dapp' | 'flutter'

function hasWindow(): boolean {
    return typeof window !== 'undefined'
}

export function isFlutterHost(): boolean {
    return hasWindow() && window.__FROM_FLUTTER__ === true
}

export function isFlutterBridgeReady(): boolean {
    return (
        isFlutterHost() && typeof window.Flutter?.postMessage === 'function'
    )
}

export function isDappProviderExpected(): boolean {
    return hasWindow() && window.__EXPECT_DAPP_PROVIDER__ === true
}

export function isDappEnvironment(): boolean {
    return hasWindow() && typeof window.ethereum?.request === 'function'
}

export function getRuntimeHost(): RuntimeHost {
    if (isFlutterHost()) return 'flutter'
    if (isDappEnvironment()) return 'dapp'
    return 'browser'
}
