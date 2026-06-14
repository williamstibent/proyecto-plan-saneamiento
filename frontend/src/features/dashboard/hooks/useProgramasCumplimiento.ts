import { useQuery } from '@tanstack/react-query'
import { dashboardKeys } from '../api/dashboardKeys'
import { getProgramasCumplimiento } from '../api/getProgramasCumplimiento'

export function useProgramasCumplimiento(periodo: 'mes' | 'semana' = 'mes') {
  return useQuery({
    queryKey: dashboardKeys.programasCumplimiento(periodo),
    queryFn: () => getProgramasCumplimiento(periodo),
    staleTime: 1000 * 60 * 5, // 5 min — los programas no cambian tanto
  })
}
