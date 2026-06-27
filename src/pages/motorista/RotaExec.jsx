import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, MapPin, Navigation, CheckCircle2, Bell } from 'lucide-react'
import { clsx } from 'clsx'
import { repo } from '../../data/repo'
import { Button, Card, Badge, Spinner, Avatar } from '../../components/ui'

const FLOW = ['aguardando', 'embarcou', 'desembarcou']
const META = {
  aguardando: { label: 'Aguardando', dot: 'bg-slate-300', tone: 'neutral' },
  embarcou: { label: 'Embarcou', dot: 'bg-green-500', tone: 'success' },
  desembarcou: { label: 'Desembarcou', dot: 'bg-brand-500', tone: 'brand' },
}
const hasMaps = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

export default function RotaExec() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rota, setRota] = useState(null)
  const [alunos, setAlunos] = useState([])
  const [status, setStatus] = useState({})
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    Promise.all([repo.getRota(id), repo.listAlunos()]).then(([r, todos]) => {
      if (!r) return navigate('/rotas')
      setRota(r)
      setAlunos(todos.filter((a) => r.alunoIds.includes(a.id)))
      setStatus(Object.fromEntries(r.alunoIds.map((aid) => [aid, 'aguardando'])))
    })
  }, [id, navigate])

  useEffect(() => {
    if (running) timer.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer.current)
  }, [running])

  if (!rota) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const embarcados = Object.values(status).filter((s) => s !== 'aguardando').length

  function cycle(aluno) {
    setStatus((prev) => {
      const next = FLOW[(FLOW.indexOf(prev[aluno.id]) + 1) % FLOW.length]
      if (next !== 'aguardando') {
        // Em produção: dispara notificação FCM + WhatsApp aos pais (Cloud Function).
        setToast(`Pais de ${aluno.nome.split(' ')[0]} notificados: ${META[next].label.toLowerCase()}`)
        setTimeout(() => setToast(''), 2600)
      }
      return { ...prev, [aluno.id]: next }
    })
  }

  function finalizar() {
    setRunning(false)
    // Em produção: grava execucaoRota (início, fim, embarques, pontos GPS).
    navigate('/rotas')
  }

  return (
    <div className="space-y-5">
      <Link to="/rotas" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Rotas
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">{rota.turno === 'manha' ? 'Manhã' : 'Tarde'}</Badge>
            <h1 className="text-xl font-bold">{rota.nome}</h1>
          </div>
          <p className="muted">{rota.escola} · {embarcados}/{alunos.length} a bordo</p>
        </div>
        <Button variant="secondary" onClick={finalizar}><CheckCircle2 className="h-4 w-4" /> Finalizar</Button>
      </header>

      {/* GPS */}
      <Card className="overflow-hidden p-0">
        <div className="relative grid h-48 place-items-center bg-gradient-to-br from-brand-700 to-brand-900 text-center text-white">
          <div>
            <Navigation className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">{running ? 'Transmitindo posição ao vivo' : 'GPS pronto'}</p>
            <p className="mt-1 text-xs text-brand-200">
              {hasMaps ? 'Mapa em tempo real ativo' : 'Conecte a Google Maps API para o mapa ao vivo'}
            </p>
          </div>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5" /> geofence 100m
          </span>
        </div>
      </Card>

      {/* Cronômetro */}
      <Card className="text-center">
        <p className={clsx('font-mono text-5xl font-bold tracking-tight', running ? 'text-green-600' : 'muted')}>
          {mm}:{ss}
        </p>
        <Button className="mt-3" variant={running ? 'danger' : 'primary'} onClick={() => setRunning((r) => !r)}>
          {running ? <><Pause className="h-4 w-4" /> Pausar rota</> : <><Play className="h-4 w-4" /> Iniciar rota</>}
        </Button>
      </Card>

      {/* Check-in dos alunos */}
      <Card>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide muted">Check-in dos alunos</p>
        <ul className="divide-y divide-[rgb(var(--border))]">
          {alunos.map((a) => {
            const st = status[a.id]
            return (
              <li key={a.id}>
                <button onClick={() => cycle(a)} className="flex w-full items-center gap-3 py-3 text-left">
                  <span className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', META[st].dot)} />
                  <Avatar name={a.nome} className="h-9 w-9 text-xs" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{a.nome}</span>
                    <span className="block truncate text-xs muted">{a.bairro}</span>
                  </span>
                  <Badge tone={META[st].tone}>{META[st].label}</Badge>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-center text-xs muted">Toque no aluno para alternar o status · os pais são avisados a cada mudança</p>
      </Card>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-float md:bottom-8">
          <Bell className="h-4 w-4 text-amber-400" /> {toast}
        </div>
      )}
    </div>
  )
}
