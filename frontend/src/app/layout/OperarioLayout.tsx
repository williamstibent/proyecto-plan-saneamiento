import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { cn } from '@/shared/lib/utils'

// ─── Bottom nav ───────────────────────────────────────────────────────────────

interface NavTab {
  to: string
  label: string
  icon: (active: boolean) => React.ReactNode
}

const TABS: NavTab[] = [
  {
    to: '/operario/hoy',
    label: 'Hoy',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#7c3aed' : 'none'} stroke={active ? '#7c3aed' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    to: '/operario/historial',
    label: 'Historial',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c3aed' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3" />
        <path d="M3.05 11a9 9 0 1 0 .5-3" />
        <path d="M3 4v4h4" />
      </svg>
    ),
  },
  {
    to: '/operario/perfil',
    label: 'Perfil',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c3aed' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

// ─── Perfil mini (sección de la tab) ─────────────────────────────────────────

function PerfilTab() {
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
    <div className="flex h-full flex-col items-center justify-center px-6 pt-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl font-extrabold text-white shadow-lg shadow-violet-200">
            {initials}
          </div>
          <div className="text-center">
            <div className="text-xl font-extrabold capitalize">{user?.nombre}</div>
            <div className="text-sm text-violet-600 capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</div>
            <div className="mt-1 text-xs text-[#5e577a]">{user?.tenantNombre} · Centro</div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-violet-100 bg-[#faf9fc] p-4 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-violet-500">Rol</div>
            <div className="mt-0.5 text-sm font-bold capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-violet-500">Establecimiento</div>
            <div className="mt-0.5 text-sm font-bold">{user?.tenantNombre}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-100"
        >
          ← Cerrar sesión
        </button>

        <p className="text-center text-[11px] text-violet-400">SanitIA · Resolución 2674 / 2013</p>
      </div>
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function OperarioLayout() {
  const user = useAuthStore((s) => s.user)

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const todayStr = today.charAt(0).toUpperCase() + today.slice(1)

  const initials = user?.nombre
    ? user.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#faf9fc]">
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-violet-100 bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 text-xs font-extrabold text-white">
            S
          </div>
          <div>
            <div className="text-sm font-extrabold leading-none">SanitIA</div>
            <div className="text-[10px] text-violet-600">{todayStr}</div>
          </div>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-400 text-xs font-extrabold text-white">
          {initials}
        </div>
      </header>

      {/* ── Contenido principal ─────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden">
        <Outlet context={{ PerfilTab }} />
      </main>

      {/* ── Bottom navigation ───────────────────────────────────────── */}
      <nav className="flex h-16 shrink-0 items-stretch border-t border-violet-100 bg-white">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                isActive ? 'text-violet-700' : 'text-slate-400',
              )
            }
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
