import type { ProgramaMinimo } from '../types'

export const proceduresKeys = {
  all:    ['procedimientos'] as const,
  list:   (programa?: ProgramaMinimo) => [...proceduresKeys.all, 'list', programa ?? 'todos'] as const,
  detail: (id: string)                => [...proceduresKeys.all, 'detail', id] as const,
}
