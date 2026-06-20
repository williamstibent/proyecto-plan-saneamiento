import { cn } from '@/shared/lib/utils'
import type { Piso } from '../types'

interface FloorSelectorProps {
  pisos: Piso[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function FloorSelector({ pisos, selectedId, onSelect }: FloorSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {pisos.map((piso) => {
        const isActive = piso.id === selectedId
        return (
          <button
            key={piso.id}
            type="button"
            onClick={() => { onSelect(piso.id) }}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              isActive
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'border border-violet-100 bg-white text-[#5e577a] hover:bg-violet-50',
            )}
          >
            🏢 {piso.nombre}
          </button>
        )
      })}
    </div>
  )
}

export function FloorSelectorSkeleton() {
  return (
    <div className="flex gap-2">
      {[0, 1].map((i) => (
        <div key={i} className="h-9 w-40 shrink-0 animate-pulse rounded-full bg-violet-100" />
      ))}
    </div>
  )
}
