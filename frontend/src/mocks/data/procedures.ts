import type { ProgramaMinimo, TaskFrequency } from '@/features/procedures/types'

export interface PoeResumen {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  programa: ProgramaMinimo
  areaAplicacion: string
  frecuencia: TaskFrequency
  version: number
  estado: 'activo' | 'borrador' | 'desactivado'
  eppCount: number
  pasosCount: number
  productosCount: number
  creadoEn: string        // ISO date
  actualizadoEn: string
}

// Store en memoria — persiste durante la sesión del worker MSW
export const MOCK_PROCEDIMIENTOS: PoeResumen[] = [
  {
    id: 'poe-001',
    codigo: 'POE-LYD-01',
    nombre: 'Limpieza y desinfección de mesas de trabajo',
    descripcion: 'Procedimiento estándar para superficies de contacto directo con alimentos.',
    programa: 'limpieza-desinfeccion',
    areaAplicacion: 'Cocina',
    frecuencia: 'diaria',
    version: 2,
    estado: 'activo',
    eppCount: 3,
    pasosCount: 8,
    productosCount: 2,
    creadoEn: '2025-11-12T08:00:00Z',
    actualizadoEn: '2026-01-05T10:30:00Z',
  },
  {
    id: 'poe-002',
    codigo: 'POE-LYD-02',
    nombre: 'Desinfección de pisos y paredes área húmeda',
    descripcion: 'Aplicación de desinfectante en superficies no alimentarias.',
    programa: 'limpieza-desinfeccion',
    areaAplicacion: 'Área de ventas',
    frecuencia: 'semanal',
    version: 1,
    estado: 'activo',
    eppCount: 4,
    pasosCount: 6,
    productosCount: 1,
    creadoEn: '2025-11-15T09:00:00Z',
    actualizadoEn: '2025-11-15T09:00:00Z',
  },
  {
    id: 'poe-003',
    codigo: 'POE-CP-01',
    nombre: 'Control de plagas — inspección y registro',
    descripcion: 'Inspección visual mensual de trampas y puntos críticos.',
    programa: 'control-plagas',
    areaAplicacion: 'Toda la planta',
    frecuencia: 'mensual',
    version: 1,
    estado: 'activo',
    eppCount: 2,
    pasosCount: 10,
    productosCount: 0,
    creadoEn: '2025-12-01T07:00:00Z',
    actualizadoEn: '2025-12-01T07:00:00Z',
  },
  {
    id: 'poe-004',
    codigo: 'POE-AP-01',
    nombre: 'Verificación calidad agua potable',
    descripcion: 'Toma de muestras y registro de cloro residual.',
    programa: 'agua-potable',
    areaAplicacion: 'Cocina',
    frecuencia: 'diaria',
    version: 1,
    estado: 'activo',
    eppCount: 1,
    pasosCount: 4,
    productosCount: 1,
    creadoEn: '2025-12-10T08:00:00Z',
    actualizadoEn: '2026-02-20T11:00:00Z',
  },
  {
    id: 'poe-005',
    codigo: 'POE-RS-01',
    nombre: 'Clasificación y disposición de residuos sólidos',
    descripcion: 'Separación en origen y entrega a gestor externo.',
    programa: 'residuos-solidos',
    areaAplicacion: 'Toda la planta',
    frecuencia: 'diaria',
    version: 1,
    estado: 'borrador',
    eppCount: 3,
    pasosCount: 5,
    productosCount: 0,
    creadoEn: '2026-03-01T08:00:00Z',
    actualizadoEn: '2026-03-01T08:00:00Z',
  },
]
