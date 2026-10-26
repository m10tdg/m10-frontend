// src/shared/stores/types.ts
export type UserRole = 'admin' | 'test_engineer' | 'standard_user' | 'developer'

export type Lang = 'en' | 'tr' | 'de'

export interface UserTenant {
  id: string
  name: string
  slug: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  tenant: UserTenant
}

export interface PlatformOwner {
  id: string
  name: string
  email: string
}

export interface AppState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark'
}

export interface UserState {
  currentUser: User | null
  token: string | null
  isAuthenticated: boolean
}
