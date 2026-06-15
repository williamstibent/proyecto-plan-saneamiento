import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { PoeWizardData } from '../types'
import { POE_WIZARD_DATA_INICIAL } from '../types'
import { useCreateProcedimiento } from '../hooks/useProcedimientos'
import { WizardStepper } from '../components/wizard/WizardStepper'
import type { WizardStep } from '../components/wizard/WizardStepper'
import { WizardPreview }      from '../components/wizard/WizardPreview'
import { Step1InfoBasica }    from '../components/wizard/steps/Step1InfoBasica'
import { Step2EppImplementos } from '../components/wizard/steps/Step2EppImplementos'
import { Step3ProductosDosis } from '../components/wizard/steps/Step3ProductosDosis'
import { Step4Pasos }          from '../components/wizard/steps/Step4Pasos'
import { Step5Frecuencia }     from '../components/wizard/steps/Step5Frecuencia'
import { Step6Preview }        from '../components/wizard/steps/Step6Preview'

const WIZARD_STEPS: WizardStep[] = [
  { label: 'Información básica'     },
  { label: 'EPP e implementos'      },
  { label: 'Productos y dosis'      },
  { label: 'Pasos del checklist'    },
  { label: 'Frecuencia'             },
  { label: 'Revisión y publicación' },
]

function stepSublabel(step: number, data: PoeWizardData): string | undefined {
  switch (step) {
    case 0: return data.codigo ? `✓ ${data.codigo}` : undefined
    case 1: return data.epp.length ? `✓ ${data.epp.length} EPP` : undefined
    case 2: return data.productos.length ? `✓ ${data.productos.length} producto${data.productos.length > 1 ? 's' : ''}` : undefined
    case 3: return data.pasos.length ? `✓ ${data.pasos.length} paso${data.pasos.length > 1 ? 's' : ''}` : undefined
    case 4: return data.frecuencia.frecuencia ? `✓ ${data.frecuencia.frecuencia}` : undefined
    default: return undefined
  }
}

export function PoeWizardPage() {
  const navigate        = useNavigate()
  const createMutation  = useCreateProcedimiento()

  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData]               = useState<PoeWizardData>(POE_WIZARD_DATA_INICIAL)

  const updateData = (partial: Partial<PoeWizardData>) =>
    setData((prev) => ({ ...prev, ...partial }))

  const goNext = (partial: Partial<PoeWizardData>) => {
    updateData(partial)
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const handleStepClick = (index: number) => {
    if (index < currentStep) setCurrentStep(index)
  }

  const handlePublish = () => {
    createMutation.mutate(data, {
      onSuccess: () => {
        // Redirige a la lista; TanStack Query ya invalidó la caché
        navigate('/poe', { replace: true, state: { nuevoCodigo: data.codigo } })
      },
    })
  }

  const stepsWithSublabels: WizardStep[] = WIZARD_STEPS.map((s, i) => ({
    ...s,
    sublabel: i < currentStep ? (stepSublabel(i, data) ?? '✓ Listo') : stepSublabel(i, data),
  }))

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9fc]">
      {/* ── Header ───────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-10 flex h-12 items-center border-b border-violet-100 bg-white px-5">
        <div className="flex items-center gap-3">
          <Link
            to="/poe"
            className="flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-800"
          >
            ← POE
          </Link>
          <span className="text-violet-200">·</span>
          <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-black text-white">
            P
          </div>
          <span className="font-extrabold">Constructor de POE</span>
        </div>

        {/* Barra de progreso */}
        <div className="mx-6 flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        <span className="font-mono text-xs text-violet-600">{currentStep + 1} / 6</span>
      </div>

      {/* ── Layout ───────────────────────────────── */}
      <div className="mt-12 grid h-[calc(100vh-3rem)] w-full grid-cols-12">
        {/* Stepper lateral — oculto en móvil */}
        <WizardStepper
          steps={stepsWithSublabels}
          currentStep={currentStep}
          poeCode={data.codigo}
          poeNombre={data.nombre}
          onStepClick={handleStepClick}
        />

        {/* Área de formulario — col-span-12 en móvil, 6 en desktop */}
        <main className="scrollbar-clean col-span-12 overflow-auto px-4 py-6 lg:col-span-6 lg:px-8 lg:py-8">
          {currentStep === 0 && <Step1InfoBasica    data={data} onNext={goNext} />}
          {currentStep === 1 && <Step2EppImplementos data={data} onNext={goNext} onBack={goBack} />}
          {currentStep === 2 && <Step3ProductosDosis data={data} onNext={goNext} onBack={goBack} />}
          {currentStep === 3 && <Step4Pasos          data={data} onNext={goNext} onBack={goBack} />}
          {currentStep === 4 && <Step5Frecuencia     data={data} onNext={goNext} onBack={goBack} />}
          {currentStep === 5 && (
            <Step6Preview
              data={data}
              onPublish={handlePublish}
              onBack={goBack}
              isPublishing={createMutation.isPending}
            />
          )}
        </main>

        {/* Preview del operario — oculto en móvil */}
        <WizardPreview data={data} />
      </div>
    </div>
  )
}
