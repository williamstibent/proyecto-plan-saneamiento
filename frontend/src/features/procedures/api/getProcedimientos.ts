import { apiClient } from '@/shared/lib/api'
import type { ProgramaMinimo } from '../types'
import type { PoeResumen } from '@/mocks/data/procedures'
import type { PaginatedResponse } from '@/shared/types'

export async function getProcedimientos(programa?: ProgramaMinimo): Promise<PoeResumen[]> {
  const params = programa ? { programa } : {}
  const res    = await apiClient.get<PaginatedResponse<PoeResumen>>('/procedimientos', { params })
  return res.data.data
}

export async function createProcedimiento(body: unknown): Promise<PoeResumen> {
  const res = await apiClient.post<PoeResumen>('/procedimientos', body)
  return res.data
}
