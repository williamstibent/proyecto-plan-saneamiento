/**
 * Query keys factory para el feature dashboard.
 * Centraliza las claves para invalidación de caché predecible.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,

  resumen: () => [...dashboardKeys.all, 'resumen'] as const,

  programas: () => [...dashboardKeys.all, 'programas'] as const,
  programasCumplimiento: (periodo: 'mes' | 'semana') =>
    [...dashboardKeys.programas(), 'cumplimiento', periodo] as const,

  tareasHoy: () => [...dashboardKeys.all, 'tareas-hoy'] as const,
}
