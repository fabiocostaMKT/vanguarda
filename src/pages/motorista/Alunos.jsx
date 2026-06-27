import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Users, ChevronRight } from 'lucide-react'
import { repo } from '../../data/repo'
import { Button, Input, Select, Badge, Spinner, EmptyState, Avatar, brl } from '../../components/ui'

const STATUS = {
  ativo: { tone: 'success', label: 'Ativo' },
  ferias: { tone: 'warning', label: 'Férias' },
  inativo: { tone: 'neutral', label: 'Inativo' },
}

export default function Alunos() {
  const [alunos, setAlunos] = useState(null)
  const [q, setQ] = useState('')
  const [turno, setTurno] = useState('todos')

  useEffect(() => { repo.listAlunos().then(setAlunos) }, [])

  const filtrados = useMemo(() => {
    if (!alunos) return []
    return alunos
      .filter((a) => (turno === 'todos' ? true : a.turno === turno))
      .filter((a) => a.nome.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [alunos, q, turno])

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Alunos</h1>
          <p className="muted">{alunos ? `${alunos.length} cadastrados` : 'Carregando…'}</p>
        </div>
        <Link to="/alunos/novo"><Button><Plus className="h-4 w-4" /> Novo aluno</Button></Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--text-muted))]" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome…" className="pl-9" />
        </div>
        <Select value={turno} onChange={(e) => setTurno(e.target.value)} className="sm:w-44">
          <option value="todos">Todos os turnos</option>
          <option value="manha">Manhã</option>
          <option value="tarde">Tarde</option>
        </Select>
      </div>

      {!alunos ? (
        <div className="grid h-48 place-items-center"><Spinner className="h-7 w-7" /></div>
      ) : filtrados.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum aluno encontrado"
          action={<Link to="/alunos/novo"><Button><Plus className="h-4 w-4" /> Cadastrar aluno</Button></Link>}>
          Ajuste a busca ou cadastre o primeiro aluno da sua van.
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((a) => (
            <Link key={a.id} to={`/alunos/${a.id}`}
              className="card flex items-center gap-3 p-4 transition hover:shadow-float">
              <Avatar name={a.nome} className="h-11 w-11 text-sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{a.nome}</p>
                <p className="truncate text-xs muted">{a.escola} · {a.serie}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge tone={STATUS[a.status]?.tone}>{STATUS[a.status]?.label}</Badge>
                  <span className="text-xs muted">{brl(a.mensalidade)}/mês</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[rgb(var(--text-muted))]" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
