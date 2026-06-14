import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { PoeWizardData, FrecuenciaConfig, DosisChoque, TaskFrequency } from '../../../types'
import { FRECUENCIA_LABEL } from '../../../types'
import { WizardNav } from './WizardNav'

interface Props {
  data: PoeWizardData
  onNext: (partial: Partial<PoeWizardData>) => void
  onBack: () => void
}

const FRECUENCIAS: { value: TaskFrequency; label: string; sublabel: string }[] = [
  { value: 'diaria',    label: 'Diaria',    sublabel: 'Cada día' },
  { value: 'semanal',   label: 'Semanal',   sublabel: '1 vez/semana' },
  { value: 'quincenal', label: 'Quincenal', sublabel: 'Cada 15 días' },
  { value: 'mensual',   label: 'Mensual',   sublabel: '1 vez/mes' },
  { value: 'trimestral',label: 'Trimestral',sublabel: 'Cada 3 meses' },
  { value: 'semestral', label: 'Semestral', sublabel: 'Cada 6 meses' },
  { value: 'anual',     label: 'Anual',     sublabel: '1 vez/año' },
]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-wider text-violet-500">{children}</label>
}

export function Step5Frecuencia({ data, onNext, onBack }: Props) {
  const [frecuencia, setFrecuencia]   = useState<FrecuenciaConfig>(data.frecuencia)
  const [dosisChoque, setDosisChoque] = useState<DosisChoque>(data.dosisChoque)

  const setFrq = <K extends keyof FrecuenciaConfig>(key: K, value: FrecuenciaConfig[K]) =>
    setFrecuencia((prev) => ({ ...prev, [key]: value }))

  const setDosis = <K extends keyof DosisChoque>(key: K, value: DosisChoque[K]) =>
    setDosisChoque((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ frecuencia, dosisChoque })
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 5 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Frecuencia y programación</h3>
          <p className="mt-1 text-sm text-[#5e577a]">¿Con qué frecuencia se ejecuta este procedimiento?</p>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
          auto-guardado
        </span>
      </div>

      <div className="mt-7 flex-1 space-y-6 overflow-auto">
        {/* Frecuencia principal */}
        <div>
          <h4 className="mb-3 font-extrabold">Frecuencia de ejecución</h4>
          <div className="grid grid-cols-4 gap-2">
            {FRECUENCIAS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFrq('frecuencia', f.value)}
                className={cn(
                  'rounded-2xl border-2 p-3 text-left transition',
                  frecuencia.frecuencia === f.value
                    ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                    : 'border-violet-100 bg-white hover:border-violet-200',
                )}
              >
                <div className={cn(
                  'text-sm font-extrabold',
                  frecuencia.frecuencia === f.value ? 'text-violet-700' : 'text-[#1b1530]',
                )}>
                  {f.label}
                </div>
                <div className="mt-0.5 text-[10px] text-[#5e577a]">{f.sublabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Hora de ejecución</FieldLabel>
            <input
              type="time"
              value={frecuencia.horaEjecucion ?? ''}
              onChange={(e) => setFrq('horaEjecucion', e.target.value || undefined)}
              className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {frecuencia.frecuencia === 'semanal' && (
            <div>
              <FieldLabel>Día de la semana</FieldLabel>
              <select
                value={frecuencia.diaSemana ?? ''}
                onChange={(e) => setFrq('diaSemana', Number(e.target.value) as FrecuenciaConfig['diaSemana'])}
                className="mt-1 w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
              >
                {['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d, i) => (
                  <option key={i} value={i === 0 ? '' : i}>{d || 'Seleccionar…'}</option>
                ))}
              </select>
            </div>
          )}

          {(frecuencia.frecuencia === 'mensual' || frecuencia.frecuencia === 'quincenal') && (
            <div>
              <FieldLabel>Día del mes</FieldLabel>
              <input
                type="number"
                min={1}
                max={28}
                placeholder="1"
                value={frecuencia.diaMes ?? ''}
                onChange={(e) => setFrq('diaMes', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          )}
        </div>

        {/* Dosis de choque */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-orange-900">⚡ Dosis de choque</div>
              <div className="mt-0.5 text-[11px] text-orange-900/70">
                Aplica una concentración mayor en intervalos específicos (ej. desinfección quincenal intensiva).
              </div>
            </div>
            <div
              onClick={() => setDosis('activa', !dosisChoque.activa)}
              className={cn(
                'relative h-6 w-11 cursor-pointer rounded-full transition',
                dosisChoque.activa ? 'bg-orange-500' : 'bg-orange-200',
              )}
            >
              <div className={cn(
                'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all',
                dosisChoque.activa ? 'left-[26px]' : 'left-1',
              )} />
            </div>
          </div>

          {dosisChoque.activa && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FieldLabel>Producto de choque</FieldLabel>
                <input
                  type="text"
                  placeholder="Amonio cuaternario 1000 ppm"
                  value={dosisChoque.producto}
                  onChange={(e) => setDosis('producto', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div>
                <FieldLabel>Concentración</FieldLabel>
                <input
                  type="text"
                  placeholder="1000 ppm"
                  value={dosisChoque.concentracion ?? ''}
                  onChange={(e) => setDosis('concentracion', e.target.value || undefined)}
                  className="mt-1 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div className="col-span-3">
                <FieldLabel>Frecuencia de la dosis de choque</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['semanal', 'quincenal', 'mensual', 'trimestral'] as TaskFrequency[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDosis('frecuencia', f)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-semibold transition',
                        dosisChoque.frecuencia === f
                          ? 'border-orange-400 bg-orange-100 text-orange-800'
                          : 'border-orange-200 bg-white text-orange-700 hover:bg-orange-50',
                      )}
                    >
                      {FRECUENCIA_LABEL[f]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {frecuencia.frecuencia && (
          <div className="rounded-2xl border border-violet-100 bg-white p-3 text-[11px] text-violet-900/80">
            ⓘ El sistema generará <b>automáticamente</b> las instancias de tarea para todos los operarios
            asignados a este procedimiento, según la programación definida.
          </div>
        )}
      </div>

      <WizardNav step={4} totalSteps={6} onBack={onBack} />
    </form>
  )
}
