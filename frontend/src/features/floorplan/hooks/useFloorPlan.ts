import { useQuery } from '@tanstack/react-query'
import { getPisos, getTareasArea } from '../api/floorplanApi'

const floorplanKeys = {
  all:   ['floorplan'] as const,
  pisos: () => [...floorplanKeys.all, 'pisos'] as const,
  area:  (areaId: string) => [...floorplanKeys.all, 'area', areaId] as const,
}

export function usePisos() {
  return useQuery({
    queryKey: floorplanKeys.pisos(),
    queryFn: getPisos,
  })
}

export function useTareasArea(areaId: string | null) {
  return useQuery({
    queryKey: floorplanKeys.area(areaId ?? ''),
    queryFn: () => getTareasArea(areaId as string),
    enabled: Boolean(areaId),
  })
}
