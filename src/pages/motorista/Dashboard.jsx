import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Route as RouteIcon, Wallet, AlertTriangle, Clock, Bell, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { repo } from '../../data/repo'
import { Card, CardTitle, Stat, Badge, Spinner, Button, brl, Avatar } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'

// histórico mock de 6 meses (entra dado real do financeiro na fase 3)
const HIST = [
  { mes: 'Jan', v: 5200 }, { mes: 'Fev', v: 6100 }, { mes: 'Mar', v: 6400 },
  { mes: 'Abr', v: 6800 }, { mes: 'Mai', v: 7200 }, { mes: 'Jun', v: 7600 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([repo.dashboardSummary(), repo.listRotas(), repo.listAlunos(), repo.listMensalidades(), repo.listNotificacoes()])
      .then(([resumo, rotas, alunos, mensalidades, notificacoes]) =>
        setData({ resumo, rotas, alunos, mensalidades, notificacoes }))
  }, [])

  if (!data) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>
  const { resumo, rotas, alunos, mensalidades, notificacoes } = data
  const proximaRota = rotas[0]
  const vencidas = mensalidades.filter((m) => m.status === 'vencido')
  const nomeAluno = (id) => alunos.find((a) => a.id === id)?.nome || '—'
  const primeiroNome = (user?.nome || '').split(' ')[0]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Olá, {primeiroNome} 👋</h1>
          <p className="muted">Resumo da sua operação hoje.</p>
        </div>
        <Link to="/rotas"><Button variant="amber">Iniciar rota</Button></Link>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Users} label="Alunos ativos" value={resumo.totalAlunos} tone="brand" />
        <Stat icon={RouteIcon} label="Rotas ativas" value={resumo.totalRotas} tone="brand" />
        <Stat icon={Wallet} label="Recebido no mês" value={brl(resumo.recebido)} sub={`de ${brl(resumo.previsto)} previstos`} tone="success" />
        <Stat icon={AlertTriangle} label="Em atraso" value={resumo.vencidosCount} sub={brl(resumo.vencidosValor)} tone="danger" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Próxima rota */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Próxima rota</CardTitle>
            <Link to="/rotas" className="text-sm font-medium text-brand-600">Ver todas</Link>
          </div>
          {proximaRota ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[rgb(var(--surface-2))] p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{proximaRota.turno === 'manha' ? 'Manhã' : 'Tarde'}</Badge>
                  <span className="font-semibold">{proximaRota.nome}</span>
                </div>
                <p className="mt-1 text-sm muted">{proximaRota.escola} · {proximaRota.alunoIds.length} alunos</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-brand-600" /> Saída {proximaRota.horarioSaida}
              </div>
              <Link to="/rotas"><Button size="sm">Abrir <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          ) : <p className="muted">Nenhuma rota cadastrada.</p>}

          <div className="mt-6">
            <CardTitle className="mb-3 text-sm muted">Receita dos últimos 6 meses</CardTitle>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HIST}>
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip formatter={(v) => brl(v)} cursor={{ fill: 'rgba(0,0,0,.04)' }} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {HIST.map((_, i) => <Cell key={i} fill={i === HIST.length - 1 ? '#1d4ed8' : '#93c5fd'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Coluna lateral: alertas + atrasos */}
        <div className="space-y-6">
          <Card>
            <CardTitle className="mb-3 flex items-center gap-2"><Bell className="h-4 w-4" /> Alertas</CardTitle>
            <div className="space-y-3">
              {notificacoes.length === 0 && <p className="text-sm muted">Sem alertas.</p>}
              {notificacoes.map((n) => (
                <div key={n.id} className="rounded-xl bg-[rgb(var(--surface-2))] p-3">
                  <p className="text-sm font-medium">{n.titulo}</p>
                  <p className="text-xs muted">{n.corpo}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle className="mb-3 flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" /> Mensalidades vencidas
            </CardTitle>
            {vencidas.length === 0 ? (
              <p className="text-sm muted">Tudo em dia. 🎉</p>
            ) : (
              <div className="space-y-2">
                {vencidas.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar name={nomeAluno(m.alunoId)} className="h-8 w-8 text-xs" />
                    <span className="flex-1 truncate text-sm">{nomeAluno(m.alunoId)}</span>
                    <Badge tone="danger">{brl(m.valor)}</Badge>
                  </div>
                ))}
                <Link to="/financeiro" className="mt-2 block text-sm font-medium text-brand-600">Cobrar no Pix →</Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
