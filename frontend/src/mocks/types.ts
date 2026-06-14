/**
 * Tipos que representan los DTOs del backend.
 * Deben coincidir exactamente con las respuestas de Spring Boot.
 * Los tipos de UI (features/dashboard/types.ts) se derivan de estos.
 */

import type { TaskStatus } from '@/shared/types'

export interface ActividadResponse {
  id: string
  usuario: string
  accion: string
  objetivo: string
  hora: string
  tipo: 'completado' | 'enviado' | 'evidencia' | 'alerta'
}

export interface DashboardResumenResponse {
  saludo: string
  fecha: string
  totalTareasDia: number
  areasActivas: number
  tareasProximasAVencer: number
  diasParaInvima: number
  paqueteEvidenciaPct: number
  actividad: ActividadResponse[]
}

export interface ProgramaCumplimientoResponse {
  id: string
  nombre: string
  emoji: string
  descripcion: string
  cumplimiento: number
}

export interface TareaHoyResponse {
  id: string
  poeCode: string
  titulo: string
  area: string
  responsable: string
  estado: TaskStatus
  hora?: string
  progreso?: number
  urgente?: boolean
}
