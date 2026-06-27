import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/ui'

const SUGESTOES = [
  'Escrever cobrança gentil para o Arthur (mensalidade vencida)',
  'Criar comunicado de recesso escolar para os pais',
  'Resumir meu financeiro do mês',
]

// Respostas simuladas (em produção: Anthropic Claude via Cloud Function).
function responder(texto) {
  const t = texto.toLowerCase()
  if (t.includes('cobran') || t.includes('arthur'))
    return 'Olá! 😊 Passando para lembrar com carinho que a mensalidade do transporte do Arthur está em aberto. Posso te enviar o Pix por aqui mesmo para facilitar? Qualquer dúvida, é só me chamar. Obrigado!'
  if (t.includes('recesso') || t.includes('comunicado'))
    return '📢 Comunicado aos pais: informo que, devido ao recesso escolar, o transporte ficará suspenso de 15 a 19/07, retornando normalmente no dia 22/07. Bom descanso às crianças! Abraço, Carlos (VanGuarda).'
  if (t.includes('financ') || t.includes('resum'))
    return 'No mês você recebeu R$ 1.220 de 6 mensalidades, com R$ 1.310 ainda a receber e R$ 1.650 em despesas. Sugiro priorizar a cobrança das 2 vencidas — posso gerar os Pix e as mensagens para você.'
  return 'Posso te ajudar a escrever mensagens para os pais, gerar cobranças, criar comunicados e resumir seu financeiro. O que você precisa?'
}

export default function Assistente() {
  const [msgs, setMsgs] = useState([{ role: 'ia', text: 'Oi, Carlos! Sou a IA do VanGuarda. Como posso ajudar hoje?' }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  function enviar(texto) {
    const t = (texto ?? input).trim()
    if (!t) return
    setMsgs((m) => [...m, { role: 'user', text: t }])
    setInput('')
    setTimeout(() => setMsgs((m) => [...m, { role: 'ia', text: responder(t) }]), 500)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-2xl flex-col">
      <header className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white"><Sparkles className="h-5 w-5" /></div>
        <div>
          <h1 className="text-lg font-bold leading-none">Assistente IA</h1>
          <span className="text-xs muted">Powered by Anthropic Claude</span>
        </div>
        <Badge tone="brand" className="ml-auto">Premium</Badge>
      </header>

      <Card className="flex-1 space-y-3 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-brand-700 text-white' : 'bg-[rgb(var(--surface-2))]'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </Card>

      {msgs.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGESTOES.map((s) => (
            <button key={s} onClick={() => enviar(s)}
              className="rounded-full border border-[rgb(var(--border))] px-3 py-1.5 text-xs hover:bg-[rgb(var(--surface-2))]">
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); enviar() }} className="mt-3 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pergunte ou peça algo…" />
        <Button type="submit"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  )
}
