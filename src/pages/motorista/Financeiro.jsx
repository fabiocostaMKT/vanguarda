import { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, QrCode, Copy, Check, Fuel, Wrench, Shield, MoreHorizontal } from 'lucide-react'
import { repo } from '../../data/repo'
import { Card, CardTitle, Badge, Button, Spinner, Avatar, brl } from '../../components/ui'

const STATUS = { pago: 'success', pendente: 'warning', vencido: 'danger' }
const STATUS_LABEL = { pago: 'Pago', pendente: 'Pendente', vencido: 'Vencido' }
const DESP_ICON = { combustivel: Fuel, manutencao: Wrench, seguro: Shield, outros: MoreHorizontal }

export default function Financeiro() {
  const [data, setData] = useState(null)
  const [pix, setPix] = useState(null) // mensalidade selecionada p/ cobrança

  const carregar = () =>
    Promise.all([repo.listMensalidades(), repo.listDespesas(), repo.listAlunos()])
      .then(([mensalidades, despesas, alunos]) => setData({ mensalidades, despesas, alunos }))
  useEffect(() => { carregar() }, [])

  const resumo = useMemo(() => {
    if (!data) return null
    const recebido = data.mensalidades.filter((m) => m.status === 'pago').reduce((s, m) => s + m.valor, 0)
    const aReceber = data.mensalidades.filter((m) => m.status !== 'pago').reduce((s, m) => s + m.valor, 0)
    const despesas = data.despesas.reduce((s, d) => s + d.valor, 0)
    return { recebido, aReceber, despesas, lucro: recebido - despesas }
  }, [data])

  if (!data) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>
  const nome = (id) => data.alunos.find((a) => a.id === id)?.nome || '—'

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <p className="muted">Mensalidades, cobrança no Pix e despesas.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Wallet} tone="success" label="Recebido" value={brl(resumo.recebido)} />
        <Stat icon={TrendingUp} tone="warning" label="A receber" value={brl(resumo.aReceber)} />
        <Stat icon={TrendingDown} tone="danger" label="Despesas" value={brl(resumo.despesas)} />
        <Stat icon={Wallet} tone="brand" label="Lucro do mês" value={brl(resumo.lucro)} />
      </section>

      <Card>
        <CardTitle className="mb-4">Mensalidades</CardTitle>
        <div className="divide-y divide-[rgb(var(--border))]">
          {data.mensalidades.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3">
              <Avatar name={nome(m.alunoId)} className="h-9 w-9 text-xs" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{nome(m.alunoId)}</p>
                <p className="text-xs muted">Venc. {new Date(m.vencimento).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className="text-sm font-semibold">{brl(m.valor)}</span>
              <Badge tone={STATUS[m.status]}>{STATUS_LABEL[m.status]}</Badge>
              {m.status !== 'pago' && (
                <Button size="sm" variant="secondary" onClick={() => setPix(m)}>
                  <QrCode className="h-4 w-4" /> Cobrar
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Despesas do mês</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.despesas.map((d) => {
            const Icon = DESP_ICON[d.categoria] || MoreHorizontal
            return (
              <div key={d.id} className="flex items-center gap-3 rounded-xl bg-[rgb(var(--surface-2))] p-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[rgb(var(--surface))]"><Icon className="h-5 w-5 text-brand-600" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.descricao}</p>
                  <p className="text-xs capitalize muted">{d.categoria}</p>
                </div>
                <span className="text-sm font-semibold text-red-500">- {brl(d.valor)}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {pix && <PixModal mensalidade={pix} aluno={nome(pix.alunoId)} onClose={() => setPix(null)}
        onPago={async () => { await repo.marcarMensalidadePaga(pix.id); setPix(null); carregar() }} />}
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }) {
  const TONES = { success: 'text-green-600', warning: 'text-amber-600', danger: 'text-red-500', brand: 'text-brand-600' }
  return (
    <Card>
      <Icon className={`h-5 w-5 ${TONES[tone]}`} />
      <p className="mt-2 text-xl font-bold">{value}</p>
      <p className="text-sm muted">{label}</p>
    </Card>
  )
}

function PixModal({ mensalidade, aluno, onClose, onPago }) {
  const [copied, setCopied] = useState(false)
  const code = `00020126KEEPVAN-PIX-${mensalidade.id.toUpperCase()}-${Math.round(mensalidade.valor * 100)}5204000053039865802BR`
  function copy() { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <Card className="w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
        <CardTitle>Cobrança Pix</CardTitle>
        <p className="mt-1 text-sm muted">{aluno} · {brl(mensalidade.valor)}</p>
        <div className="mx-auto my-5 grid h-44 w-44 place-items-center rounded-2xl bg-[rgb(var(--surface-2))]">
          <QrCode className="h-28 w-28 text-brand-700" />
        </div>
        <button onClick={copy} className="flex w-full items-center justify-between gap-2 rounded-xl border border-[rgb(var(--border))] p-3 text-left text-xs">
          <span className="truncate font-mono">{code}</span>
          {copied ? <Check className="h-4 w-4 shrink-0 text-green-600" /> : <Copy className="h-4 w-4 shrink-0" />}
        </button>
        <p className="mt-2 text-xs muted">Em produção: Pix gerado pelo Asaas + envio por WhatsApp e baixa automática via webhook.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Fechar</Button>
          <Button className="flex-1" onClick={onPago}><Check className="h-4 w-4" /> Marcar pago</Button>
        </div>
      </Card>
    </div>
  )
}
