// src/shared/stores/user-store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, UserState } from './types'

interface UserStore extends UserState {
  // Actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setRole: (role: User['role']) => void
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
}
export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) => set({
          currentUser: user,
          isAuthenticated: !!user
        }),

        login: (user) => set({
          currentUser: user,
          isAuthenticated: true
        }),

        logout: () => set({
          currentUser: null,
          isAuthenticated: false
        }),

        updateUser: (updates) => {
          const currentUser = get().currentUser
          if (currentUser) {
            set({
              currentUser: { ...currentUser, ...updates }
            })
          }
        },

        setRole: (role) => {
          const currentUser = get().currentUser
          if (currentUser) {
            set({
              currentUser: {
                ...currentUser,
                role,
              }
            })
          }
        },
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'user-store' }
  )
)