import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Clock, Users, MapPin, Play, Plus, Route as RouteIcon } from 'lucide-react'
import { repo } from '../../data/repo'
import { Button, Card, Badge, Spinner, EmptyState } from '../../components/ui'

export default function Rotas() {
  const [rotas, setRotas] = useState(null)

  useEffect(() => { repo.listRotas().then(setRotas) }, [])

  if (!rotas) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Rotas</h1>
          <p className="muted">{rotas.length} rotas cadastradas</p>
        </div>
        <Button variant="secondary"><Plus className="h-4 w-4" /> Nova rota</Button>
      </header>

      {rotas.length === 0 ? (
        <EmptyState icon={RouteIcon} title="Nenhuma rota ainda">
          Crie a primeira rota e vincule os alunos que ela atende.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rotas.map((r) => (
            <Card key={r.id} className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15">
                  <Bus className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">{r.turno === 'manha' ? 'Manhã' : 'Tarde'}</Badge>
                    <Badge tone={r.status === 'ativa' ? 'success' : 'neutral'}>{r.status}</Badge>
                  </div>
                  <h3 className="mt-1 truncate font-semibold">{r.nome}</h3>
                  <p className="truncate text-sm muted">{r.escola}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <Info icon={Clock} label="Saída" value={r.horarioSaida} />
                <Info icon={Users} label="Alunos" value={r.alunoIds.length} />
                <Info icon={MapPin} label="Trajeto" value={`${r.distanciaKm} km`} />
              </div>

              <Link to={`/rotas/${r.id}/executar`} className="mt-auto">
                <Button variant="amber" className="w-full"><Play className="h-4 w-4" /> Iniciar rota</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-[rgb(var(--surface-2))] p-2.5 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-brand-600" />
      <p className="font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs muted">{label}</p>
    </div>
  )
}
