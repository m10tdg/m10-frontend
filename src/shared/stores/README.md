# Zustand Store Setup

This directory contains a clean, scalable, and organized Zustand store setup following clean code principles.

## 🏗️ Architecture

### Store Structure
- **`types.ts`** - TypeScript interfaces and types
- **`app-store.ts`** - Global app state (loading, errors, theme)
- **`user-store.ts`** - User authentication and profile state
- **`index.ts`** - Main exports and convenience hooks

### Key Principles
- **Separation of Concerns** - Each store handles a specific domain
- **Type Safety** - Full TypeScript support with proper interfaces
- **Persistence** - User data persists across sessions
- **DevTools** - Redux DevTools integration for debugging
- **Performance** - Selector hooks to prevent unnecessary re-renders

## 🚀 Usage

### Basic Usage

```typescript
import { useAppStore, useUserStore } from '@/shared/stores'

// In your component
function MyComponent() {
  const { isLoading, setLoading } = useAppStore()
  const { currentUser, login } = useUserStore()

  // Use the state and actions
  const handleLogin = () => {
    setLoading(true)
    // ... login logic
    login(userData)
    setLoading(false)
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {currentUser && <div>Welcome {currentUser.name}!</div>}
    </div>
  )
}
```

### Using Combined Store

```typescript
import { useStores } from '@/shared/stores'

function MyComponent() {
  const { app, user } = useStores()

  return (
    <div>
      <p>Theme: {app.theme}</p>
      <p>User: {user.currentUser?.name}</p>
    </div>
  )
}
```

### Using Selector Hooks (Performance Optimized)

```typescript
import { useAppLoading, useCurrentUser } from '@/shared/stores'

function MyComponent() {
  const isLoading = useAppLoading() // Only re-renders when loading changes
  const user = useCurrentUser() // Only re-renders when user changes

  // ... component logic
}
```

## 🛠️ Adding New Stores

1. **Create types** in `types.ts`:
```typescript
export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface TodoState {
  todos: Todo[]
}
```

2. **Create store slice**:
```typescript
// todo-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface TodoStore extends TodoState {
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
}

export const useTodoStore = create<TodoStore>()(
  devtools(
    (set) => ({
      todos: [],

      addTodo: (text) => set((state) => ({
        todos: [...state.todos, {
          id: Date.now().toString(),
          text,
          completed: false
        }]
      })),

      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      })),

      removeTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
    }),
    { name: 'todo-store' }
  )
)
```

3. **Export from index.ts**:
```typescript
export { useTodoStore } from './todo-store'
export const useStores = () => ({
  app: useAppStore(),
  user: useUserStore(),
  todo: useTodoStore(),
})
```

## 📋 Available Stores

### App Store (`useAppStore`)
- **State**: `isLoading`, `error`, `theme`
- **Actions**: `setLoading`, `setError`, `clearError`, `setTheme`, `toggleTheme`
- **Persistence**: None (in-memory only)

### User Store (`useUserStore`)
- **State**: `currentUser`, `isAuthenticated`
- **Actions**: `setUser`, `login`, `logout`, `updateUser`
- **Persistence**: User data persists in localStorage

## 🔧 Best Practices

1. **Use selector hooks** for better performance
2. **Keep stores focused** on specific domains
3. **Use meaningful action names** (e.g., `setLoading` not `set`)
4. **Handle async operations** properly with loading states
5. **Clear errors** after handling them
6. **Use TypeScript** for all store interactions
7. **Test your stores** with Zustand's testing utilities

## 🐛 Debugging

All stores are connected to Redux DevTools. Open your browser's DevTools and look for the "Zustand" tab to inspect and debug your store state.

## 📚 Resources

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)