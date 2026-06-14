import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { PoeWizardData, EppItem } from '../../../types'
import { EPP_CATALOGO } from '../../../types'
import { WizardNav } from './WizardNav'

interface Props {
  data: PoeWizardData
  onNext: (partial: Partial<PoeWizardData>) => void
  onBack: () => void
}

export function Step2EppImplementos({ data, onNext, onBack }: Props) {
  const [selectedEpp, setSelectedEpp] = useState<EppItem[]>(data.epp)
  const [implementos, setImplementos]  = useState<string[]>(data.implementos)
  const [nuevoImplemento, setNuevoImplemento] = useState('')

  const toggleEpp = (item: EppItem) => {
    setSelectedEpp((prev) =>
      prev.some((e) => e.id === item.id)
        ? prev.filter((e) => e.id !== item.id)
        : [...prev, item],
    )
  }

  const addImplemento = () => {
    const trimmed = nuevoImplemento.trim()
    if (trimmed && !implementos.includes(trimmed)) {
      setImplementos((prev) => [...prev, trimmed])
      setNuevoImplemento('')
    }
  }

  const removeImplemento = (imp: string) => {
    setImplementos((prev) => prev.filter((i) => i !== imp))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ epp: selectedEpp, implementos })
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 2 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">EPP e implementos</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Define qué debe usar el operario antes de iniciar.</p>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
          auto-guardado
        </span>
      </div>

      <div className="mt-7 flex-1 space-y-7">
        {/* EPP */}
        <div>
          <h4 className="mb-1 font-extrabold">Equipo de protección personal</h4>
          <p className="mb-4 text-xs text-[#5e577a]">Selecciona el EPP requerido para este procedimiento.</p>

          <div className="grid grid-cols-4 gap-3">
            {EPP_CATALOGO.map((item) => {
              const isSelected = selectedEpp.some((e) => e.id === item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleEpp(item)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition',
                    isSelected
                      ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                      : 'border-violet-100 bg-white hover:border-violet-200 hover:bg-violet-50/40',
                  )}
                >
                  <div className={cn(
                    'grid h-12 w-12 place-items-center rounded-xl text-2xl',
                    isSelected ? 'bg-violet-100' : 'bg-[#faf9fc]',
                  )}>
                    {item.emoji}
                  </div>
                  <span className={cn(
                    'text-[11px] font-semibold leading-tight',
                    isSelected ? 'text-violet-700' : 'text-[#5e577a]',
                  )}>
                    {item.label}
                  </span>
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  )}
                </button>
              )
            })}
          </div>

          {selectedEpp.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedEpp.map((e) => (
                <span key={e.id} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                  {e.emoji} {e.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Implementos */}
        <div>
          <h4 className="mb-1 font-extrabold">Implementos y herramientas</h4>
          <p className="mb-4 text-xs text-[#5e577a]">Escribe cada implemento y presiona Enter o el botón +.</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={nuevoImplemento}
              onChange={(e) => setNuevoImplemento(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImplemento() } }}
              placeholder="esponja, balde, atomizador…"
              className="flex-1 rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={addImplemento}
              className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 hover:bg-violet-100"
            >
              + Agregar
            </button>
          </div>

          {implementos.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {implementos.map((imp) => (
                <span
                  key={imp}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-sm text-[#1b1530] shadow-sm"
                >
                  {imp}
                  <button
                    type="button"
                    onClick={() => removeImplemento(imp)}
                    className="ml-0.5 text-violet-300 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[11px] text-violet-400">No hay implementos agregados aún.</p>
          )}
        </div>

        {selectedEpp.length === 0 && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-[11px] text-orange-900/80">
            ⚠ La Resolución 2674 exige definir el EPP para cada procedimiento. Selecciona al menos uno.
          </div>
        )}
      </div>

      <WizardNav step={1} totalSteps={6} onBack={onBack} />
    </form>
  )
}
