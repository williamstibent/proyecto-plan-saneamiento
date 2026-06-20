import { Stage, Layer, Line, Text, Group } from 'react-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useElementSize } from '@/shared/hooks/useElementSize'
import type { AreaPlano, EstadoCumplimiento } from '../types'

const ESTADO_COLOR: Record<EstadoCumplimiento, { fill: string; stroke: string; selectedStroke: string }> = {
  AL_DIA:  { fill: 'rgba(16, 185, 129, 0.18)', stroke: '#10b981', selectedStroke: '#047857' },
  PROXIMO: { fill: 'rgba(249, 115, 22, 0.18)', stroke: '#f97316', selectedStroke: '#c2410c' },
  VENCIDO: { fill: 'rgba(244, 63, 94, 0.20)',  stroke: '#f43f5e', selectedStroke: '#be123c' },
}

interface AreaBounds {
  minXPct: number
  maxXPct: number
  minYPct: number
  maxYPct: number
}

function getAreaBounds(poligono: AreaPlano['poligono']): AreaBounds {
  const xs = poligono.map((p) => p.x)
  const ys = poligono.map((p) => p.y)
  return { minXPct: Math.min(...xs), maxXPct: Math.max(...xs), minYPct: Math.min(...ys), maxYPct: Math.max(...ys) }
}

function buildAreaLabel(a: AreaPlano): string {
  if (a.totalTareas === 0) return `${a.nombre}\nSin tareas hoy`
  return `${a.nombre}\n${String(a.tareasCompletadas)}/${String(a.totalTareas)} tareas`
}

function setCursor(e: KonvaEventObject<MouseEvent>, cursor: string) {
  const stage = e.target.getStage()
  if (stage) stage.container().style.cursor = cursor
}

interface FloorPlanCanvasProps {
  areas: AreaPlano[]
  selectedAreaId: string | null
  onSelectArea: (id: string) => void
}

/**
 * Plano interactivo del piso seleccionado. Cada área es un polígono coloreado
 * según su cumplimiento del día (rojo=vencida, amarillo=próxima, verde=al día).
 * Solo lectura — al tocar un área se muestra su detalle en AreaTasksPanel,
 * sin acciones de reasignación ni de no conformidad.
 */
export function FloorPlanCanvas({ areas, selectedAreaId, onSelectArea }: FloorPlanCanvasProps) {
  const { ref, size } = useElementSize<HTMLDivElement>()
  const { width } = size
  const height = width * 0.62
  const fontSize = Math.max(10, Math.min(15, width / 45))

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-3xl border border-violet-100 bg-[#faf9fc]"
      style={{ aspectRatio: '1 / 0.62' }}
    >
      {width > 0 && (
        <Stage width={width} height={height}>
          <Layer>
            {areas.map((a) => {
              const points = a.poligono.flatMap((p) => [(p.x / 100) * width, (p.y / 100) * height])
              const colors = ESTADO_COLOR[a.estadoCumplimiento]
              const isSelected = a.id === selectedAreaId
              const bounds = getAreaBounds(a.poligono)
              const boxX = (bounds.minXPct / 100) * width
              const boxY = (bounds.minYPct / 100) * height
              const boxWidth = ((bounds.maxXPct - bounds.minXPct) / 100) * width
              const boxHeight = ((bounds.maxYPct - bounds.minYPct) / 100) * height

              return (
                <Group
                  key={a.id}
                  onClick={() => { onSelectArea(a.id) }}
                  onTap={() => { onSelectArea(a.id) }}
                  onMouseEnter={(e) => { setCursor(e, 'pointer') }}
                  onMouseLeave={(e) => { setCursor(e, 'default') }}
                >
                  <Line
                    points={points}
                    closed
                    fill={colors.fill}
                    stroke={isSelected ? colors.selectedStroke : colors.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <Text
                    text={buildAreaLabel(a)}
                    x={boxX}
                    y={boxY + boxHeight / 2 - fontSize}
                    width={boxWidth}
                    align="center"
                    fontSize={fontSize}
                    fontStyle="bold"
                    fill="#1b1530"
                    lineHeight={1.4}
                  />
                </Group>
              )
            })}
          </Layer>
        </Stage>
      )}

      {/* Indicador "en ejecución" — overlay HTML para aprovechar animate-pulse */}
      {width > 0 && areas.filter((a) => a.enEjecucion).map((a) => {
        const bounds = getAreaBounds(a.poligono)
        return (
          <span
            key={a.id}
            className="absolute flex h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${String(bounds.maxXPct)}%`, top: `${String(bounds.minYPct)}%` }}
          >
            <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-violet-600" />
          </span>
        )
      })}
    </div>
  )
}
