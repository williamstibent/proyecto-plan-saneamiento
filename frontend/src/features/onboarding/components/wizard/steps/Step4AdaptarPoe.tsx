import { useState, useEffect } from 'react'
import type { PoeWizardData } from '@/features/procedures/types'
import { Step1InfoBasica }     from '@/features/procedures/components/wizard/steps/Step1InfoBasica'
import { Step2EppImplementos } from '@/features/procedures/components/wizard/steps/Step2EppImplementos'
import { Step3ProductosDosis } from '@/features/procedures/components/wizard/steps/Step3ProductosDosis'
import { Step4Pasos }          from '@/features/procedures/components/wizard/steps/Step4Pasos'
import { Step5Frecuencia }     from '@/features/procedures/components/wizard/steps/Step5Frecuencia'
import { AdaptarPoePreview }   from './AdaptarPoePreview'
import { usePoeRepositorioDetalle, useAdaptarPoe } from '../../../hooks/usePoeRepositorio'
import type { Cliente } from '../../../types'
import type { PoeRepositorioItem } from '@/mocks/data/poe-repositorio'

interface Props {
  cliente: Cliente
  poeOrigen: PoeRepositorioItem
  onBack: () => void
  onFinish: () => void
}

type SeccionEditable = 0 | 1 | 2 | 3 | 4
type SubStep = 'preview' | SeccionEditable

const SECCION_LABEL: Record<SeccionEditable, string> = {
  0: 'Información básica',
  1: 'EPP e implementos',
  2: 'Productos y dosis',
  3: 'Checklist',
  4: 'Programación',
}

export function Step4AdaptarPoe({ cliente, poeOrigen, onBack, onFinish }: Props) {
  const { data: detalle, isLoading } = usePoeRepositorioDetalle(poeOrigen.id)
  const adaptarMutation = useAdaptarPoe()

  const [subStep, setSubStep]     = useState<SubStep>('preview')
  const [localData, setLocalData] = useState<PoeWizardData | null>(null)

  useEffect(() => {
    if (detalle && !localData) setLocalData(detalle)
  }, [detalle, localData])

  if (!localData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <p className="text-sm text-[#5e577a]">{isLoading ? 'Cargando contenido del POE…' : 'Preparando edición…'}</p>
      </div>
    )
  }

  const volverAlResumen = () => { setSubStep('preview') }

  const guardarSeccion = (partial: Partial<PoeWizardData>) => {
    setLocalData((prev) => (prev ? { ...prev, ...partial } : prev))
    setSubStep('preview')
  }

  const handleGuardar = () => {
    adaptarMutation.mutate(
      { clienteId: cliente.id, origenPoeId: poeOrigen.id, data: localData },
      { onSuccess: onFinish },
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-violet-100 bg-[#faf9fc] px-4 py-2.5">
        <div className="text-xs text-[#5e577a]">
          {subStep === 'preview' ? (
            <>✏️ Adaptando <span className="font-mono font-semibold text-violet-700">{poeOrigen.codigo}</span> para <b>{cliente.nombre}</b></>
          ) : (
            <>✎ Editando <b>{SECCION_LABEL[subStep]}</b> · <span className="font-mono font-semibold text-violet-700">{poeOrigen.codigo}</span></>
          )}
        </div>
        <div className="flex items-center gap-3">
          {subStep !== 'preview' && (
            <button type="button" onClick={volverAlResumen} className="text-xs font-semibold text-violet-600 hover:text-violet-800">
              ← Volver al resumen
            </button>
          )}
          <button type="button" onClick={onBack} className="text-xs font-semibold text-violet-600 hover:text-violet-800">
            ← Elegir otro POE
          </button>
        </div>
      </div>

      <div className="scrollbar-clean flex-1 overflow-auto">
        {subStep === 'preview' && (
          <AdaptarPoePreview
            data={localData}
            cliente={cliente}
            poeOrigen={poeOrigen}
            onEditarSeccion={setSubStep}
            onGuardar={handleGuardar}
            onBack={onBack}
            isGuardando={adaptarMutation.isPending}
          />
        )}
        {subStep === 0 && <Step1InfoBasica    data={localData} onNext={guardarSeccion} />}
        {subStep === 1 && <Step2EppImplementos data={localData} onNext={guardarSeccion} onBack={volverAlResumen} />}
        {subStep === 2 && <Step3ProductosDosis data={localData} onNext={guardarSeccion} onBack={volverAlResumen} />}
        {subStep === 3 && <Step4Pasos          data={localData} onNext={guardarSeccion} onBack={volverAlResumen} />}
        {subStep === 4 && <Step5Frecuencia     data={localData} onNext={guardarSeccion} onBack={volverAlResumen} />}
      </div>
    </div>
  )
}
