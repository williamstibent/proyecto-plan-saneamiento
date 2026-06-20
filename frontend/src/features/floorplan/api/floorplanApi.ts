import { apiClient } from '@/shared/lib/api'
import type { Piso, TareaAreaResumen } from '../types'

/** Pisos del establecimiento con sus áreas y cumplimiento del día. */
export async function getPisos(): Promise<Piso[]> {
  const res = await apiClient.get<Piso[]>('/pisos')
  return res.data
}

/** Tareas del día para un área específica (solo lectura). */
export async function getTareasArea(areaId: string): Promise<TareaAreaResumen[]> {
  const res = await apiClient.get<TareaAreaResumen[]>(`/areas/${areaId}/tareas-hoy`)
  return res.data
}
