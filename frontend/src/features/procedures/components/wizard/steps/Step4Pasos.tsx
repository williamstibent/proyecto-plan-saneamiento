import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { PoeWizardData, PasoChecklist, FaseChecklist } from '../../../types'
import { FASES_CHECKLIST } from '../../../types'
import { WizardNav } from './WizardNav'

interface Props {
  data: PoeWizardData
  onNext: (partial: Partial<PoeWizardData>) => void
  onBack: () => void
}

let _id = 0
const newId = () => `paso-${++_id}-${Date.now()}`

function emptyPaso(order: number): PasoChecklist {
  return {
    id: newId(),
    descripcion: '',
    fase: 'limpieza',
    requiereFoto: false,
    ordenEjecucion: order,
  }
}

const FASE_COLORS: Record<FaseChecklist, string> = {
  preparacion: 'bg-orange-100 text-orange-800',
  limpieza:    'bg-sky-100 text-sky-800',
  desinfeccion: 'bg-violet-100 text-violet-800',
  verificacion: 'bg-emerald-100 text-emerald-800',
}

interface PasoCardProps {
  paso: PasoChecklist
  index: number
  onChange: (updated: PasoChecklist) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

function PasoCard({ paso, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: PasoCardProps) {
  const set = <K extends keyof PasoChecklist>(key: K, value: PasoChecklist[K]) =>
    onChange({ ...paso, [key]: value })

  return (
    <div className="group rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        {/* Número */}
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border-2 border-violet-200 text-sm font-extrabold text-violet-700">
          {index + 1}
        </div>

        {/* Descripción */}
        <textarea
          rows={2}
          placeholder="Describe la acción concreta que debe realizar el operario…"
          value={paso.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          className="flex-1 resize-none rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        {/* Orden */}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="rounded-lg p-1 text-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-20"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="rounded-lg p-1 text-violet-300 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-20"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Fase */}
        <div className="flex flex-1 flex-wrap gap-1.5">
          {FASES_CHECKLIST.map((fase) => (
            <button
              key={fase.value}
              type="button"
              onClick={() => set('fase', fase.value)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold transition',
                paso.fase === fase.value
                  ? FASE_COLORS[fase.value]
                  : 'bg-[#faf9fc] text-[#5e577a] hover:bg-violet-50',
              )}
            >
              {fase.label}
            </button>
          ))}
        </div>

        {/* Requiere foto */}
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium">
          <div
            onClick={() => set('requiereFoto', !paso.requiereFoto)}
            className={cn(
              'relative h-4 w-8 rounded-full transition',
              paso.requiereFoto ? 'bg-fuchsia-500' : 'bg-violet-200',
            )}
          >
            <div className={cn(
              'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all',
              paso.requiereFoto ? 'left-[18px]' : 'left-0.5',
            )} />
          </div>
          <span className={paso.requiereFoto ? 'text-fuchsia-700' : 'text-[#5e577a]'}>
            📸 Foto
          </span>
        </label>

        {/* Eliminar */}
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition"
        >
          × Eliminar
        </button>
      </div>
    </div>
  )
}

export function Step4Pasos({ data, onNext, onBack }: Props) {
  const [pasos, setPasos] = useState<PasoChecklist[]>(
    data.pasos.length ? data.pasos : [emptyPaso(1)],
  )

  const addPaso = () =>
    setPasos((prev) => [...prev, emptyPaso(prev.length + 1)])

  const updatePaso = (index: number, updated: PasoChecklist) =>
    setPasos((prev) => prev.map((p, i) => (i === index ? updated : p)))

  const removePaso = (index: number) =>
    setPasos((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))

  const move = (index: number, dir: -1 | 1) => {
    const next = [...pasos]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setPasos(next.map((p, i) => ({ ...p, ordenEjecucion: i + 1 })))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ pasos: pasos.map((p, i) => ({ ...p, ordenEjecucion: i + 1 })) })
  }

  const faseCount = FASES_CHECKLIST.reduce<Record<FaseChecklist, number>>(
    (acc, f) => ({ ...acc, [f.value]: pasos.filter((p) => p.fase === f.value).length }),
    {} as Record<FaseChecklist, number>,
  )

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 4 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Pasos del checklist</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Define las acciones que realizará el operario.</p>
        </div>
        <div className="flex gap-1.5">
          {FASES_CHECKLIST.map((f) => faseCount[f.value] > 0 && (
            <span key={f.value} className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', FASE_COLORS[f.value])}>
              {faseCount[f.value]} {f.label.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-7 flex-1 space-y-3 overflow-auto">
        {pasos.map((paso, i) => (
          <PasoCard
            key={paso.id}
            paso={paso}
            index={i}
            onChange={(u) => updatePaso(i, u)}
            onRemove={() => removePaso(i)}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            isFirst={i === 0}
            isLast={i === pasos.length - 1}
          />
        ))}

        <button
          type="button"
          onClick={addPaso}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 py-3 text-sm font-semibold text-violet-500 hover:border-violet-400 hover:bg-violet-50/60 hover:text-violet-700 transition"
        >
          + Agregar paso
        </button>

        <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/60 p-3 text-[11px] text-fuchsia-900/80">
          📸 Los pasos marcados con <b>Foto</b> exigirán evidencia fotográfica al operario durante la ejecución.
          Sin evidencia = evidencia inválida para inspección INVIMA.
        </div>
      </div>

      <WizardNav step={3} totalSteps={6} onBack={onBack} />
    </form>
  )
}
