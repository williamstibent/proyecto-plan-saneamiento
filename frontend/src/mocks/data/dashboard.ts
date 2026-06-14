/**
 * Datos mock del dashboard.
 * Editar aquí para cambiar lo que devuelven los endpoints mientras el backend no está listo.
 * Cada constante exportada corresponde a la respuesta de un endpoint específico.
 */

import type {
  DashboardResumenResponse,
  ProgramaCumplimientoResponse,
  TareaHoyResponse,
} from '../types'

// GET /api/v1/dashboard/resumen
export const MOCK_DASHBOARD_RESUMEN: DashboardResumenResponse = {
  saludo: 'Catalina',
  fecha: '13 de junio · sábado',
  totalTareasDia: 28,
  areasActivas: 6,
  tareasProximasAVencer: 3,
  diasParaInvima: 21,
  paqueteEvidenciaPct: 68,
  actividad: [
    { id: '1', usuario: 'Sara', accion: 'completó', objetivo: 'Refrigerador', hora: '09:25', tipo: 'completado' },
    { id: '2', usuario: 'Laura', accion: 'envió a validar', objetivo: 'Pisos · Horno', hora: '09:10', tipo: 'enviado' },
    { id: '3', usuario: 'Juan', accion: 'capturó 3 fotos ·', objetivo: 'Cocina', hora: '08:42', tipo: 'evidencia' },
    { id: '4', usuario: 'Tú', accion: 'abriste NC ·', objetivo: 'Plagas almacén', hora: 'ayer', tipo: 'alerta' },
  ],
}

// GET /api/v1/programas/cumplimiento
export const MOCK_PROGRAMAS: ProgramaCumplimientoResponse[] = [
  {
    id: 'limpieza-desinfeccion',
    nombre: 'Limpieza y Desinfección',
    emoji: '🧼',
    descripcion: '15 procedimientos',
    cumplimiento: 92,
  },
  {
    id: 'agua-potable',
    nombre: 'Agua potable',
    emoji: '💧',
    descripcion: 'Cloro diario',
    cumplimiento: 88,
  },
  {
    id: 'residuos-solidos',
    nombre: 'Residuos sólidos',
    emoji: '♻',
    descripcion: 'Bajo objetivo',
    cumplimiento: 74,
  },
  {
    id: 'control-plagas',
    nombre: 'Control de plagas',
    emoji: '🐜',
    descripcion: 'Proveedor: Sanex',
    cumplimiento: 81,
  },
]

// GET /api/v1/task-instances/hoy
export const MOCK_TAREAS_HOY: TareaHoyResponse[] = [
  // Vencidas
  { id: 't1', poeCode: 'POE-LYD-02', titulo: 'Mesas de trabajo', area: 'Cocina', responsable: 'Juan R.', estado: 'EXPIRED' },
  { id: 't2', poeCode: 'POE-PISOS-14', titulo: 'Sanitización pisos', area: 'Horno', responsable: 'Mateo R.', estado: 'EXPIRED' },
  // Próximas
  { id: 't3', poeCode: 'POE-LYD-03', titulo: 'Desinfectar utensilios', area: 'Cocina', responsable: 'Laura O.', estado: 'PENDING', hora: '09:30', urgente: true },
  { id: 't4', poeCode: 'POE-FRIO-05', titulo: 'Refrigerador 02', area: 'Cuarto frío', responsable: 'Sara C.', estado: 'PENDING', hora: '11:00' },
  { id: 't5', poeCode: 'POE-BAÑOS-01', titulo: 'Limpieza baños', area: 'Baños', responsable: 'Pedro M.', estado: 'PENDING', hora: '12:00' },
  // En ejecución
  { id: 't6', poeCode: 'POE-LYD-02', titulo: 'Mesas · cocina', area: 'Cocina', responsable: 'Juan R.', estado: 'IN_PROGRESS', progreso: 67 },
  { id: 't7', poeCode: 'POE-HORNO-03', titulo: 'Limpieza interior horno', area: 'Horno', responsable: 'Laura O.', estado: 'IN_PROGRESS', progreso: 30 },
  // Completadas
  { id: 't8', poeCode: 'PROG-AGUA', titulo: 'Cloro libre · 2 ppm', area: 'Agua', responsable: 'Sara C.', estado: 'COMPLETED', hora: '07:30' },
  { id: 't9', poeCode: 'POE-MANOS-01', titulo: 'Lavado de manos', area: 'Cocina', responsable: 'Juan R.', estado: 'COMPLETED', hora: '07:45' },
]
