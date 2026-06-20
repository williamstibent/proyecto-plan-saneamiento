import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { buscarPoeRepositorio, getPoeRepositorioDetalle, adaptarPoeParaCliente } from '../api/poeRepositorioApi'
import { poeRepositorioKeys } from '../api/poeRepositorioKeys'
import { clientesKeys } from '../api/clientesKeys'
import type { ProgramaMinimo } from '@/features/procedures/types'

export function usePoeRepositorio(q?: string, programa?: ProgramaMinimo) {
  return useQuery({
    queryKey:  poeRepositorioKeys.search(q, programa),
    queryFn:   () => buscarPoeRepositorio(q, programa),
    staleTime: 15_000,
  })
}

export function usePoeRepositorioDetalle(id: string | null) {
  return useQuery({
    queryKey: poeRepositorioKeys.detail(id ?? ''),
    queryFn:  () => getPoeRepositorioDetalle(id as string),
    enabled:  Boolean(id),
  })
}

export function useAdaptarPoe() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: adaptarPoeParaCliente,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: clientesKeys.list() })
      void qc.invalidateQueries({ queryKey: poeRepositorioKeys.all })
    },
  })
}
