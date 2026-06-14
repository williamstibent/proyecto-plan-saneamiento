import type { UserRole } from '@/shared/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  nombre: string
  role: UserRole
  tenantId: string
  tenantNombre: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}
