import type { TareaOperario, TareaResumen } from '@/features/operario/types'

/**
 * Almacén mutable en memoria — simula la base de datos del backend
 * para la vista del operario durante las pruebas con MSW.
 */

// ─── Tareas de hoy (detalle completo, con pasos) ──────────────────────────────

export const MOCK_TAREAS_HOY: TareaOperario[] = [
  {
    id: 'tarea-001',
    poeCode: 'POE-PISOS-01',
    nombre: 'Sanitización de pisos — Área Horno',
    descripcion: 'Limpieza y desinfección de pisos del área de horno según protocolo de amonio cuaternario.',
    area: 'Horno',
    frecuencia: 'diaria',
    estado: 'IN_PROGRESS',
    horaEstimada: '07:00',
    urgente: false,
    pasos: [
      { id: 'p1-1', descripcion: 'Retirar equipos y utensilios del área', fase: 'preparacion', requiereFoto: false, ordenEjecucion: 1, estado: 'completado', completadoEn: new Date().toISOString() },
      { id: 'p1-2', descripcion: 'Aplicar detergente con trapeador húmedo', fase: 'limpieza', requiereFoto: false, ordenEjecucion: 2, estado: 'completado', completadoEn: new Date().toISOString() },
      { id: 'p1-3', descripcion: 'Enjuagar con agua limpia', fase: 'limpieza', requiereFoto: false, ordenEjecucion: 3, estado: 'completado', completadoEn: new Date().toISOString() },
      { id: 'p1-4', descripcion: 'Aplicar amonio cuaternario (dilución 1:200)', fase: 'desinfeccion', requiereFoto: true, ordenEjecucion: 4, estado: 'pendiente' },
      { id: 'p1-5', descripcion: 'Verificar aspecto visual del piso (sin residuos)', fase: 'verificacion', requiereFoto: true, ordenEjecucion: 5, estado: 'pendiente' },
    ],
  },
  {
    id: 'tarea-002',
    poeCode: 'POE-MESAS-02',
    nombre: 'Limpieza mesas de trabajo — Cocina',
    descripcion: 'Limpieza y desinfección de superficies de contacto con alimentos.',
    area: 'Cocina',
    frecuencia: 'diaria',
    estado: 'PENDING',
    horaEstimada: '10:30',
    urgente: true,
    pasos: [
      { id: 'p2-1', descripcion: 'Retirar todos los utensilios y alimentos de la superficie', fase: 'preparacion', requiereFoto: false, ordenEjecucion: 1, estado: 'pendiente' },
      { id: 'p2-2', descripcion: 'Limpiar con paño humedecido en detergente neutro', fase: 'limpieza', requiereFoto: false, ordenEjecucion: 2, estado: 'pendiente' },
      { id: 'p2-3', descripcion: 'Enjuagar superficie con agua potable', fase: 'limpieza', requiereFoto: false, ordenEjecucion: 3, estado: 'pendiente' },
      { id: 'p2-4', descripcion: 'Aplicar desinfectante (hipoclorito 200 ppm) y esperar 10 min', fase: 'desinfeccion', requiereFoto: false, ordenEjecucion: 4, estado: 'pendiente' },
      { id: 'p2-5', descripcion: 'Secar con papel desechable', fase: 'desinfeccion', requiereFoto: false, ordenEjecucion: 5, estado: 'pendiente' },
      { id: 'p2-6', descripcion: 'Foto del área desinfectada', fase: 'verificacion', requiereFoto: true, ordenEjecucion: 6, estado: 'pendiente' },
    ],
  },
  {
    id: 'tarea-003',
    poeCode: 'POE-RESI-03',
    nombre: 'Registro y disposición de residuos sólidos',
    descripcion: 'Clasificación, pesaje y disposición correcta de residuos del turno.',
    area: 'Almacén',
    frecuencia: 'diaria',
    estado: 'PENDING',
    horaEstimada: '14:00',
    urgente: false,
    pasos: [
      { id: 'p3-1', descripcion: 'Identificar y clasificar residuos por tipo (orgánico/inorgánico)', fase: 'preparacion', requiereFoto: false, ordenEjecucion: 1, estado: 'pendiente' },
      { id: 'p3-2', descripcion: 'Pesar cada bolsa y registrar en bitácora', fase: 'verificacion', requiereFoto: false, ordenEjecucion: 2, estado: 'pendiente' },
      { id: 'p3-3', descripcion: 'Llevar residuos al cuarto de acopio', fase: 'limpieza', requiereFoto: false, ordenEjecucion: 3, estado: 'pendiente' },
      { id: 'p3-4', descripcion: 'Fotografiar cuarto de acopio ordenado', fase: 'verificacion', requiereFoto: true, ordenEjecucion: 4, estado: 'pendiente' },
    ],
  },
  {
    id: 'tarea-004',
    poeCode: 'POE-AGUA-04',
    nombre: 'Verificación calidad del agua — Puntos críticos',
    descripcion: 'Medición de cloro residual y pH en puntos de control.',
    area: 'Producción',
    frecuencia: 'diaria',
    estado: 'COMPLETED',
    horaEstimada: '06:30',
    urgente: false,
    completadoEn: new Date(new Date().setHours(6, 45)).toISOString(),
    pasos: [
      { id: 'p4-1', descripcion: 'Identificar 3 puntos de muestreo', fase: 'preparacion', requiereFoto: false, ordenEjecucion: 1, estado: 'completado', completadoEn: new Date().toISOString() },
      { id: 'p4-2', descripcion: 'Medir cloro residual (≥ 0.5 ppm)', fase: 'verificacion', requiereFoto: false, ordenEjecucion: 2, estado: 'completado', completadoEn: new Date().toISOString() },
      { id: 'p4-3', descripcion: 'Registrar resultado en formato FO-AGUA-001', fase: 'verificacion', requiereFoto: true, ordenEjecucion: 3, estado: 'completado', evidenciaUrl: 'https://placehold.co/300x200?text=Evidencia', completadoEn: new Date().toISOString() },
    ],
  },
]

// ─── Historial de los últimos días ────────────────────────────────────────────

const d = (daysAgo: number, h: number, m: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(h, m, 0, 0)
  return dt.toISOString()
}

export const MOCK_HISTORIAL: TareaResumen[] = [
  { id: 'hist-01', poeCode: 'POE-AGUA-04', nombre: 'Verificación calidad del agua', area: 'Producción', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 3, pasosCompletados: 3, horaEstimada: '06:30', completadoEn: d(0, 6, 45) },
  { id: 'hist-02', poeCode: 'POE-PISOS-01', nombre: 'Sanitización de pisos — Horno', area: 'Horno', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 5, pasosCompletados: 5, horaEstimada: '07:00', completadoEn: d(1, 7, 38) },
  { id: 'hist-03', poeCode: 'POE-MESAS-02', nombre: 'Limpieza mesas de trabajo', area: 'Cocina', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 6, pasosCompletados: 6, horaEstimada: '10:30', completadoEn: d(1, 10, 55) },
  { id: 'hist-04', poeCode: 'POE-RESI-03', nombre: 'Residuos sólidos', area: 'Almacén', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 4, pasosCompletados: 4, horaEstimada: '14:00', completadoEn: d(1, 14, 12) },
  { id: 'hist-05', poeCode: 'POE-AGUA-04', nombre: 'Verificación calidad del agua', area: 'Producción', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 3, pasosCompletados: 3, horaEstimada: '06:30', completadoEn: d(2, 6, 50) },
  { id: 'hist-06', poeCode: 'POE-PISOS-01', nombre: 'Sanitización de pisos — Horno', area: 'Horno', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 5, pasosCompletados: 5, horaEstimada: '07:00', completadoEn: d(2, 7, 22) },
  { id: 'hist-07', poeCode: 'POE-MESAS-02', nombre: 'Limpieza mesas de trabajo', area: 'Cocina', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 6, pasosCompletados: 6, horaEstimada: '10:30', completadoEn: d(3, 11, 5) },
  { id: 'hist-08', poeCode: 'POE-RESI-03', nombre: 'Residuos sólidos', area: 'Almacén', frecuencia: 'diaria', estado: 'COMPLETED', totalPasos: 4, pasosCompletados: 4, horaEstimada: '14:00', completadoEn: d(3, 14, 8) },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Calcula el resumen de una tarea (para la lista) */
export function toResumen(tarea: TareaOperario): TareaResumen {
  return {
    id: tarea.id,
    poeCode: tarea.poeCode,
    nombre: tarea.nombre,
    area: tarea.area,
    frecuencia: tarea.frecuencia,
    estado: tarea.estado,
    horaEstimada: tarea.horaEstimada,
    urgente: tarea.urgente,
    totalPasos: tarea.pasos.length,
    pasosCompletados: tarea.pasos.filter((p) => p.estado === 'completado').length,
    completadoEn: tarea.completadoEn,
  }
}
