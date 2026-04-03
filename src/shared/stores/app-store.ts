// src/shared/stores/app-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppState } from './types'

interface AppStore extends AppState {
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  theme: 'light',
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const currentTheme = get().theme
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' })
      },
    }),
    { name: 'app-store' }
  )
)