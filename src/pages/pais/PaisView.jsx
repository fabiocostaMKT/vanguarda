import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Navigation, Phone, MessageCircle, QrCode, CalendarOff, MapPin, Clock, Check } from 'lucide-react'
import { Card, CardTitle, Badge, Button, Avatar, brl } from '../../components/ui'

// Visão dos pais — em produção, dados vêm do vínculo aluno↔responsável (Firestore).
const FILHO = { nome: 'Helena Martins Costa', escola: 'Colégio Equipe', serie: '5º ano' }
const MOTORISTA = { nome: 'Carlos Eduardo Ramos', veiculo: 'Mercedes Sprinter · RKV-2E26', tel: '(32) 99980-1204' }

export default function PaisView() {
  const [falta, setFalta] = useState(false)
  const [enviado, setEnviado] = useState(false)

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <header className="flex items-center justify-between bg-brand-800 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15"><Bus className="h-5 w-5" /></div>
          <span className="font-extrabold">VanGuarda <span className="text-xs font-normal text-brand-200">· Pais</span></span>
        </div>
        <Link to="/login" className="text-xs text-brand-200 underline">sair</Link>
      </header>

      <main className="mx-auto max-w-md space-y-4 p-4">
        {/* Status da van */}
        <Card className="overflow-hidden p-0">
          <div className="relative grid h-40 place-items-center bg-gradient-to-br from-brand-600 to-brand-900 text-center text-white">
            <div>
              <Navigation className="mx-auto mb-2 h-7 w-7 animate-pulse" />
              <p className="font-semibold">Van a caminho da escola</p>
              <p className="text-xs text-brand-200">chega em ~8 min</p>
            </div>
            <Badge className="absolute right-3 top-3 bg-green-500 text-white">ao vivo</Badge>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Avatar name={FILHO.nome} className="h-11 w-11 text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{FILHO.nome}</p>
              <p className="truncate text-xs muted">{FILHO.escola} · {FILHO.serie}</p>
            </div>
            <Badge tone="success"><Check className="h-3 w-3" /> Embarcou</Badge>
          </div>
        </Card>

        {/* Motorista */}
        <Card>
          <CardTitle className="mb-3">Motorista</CardTitle>
          <div className="flex items-center gap-3">
            <Avatar name={MOTORISTA.nome} className="h-11 w-11 text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{MOTORISTA.nome}</p>
              <p className="truncate text-xs muted">{MOTORISTA.veiculo}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={`tel:${MOTORISTA.tel}`}><Button variant="secondary" className="w-full"><Phone className="h-4 w-4" /> Ligar</Button></a>
            <Button variant="secondary" className="w-full"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
          </div>
        </Card>

        {/* Histórico */}
        <Card>
          <CardTitle className="mb-3">Hoje</CardTitle>
          <ul className="space-y-3 text-sm">
            <Evento icon={MapPin} hora="06:42" texto="Embarque confirmado em casa" tone="text-green-600" />
            <Evento icon={Clock} hora="06:20" texto="Van iniciou a rota" tone="text-brand-600" />
          </ul>
        </Card>

        {/* Pagamento */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm muted">Mensalidade de junho</p>
            <p className="text-xl font-bold">{brl(380)} <Badge tone="success">paga</Badge></p>
          </div>
          <Button variant="secondary"><QrCode className="h-4 w-4" /> Histórico</Button>
        </Card>

        {/* Avisar falta */}
        <Card>
          <CardTitle className="mb-1 flex items-center gap-2"><CalendarOff className="h-4 w-4" /> Avisar falta</CardTitle>
          {enviado ? (
            <p className="py-2 text-sm text-green-600"><Check className="mr-1 inline h-4 w-4" /> Motorista avisado. Obrigado!</p>
          ) : !falta ? (
            <>
              <p className="mb-3 text-sm muted">A Helena não vai usar a van? Avise o motorista.</p>
              <Button variant="amber" className="w-full" onClick={() => setFalta(true)}>Avisar ausência</Button>
            </>
          ) : (
            <div className="space-y-2">
              {['Amanhã', 'Próximos 2 dias', 'Semana inteira'].map((p) => (
                <button key={p} onClick={() => setEnviado(true)}
                  className="w-full rounded-xl border border-[rgb(var(--border))] p-3 text-left text-sm hover:bg-[rgb(var(--surface-2))]">
                  {p}
                </button>
              ))}
            </div>
          )}
        </Card>

        <p className="pb-6 pt-2 text-center text-xs muted">VanGuarda © 2026 · demonstração do app dos pais</p>
      </main>
    </div>
  )
}

function Evento({ icon: Icon, hora, texto, tone }) {
  return (
    <li className="flex items-center gap-3">
      <Icon className={`h-4 w-4 ${tone}`} />
      <span className="flex-1">{texto}</span>
      <span className="text-xs muted">{hora}</span>
    </li>
  )
}
