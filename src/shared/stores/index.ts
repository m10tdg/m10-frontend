// src/shared/stores/index.ts
import { useAppStore } from './app-store'
import { useUserStore } from './user-store'

// Re-export all stores for easy importing
export { useAppStore } from './app-store'
export { useUserStore } from './user-store'

// Re-export types
export type { User, AppState, UserState, UserRole } from './types'

// Combined store hooks for convenience
export const useStores = () => ({
  app: useAppStore(),
  user: useUserStore(),
})

// Selector hooks for better performance (only re-render when specific state changes)
export const useAppLoading = () => useAppStore((state) => state.isLoading)
export const useAppError = () => useAppStore((state) => state.error)
export const useAppTheme = () => useAppStore((state) => state.theme)
export const useCurrentUser = () => useUserStore((state) => state.currentUser)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useUserRole = () => useUserStore((state) => state.currentUser?.role)