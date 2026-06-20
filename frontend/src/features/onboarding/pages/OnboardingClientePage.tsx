import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingStepper } from '../components/wizard/OnboardingStepper'
import type { OnboardingStep } from '../components/wizard/OnboardingStepper'
import { Step1Cliente }     from '../components/wizard/steps/Step1Cliente'
import { Step2PisosAreas }  from '../components/wizard/steps/Step2PisosAreas'
import { Step3BuscarPoe }   from '../components/wizard/steps/Step3BuscarPoe'
import { Step4AdaptarPoe }  from '../components/wizard/steps/Step4AdaptarPoe'
import type { Cliente, PisoCliente } from '../types'
import type { PoeRepositorioItem } from '@/mocks/data/poe-repositorio'

interface OnboardingData {
  cliente: Cliente | null
  pisos: PisoCliente[]
  poeSeleccionado: PoeRepositorioItem | null
}

const DATA_INICIAL: OnboardingData = { cliente: null, pisos: [], poeSeleccionado: null }

export function OnboardingClientePage() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData]               = useState<OnboardingData>(DATA_INICIAL)

  const goBack = () => { setCurrentStep((s) => Math.max(s - 1, 0)) }

  const handleStepClick = (index: number) => {
    if (index < currentStep) setCurrentStep(index)
  }

  const handleClienteNext = (partial: { cliente: Cliente }) => {
    setData((prev) => ({ ...prev, cliente: partial.cliente }))
    setCurrentStep(1)
  }

  const handlePisosNext = (partial: { pisos: PisoCliente[] }) => {
    setData((prev) => ({ ...prev, pisos: partial.pisos }))
    setCurrentStep(2)
  }

  const handlePoeNext = (partial: { poeSeleccionado: PoeRepositorioItem }) => {
    setData((prev) => ({ ...prev, poeSeleccionado: partial.poeSeleccionado }))
    setCurrentStep(3)
  }

  const handleAdaptarFinish = () => {
    void navigate('/clientes', {
      replace: true,
      state: { clienteNombre: data.cliente?.nombre, poeNombre: data.poeSeleccionado?.nombre },
    })
  }

  const steps: OnboardingStep[] = [
    { label: 'Cliente',        sublabel: data.cliente ? `✓ ${data.cliente.nombre}` : undefined },
    { label: 'Pisos y áreas',  sublabel: data.pisos.length ? `✓ ${String(data.pisos.length)} piso${data.pisos.length > 1 ? 's' : ''}` : undefined },
    { label: 'Buscar POE',     sublabel: data.poeSeleccionado ? `✓ ${data.poeSeleccionado.codigo}` : undefined },
    { label: 'Adaptar POE' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9fc]">
      {/* ── Header ───────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-10 flex h-12 items-center border-b border-violet-100 bg-white px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-black text-white">
            S
          </div>
          <span className="font-extrabold">Onboarding de cliente</span>
        </div>

        <div className="mx-6 flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${String(((currentStep + 1) / 4) * 100)}%` }}
            />
          </div>
        </div>

        <span className="font-mono text-xs text-violet-600">{currentStep + 1} / 4</span>
      </div>

      {/* ── Layout ───────────────────────────────── */}
      <div className="mt-12 grid h-[calc(100vh-3rem)] w-full grid-cols-12">
        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          clienteNombre={data.cliente?.nombre}
          onStepClick={handleStepClick}
        />

        <main className="scrollbar-clean col-span-12 overflow-auto px-4 py-6 lg:col-span-10 lg:px-8 lg:py-8">
          {currentStep === 0 && (
            <Step1Cliente onNext={handleClienteNext} />
          )}

          {currentStep === 1 && data.cliente && (
            <Step2PisosAreas cliente={data.cliente} onNext={handlePisosNext} onBack={goBack} />
          )}

          {currentStep === 2 && (
            <Step3BuscarPoe onNext={handlePoeNext} onBack={goBack} />
          )}

          {currentStep === 3 && data.cliente && data.poeSeleccionado && (
            <Step4AdaptarPoe
              cliente={data.cliente}
              poeOrigen={data.poeSeleccionado}
              onBack={goBack}
              onFinish={handleAdaptarFinish}
            />
          )}
        </main>
      </div>
    </div>
  )
}
