import { apiClient } from '@/shared/lib/api'
import type { Cliente, PisoCliente, TipoEstablecimiento } from '../types'
import type { PaginatedResponse } from '@/shared/types'

export async function getClientes(): Promise<Cliente[]> {
  const res = await apiClient.get<PaginatedResponse<Cliente>>('/clientes')
  return res.data.data
}

export interface CrearClienteRequest {
  nombre: string
  nit?: string
  tipoEstablecimiento: TipoEstablecimiento
}

export async function crearCliente(body: CrearClienteRequest): Promise<Cliente> {
  const res = await apiClient.post<Cliente>('/clientes', body)
  return res.data
}

export async function getPisosCliente(clienteId: string): Promise<PisoCliente[]> {
  const res = await apiClient.get<PisoCliente[]>(`/clientes/${clienteId}/pisos`)
  return res.data
}

export interface CrearPisosRequest {
  clienteId: string
  pisos: { nombre: string; areas: string[] }[]
}

export async function crearPisos({ clienteId, pisos }: CrearPisosRequest): Promise<PisoCliente[]> {
  const res = await apiClient.post<PisoCliente[]>(`/clientes/${clienteId}/pisos`, { pisos })
  return res.data
}
