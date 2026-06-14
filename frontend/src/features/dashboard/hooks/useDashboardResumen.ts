import { useQuery } from '@tanstack/react-query'
import { dashboardKeys } from '../api/dashboardKeys'
import { getDashboardResumen } from '../api/getDashboardResumen'

export function useDashboardResumen() {
  return useQuery({
    queryKey: dashboardKeys.resumen(),
    queryFn: getDashboardResumen,
    staleTime: 1000 * 60, // 1 min — el resumen cambia con frecuencia en el día
  })
}
