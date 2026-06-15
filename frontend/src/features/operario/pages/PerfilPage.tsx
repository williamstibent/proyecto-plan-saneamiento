import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'

export function PerfilPage() {
  const user      = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate  = useNavigate()

  const initials = user?.nombre
    ? user.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col overflow-auto px-4 py-5">
      <h1 className="mb-5 text-xl font-extrabold tracking-tight">Mi perfil</h1>

      <div className="flex flex-col items-center gap-3 pt-2 lg:max-w-sm lg:mx-auto">
        {/* Avatar */}
        <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl font-extrabold text-white shadow-lg shadow-violet-200">
          {initials}
        </div>
        <div className="text-center">
          <div className="text-xl font-extrabold capitalize">{user?.nombre}</div>
          <div className="text-sm text-violet-600 capitalize">
            {user?.role?.toLowerCase().replace(/_/g, ' ')}
          </div>
          <div className="mt-1 text-xs text-[#5e577a]">{user?.tenantNombre}</div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 rounded-2xl border border-violet-100 bg-[#faf9fc] p-4 space-y-3 lg:max-w-sm lg:mx-auto lg:w-full">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-500">Rol</div>
          <div className="mt-0.5 text-sm font-bold capitalize">
            {user?.role?.toLowerCase().replace(/_/g, ' ')}
          </div>
        </div>
        <div className="border-t border-violet-100" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-500">Establecimiento</div>
          <div className="mt-0.5 text-sm font-bold">{user?.tenantNombre}</div>
        </div>
        <div className="border-t border-violet-100" />
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-500">Normativa</div>
          <div className="mt-0.5 text-sm font-bold">Resolución 2674 de 2013</div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-6 lg:max-w-sm lg:mx-auto lg:w-full">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100"
        >
          ← Cerrar sesión
        </button>
      </div>

      <p className="mt-6 text-center text-[11px] text-violet-400">
        SanitIA · Resolución 2674 / 2013
      </p>
    </div>
  )
}
