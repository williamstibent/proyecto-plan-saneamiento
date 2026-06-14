import { apiClient } from '@/shared/lib/api'
import type { ProgramaCumplimientoResponse } from '@/mocks/types'

export async function getProgramasCumplimiento(
  periodo: 'mes' | 'semana',
): Promise<ProgramaCumplimientoResponse[]> {
  const { data } = await apiClient.get<ProgramaCumplimientoResponse[]>(
    '/programas/cumplimiento',
    { params: { periodo } },
  )
  return data
}
