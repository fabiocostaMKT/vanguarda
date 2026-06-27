import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Phone, Heart, MapPin, School, CalendarClock, QrCode, Trash2 } from 'lucide-react'
import { repo } from '../../data/repo'
import { Button, Card, CardTitle, Badge, Spinner, Avatar, brl } from '../../components/ui'

export default function AlunoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [aluno, setAluno] = useState(null)
  const [erro, setErro] = useState(false)

  useEffect(() => { repo.getAluno(id).then((a) => (a ? setAluno(a) : setErro(true))) }, [id])

  async function excluir() {
    if (!confirm('Excluir este aluno? Esta ação não pode ser desfeita.')) return
    await repo.deleteAluno(id)
    navigate('/alunos')
  }

  if (erro) return <p className="muted">Aluno não encontrado. <Link to="/alunos" className="text-brand-600">Voltar</Link></p>
  if (!aluno) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  return (
    <div className="space-y-6">
      <Link to="/alunos" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Alunos
      </Link>

      <header className="flex flex-wrap items-center gap-4">
        <Avatar name={aluno.nome} className="h-16 w-16 text-lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{aluno.nome}</h1>
          <p className="muted">{aluno.escola} · {aluno.serie} · {aluno.turno === 'manha' ? 'Manhã' : 'Tarde'}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/alunos/${id}/editar`}><Button variant="secondary"><Pencil className="h-4 w-4" /> Editar</Button></Link>
          <Button variant="danger" onClick={excluir}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardTitle className="mb-4">Dados do aluno</CardTitle>
          <dl className="space-y-3 text-sm">
            <Row icon={School} label="Escola" value={`${aluno.escola} — ${aluno.serie}`} />
            <Row icon={MapPin} label="Bairro" value={aluno.bairro} />
            <Row icon={CalendarClock} label="Vencimento" value={`Dia ${aluno.diaVencimento}`} />
            <Row icon={QrCode} label="Mensalidade" value={`${brl(aluno.mensalidade)}/mês`} />
          </dl>
        </Card>

        <Card>
          <CardTitle className="mb-4 flex items-center gap-2"><Heart className="h-4 w-4 text-red-500" /> Saúde & Emergência</CardTitle>
          <dl className="space-y-3 text-sm">
            <Row label="Tipo sanguíneo" value={aluno.saude?.tipoSanguineo || '—'} />
            <Row label="Alergias" value={aluno.saude?.alergias?.length ? aluno.saude.alergias.join(', ') : 'Nenhuma'} />
            <Row label="Medicamentos" value={aluno.saude?.medicamentos?.length ? aluno.saude.medicamentos.join(', ') : 'Nenhum'} />
            <div className="rounded-xl bg-[rgb(var(--surface-2))] p-3">
              <p className="text-xs muted">Contato de emergência</p>
              <p className="font-medium">{aluno.contatoEmergencia?.nome} <span className="muted">({aluno.contatoEmergencia?.parentesco})</span></p>
              <a href={`tel:${aluno.contatoEmergencia?.telefone}`} className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600">
                <Phone className="h-3.5 w-3.5" /> {aluno.contatoEmergencia?.telefone}
              </a>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/15"><QrCode className="h-6 w-6" /></div>
          <div>
            <p className="font-semibold">Carteirinha digital</p>
            <p className="text-sm muted">QR Code do aluno para validação rápida (em breve).</p>
          </div>
        </div>
        <Badge tone="brand">Premium</Badge>
      </Card>
    </div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 muted">{Icon && <Icon className="h-4 w-4" />}{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
