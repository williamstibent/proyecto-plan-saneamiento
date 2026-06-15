import type { TaskStatus } from '@/shared/types'
import type { FaseChecklist, TaskFrequency } from '@/features/procedures/types'

// ─── Paso de ejecución ────────────────────────────────────────────────────────

export type PasoEstado = 'pendiente' | 'completado'

export interface PasoEjecucion {
  id: string
  descripcion: string
  fase: FaseChecklist
  requiereFoto: boolean
  ordenEjecucion: number
  estado: PasoEstado
  observacion?: string
  evidenciaUrl?: string
  completadoEn?: string
}

// ─── Tarea completa (detalle con pasos) ───────────────────────────────────────

export interface TareaOperario {
  id: string
  poeCode: string
  nombre: string
  descripcion: string
  area: string
  frecuencia: TaskFrequency
  estado: TaskStatus
  horaEstimada?: string
  urgente?: boolean
  pasos: PasoEjecucion[]
  completadoEn?: string
  observacionGeneral?: string
}

// ─── Tarea resumen (lista) ────────────────────────────────────────────────────

export interface TareaResumen {
  id: string
  poeCode: string
  nombre: string
  area: string
  frecuencia: TaskFrequency
  estado: TaskStatus
  horaEstimada?: string
  urgente?: boolean
  totalPasos: number
  pasosCompletados: number
  completadoEn?: string
}

// ─── Requests ────────────────────────────────────────────────────────────────

export interface CompletarPasoRequest {
  observacion?: string
}

export interface CompletarTareaRequest {
  observacionGeneral?: string
}

// ─── Labels de apoyo ─────────────────────────────────────────────────────────

export const ESTADO_TAREA: Record<TaskStatus, { label: string; emoji: string }> = {
  PENDING:     { label: 'Pendiente',    emoji: '⏳' },
  IN_PROGRESS: { label: 'En ejecución', emoji: '🔄' },
  COMPLETED:   { label: 'Completada',   emoji: '✅' },
  EXPIRED:     { label: 'Vencida',      emoji: '⚠️' },
}
