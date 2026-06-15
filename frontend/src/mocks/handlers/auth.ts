import { http, HttpResponse, delay } from 'msw'
import type { LoginRequest, LoginResponse, AuthUser } from '@/features/auth/types'

/**
 * Usuarios de prueba disponibles en modo mock.
 * Cada email mapea a un rol y perfil distinto.
 * Cualquier contraseña no vacía es válida.
 *
 * Credenciales rápidas:
 *   operario@demo.co   / demo  → rol OPERARIO   (redirige a /operario/hoy)
 *   supervisor@demo.co / demo  → rol SUPERVISOR  (redirige a /dashboard)
 *   admin@demo.co      / demo  → rol ADMIN_CLIENTE (redirige a /dashboard)
 */
const MOCK_USERS: Record<string, Omit<AuthUser, 'id'>> = {
  'operario@demo.co': {
    nombre: 'Carlos Martínez',
    role: 'OPERARIO',
    tenantId: 'mock-tenant-id',
    tenantNombre: 'ArtesaPan',
  },
  'supervisor@demo.co': {
    nombre: 'Laura Torres',
    role: 'SUPERVISOR',
    tenantId: 'mock-tenant-id',
    tenantNombre: 'ArtesaPan',
  },
  'admin@demo.co': {
    nombre: 'Ana García',
    role: 'ADMIN_CLIENTE',
    tenantId: 'mock-tenant-id',
    tenantNombre: 'ArtesaPan',
  },
}

/** Usuario por defecto cuando el email no está en el mapa (cualquier otro email) */
const DEFAULT_USER = (email: string): Omit<AuthUser, 'id'> => ({
  nombre: email.split('@')[0].replace(/[._]/g, ' '),
  role: 'ADMIN_CLIENTE',
  tenantId: 'mock-tenant-id',
  tenantNombre: 'ArtesaPan',
})

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(500)

    const body = await request.json() as LoginRequest

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Email y contraseña son requeridos', timestamp: new Date().toISOString() },
        { status: 400 },
      )
    }

    const profile = MOCK_USERS[body.email.toLowerCase()] ?? DEFAULT_USER(body.email)

    const response: LoginResponse = {
      token: `mock-jwt.${btoa(JSON.stringify({ role: profile.role, tenantId: profile.tenantId }))}.sig`,
      user: {
        id: `mock-user-${profile.role.toLowerCase()}`,
        ...profile,
      },
    }

    return HttpResponse.json(response)
  }),
]
