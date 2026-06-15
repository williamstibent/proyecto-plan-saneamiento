import { apiClient } from '@/shared/lib/api'
import type {
  TareaResumen,
  TareaOperario,
  PasoEjecucion,
  CompletarPasoRequest,
  CompletarTareaRequest,
} from '../types'

/** Tareas asignadas al operario para hoy */
export async function getTareasHoy(): Promise<TareaResumen[]> {
  const res = await apiClient.get<TareaResumen[]>('/operario/tareas-hoy')
  return res.data
}

/** Detalle completo de una tarea (con pasos) */
export async function getTareaDetalle(id: string): Promise<TareaOperario> {
  const res = await apiClient.get<TareaOperario>(`/operario/tareas/${id}`)
  return res.data
}

/** Marcar un paso del checklist como completado */
export async function completarPaso(
  tareaId: string,
  pasoId: string,
  body: CompletarPasoRequest,
): Promise<PasoEjecucion> {
  const res = await apiClient.patch<PasoEjecucion>(
    `/operario/tareas/${tareaId}/pasos/${pasoId}`,
    body,
  )
  return res.data
}

/** Finalizar la tarea completa */
export async function completarTarea(
  tareaId: string,
  body: CompletarTareaRequest,
): Promise<TareaOperario> {
  const res = await apiClient.post<TareaOperario>(
    `/operario/tareas/${tareaId}/completar`,
    body,
  )
  return res.data
}

/** Historial de tareas completadas */
export async function getHistorial(): Promise<TareaResumen[]> {
  const res = await apiClient.get<TareaResumen[]>('/operario/historial')
  return res.data
}
