import { useQuery } from '@tanstack/react-query'
import { dashboardKeys } from '../api/dashboardKeys'
import { getTareasHoy } from '../api/getTareasHoy'

export function useTareasHoy() {
  return useQuery({
    queryKey: dashboardKeys.tareasHoy(),
    queryFn: () => getTareasHoy(),
    staleTime: 1000 * 30, // 30 seg — el flujo de tareas es tiempo real
    refetchInterval: 1000 * 60, // refetch cada minuto automáticamente
  })
}
