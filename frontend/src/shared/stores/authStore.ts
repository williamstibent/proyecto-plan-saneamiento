import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '@/features/auth/types'
import type { UserRole } from '@/shared/types'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean

  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

/**
 * Store de autenticación con persistencia en sessionStorage.
 *
 * En desarrollo (VITE_MOCK=true) esto simula lo que Cognito haría:
 * - La sesión persiste mientras el tab esté abierto (sessionStorage).
 * - Se pierde al cerrar el tab, igual que un token con expiración corta.
 *
 * En producción, Cognito maneja la sesión vía sus propias cookies/tokens
 * y este store solo actúa como caché de la sesión activa.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'sanitia-auth-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function getCurrentRole(): UserRole | null {
  return useAuthStore.getState().user?.role ?? null
}
