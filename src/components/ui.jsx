import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

// ── Button ────────────────────────────────────────────────────────────────
const BTN = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-500/40',
  secondary:
    'bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] hover:brightness-95 focus-visible:ring-brand-500/30',
  ghost: 'hover:bg-[rgb(var(--surface-2))] text-[rgb(var(--text))]',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40',
  amber: 'bg-amber-500 text-slate-900 hover:bg-amber-400 focus-visible:ring-amber-500/40',
}
const SIZE = { sm: 'h-9 px-3 text-sm', md: 'h-11 px-4 text-sm', lg: 'h-12 px-5 text-base' }

export function Button({
  variant = 'primary', size = 'md', loading, className, children, ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition',
        'focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
        BTN[variant], SIZE[size], className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────
export function Card({ className, ...props }) {
  return <div className={clsx('card p-5', className)} {...props} />
}
export function CardTitle({ className, ...props }) {
  return <h3 className={clsx('text-base font-semibold', className)} {...props} />
}

// ── Inputs / Form ───────────────────────────────────────────────────────────
export function Field({ label, hint, error, required, children }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
export const Input = (p) => <input className={clsx('input', p.className)} {...p} />
export const Select = ({ className, children, ...p }) => (
  <select className={clsx('input', className)} {...p}>{children}</select>
)
export const Textarea = (p) => <textarea className={clsx('input', p.className)} {...p} />

// ── Badge ─────────────────────────────────────────────────────────────────
const TONE = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
  success: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
}
export function Badge({ tone = 'neutral', className, ...props }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONE[tone], className)}
      {...props}
    />
  )
}

// ── Stat card ───────────────────────────────────────────────────────────────
export function Stat({ icon: Icon, label, value, sub, tone = 'brand' }) {
  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className={clsx('grid h-12 w-12 place-items-center rounded-xl', TONE[tone])}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm muted">{label}</p>
        <p className="truncate text-xl font-bold">{value}</p>
        {sub && <p className="text-xs muted">{sub}</p>}
      </div>
    </Card>
  )
}

// ── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name = '?', className }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  return (
    <div className={clsx('grid place-items-center rounded-full bg-brand-100 text-brand-700 font-semibold dark:bg-brand-500/20 dark:text-brand-300', className || 'h-10 w-10 text-sm')}>
      {initials}
    </div>
  )
}

// ── EmptyState / Spinner ────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[rgb(var(--border))] p-10 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-[rgb(var(--text-muted))]" />}
      <p className="font-semibold">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
export function Spinner({ className }) {
  return <Loader2 className={clsx('h-5 w-5 animate-spin text-brand-600', className)} />
}

// ── helpers ───────────────────────────────────────────────────────────────
export const brl = (n) =>
  (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
