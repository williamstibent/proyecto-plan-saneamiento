import type { Piso, AreaPlano, TareaAreaResumen, EstadoCumplimiento } from '@/features/floorplan/types'

/**
 * Datos mock del mapa interactivo del establecimiento.
 * Las tareas se asignan al área del día (no a un operario en particular),
 * por eso `operarioEjecutando` es solo informativo: indica quién la tomó,
 * no implica que esté reservada para esa persona.
 */

// ─── Tareas de hoy por área ─────────────────────────────────────────────────

// Identificadores que eventualmente serán el UUID real del área en la base de
// datos (usado también para resolver los procedimientos asociados al área).
export const AREA_ID = {
  cocina:        'ae1d798a-3cd7-462d-98f2-b0614cec50d5',
  horno:         'bdb97eac-ba70-44d5-a6db-a1910554bfa2',
  cuartoFrio:    '78af0330-ac46-49bc-aefb-f7d563808e3f',
  lavado:        'abcf4de7-307c-4680-9067-097cd4a1cd5d',
  almacen:       '511620e5-1257-4128-a566-5e0441bbfde5',
  recepcion:     '248284de-ccf9-47af-9226-221477b076a1',
  banos:         '95a2bebb-2d03-46fe-8e38-363f871dd6f8',
  oficina:       '08ff230e-968a-4bda-ba72-8a8e31812735',
} as const

export const MOCK_TAREAS_POR_AREA: Record<string, TareaAreaResumen[]> = {
  [AREA_ID.cocina]: [
    { id: 'a-t1', poeCode: 'POE-LYD-02', nombre: 'Mesas de trabajo y consumo', estado: 'IN_PROGRESS', horaEstimada: '09:00', operarioEjecutando: 'Juan R.', progreso: 65 },
    { id: 'a-t2', poeCode: 'POE-MANOS-01', nombre: 'Lavado de manos — verificación', estado: 'COMPLETED', horaEstimada: '07:45', operarioEjecutando: 'Juan R.', completadoEn: hoy(7, 50) },
    { id: 'a-t3', poeCode: 'POE-LYD-03', nombre: 'Desinfectar utensilios de cocina', estado: 'PENDING', horaEstimada: '11:30', urgente: true },
  ],
  [AREA_ID.horno]: [
    { id: 'a-t4', poeCode: 'POE-PISOS-01', nombre: 'Sanitización de pisos', estado: 'IN_PROGRESS', horaEstimada: '07:00', operarioEjecutando: 'Carlos Martínez', progreso: 60 },
    { id: 'a-t5', poeCode: 'POE-HORNO-03', nombre: 'Limpieza interior horno', estado: 'PENDING', horaEstimada: '13:00' },
  ],
  [AREA_ID.cuartoFrio]: [
    { id: 'a-t6', poeCode: 'POE-FRIO-05', nombre: 'Refrigerador y congelador', estado: 'EXPIRED', horaEstimada: '08:00' },
    { id: 'a-t7', poeCode: 'POE-FRIO-06', nombre: 'Verificación de temperatura', estado: 'PENDING', horaEstimada: '15:00' },
  ],
  [AREA_ID.lavado]: [
    { id: 'a-t8', poeCode: 'POE-LYD-04', nombre: 'Lavado y desinfección de utensilios', estado: 'COMPLETED', horaEstimada: '12:00', operarioEjecutando: 'Mateo R.', completadoEn: hoy(12, 15) },
  ],
  [AREA_ID.almacen]: [
    { id: 'a-t9', poeCode: 'POE-RESI-03', nombre: 'Registro y disposición de residuos', estado: 'PENDING', horaEstimada: '14:00' },
    { id: 'a-t10', poeCode: 'POE-PLAGAS-02', nombre: 'Inspección de cebaderos', estado: 'PENDING', horaEstimada: '16:00', urgente: true },
  ],
  [AREA_ID.banos]: [
    { id: 'a-t11', poeCode: 'POE-BAÑOS-01', nombre: 'Limpieza y desinfección de baños', estado: 'EXPIRED', horaEstimada: '09:30' },
    { id: 'a-t12', poeCode: 'POE-BAÑOS-02', nombre: 'Reposición de insumos (jabón, papel)', estado: 'COMPLETED', horaEstimada: '07:00', operarioEjecutando: 'Pedro M.', completadoEn: hoy(7, 10) },
  ],
  [AREA_ID.recepcion]: [
    { id: 'a-t13', poeCode: 'PROG-AGUA', nombre: 'Verificación cloro residual — tanque', estado: 'COMPLETED', horaEstimada: '06:30', operarioEjecutando: 'Sara C.', completadoEn: hoy(6, 40) },
    { id: 'a-t14', poeCode: 'POE-RECEP-01', nombre: 'Inspección sanitaria de materia prima', estado: 'PENDING', horaEstimada: '10:00' },
  ],
  [AREA_ID.oficina]: [],
}

function hoy(h: number, m: number): string {
  const dt = new Date()
  dt.setHours(h, m, 0, 0)
  return dt.toISOString()
}

/** Deriva el resumen de cumplimiento de un área a partir de sus tareas del día. */
function resumirArea(tareas: TareaAreaResumen[]): {
  estadoCumplimiento: EstadoCumplimiento
  enEjecucion: boolean
  totalTareas: number
  tareasCompletadas: number
  tareasPendientes: number
  tareasVencidas: number
} {
  const tareasCompletadas = tareas.filter((t) => t.estado === 'COMPLETED').length
  const tareasPendientes  = tareas.filter((t) => t.estado === 'PENDING').length
  const tareasVencidas    = tareas.filter((t) => t.estado === 'EXPIRED').length
  const enEjecucion       = tareas.some((t) => t.estado === 'IN_PROGRESS')

  let estadoCumplimiento: EstadoCumplimiento = 'AL_DIA'
  if (tareasVencidas > 0) estadoCumplimiento = 'VENCIDO'
  else if (tareasPendientes > 0) estadoCumplimiento = 'PROXIMO'

  return { estadoCumplimiento, enEjecucion, totalTareas: tareas.length, tareasCompletadas, tareasPendientes, tareasVencidas }
}

/** Construye un AreaPlano completo a partir de su geometría + tareas del día. */
function area(id: string, pisoId: string, nombre: string, poligono: { x: number; y: number }[]): AreaPlano {
  return { id, pisoId, nombre, poligono, ...resumirArea(MOCK_TAREAS_POR_AREA[id] ?? []) }
}

// ─── Pisos del establecimiento ──────────────────────────────────────────────
// Coordenadas de polígono en porcentaje (0-100) del ancho/alto del plano.

export const MOCK_PISOS: Piso[] = [
  {
    id: 'piso1',
    nombre: 'Planta de producción',
    orden: 1,
    areas: [
      area(AREA_ID.cocina,     'piso1', 'Cocina',                 [{ x: 4, y: 6 }, { x: 46, y: 6 }, { x: 46, y: 46 }, { x: 4, y: 46 }]),
      area(AREA_ID.horno,      'piso1', 'Horno',                  [{ x: 54, y: 6 }, { x: 96, y: 6 }, { x: 96, y: 40 }, { x: 54, y: 40 }]),
      area(AREA_ID.cuartoFrio, 'piso1', 'Cuarto frío',            [{ x: 4, y: 54 }, { x: 46, y: 54 }, { x: 46, y: 94 }, { x: 4, y: 94 }]),
      area(AREA_ID.lavado,     'piso1', 'Lavado de utensilios',   [{ x: 54, y: 46 }, { x: 96, y: 46 }, { x: 96, y: 94 }, { x: 54, y: 94 }]),
    ],
  },
  {
    id: 'piso2',
    nombre: 'Bodega y servicios',
    orden: 2,
    areas: [
      area(AREA_ID.almacen,   'piso2', 'Almacén',                          [{ x: 4, y: 6 }, { x: 50, y: 6 }, { x: 50, y: 50 }, { x: 4, y: 50 }]),
      area(AREA_ID.recepcion, 'piso2', 'Recepción de materia prima',       [{ x: 56, y: 6 }, { x: 96, y: 6 }, { x: 96, y: 36 }, { x: 56, y: 36 }]),
      area(AREA_ID.banos,     'piso2', 'Baños',                            [{ x: 56, y: 44 }, { x: 78, y: 44 }, { x: 78, y: 94 }, { x: 56, y: 94 }]),
      area(AREA_ID.oficina,   'piso2', 'Oficina administrativa',           [{ x: 82, y: 44 }, { x: 96, y: 44 }, { x: 96, y: 94 }, { x: 82, y: 94 }]),
    ],
  },
]
