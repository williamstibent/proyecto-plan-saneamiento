import type { TaskStatus } from '@/shared/types'

/**
 * Tipos del feature: floorplan (mapa interactivo del establecimiento).
 *
 * Jerarquía: Establecimiento → Piso → Área (ver Plan de implementación, sección 4.5).
 * Las tareas se asignan al área/turno, no a un operario específico — por eso este
 * feature es de solo lectura: no incluye reasignación de tareas ni apertura de NC
 * (fuera de alcance de MVP Fase 1).
 */

/** Punto de un polígono, en porcentaje (0-100) del ancho/alto del plano. */
export interface PuntoPoligono {
  x: number
  y: number
}

/** Estado de cumplimiento agregado de un área para el día actual. */
export type EstadoCumplimiento = 'AL_DIA' | 'PROXIMO' | 'VENCIDO'

export const ESTADO_CUMPLIMIENTO_LABEL: Record<EstadoCumplimiento, string> = {
  AL_DIA: 'Al día',
  PROXIMO: 'Próximo a vencer',
  VENCIDO: 'Vencida',
}

/** Área física dentro de un piso, con su polígono y resumen de cumplimiento. */
export interface AreaPlano {
  id: string
  pisoId: string
  nombre: string
  poligono: PuntoPoligono[]
  estadoCumplimiento: EstadoCumplimiento
  enEjecucion: boolean
  totalTareas: number
  tareasCompletadas: number
  tareasPendientes: number
  tareasVencidas: number
}

/** Piso/nivel del establecimiento, con sus áreas. */
export interface Piso {
  id: string
  nombre: string
  orden: number
  areas: AreaPlano[]
}

/** Resumen de una tarea del día para el panel de detalle de un área (solo lectura). */
export interface TareaAreaResumen {
  id: string
  poeCode: string
  nombre: string
  estado: TaskStatus
  horaEstimada?: string
  urgente?: boolean
  /** Operario que está ejecutando o ejecutó la tarea — informativo, no editable. */
  operarioEjecutando?: string
  progreso?: number
  completadoEn?: string
}
