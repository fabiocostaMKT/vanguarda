// Seed de dados mock — espelha o modelo Firestore da Especificação Funcional.
// Realista o bastante pra demo de vendas (dashboard, alunos, rotas, financeiro).

const hoje = new Date()
const mesAtual = hoje.getMonth()
const ano = hoje.getFullYear()
const venc = (dia) => new Date(ano, mesAtual, dia).toISOString()

export function makeSeed() {
  const motorista = {
    id: 'm1',
    userId: 'm1',
    nome: 'Carlos Eduardo Ramos',
    cpf: '123.456.789-00',
    telefone: '(32) 99980-1204',
    email: 'carlos@vanguarda.app',
    cnh: { numero: '01234567890', categoria: 'D', vencimento: '2027-08-15' },
    veiculo: { marca: 'Mercedes-Benz', modelo: 'Sprinter', ano: 2021, placa: 'RKV-2E26', cor: 'Branca', capacidade: 20 },
    cidade: 'Juiz de Fora', estado: 'MG',
    plano: 'pro',
  }

  const alunos = [
    a('a1', 'Helena Martins Costa', 'Colégio Equipe', '5º ano', 'manha', 'São Mateus', 380, 5, 'A+', ['Bombinha (asma)'], 'Juliana Costa', 'Mãe', '(32) 99815-2030'),
    a('a2', 'Pedro Henrique Alves', 'Colégio Equipe', '3º ano', 'manha', 'Santa Helena', 360, 10, 'O+', [], 'Marcos Alves', 'Pai', '(32) 99811-7744'),
    a('a3', 'Laura Beatriz Nunes', 'Escola Granbery', '7º ano', 'manha', 'Cascatinha', 420, 5, 'B+', ['Alergia a amendoim'], 'Renata Nunes', 'Mãe', '(32) 99902-3115'),
    a('a4', 'Miguel Santos Pereira', 'Colégio Cristo Redentor', '2º ano', 'tarde', 'Bom Pastor', 350, 15, 'A-', [], 'Sandra Pereira', 'Mãe', '(32) 99988-0102'),
    a('a5', 'Sophia Almeida Lima', 'Escola Granbery', '6º ano', 'manha', 'Cascatinha', 420, 5, 'AB+', [], 'Paulo Lima', 'Pai', '(32) 99870-4400'),
    a('a6', 'Arthur Gomes Ferreira', 'Colégio Equipe', '4º ano', 'manha', 'São Mateus', 380, 10, 'O-', ['Rinite'], 'Camila Ferreira', 'Mãe', '(32) 99815-9988'),
    a('a7', 'Valentina Rocha Dias', 'Colégio Academia', '1º ano', 'tarde', 'Alto dos Passos', 400, 20, 'A+', [], 'Bruno Dias', 'Pai', '(32) 99933-2211'),
    a('a8', 'Davi Lucca Monteiro', 'Colégio Cristo Redentor', '8º ano', 'tarde', 'Bom Pastor', 360, 15, 'B-', [], 'Aline Monteiro', 'Mãe', '(32) 99944-5566', 'ferias'),
  ]

  const rotas = [
    { id: 'r1', nome: 'Manhã — Zona Sul', turno: 'manha', horarioSaida: '06:20', horarioChegada: '07:10', escola: 'Colégio Equipe', alunoIds: ['a1', 'a2', 'a6'], distanciaKm: 14, tempoMin: 50, status: 'ativa' },
    { id: 'r2', nome: 'Manhã — Granbery', turno: 'manha', horarioSaida: '06:40', horarioChegada: '07:20', escola: 'Escola Granbery', alunoIds: ['a3', 'a5'], distanciaKm: 9, tempoMin: 40, status: 'ativa' },
    { id: 'r3', nome: 'Tarde — Cristo Redentor', turno: 'tarde', horarioSaida: '12:10', horarioChegada: '12:55', escola: 'Colégio Cristo Redentor', alunoIds: ['a4', 'a7'], distanciaKm: 11, tempoMin: 45, status: 'ativa' },
  ]

  const mensalidades = [
    m('me1', 'a1', 380, venc(5), 'pago'),
    m('me2', 'a2', 360, venc(10), 'pendente'),
    m('me3', 'a3', 420, venc(5), 'pago'),
    m('me4', 'a4', 350, venc(15), 'pendente'),
    m('me5', 'a5', 420, venc(5), 'pago'),
    m('me6', 'a6', 380, venc(10), 'vencido'),
    m('me7', 'a7', 400, venc(20), 'pendente'),
  ]

  const despesas = [
    { id: 'd1', categoria: 'combustivel', descricao: 'Diesel S-10', valor: 850, data: venc(3) },
    { id: 'd2', categoria: 'manutencao', descricao: 'Troca de óleo + filtros', valor: 420, data: venc(8) },
    { id: 'd3', categoria: 'seguro', descricao: 'Parcela seguro', valor: 380, data: venc(10) },
  ]

  const notificacoes = [
    { id: 'n1', tipo: 'ausencia', titulo: 'Falta avisada', corpo: 'Davi Lucca não irá hoje (viagem).', lido: false, createdAt: hoje.toISOString() },
    { id: 'n2', tipo: 'vencimento', titulo: 'Mensalidade vencida', corpo: 'Arthur Gomes está com a mensalidade em atraso.', lido: false, createdAt: hoje.toISOString() },
  ]

  return { motorista, alunos, rotas, mensalidades, despesas, notificacoes }
}

function a(id, nome, escola, serie, turno, bairro, mensalidade, vencDia, sangue, alergias, emNome, emParentesco, emTel, status = 'ativo') {
  return {
    id, nome, escola, serie, turno, bairro,
    dataNascimento: '2016-03-10',
    pontoReferencia: '',
    mensalidade, diaVencimento: vencDia,
    saude: { tipoSanguineo: sangue, alergias, medicamentos: [] },
    contatoEmergencia: { nome: emNome, parentesco: emParentesco, telefone: emTel },
    responsavelIds: [], status,
  }
}
function m(id, alunoId, valor, vencimento, status) {
  return { id, alunoId, valor, vencimento, status, pixCode: null, paidAt: status === 'pago' ? vencimento : null }
}
