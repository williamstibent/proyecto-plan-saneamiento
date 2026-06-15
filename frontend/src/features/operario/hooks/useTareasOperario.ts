import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTareasHoy,
  getTareaDetalle,
  completarPaso,
  completarTarea,
  getHistorial,
} from '../api/tareasApi'
import type { CompletarPasoRequest, CompletarTareaRequest } from '../types'

// ─── Query keys ───────────────────────────────────────────────────────────────

const tareasKeys = {
  all:       ['operario', 'tareas'] as const,
  hoy:       () => [...tareasKeys.all, 'hoy'] as const,
  detalle:   (id: string) => [...tareasKeys.all, id] as const,
  historial: () => ['operario', 'historial'] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTareasHoyOperario() {
  return useQuery({
    queryKey: tareasKeys.hoy(),
    queryFn: getTareasHoy,
  })
}

export function useTareaDetalle(id: string) {
  return useQuery({
    queryKey: tareasKeys.detalle(id),
    queryFn: () => getTareaDetalle(id),
    enabled: Boolean(id),
  })
}

export function useHistorial() {
  return useQuery({
    queryKey: tareasKeys.historial(),
    queryFn: getHistorial,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCompletarPaso(tareaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pasoId, body }: { pasoId: string; body: CompletarPasoRequest }) =>
      completarPaso(tareaId, pasoId, body),
    onSuccess: () => {
      // Refrescar el detalle de la tarea para ver el paso actualizado
      queryClient.invalidateQueries({ queryKey: tareasKeys.detalle(tareaId) })
    },
  })
}

export function useCompletarTarea(tareaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CompletarTareaRequest) => completarTarea(tareaId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tareasKeys.hoy() })
      queryClient.invalidateQueries({ queryKey: tareasKeys.detalle(tareaId) })
      queryClient.invalidateQueries({ queryKey: tareasKeys.historial() })
    },
  })
}
