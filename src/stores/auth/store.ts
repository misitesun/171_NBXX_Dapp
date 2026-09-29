import { create } from 'zustand'
import type { UserInfo } from '@/features/user/types.ts'

export interface AuthStoreState {
    status: 'checking' | 'signedOut' | 'signedIn'
    user: UserInfo | null
}

export const useAuthStore = create<AuthStoreState>()(() => ({ status: 'checking', user: null }))
