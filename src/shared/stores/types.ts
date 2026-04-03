// src/shared/stores/types.ts
export type UserRole = 'admin' | 'test_engineer' | 'standard_user' | 'developer'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export interface AppState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark'
}

export interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
}