import { apiClient } from '@/shared/lib/api'
import type { DashboardResumenResponse } from '@/mocks/types'

export async function getDashboardResumen(): Promise<DashboardResumenResponse> {
  const { data } = await apiClient.get<DashboardResumenResponse>('/dashboard/resumen')
  return data
}
