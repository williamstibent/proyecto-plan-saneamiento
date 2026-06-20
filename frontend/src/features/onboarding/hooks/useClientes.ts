import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClientes, crearCliente, getPisosCliente, crearPisos } from '../api/clientesApi'
import { clientesKeys } from '../api/clientesKeys'

export function useClientes() {
  return useQuery({
    queryKey:  clientesKeys.list(),
    queryFn:   getClientes,
    staleTime: 30_000,
  })
}

export function useCrearCliente() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: crearCliente,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: clientesKeys.all })
    },
  })
}

export function usePisosCliente(clienteId: string | null) {
  return useQuery({
    queryKey: clientesKeys.pisos(clienteId ?? ''),
    queryFn:  () => getPisosCliente(clienteId as string),
    enabled:  Boolean(clienteId),
  })
}

export function useCrearPisos() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: crearPisos,
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: clientesKeys.pisos(variables.clienteId) })
      void qc.invalidateQueries({ queryKey: clientesKeys.list() })
    },
  })
}
