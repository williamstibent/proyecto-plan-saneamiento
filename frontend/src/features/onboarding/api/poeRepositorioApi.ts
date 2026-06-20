import { apiClient } from '@/shared/lib/api'
import type { ProgramaMinimo, PoeWizardData } from '@/features/procedures/types'
import type { PoeRepositorioItem } from '@/mocks/data/poe-repositorio'
import type { PaginatedResponse } from '@/shared/types'

export async function buscarPoeRepositorio(q?: string, programa?: ProgramaMinimo): Promise<PoeRepositorioItem[]> {
  const params: Record<string, string> = {}
  if (q) params.q = q
  if (programa) params.programa = programa

  const res = await apiClient.get<PaginatedResponse<PoeRepositorioItem>>('/poe-repositorio', { params })
  return res.data.data
}

export async function getPoeRepositorioDetalle(id: string): Promise<PoeWizardData> {
  const res = await apiClient.get<PoeWizardData>(`/poe-repositorio/${id}`)
  return res.data
}

export interface AdaptarPoeRequest {
  clienteId: string
  origenPoeId: string
  data: PoeWizardData
}

export interface AdaptarPoeResponse {
  id: string
  codigo: string
  nombre: string
  clienteId: string
  origenPoeId: string
  creadoEn: string
}

export async function adaptarPoeParaCliente({ clienteId, origenPoeId, data }: AdaptarPoeRequest): Promise<AdaptarPoeResponse> {
  const res = await apiClient.post<AdaptarPoeResponse>(`/clientes/${clienteId}/poes`, { origenPoeId, data })
  return res.data
}
