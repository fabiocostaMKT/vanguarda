import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Route as RouteIcon, Wallet, MessageCircle, Sparkles, Settings, LogOut, Bus } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui'

const NAV = [
  { to: '/', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/alunos', label: 'Alunos', icon: Users },
  { to: '/rotas', label: 'Rotas', icon: RouteIcon },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/comunicacao', label: 'Conversas', icon: MessageCircle },
  { to: '/assistente', label: 'IA', icon: Sparkles },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const sair = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 md:flex">
        <Brand />
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {NAV.map((n) => <Item key={n.to} {...n} />)}
          <Item to="/config" label="Configurações" icon={Settings} />
        </nav>
        <UserCard user={user} onLogout={sair} />
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 md:hidden">
          <Brand />
          <Link to="/config"><Avatar name={user?.nome} /></Link>
        </header>
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))] pb-safe md:hidden">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => clsx(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium',
              isActive ? 'text-brand-600' : 'text-[rgb(var(--text-muted))]')}>
            <n.icon className="h-5 w-5" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white"><Bus className="h-5 w-5" /></div>
      <div className="text-lg font-extrabold tracking-tight">Van<span className="text-brand-600">Guarda</span></div>
    </div>
  )
}

function Item({ to, label, icon: Icon, end }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
        isActive ? 'bg-brand-700 text-white' : 'text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]')}>
      <Icon className="h-5 w-5" /> {label}
    </NavLink>
  )
}

function UserCard({ user, onLogout }) {
  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-[rgb(var(--border))] p-2.5">
      <Avatar name={user?.nome} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user?.nome}</p>
        <p className="truncate text-xs muted">Motorista</p>
      </div>
      <button onClick={onLogout} title="Sair" className="rounded-lg p-2 hover:bg-[rgb(var(--surface-2))]">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}
