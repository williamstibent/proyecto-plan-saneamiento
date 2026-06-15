import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/login'
import { useAuthStore } from '@/shared/stores/authStore'
import type { LoginRequest, AuthUser } from '../types'

/** Ruta de inicio por defecto según el rol del usuario. */
function defaultHomeForRole(user: AuthUser): string {
  if (user.role === 'OPERARIO') return '/operario/hoy'
  return '/dashboard'
}

/**
 * Valida si la ruta `from` tiene sentido para el rol del usuario.
 * Evita que un operario sea redirigido a rutas de admin (p.ej. "/" → "/dashboard")
 * o que un admin acabe en la vista del operario.
 */
function resolveDestination(from: string | undefined, user: AuthUser): string {
  const home = defaultHomeForRole(user)

  // Sin ruta previa → home del rol
  if (!from || from === '/') return home

  // Operario: solo puede volver a rutas de /operario
  if (user.role === 'OPERARIO' && !from.startsWith('/operario')) return home

  // Admin/supervisor: no deben acabar en rutas del operario
  if (user.role !== 'OPERARIO' && from.startsWith('/operario')) return home

  return from
}

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const from = (location.state as { from?: Location })?.from?.pathname

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate(resolveDestination(from, user), { replace: true })
    },
  })
}
