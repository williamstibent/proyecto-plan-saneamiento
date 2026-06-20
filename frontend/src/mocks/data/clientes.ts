import type { Cliente, PisoCliente } from '@/features/onboarding/types'

/**
 * Datos mock de clientes (tenants) para el flujo de onboarding y reutilización
 * de POEs. Store en memoria — persiste durante la sesión del worker MSW.
 */
export const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cliente-001',
    nombre: 'ArtesaPan',
    nit: '900.123.456-7',
    tipoEstablecimiento: 'panaderia',
    pisosCount: 2,
    areasCount: 8,
    poesAsignados: 5,
    creadoEn: '2025-10-02T08:00:00Z',
  },
  {
    id: 'cliente-002',
    nombre: 'Panadería San José',
    nit: '900.654.321-1',
    tipoEstablecimiento: 'panaderia',
    pisosCount: 1,
    areasCount: 3,
    poesAsignados: 4,
    creadoEn: '2025-08-14T08:00:00Z',
  },
  {
    id: 'cliente-003',
    nombre: 'Restaurante El Fogón',
    tipoEstablecimiento: 'restaurante',
    pisosCount: 0,
    areasCount: 0,
    poesAsignados: 0,
    creadoEn: '2026-05-20T08:00:00Z',
  },
  {
    id: 'cliente-004',
    nombre: 'Cafetería Aroma',
    tipoEstablecimiento: 'cafeteria',
    pisosCount: 0,
    areasCount: 0,
    poesAsignados: 0,
    creadoEn: '2026-06-10T08:00:00Z',
  },
]

export const MOCK_PISOS_POR_CLIENTE: Record<string, PisoCliente[]> = {
  'cliente-001': [
    {
      id: 'piso-cli001-1',
      clienteId: 'cliente-001',
      nombre: 'Planta de producción',
      orden: 1,
      areas: [
        { id: 'area-cli001-1', pisoId: 'piso-cli001-1', nombre: 'Cocina' },
        { id: 'area-cli001-2', pisoId: 'piso-cli001-1', nombre: 'Horno' },
        { id: 'area-cli001-3', pisoId: 'piso-cli001-1', nombre: 'Cuarto frío' },
        { id: 'area-cli001-4', pisoId: 'piso-cli001-1', nombre: 'Lavado de utensilios' },
      ],
    },
    {
      id: 'piso-cli001-2',
      clienteId: 'cliente-001',
      nombre: 'Bodega y servicios',
      orden: 2,
      areas: [
        { id: 'area-cli001-5', pisoId: 'piso-cli001-2', nombre: 'Almacén' },
        { id: 'area-cli001-6', pisoId: 'piso-cli001-2', nombre: 'Recepción de materia prima' },
        { id: 'area-cli001-7', pisoId: 'piso-cli001-2', nombre: 'Baños' },
        { id: 'area-cli001-8', pisoId: 'piso-cli001-2', nombre: 'Oficina administrativa' },
      ],
    },
  ],
  'cliente-002': [
    {
      id: 'piso-cli002-1',
      clienteId: 'cliente-002',
      nombre: 'Local principal',
      orden: 1,
      areas: [
        { id: 'area-cli002-1', pisoId: 'piso-cli002-1', nombre: 'Cocina' },
        { id: 'area-cli002-2', pisoId: 'piso-cli002-1', nombre: 'Área de ventas' },
        { id: 'area-cli002-3', pisoId: 'piso-cli002-1', nombre: 'Baños' },
      ],
    },
  ],
  'cliente-003': [],
  'cliente-004': [],
}
