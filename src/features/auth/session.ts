import {
    connectDappWallet, detectDappProvider, initializeDappWallet, signDappMessage,
    startDappWalletListeners, stopDappWalletListeners,
} from '@/services/dapp'
import { registerHttpUnauthorizedHandler, registerHttpWalletAddressProvider } from '@/services/http'
import { getToken, getWalletAddress, removeToken, setToken } from '@/services/storage'
import { useDappStore } from '@/stores/dapp'
import { useAuthStore } from '@/stores/auth/store.ts'
import { getMyInfo } from '@/features/user'
import { requestWalletLogin } from './api.ts'

let attempt = 0
let checkedAddress: string | undefined
let sessionRequests = new AbortController()
let activeLogin: Promise<void> | undefined

function sameAddress(first: string, second: string): boolean {
    return first.toLowerCase() === second.toLowerCase()
}

function invalidateWork(): void {
    attempt += 1
    checkedAddress = undefined
    sessionRequests.abort()
    sessionRequests = new AbortController()
    activeLogin = undefined
}

export function getAuthRequestSignal(): AbortSignal {
    return sessionRequests.signal
}

export function logout(): void {
    invalidateWork()
    removeToken()
    stopDappWalletListeners()
    useDappStore.getState().clearWalletAddress()
    useAuthStore.setState({ status: 'signedOut', user: null })
}

function assertCurrent(currentAttempt: number, address: string): void {
    if (attempt !== currentAttempt || !sameAddress(address, useDappStore.getState().walletAddress)) {
        throw new Error('auth.sessionChanged')
    }
}

function assertAttempt(currentAttempt: number): void {
    if (currentAttempt !== attempt) throw new Error('auth.sessionChanged')
}

async function connectSession(currentAttempt: number): Promise<string> {
    const provider = await detectDappProvider({ waitForDelayedProvider: true })
    assertAttempt(currentAttempt)
    if (!provider || !await initializeDappWallet()) throw new Error('auth.walletRequired')
    assertAttempt(currentAttempt)
    const { address } = await connectDappWallet()
    assertAttempt(currentAttempt)
    // Listen during signing as well: switching wallets invalidates the pending login.
    startDappWalletListeners({ onAccountsChanged: logout, onChainChanged: logout })
    return address
}

export async function resumeSession(): Promise<void> {
    const currentAttempt = ++attempt
    const token = getToken()
    const storedAddress = getWalletAddress()
    if (!token || !storedAddress) { logout(); return }
    try {
        const address = await connectSession(currentAttempt)
        assertCurrent(currentAttempt, address)
        if (!sameAddress(address, storedAddress)) { logout(); return }
        checkedAddress = address
        const user = await getMyInfo(getAuthRequestSignal())
        assertCurrent(currentAttempt, address)
        useAuthStore.setState({ status: 'signedIn', user })
    } catch (error) {
        if (currentAttempt === attempt) logout()
        throw error
    }
}

export function loginWithWallet(referralCode: string): Promise<void> {
    if (activeLogin) return activeLogin
    logout()
    const currentAttempt = ++attempt
    const task = (async () => {
        const address = await connectSession(currentAttempt)
        assertCurrent(currentAttempt, address)
        const timestamp = Math.floor(Date.now() / 1000)
        const { signature } = await signDappMessage(`Login-${timestamp}`)
        assertCurrent(currentAttempt, address)
        // Signing UI can remain open beyond the server's 60-second window.
        if (Math.floor(Date.now() / 1000) - timestamp >= 60) throw new Error('auth.signatureExpired')
        // Login already cleared the old Token; send the freshly connected address on POST too.
        checkedAddress = address
        const ref = referralCode.trim()
        const token = await requestWalletLogin({ address, signature, timestamp, ...(ref ? { ref } : {}) }, getAuthRequestSignal())
        assertCurrent(currentAttempt, address)
        checkedAddress = address
        setToken(token)
        useAuthStore.setState({ status: 'signedIn', user: null })
        // Profile loading belongs to the home page; its failure cannot relabel a successful login.
    })()
    activeLogin = task
    void task.then(() => {
        if (activeLogin === task) activeLogin = undefined
    }, () => {
        if (activeLogin === task) { activeLogin = undefined; logout() }
    })
    return task
}

export function mountAuthSession(): () => void {
    const removeAddressProvider = registerHttpWalletAddressProvider(() => {
        const currentAddress = useDappStore.getState().walletAddress
        return checkedAddress && sameAddress(checkedAddress, currentAddress) ? checkedAddress : undefined
    })
    const removeUnauthorized = registerHttpUnauthorizedHandler(logout)
    useAuthStore.setState({ status: 'checking', user: null })
    void resumeSession().catch(() => undefined)
    return () => {
        invalidateWork()
        stopDappWalletListeners()
        removeAddressProvider()
        removeUnauthorized()
    }
}
