import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'

/**
 * Wrapper de rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /login guardando
 * la URL intentada en `state.from` para redirigir después del login.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
