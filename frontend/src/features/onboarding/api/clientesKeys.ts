export const clientesKeys = {
  all:   ['clientes'] as const,
  list:  ()                    => [...clientesKeys.all, 'list'] as const,
  pisos: (clienteId: string)   => [...clientesKeys.all, clienteId, 'pisos'] as const,
}
