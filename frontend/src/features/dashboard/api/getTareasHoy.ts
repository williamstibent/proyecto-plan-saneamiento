import { apiClient } from '@/shared/lib/api'
import type { TareaHoyResponse } from '@/mocks/types'
import type { TaskStatus } from '@/shared/types'

export async function getTareasHoy(estado?: TaskStatus): Promise<TareaHoyResponse[]> {
  const { data } = await apiClient.get<TareaHoyResponse[]>('/task-instances/hoy', {
    params: estado ? { estado } : undefined,
  })
  return data
}
