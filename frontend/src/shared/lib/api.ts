import axios from 'axios'

/**
 * Cliente HTTP centralizado.
 * El interceptor de request adjuntará el JWT de Cognito en Fase 1.
 *
 * En dev local, Vite hace proxy de /api → http://localhost:8080,
 * así que usamos '/api' como base sin hardcodear el host.
 */
export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Interceptor de request — adjunta el token JWT.
// getAuthToken se inyecta desde fuera para evitar dependencia circular (api ↔ authStore).
// Se inicializa en main.tsx justo después de crear el store.
let getAuthToken: (() => string | null) = () => null

export function setTokenGetter(fn: () => string | null) {
  getAuthToken = fn
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor de response — manejo centralizado de errores HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status

      if (status === 401) {
        // TODO Sprint 1: Redirigir a /login y limpiar el store de auth
        console.warn('No autorizado — redirigir a login')
      }

      if (status === 403) {
        console.warn('Acceso denegado')
      }
    }

    return Promise.reject(error)
  },
)
