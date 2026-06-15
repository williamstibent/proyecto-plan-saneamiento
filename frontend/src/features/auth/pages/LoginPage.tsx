import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../hooks/useLogin'

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo no válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  remember: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Panel decorativo izquierdo ──────────────────────────────────────────────

function DecorativePanel() {
  return (
    <div className="relative hidden lg:block lg:col-span-7 overflow-hidden p-12" style={{ background: 'linear-gradient(135deg, #fdf4ff, #fff7ed)' }}>
      {/* Blobs de fondo */}
      <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />

      <div className="relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 font-extrabold text-white shadow-lg shadow-violet-200">
            S
          </div>
          <div className="font-extrabold text-violet-950">SanitIA</div>
        </div>

        <div className="mt-20">
          <div className="text-xs uppercase tracking-widest text-violet-700">
            cumplimiento sanitario, hecho fácil
          </div>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">
            Donde el plan de saneamiento{' '}
            <span className="rounded-lg bg-violet-100 px-2">deja de ser papel</span>.
          </h2>
          <p className="mt-4 max-w-md text-violet-900/70">
            Convierte la Resolución 2674 en tareas diarias, evidencias en contexto y reportes
            listos para INVIMA.
          </p>

          {/* Tarjetas flotantes decorativas */}
          <div className="relative mt-10 h-72">
            <div className="absolute left-0 top-0 w-56 rotate-[-4deg] rounded-2xl border border-violet-100 bg-white p-3 shadow-xl shadow-violet-200">
              <div className="flex items-center justify-between text-[10px]">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">completada</span>
                <span className="font-mono text-violet-500">07:30</span>
              </div>
              <div className="mt-1 text-sm font-bold leading-tight">Sanitización pisos</div>
              <div className="text-[11px] text-violet-700">Horno · POE-PISOS-14</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="absolute right-0 top-12 w-60 rotate-[3deg] rounded-2xl border border-orange-100 bg-white p-3 shadow-xl shadow-orange-200">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">vence 09:30</span>
                <span className="text-lg">🧪</span>
              </div>
              <div className="mt-1 text-sm font-bold leading-tight">Limpiar mesas de trabajo</div>
              <div className="text-[11px] text-violet-700">Cocina · diaria</div>
              <div className="mt-2 text-[10px] font-bold text-orange-700">⏱ Amonio cuat. 10 min</div>
            </div>

            <div className="absolute bottom-0 left-10 w-52 rotate-[2deg] rounded-2xl border border-violet-100 bg-white p-3 shadow-xl shadow-violet-200">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-700">
                  JR
                </div>
                <div className="text-[11px]">
                  <div className="font-bold">Juan acaba de</div>
                  <div className="text-violet-700">subir 3 fotos · ahora</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs text-violet-800 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Diseñado con consultoras sanitarias de Colombia
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Formulario derecho ───────────────────────────────────────────────────────

function LoginForm() {
  const { mutate: doLogin, isPending, error } = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  })

  const onSubmit = (values: LoginFormValues) => {
    doLogin({ email: values.email, password: values.password })
  }

  return (
    <div className="col-span-12 flex flex-col justify-center bg-white px-6 py-10 lg:col-span-5 lg:p-12">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo compacto — solo visible en móvil (el panel decorativo está oculto) */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 font-extrabold text-white shadow-lg shadow-violet-200">
            S
          </div>
          <div>
            <div className="font-extrabold text-violet-950">SanitIA</div>
            <div className="text-xs text-violet-600">cumplimiento sanitario, hecho fácil</div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold leading-tight">
          Bienvenido<br />de vuelta.
        </h1>
        <p className="mt-2 text-sm text-[#5e577a]">Ingresa para abrir el día.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-violet-800">Correo electrónico</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6">
                <path strokeWidth="2" d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                placeholder="tu@empresa.com"
                className="w-full bg-transparent text-sm outline-none"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-violet-800">Contraseña</label>
              <a href="#" className="text-xs font-semibold text-violet-700 hover:underline">
                ¿Olvidaste?
              </a>
            </div>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6">
                <path strokeWidth="2" d="M12 11v3m0 4h.01M6 21h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zM16 10V7a4 4 0 10-8 0v3" />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2 text-xs text-violet-900/80">
            <input type="checkbox" className="rounded border-violet-300 text-violet-600" {...register('remember')} />
            Mantén la sesión abierta 30 días
          </label>

          {/* Error de servidor */}
          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
              Credenciales incorrectas. Intenta de nuevo.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 py-3 text-base font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-60"
          >
            {isPending ? 'Entrando…' : 'Entrar'}
            {!isPending && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-violet-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[11px] uppercase tracking-widest text-violet-600">o</span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-white py-3 text-sm font-semibold hover:bg-[#faf9fc]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#7c3aed" d="M12 11.5V14h6.3c-.3 1.7-1.9 5-6.3 5-3.8 0-6.9-3.1-6.9-7s3.1-7 6.9-7c2.2 0 3.6.9 4.4 1.7l3-2.9C17.6 1.9 15 1 12 1 5.9 1 1 5.9 1 12s4.9 11 11 11c6.4 0 10.6-4.5 10.6-10.8 0-.7-.1-1.2-.2-1.7H12z" />
            </svg>
            Single Sign-On corporativo
          </button>

          <p className="mt-4 text-center text-xs text-violet-900/60">
            ¿Sin cuenta?{' '}
            <a href="#" className="font-bold text-violet-700">Pide acceso →</a>
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Página completa ──────────────────────────────────────────────────────────

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-stretch">
      <div className="grid w-full grid-cols-12">
        <DecorativePanel />
        <LoginForm />
      </div>
    </div>

  )
}
