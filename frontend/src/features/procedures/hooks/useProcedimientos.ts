import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProcedimientos, createProcedimiento } from '../api/getProcedimientos'
import { proceduresKeys } from '../api/proceduresKeys'
import type { ProgramaMinimo, PoeWizardData } from '../types'

export function useProcedimientos(programa?: ProgramaMinimo) {
  return useQuery({
    queryKey: proceduresKeys.list(programa),
    queryFn:  () => getProcedimientos(programa),
    staleTime: 30_000,
  })
}

export function useCreateProcedimiento() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: PoeWizardData) => createProcedimiento(data),
    onSuccess: () => {
      // Invalida toda la lista para que se recargue con el nuevo POE
      qc.invalidateQueries({ queryKey: proceduresKeys.all })
    },
  })
}
