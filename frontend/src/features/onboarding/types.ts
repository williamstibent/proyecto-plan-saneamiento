import type { ProgramaMinimo } from '@/features/procedures/types'

// ─── Cliente (tenant) ────────────────────────────────────────────────────────

export type TipoEstablecimiento = 'panaderia' | 'restaurante' | 'cafeteria' | 'pasteleria' | 'otro'

export interface Cliente {
  id: string
  nombre: string
  nit?: string
  tipoEstablecimiento: TipoEstablecimiento
  pisosCount: number
  areasCount: number
  poesAsignados: number
  creadoEn: string // ISO date
}

export const TIPO_ESTABLECIMIENTO_LABEL: Record<TipoEstablecimiento, string> = {
  panaderia:    'Panadería',
  restaurante:  'Restaurante',
  cafeteria:    'Cafetería',
  pasteleria:   'Pastelería',
  otro:         'Otro',
}

/** Áreas típicas sugeridas según el tipo de establecimiento — agiliza el paso 2 del onboarding. */
export const AREAS_SUGERIDAS: Record<TipoEstablecimiento, string[]> = {
  panaderia:   ['Cocina', 'Horno', 'Almacenamiento', 'Baños', 'Área de ventas'],
  restaurante: ['Cocina caliente', 'Cocina fría', 'Cuarto frío', 'Comedor', 'Baños'],
  cafeteria:   ['Barra', 'Cocina', 'Almacén', 'Baños', 'Área de clientes'],
  pasteleria:  ['Producción', 'Horno', 'Cuarto frío', 'Área de ventas', 'Baños'],
  otro:        ['Área 1', 'Área 2'],
}

// ─── Pisos y áreas del cliente ───────────────────────────────────────────────

export interface AreaCliente {
  id: string
  pisoId: string
  nombre: string
}

export interface PisoCliente {
  id: string
  clienteId: string
  nombre: string
  orden: number
  areas: AreaCliente[]
}

// ─── Repositorio de POEs (plantillas + POEs de otros clientes) ──────────────

export type OrigenPoe = 'plantilla-plataforma' | 'plantilla-tenant' | 'cliente'

export const ORIGEN_POE_LABEL: Record<OrigenPoe, string> = {
  'plantilla-plataforma': 'Plantilla SanitIA',
  'plantilla-tenant':     'Plantilla de otro cliente',
  cliente:                'POE de cliente',
}

export type ModoBusquedaPoe = 'todos' | 'programa'

export interface BusquedaPoeRepositorio {
  q?: string
  programa?: ProgramaMinimo
}
