import type { ProgramaMinimo } from '@/features/procedures/types'

export const poeRepositorioKeys = {
  all:    ['poe-repositorio'] as const,
  search: (q?: string, programa?: ProgramaMinimo) =>
    [...poeRepositorioKeys.all, 'search', q ?? '', programa ?? 'todos'] as const,
  detail: (id: string) => [...poeRepositorioKeys.all, 'detail', id] as const,
}
