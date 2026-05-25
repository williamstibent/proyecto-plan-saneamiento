/**
 * Tipos de dominio compartidos entre features.
 * Los tipos específicos de cada feature viven en features/{name}/types.ts
 */

// Respuesta paginada estándar del backend
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

// Respuesta de error estándar del backend
export interface ApiError {
  code: string
  message: string
  timestamp: string
}

// Roles del sistema (deben coincidir con los del backend)
export type UserRole =
  | 'ADMIN_PLATAFORMA'
  | 'CONSULTOR'
  | 'ADMIN_CLIENTE'
  | 'OPERARIO'

// Estado de una tarea
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'

// Fases de un procedimiento POE
export type ProcedurePhase = 'PREPARATION' | 'CLEANING' | 'DISINFECTION'

// Frecuencia de una tarea
export type TaskFrequency =
  | 'BEFORE_SHIFT'
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
