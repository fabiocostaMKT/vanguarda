// Repositório — única porta de acesso a dados do app.
// Hoje implementa o modo MOCK (persistência em localStorage). O modo Firebase
// pluga aqui, função a função, sem que nenhuma tela precise mudar.
import { DATA_MODE } from '../lib/firebase'
import { makeSeed } from '../lib/mock/seed'

const KEY = 'keepvan_db_v1'
const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))
const uid = (p) => p + Math.random().toString(36).slice(2, 9)

function load() {
  const raw = localStorage.getItem(KEY)
  if (raw) return JSON.parse(raw)
  const seed = makeSeed()
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)) }

// ── API pública (sempre assíncrona, espelhando o Firestore) ──────────────────
export const repo = {
  async getMotorista() { await delay(); return load().motorista },

  async listAlunos() { await delay(); return load().alunos },
  async getAluno(id) { await delay(); return load().alunos.find((a) => a.id === id) || null },
  async saveAluno(aluno) {
    await delay()
    const db = load()
    if (aluno.id) {
      db.alunos = db.alunos.map((a) => (a.id === aluno.id ? { ...a, ...aluno } : a))
    } else {
      aluno.id = uid('a')
      aluno.status = aluno.status || 'ativo'
      db.alunos.push(aluno)
    }
    save(db)
    return aluno
  },
  async deleteAluno(id) {
    await delay()
    const db = load()
    db.alunos = db.alunos.filter((a) => a.id !== id)
    save(db)
  },

  async listRotas() { await delay(); return load().rotas },
  async getRota(id) { await delay(); return load().rotas.find((r) => r.id === id) || null },

  async listMensalidades() { await delay(); return load().mensalidades },
  async listDespesas() { await delay(); return load().despesas },
  async listNotificacoes() { await delay(); return load().notificacoes },

  // Resumo do dashboard — calculado a partir das coleções.
  async dashboardSummary() {
    await delay()
    const db = load()
    const ativos = db.alunos.filter((a) => a.status === 'ativo')
    const previsto = ativos.reduce((s, a) => s + (a.mensalidade || 0), 0)
    const recebido = db.mensalidades.filter((m) => m.status === 'pago').reduce((s, m) => s + m.valor, 0)
    const pendentes = db.mensalidades.filter((m) => m.status === 'pendente')
    const vencidos = db.mensalidades.filter((m) => m.status === 'vencido')
    const despesas = db.despesas.reduce((s, d) => s + d.valor, 0)
    return {
      totalAlunos: ativos.length,
      totalRotas: db.rotas.filter((r) => r.status === 'ativa').length,
      previsto, recebido, despesas,
      pendentesCount: pendentes.length,
      vencidosCount: vencidos.length,
      vencidosValor: vencidos.reduce((s, m) => s + m.valor, 0),
    }
  },

  // util de demo: reseta o banco mock pro seed
  async _reset() { localStorage.removeItem(KEY); load() },
}

if (DATA_MODE === 'firebase') {
  // TODO(fase produção): substituir cada método por queries Firestore
  // (collection/doc/getDocs/setDoc) respeitando as Security Rules por motorista.
  console.info('[KeepVan] modo firebase — repositório Firestore a implementar.')
}
