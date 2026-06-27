import { useEffect, useState } from 'react'
import { User, Bus, IdCard, Star, Check } from 'lucide-react'
import { repo } from '../../data/repo'
import { Card, CardTitle, Badge, Button, Spinner } from '../../components/ui'

const PLANOS = [
  { id: 'basico', nome: 'Básico', preco: 79, destaque: 'Até 20 alunos · 2 rotas' },
  { id: 'pro', nome: 'Pro', preco: 129, destaque: 'Até 40 · WhatsApp · contratos' },
  { id: 'premium', nome: 'Premium', preco: 179, destaque: 'Ilimitado · IA · otimização' },
]

export default function Config() {
  const [m, setM] = useState(null)
  useEffect(() => { repo.getMotorista().then(setM) }, [])
  if (!m) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="muted">Seus dados, veículo e plano.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2"><User className="h-4 w-4" /> Perfil</CardTitle>
          <Row label="Nome" value={m.nome} />
          <Row label="CPF" value={m.cpf} />
          <Row label="Telefone" value={m.telefone} />
          <Row label="E-mail" value={m.email} />
          <Row label="Cidade" value={`${m.cidade}/${m.estado}`} />
        </Card>

        <Card>
          <CardTitle className="mb-4 flex items-center gap-2"><Bus className="h-4 w-4" /> Veículo</CardTitle>
          <Row label="Veículo" value={`${m.veiculo.marca} ${m.veiculo.modelo} ${m.veiculo.ano}`} />
          <Row label="Placa" value={m.veiculo.placa} />
          <Row label="Cor" value={m.veiculo.cor} />
          <Row label="Capacidade" value={`${m.veiculo.capacidade} lugares`} />
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[rgb(var(--surface-2))] p-3 text-sm">
            <IdCard className="h-4 w-4 text-brand-600" />
            CNH {m.cnh.categoria} · venc. {new Date(m.cnh.vencimento).toLocaleDateString('pt-BR')}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-1 flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Plano</CardTitle>
        <p className="mb-4 text-sm muted">Plano atual: <span className="font-semibold capitalize">{m.plano}</span></p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PLANOS.map((p) => {
            const atual = p.id === m.plano
            return (
              <div key={p.id} className={`rounded-2xl border p-4 ${atual ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-[rgb(var(--border))]'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{p.nome}</span>
                  {atual && <Badge tone="brand"><Check className="h-3 w-3" /> Atual</Badge>}
                </div>
                <p className="mt-2 text-2xl font-bold">R$ {p.preco}<span className="text-sm font-normal muted">/mês</span></p>
                <p className="mt-1 text-xs muted">{p.destaque}</p>
                {!atual && <Button variant="secondary" size="sm" className="mt-3 w-full">Mudar</Button>}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[rgb(var(--border))] py-2 text-sm last:border-0">
      <span className="muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
