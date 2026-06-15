import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useAuthStore } from '@/shared/stores/authStore'

interface DashboardSidebarProps {
  onClose?: () => void
}

interface NavItem {
  emoji: string
  label: string
  href: string
  badge?: { text: string; variant: 'bad' | 'warn' }
}

const NAV_OPERATIVO: NavItem[] = [
  { emoji: '🏠', label: 'Resumen',          href: '/dashboard' },
  { emoji: '✅', label: 'Validar',           href: '/validar',          badge: { text: '12', variant: 'bad' } },
  { emoji: '📍', label: 'Mapa',              href: '/mapa' },
  { emoji: '📅', label: 'Programación',      href: '/programacion' },
  { emoji: '⚠',  label: 'No conformidades',  href: '/no-conformidades', badge: { text: '3', variant: 'warn' } },
]

const NAV_CONFIGURAR: NavItem[] = [
  { emoji: '📑', label: 'POE',              href: '/poe' },
  { emoji: '🧪', label: 'Productos',        href: '/productos' },
  { emoji: '👥', label: 'Usuarios',         href: '/usuarios' },
  { emoji: '📚', label: 'Capacitaciones',   href: '/capacitaciones' },
  { emoji: '🛡',  label: 'Vista INVIMA',    href: '/invima' },
]

function Badge({ text, variant }: { text: string; variant: 'bad' | 'warn' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
        variant === 'bad'  && 'bg-rose-100 text-rose-700',
        variant === 'warn' && 'bg-orange-100 text-orange-700',
      )}
    >
      {text}
    </span>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const { pathname } = useLocation()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm transition-colors',
        isActive
          ? 'border border-violet-100 bg-white font-bold text-[#1b1530] shadow-sm'
          : 'text-[#1b1530] hover:bg-white',
      )}
    >
      <span>{item.emoji}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && <Badge text={item.badge.text} variant={item.badge.variant} />}
    </Link>
  )
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const user      = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate  = useNavigate()

  const initials = user?.nombre
    ? user.nombre.slice(0, 2).toUpperCase()
    : 'U'

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-violet-100 bg-[#faf9fc] p-4 lg:w-56">
      {/* Logo + tenant + botón cerrar (solo móvil) */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 font-extrabold text-white shadow-md shadow-violet-200">
          S
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold leading-none">SanitIA</div>
          <div className="mt-0.5 text-[10px] text-violet-600 truncate">
            {user?.tenantNombre ?? 'ArtesaPan'} · Centro
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-xl text-violet-400 hover:bg-violet-100 lg:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav operativo */}
      <div className="mb-2 px-2 text-[10px] uppercase tracking-widest text-violet-500">
        Operativo
      </div>
      <nav className="space-y-1">
        {NAV_OPERATIVO.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Nav configurar */}
      <div className="mb-2 mt-6 px-2 text-[10px] uppercase tracking-widest text-violet-500">
        Configurar
      </div>
      <nav className="space-y-1">
        {NAV_CONFIGURAR.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Usuario + logout */}
      <div className="mt-auto rounded-2xl border border-violet-100 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-400 text-xs font-extrabold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-xs font-extrabold capitalize">
              {user?.nombre ?? 'Usuario'}
            </div>
            <div className="text-[10px] text-violet-600 capitalize">
              {user?.role ?? 'operario'}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          ← Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
