// src/shared/stores/owner-store.ts
// Session of an M10 platform owner. Kept apart from the tenant user session so
// signing in to one panel never affects the other.
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { PlatformOwner } from './types'

interface OwnerState {
  owner: PlatformOwner | null
  token: string | null
}

interface OwnerStore extends OwnerState {
  login: (owner: PlatformOwner, token: string) => void
  logout: () => void
}

const initialState: OwnerState = {
  owner: null,
  token: null,
}

export const useOwnerStore = create<OwnerStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        login: (owner, token) => set({ owner, token }),
        logout: () => set(initialState),
      }),
      { name: 'owner-store' }
    ),
    { name: 'owner-store' }
  )
)
