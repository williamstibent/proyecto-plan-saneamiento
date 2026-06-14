import { cn } from '@/shared/lib/utils'
import type { PoeWizardData } from '../../../types'
import { PROGRAMAS_LABEL, FRECUENCIA_LABEL, FASES_CHECKLIST } from '../../../types'

interface Props {
  data: PoeWizardData
  onPublish: () => void
  onBack: () => void
  isPublishing?: boolean
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-4">
      <h5 className="mb-3 text-[10px] uppercase tracking-widest text-violet-500">{title}</h5>
      {children}
    </div>
  )
}

function Badge({ label, color = 'violet' }: { label: string; color?: 'violet' | 'sky' | 'orange' | 'fuchsia' | 'emerald' }) {
  const cls: Record<string, string> = {
    violet:  'bg-violet-100 text-violet-800',
    sky:     'bg-sky-100 text-sky-800',
    orange:  'bg-orange-100 text-orange-800',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-800',
    emerald: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', cls[color])}>
      {label}
    </span>
  )
}

const FASE_COLOR: Record<string, 'orange' | 'sky' | 'violet' | 'emerald'> = {
  preparacion: 'orange',
  limpieza: 'sky',
  desinfeccion: 'violet',
  verificacion: 'emerald',
}

export function Step6Preview({ data, onPublish, onBack, isPublishing }: Props) {
  const fotoCount = data.pasos.filter((p) => p.requiereFoto).length

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 6 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Revisión y publicación</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Verifica el POE antes de publicarlo en el plan de saneamiento.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">Listo para publicar</span>
        </div>
      </div>

      <div className="mt-7 flex-1 space-y-3 overflow-auto">
        {/* Info básica */}
        <SectionBlock title="Información básica">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-xs text-violet-600">{data.codigo || '—'}</div>
              <div className="mt-0.5 text-base font-extrabold">{data.nombre || '—'}</div>
              {data.descripcion && (
                <div className="mt-1 text-xs text-[#5e577a]">{data.descripcion}</div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge label={PROGRAMAS_LABEL[data.programa]} color="violet" />
              <Badge label={data.areaAplicacion || 'Sin área'} color="sky" />
            </div>
          </div>
        </SectionBlock>

        {/* EPP + Implementos */}
        <SectionBlock title="EPP e implementos">
          {data.epp.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {data.epp.map((e) => (
                <Badge key={e.id} label={`${e.emoji} ${e.label}`} color="violet" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-rose-500">⚠ Sin EPP definido</p>
          )}
          {data.implementos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.implementos.map((imp, i) => (
                <span key={i} className="rounded-full border border-violet-100 px-2.5 py-0.5 text-[11px] text-[#5e577a]">
                  {imp}
                </span>
              ))}
            </div>
          )}
        </SectionBlock>

        {/* Productos */}
        <SectionBlock title="Productos y dosis">
          {data.productos.length === 0 ? (
            <p className="text-xs text-[#5e577a]">Sin productos definidos</p>
          ) : (
            <div className="space-y-2">
              {data.productos.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-2">
                  <div>
                    <div className="text-sm font-bold">🧪 {p.nombre || '—'}</div>
                    <div className="text-[11px] text-sky-700">{p.dilucion} · {p.metodoAplicacion}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {p.tiempoContactoMin && (
                      <Badge label={`⏱ ${p.tiempoContactoMin} min`} color="orange" />
                    )}
                    {p.requiereEnjuague && (
                      <Badge label="enjuague" color="sky" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionBlock>

        {/* Pasos */}
        <SectionBlock title={`Checklist · ${data.pasos.length} pasos · ${fotoCount} con foto`}>
          {data.pasos.length === 0 ? (
            <p className="text-xs text-[#5e577a]">Sin pasos definidos</p>
          ) : (
            <div className="space-y-2">
              {data.pasos.map((paso, i) => (
                <div key={paso.id} className="flex items-start gap-2.5">
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-violet-200 text-[10px] font-extrabold text-violet-600">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-xs">{paso.descripcion || '—'}</div>
                  <div className="flex items-center gap-1">
                    <Badge label={FASES_CHECKLIST.find((f) => f.value === paso.fase)?.label ?? paso.fase} color={FASE_COLOR[paso.fase] ?? 'violet'} />
                    {paso.requiereFoto && <span className="text-fuchsia-500">📸</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionBlock>

        {/* Frecuencia */}
        <SectionBlock title="Programación">
          <div className="flex items-center gap-3">
            {data.frecuencia.frecuencia ? (
              <Badge label={FRECUENCIA_LABEL[data.frecuencia.frecuencia]} color="emerald" />
            ) : (
              <span className="text-xs text-[#5e577a]">Sin frecuencia definida</span>
            )}
            {data.frecuencia.horaEjecucion && (
              <span className="text-xs text-[#5e577a]">⏰ {data.frecuencia.horaEjecucion}</span>
            )}
            {data.dosisChoque.activa && (
              <Badge label={`⚡ Dosis choque ${FRECUENCIA_LABEL[data.dosisChoque.frecuencia]}`} color="orange" />
            )}
          </div>
        </SectionBlock>

        {/* Aviso final */}
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 text-[11px]">
          <div className="mb-1 font-extrabold text-violet-900">Al publicar este POE:</div>
          <ul className="space-y-1 text-violet-900/80">
            <li>• Se creará la versión 1 del procedimiento (inmutable).</li>
            <li>• El sistema generará las tareas automáticas según la frecuencia.</li>
            <li>• Cada ejecución quedará vinculada a esta versión para trazabilidad INVIMA.</li>
            <li>• Solo el admin puede publicar versiones futuras.</li>
          </ul>
        </div>
      </div>

      {/* Nav — botón de publicar dispara onPublish */}
      <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#faf9fc]"
        >
          ← Anterior
        </button>

        <div className="font-mono text-xs text-violet-600">6 / 6</div>

        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-fuchsia-700 disabled:opacity-60"
        >
          {isPublishing ? 'Publicando…' : '🚀 Publicar POE'}
        </button>
      </div>
    </div>
  )
}
