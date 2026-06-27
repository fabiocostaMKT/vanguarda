import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bus, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Field, Input } from '../components/ui'
import { DATA_MODE } from '../lib/firebase'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setErro(''); setLoading(true)
    try {
      await login({ email, senha })
      navigate('/')
    } catch (err) {
      setErro(err.message || 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Lado da marca */}
      <div className="relative hidden flex-col justify-between bg-brand-800 p-10 text-white md:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Bus className="h-6 w-6" /></div>
          <span className="text-2xl font-extrabold">VanGuarda</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">O transporte escolar,<br />sob controle.</h1>
          <p className="mt-4 max-w-md text-brand-100">
            Alunos, rotas com GPS, cobrança no Pix e comunicação com os pais — tudo num app só.
            Feito pra quem dirige e gere a van todo dia.
          </p>
        </div>
        <p className="text-sm text-brand-200">KeepCoding © 2026 · keepcoding.net.br</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-white"><Bus className="h-6 w-6" /></div>
              <span className="text-2xl font-extrabold">Van<span className="text-brand-600">Guarda</span></span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Entrar</h2>
          <p className="mt-1 mb-6 text-sm muted">Acesse sua conta de motorista.</p>

          <div className="space-y-4">
            <Field label="E-mail">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com" className="pl-9" />
              </div>
            </Field>
            <Field label="Senha">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
                <Input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••" className="pl-9" />
              </div>
            </Field>
            {erro && <p className="text-sm text-red-500">{erro}</p>}
            <Button type="submit" size="lg" loading={loading} className="w-full">Entrar</Button>
          </div>

          {DATA_MODE === 'mock' && (
            <p className="mt-6 rounded-xl bg-amber-50 p-3 text-center text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              Modo demonstração — entre com qualquer e-mail e senha.
            </p>
          )}
          <p className="mt-4 text-center text-sm">
            <Link to="/pais" className="font-medium text-brand-600">Ver o app dos pais (demo) →</Link>
          </p>
          <p className="mt-1 text-center text-xs muted">É responsável? Acesse pelo link de convite do motorista.</p>
        </form>
      </div>
    </div>
  )
}
