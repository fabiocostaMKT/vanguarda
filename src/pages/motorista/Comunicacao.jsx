import { useEffect, useState } from 'react'
import { Send, Link2, Check, MessageCircle, Bell } from 'lucide-react'
import { repo } from '../../data/repo'
import { Card, CardTitle, Field, Input, Select, Button, Badge, Spinner, Avatar } from '../../components/ui'

export default function Comunicacao() {
  const [alunos, setAlunos] = useState(null)
  const [notificacoes, setNotificacoes] = useState([])
  const [convites, setConvites] = useState([])
  const [alunoId, setAlunoId] = useState('')
  const [tel, setTel] = useState('')

  useEffect(() => {
    repo.listAlunos().then((a) => { setAlunos(a); setAlunoId(a[0]?.id || '') })
    repo.listNotificacoes().then(setNotificacoes)
  }, [])

  function convidar(e) {
    e.preventDefault()
    const aluno = alunos.find((a) => a.id === alunoId)
    const token = Math.random().toString(36).slice(2, 8)
    setConvites((c) => [{ id: token, aluno: aluno?.nome, tel, link: `https://vanguarda.app/convite/${token}`, status: 'enviado' }, ...c])
    setTel('')
  }

  if (!alunos) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Comunicação</h1>
        <p className="muted">Convide os pais e acompanhe as notificações.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Convidar responsável</CardTitle>
          <form onSubmit={convidar} className="space-y-4">
            <Field label="Aluno">
              <Select value={alunoId} onChange={(e) => setAlunoId(e.target.value)}>
                {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </Select>
            </Field>
            <Field label="WhatsApp do responsável" hint="O convite é enviado por WhatsApp com um link único.">
              <Input value={tel} onChange={(e) => setTel(e.target.value)} placeholder="(32) 9…" required />
            </Field>
            <Button type="submit" className="w-full"><Send className="h-4 w-4" /> Enviar convite</Button>
          </form>

          {convites.length > 0 && (
            <div className="mt-5 space-y-2">
              {convites.map((c) => (
                <div key={c.id} className="rounded-xl bg-[rgb(var(--surface-2))] p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.aluno}</span>
                    <Badge tone="success"><Check className="h-3 w-3" /> {c.status}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs muted"><Link2 className="h-3 w-3" /> {c.link}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardTitle className="mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> Notificações recentes</CardTitle>
          <div className="space-y-3">
            {notificacoes.map((n) => (
              <div key={n.id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="text-sm font-medium">{n.titulo}</p>
                  <p className="text-xs muted">{n.corpo}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs muted">Em produção: push (FCM) + WhatsApp Business API para embarque, desembarque, pagamento e avisos.</p>
        </Card>
      </div>
    </div>
  )
}
