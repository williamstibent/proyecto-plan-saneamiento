import type { PoeWizardData } from '../../types'
import { FRECUENCIA_LABEL } from '../../types'

interface WizardPreviewProps {
  data: PoeWizardData
}

export function WizardPreview({ data }: WizardPreviewProps) {
  const hasEpp      = data.epp.length > 0
  const hasProductos = data.productos.length > 0
  const hasPasos    = data.pasos.length > 0

  return (
    <aside className="scrollbar-clean hidden lg:block col-span-4 overflow-auto border-l border-violet-100 bg-[#faf9fc] p-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-extrabold">👁 Vista del operario</h4>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700">live</span>
      </div>

      {/* Mockup de teléfono */}
      <div className="mx-auto max-w-[260px] rounded-[28px] bg-[#1b1530] p-2">
        <div className="scrollbar-clean overflow-auto rounded-[22px] bg-white p-4 text-[11px] leading-tight" style={{ maxHeight: 540 }}>
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-violet-600">
              {data.codigo || 'POE-···'}
            </span>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-orange-700">
              {data.frecuencia.frecuencia ? FRECUENCIA_LABEL[data.frecuencia.frecuencia] : 'Sin programar'}
            </span>
          </div>

          <div className="text-[13px] font-extrabold">
            {data.nombre || 'Nombre del procedimiento'}
          </div>
          <div className="text-[10px] text-violet-600">
            {data.areaAplicacion || 'Área'} · {data.frecuencia.horaEjecucion ?? '—'}
          </div>

          {/* EPP */}
          {hasEpp && (
            <>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-violet-500">🥽 Antes</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.epp.map((e) => (
                  <span key={e.id} className="rounded-full bg-[#f3f0f9] px-2 py-0.5 text-[9px] font-semibold text-[#5e577a]">
                    {e.emoji} {e.label}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Implementos */}
          {data.implementos.length > 0 && (
            <>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-violet-500">Implementos</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.implementos.map((imp, i) => (
                  <span key={i} className="rounded-full bg-[#f3f0f9] px-2 py-0.5 text-[9px] font-semibold text-[#5e577a]">
                    {imp}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Productos */}
          {hasProductos && (
            <>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-violet-500">Preparar</div>
              {data.productos.map((p) => (
                <div
                  key={p.id}
                  className="mt-1.5 rounded-md border border-sky-200 bg-sky-50 p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-extrabold">🧪 {p.nombre}</div>
                    {p.tiempoContactoMin && (
                      <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-semibold text-orange-700">
                        ⏱ {p.tiempoContactoMin} min
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-sky-700">
                    {p.dilucion}
                    {p.requiereEnjuague && ' · enjuagar'}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Pasos */}
          {hasPasos && (
            <>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-violet-500">Pasos</div>
              {data.pasos.slice(0, 4).map((paso, i) => (
                <div key={paso.id} className="mt-1.5 flex items-start gap-2">
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-violet-200 text-[9px] font-bold text-violet-500">
                    {i + 1}
                  </div>
                  <div className="text-[10px] text-[#1b1530]">
                    {paso.descripcion}
                    {paso.requiereFoto && <span className="ml-1 text-violet-400">📸</span>}
                  </div>
                </div>
              ))}
              {data.pasos.length > 4 && (
                <div className="mt-1 text-[10px] text-violet-500">
                  +{data.pasos.length - 4} pasos más…
                </div>
              )}
            </>
          )}

          {/* Botón CTA */}
          <button className="mt-4 w-full rounded-md bg-[#1b1530] py-2 text-[11px] font-extrabold text-white">
            Iniciar tarea →
          </button>
        </div>
      </div>

      {/* Tip contextual */}
      {data.productos.some((p) => p.tiempoContactoMin) && (
        <div className="mt-5 rounded-2xl border border-violet-100 bg-white p-4 text-[11px]">
          <div className="mb-1 font-extrabold">💡 Temporizador automático</div>
          <div className="text-violet-900/80">
            Los productos con tiempo de contacto generarán un <b>paso de espera con timer</b> durante la ejecución.
          </div>
        </div>
      )}

      {data.dosisChoque.activa && (
        <div className="mt-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-[11px]">
          <div className="mb-1 font-extrabold text-orange-900">⚡ Dosis de choque activa</div>
          <div className="text-orange-900/80">
            {data.dosisChoque.producto} · {FRECUENCIA_LABEL[data.dosisChoque.frecuencia]}
          </div>
        </div>
      )}
    </aside>
  )
}
