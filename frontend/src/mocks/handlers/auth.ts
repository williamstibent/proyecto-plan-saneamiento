import { http, HttpResponse, delay } from 'msw'
import type { LoginRequest, LoginResponse } from '@/features/auth/types'

/**
 * Mock del endpoint de autenticación.
 * Acepta cualquier email + password no vacíos y devuelve un token ficticio.
 * Cuando Cognito esté integrado, este handler se elimina y el tráfico
 * pasa al backend real.
 */
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

    const response: LoginResponse = {
      token: 'mock-jwt-token.eyJ0ZW5hbnRJZCI6Im1vY2stdGVuYW50In0.mock-signature',
      user: {
        id: 'mock-user-id',
        nombre: body.email.split('@')[0].replace(/[._]/g, ' '),
        role: 'ADMIN_CLIENTE',
        tenantId: 'mock-tenant-id',
        tenantNombre: 'ArtesaPan',
      },
    }

    return HttpResponse.json(response)
  }),
]
