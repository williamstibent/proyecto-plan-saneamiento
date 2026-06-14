import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/login'
import { useAuthStore } from '@/shared/stores/authStore'
import type { LoginRequest } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  // Si el usuario venía de una ruta protegida, redirigir allá después del login
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate(from, { replace: true })
    },
  })
}
