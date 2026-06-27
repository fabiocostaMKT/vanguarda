import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   KEEPVAN — Plataforma de Transporte Escolar
   by KeepCoding • keepcoding.net.br
   React 18 + Tailwind (core utilities only)
   ═══════════════════════════════════════════════════════════ */

// ─── Mock Data ───────────────────────────────────────────
const ALUNOS = [
  { id: 1, nome: "Lucas Silva", escola: "Col. Santa Catarina", serie: "5º ano", turno: "Manhã", bairro: "Centro", status: "ativo", responsavel: "Maria Silva", telefone: "(32) 99901-1234", valor: 380, vencimento: 10, nascimento: "12/03/2015", tipoSanguineo: "O+", alergias: "Nenhuma", emergencia: "Maria Silva - Mãe - (32) 99901-1234" },
  { id: 2, nome: "Ana Beatriz Souza", escola: "Col. Machado Sobrinho", serie: "7º ano", turno: "Manhã", bairro: "São Mateus", status: "ativo", responsavel: "Carlos Souza", telefone: "(32) 99902-5678", valor: 380, vencimento: 10, nascimento: "24/07/2013", tipoSanguineo: "A+", alergias: "Amendoim", emergencia: "Carlos Souza - Pai - (32) 99902-5678" },
  { id: 3, nome: "Pedro H. Lima", escola: "Escola Granbery", serie: "3º ano", turno: "Tarde", bairro: "Cascatinha", status: "ativo", responsavel: "Fernanda Lima", telefone: "(32) 99903-9012", valor: 350, vencimento: 5, nascimento: "01/11/2017", tipoSanguineo: "B+", alergias: "Nenhuma", emergencia: "Fernanda Lima - Mãe - (32) 99903-9012" },
  { id: 4, nome: "Isabela Santos", escola: "Col. Santa Catarina", serie: "4º ano", turno: "Manhã", bairro: "Granbery", status: "inadimplente", responsavel: "Roberto Santos", telefone: "(32) 99904-3456", valor: 380, vencimento: 10, nascimento: "18/05/2016", tipoSanguineo: "AB-", alergias: "Lactose", emergencia: "Roberto Santos - Pai - (32) 99904-3456" },
  { id: 5, nome: "Gabriel Oliveira", escola: "Col. Academia", serie: "8º ano", turno: "Manhã", bairro: "Bom Pastor", status: "ativo", responsavel: "Juliana Oliveira", telefone: "(32) 99905-7890", valor: 400, vencimento: 15, nascimento: "30/09/2012", tipoSanguineo: "O-", alergias: "Nenhuma", emergencia: "Juliana Oliveira - Mãe - (32) 99905-7890" },
  { id: 6, nome: "Manuela Costa", escola: "Escola Granbery", serie: "2º ano", turno: "Tarde", bairro: "Benfica", status: "ativo", responsavel: "André Costa", telefone: "(32) 99906-2345", valor: 350, vencimento: 5, nascimento: "14/02/2018", tipoSanguineo: "A-", alergias: "Nenhuma", emergencia: "André Costa - Pai - (32) 99906-2345" },
  { id: 7, nome: "Davi Pereira", escola: "Col. Machado Sobrinho", serie: "6º ano", turno: "Manhã", bairro: "Alto dos Passos", status: "inativo", responsavel: "Patrícia Pereira", telefone: "(32) 99907-6789", valor: 380, vencimento: 10, nascimento: "22/08/2014", tipoSanguineo: "B-", alergias: "Nenhuma", emergencia: "Patrícia Pereira - Mãe - (32) 99907-6789" },
  { id: 8, nome: "Sofia Rodrigues", escola: "Col. Santa Catarina", serie: "1º ano", turno: "Tarde", bairro: "Santa Helena", status: "ativo", responsavel: "Marcos Rodrigues", telefone: "(32) 99908-0123", valor: 380, vencimento: 10, nascimento: "09/06/2019", tipoSanguineo: "O+", alergias: "Glúten", emergencia: "Marcos Rodrigues - Pai - (32) 99908-0123" },
  { id: 9, nome: "Enzo Almeida", escola: "Col. Academia", serie: "4º ano", turno: "Manhã", bairro: "Paineiras", status: "ativo", responsavel: "Camila Almeida", telefone: "(32) 99909-4567", valor: 400, vencimento: 15, nascimento: "03/01/2016", tipoSanguineo: "A+", alergias: "Nenhuma", emergencia: "Camila Almeida - Mãe - (32) 99909-4567" },
  { id: 10, nome: "Helena Martins", escola: "Escola Granbery", serie: "5º ano", turno: "Tarde", bairro: "Mariano Procópio", status: "ferias", responsavel: "Ricardo Martins", telefone: "(32) 99910-8901", valor: 350, vencimento: 5, nascimento: "27/04/2015", tipoSanguineo: "AB+", alergias: "Nenhuma", emergencia: "Ricardo Martins - Pai - (32) 99910-8901" },
];

const ROTAS = [
  { id: 1, nome: "Manhã — Col. Santa Catarina", turno: "Manhã", saida: "06:30", chegada: "07:15", escola: "Col. Santa Catarina", alunos: [1, 4, 5, 9], distancia: 8.5, tempo: 35, status: "ativa" },
  { id: 2, nome: "Manhã — Col. Machado Sobrinho", turno: "Manhã", saida: "06:20", chegada: "07:10", escola: "Col. Machado Sobrinho", alunos: [2, 7], distancia: 6.2, tempo: 25, status: "ativa" },
  { id: 3, nome: "Tarde — Escola Granbery", turno: "Tarde", saida: "12:30", chegada: "13:10", escola: "Escola Granbery", alunos: [3, 6, 8, 10], distancia: 11, tempo: 45, status: "ativa" },
  { id: 4, nome: "Manhã — Col. Academia", turno: "Manhã", saida: "06:40", chegada: "07:20", escola: "Col. Academia", alunos: [5, 9], distancia: 5.8, tempo: 22, status: "ativa" },
];

const MENSALIDADES = [
  { id: 1, alunoId: 1, mes: "Mar/2026", valor: 380, status: "pago", dataPgto: "05/03", metodo: "PIX", diasAtraso: 0 },
  { id: 2, alunoId: 2, mes: "Mar/2026", valor: 380, status: "pago", dataPgto: "03/03", metodo: "PIX", diasAtraso: 0 },
  { id: 3, alunoId: 3, mes: "Mar/2026", valor: 350, status: "pendente", dataPgto: null, metodo: null, diasAtraso: 0 },
  { id: 4, alunoId: 4, mes: "Mar/2026", valor: 380, status: "vencido", dataPgto: null, metodo: null, diasAtraso: 15 },
  { id: 5, alunoId: 4, mes: "Fev/2026", valor: 380, status: "vencido", dataPgto: null, metodo: null, diasAtraso: 45 },
  { id: 6, alunoId: 5, mes: "Mar/2026", valor: 400, status: "pago", dataPgto: "01/03", metodo: "Cartão", diasAtraso: 0 },
  { id: 7, alunoId: 6, mes: "Mar/2026", valor: 350, status: "pago", dataPgto: "07/03", metodo: "PIX", diasAtraso: 0 },
  { id: 8, alunoId: 8, mes: "Mar/2026", valor: 380, status: "pendente", dataPgto: null, metodo: null, diasAtraso: 0 },
  { id: 9, alunoId: 9, mes: "Mar/2026", valor: 400, status: "pago", dataPgto: "12/03", metodo: "PIX", diasAtraso: 0 },
  { id: 10, alunoId: 10, mes: "Mar/2026", valor: 350, status: "pendente", dataPgto: null, metodo: null, diasAtraso: 0 },
];

const DESPESAS = [
  { id: 1, desc: "Combustível — Março", categoria: "combustivel", valor: 890, data: "15/03/2026" },
  { id: 2, desc: "Troca de óleo + filtro", categoria: "manutencao", valor: 320, data: "08/03/2026" },
  { id: 3, desc: "Seguro veicular — Parcela 3/12", categoria: "seguro", valor: 280, data: "01/03/2026" },
  { id: 4, desc: "Lavagem completa", categoria: "outros", valor: 80, data: "20/03/2026" },
];

const HISTORICO_FINANCEIRO = [
  { mes: "Out", receita: 3200, despesa: 1400 },
  { mes: "Nov", receita: 3500, despesa: 1200 },
  { mes: "Dez", receita: 2800, despesa: 1600 },
  { mes: "Jan", receita: 3400, despesa: 1300 },
  { mes: "Fev", receita: 3600, despesa: 1500 },
  { mes: "Mar", receita: 3480, despesa: 1570 },
];

// ─── SVG Icons ───────────────────────────────────────────
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  alunos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  rotas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-4 4 4 4-4 4 4"/>
      <path d="M3 7l4-4 4 4 4-4 4 4"/>
    </svg>
  ),
  financeiro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  comunicacao: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  config: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  van: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h1m16 0h1M5.6 17H3V8.6a1 1 0 0 1 .3-.7l2.3-2.3a1 1 0 0 1 .7-.3H17a1 1 0 0 1 1 1v3h2.3a1 1 0 0 1 .8.4l1.5 2a1 1 0 0 1 .2.6V15a2 2 0 0 1-2 2h-.4"/>
      <circle cx="7.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/>
      <path d="M10 17h4"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  chevRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  chevLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10l10-6 10 6-10 6-10-6z"/><path d="M22 10v6"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3"/><rect x="5" y="7" width="8" height="5" rx="1"/>
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  pais: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

const Icon = ({ name, size = 20, className = "" }) => (
  <span style={{ width: size, height: size, display: "inline-flex", flexShrink: 0 }} className={className}>
    {icons[name]}
  </span>
);

// ─── Utility Helpers ─────────────────────────────────────
const statusConfig = {
  ativo: { bg: "rgba(16,185,129,0.12)", color: "#34D399", label: "Ativo" },
  inadimplente: { bg: "rgba(239,68,68,0.12)", color: "#F87171", label: "Inadimplente" },
  inativo: { bg: "rgba(100,116,139,0.15)", color: "#94A3B8", label: "Inativo" },
  ferias: { bg: "rgba(96,165,250,0.12)", color: "#60A5FA", label: "Férias" },
  pago: { bg: "rgba(16,185,129,0.12)", color: "#34D399", label: "Pago" },
  pendente: { bg: "rgba(251,191,36,0.12)", color: "#FBBF24", label: "Pendente" },
  vencido: { bg: "rgba(239,68,68,0.12)", color: "#F87171", label: "Vencido" },
  ativa: { bg: "rgba(16,185,129,0.12)", color: "#34D399", label: "Ativa" },
};

const Badge = ({ status }) => {
  const c = statusConfig[status] || statusConfig.ativo;
  return (
    <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
};

const fmt = (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const Avatar = ({ name, size = 38 }) => {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue}, 45%, 25%)`, color: `hsl(${hue}, 70%, 75%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, flexShrink: 0, letterSpacing: 0.5 }}>
      {initials}
    </div>
  );
};

// ─── CSS (injected via style tag) ────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Bricolage+Grotesque:wght@400;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    :root {
      --bg: #0C0F16;
      --surface: #12161F;
      --surface2: #1A1F2E;
      --surface3: #232939;
      --border: #2A3040;
      --primary: #F5A623;
      --primary-dim: rgba(245,166,35,0.12);
      --green: #2DD4A0;
      --green-dim: rgba(45,212,160,0.12);
      --red: #F87171;
      --red-dim: rgba(248,113,113,0.12);
      --blue: #60A5FA;
      --blue-dim: rgba(96,165,250,0.12);
      --text: #ECF0F6;
      --text2: #8B95A8;
      --text3: #5A6478;
      --radius: 14px;
      --radius-sm: 10px;
    }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    
    .keepvan-root { display:flex; min-height:100vh; background: var(--bg); }
    
    /* Sidebar */
    .sidebar { width: 240px; background: var(--surface); border-right: 1px solid var(--border); display:flex; flex-direction:column; padding: 0; position:fixed; top:0; left:0; bottom:0; z-index:100; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
    .sidebar-overlay { display:none; }
    
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); width: 280px; }
      .sidebar.open { transform: translateX(0); }
      .sidebar-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99; backdrop-filter:blur(2px); }
    }
    
    .sidebar-brand { padding: 24px 20px 20px; display:flex; align-items:center; gap:12px; }
    .sidebar-brand-icon { width:40px; height:40px; background: linear-gradient(135deg, #F5A623, #E8930C); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; }
    .sidebar-brand h1 { font-family:'Bricolage Grotesque',sans-serif; font-size:20px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
    .sidebar-brand span { font-size:11px; color:var(--text3); font-weight:400; }
    
    .sidebar-nav { flex:1; padding: 8px 10px; display:flex; flex-direction:column; gap:2px; }
    .nav-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:var(--radius-sm); color:var(--text2); font-size:13.5px; font-weight:500; cursor:pointer; transition: all 0.15s ease; border:none; background:none; width:100%; text-align:left; }
    .nav-item:hover { background:var(--surface2); color:var(--text); }
    .nav-item.active { background:var(--primary-dim); color:var(--primary); }
    .nav-item.active svg { color:var(--primary); }
    
    .nav-section { font-size:10px; font-weight:600; color:var(--text3); letter-spacing:1.2px; text-transform:uppercase; padding:16px 14px 6px; }
    
    .sidebar-footer { padding:16px; border-top:1px solid var(--border); }
    .sidebar-plan { background:var(--surface2); border-radius:var(--radius-sm); padding:12px 14px; }
    .sidebar-plan-label { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:1px; font-weight:600; }
    .sidebar-plan-name { font-size:14px; font-weight:700; color:var(--primary); margin-top:2px; }
    
    /* Main content */
    .main-content { flex:1; margin-left:240px; min-height:100vh; }
    @media (max-width:768px) { .main-content { margin-left:0; } }
    
    .topbar { height:64px; border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 28px; gap:16px; background:var(--surface); position:sticky; top:0; z-index:50; backdrop-filter:blur(12px); }
    .topbar-hamburger { display:none; background:none; border:none; color:var(--text2); cursor:pointer; padding:4px; }
    @media (max-width:768px) { .topbar-hamburger { display:flex; } }
    .topbar h2 { font-family:'Bricolage Grotesque',sans-serif; font-size:18px; font-weight:700; color:var(--text); flex:1; }
    .topbar-actions { display:flex; align-items:center; gap:10px; }
    
    .page { padding:28px; max-width:1200px; }
    @media (max-width:768px) { .page { padding:16px; } }
    
    /* Cards */
    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:20px; transition: border-color 0.2s; }
    .card:hover { border-color: var(--surface3); }
    .card-sm { padding:16px; }
    
    /* Stat Cards */
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:24px; }
    .stat-card { position:relative; overflow:hidden; }
    .stat-card::after { content:''; position:absolute; top:0; right:0; width:80px; height:80px; border-radius:50%; filter:blur(40px); opacity:0.15; pointer-events:none; }
    .stat-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .stat-value { font-family:'Bricolage Grotesque',sans-serif; font-size:28px; font-weight:700; line-height:1; margin-bottom:4px; }
    .stat-label { font-size:12.5px; color:var(--text2); font-weight:500; }
    
    /* Table */
    .table-container { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { text-align:left; font-size:11px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:0.8px; padding:12px 16px; border-bottom:1px solid var(--border); }
    td { padding:14px 16px; border-bottom:1px solid var(--border); font-size:13.5px; color:var(--text); vertical-align:middle; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:rgba(255,255,255,0.015); }
    
    /* Search */
    .search-box { display:flex; align-items:center; gap:8px; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:0 14px; height:40px; transition:border-color 0.2s; }
    .search-box:focus-within { border-color:var(--primary); }
    .search-box input { background:none; border:none; outline:none; color:var(--text); font-size:13px; font-family:inherit; width:100%; }
    .search-box input::placeholder { color:var(--text3); }
    
    /* Button */
    .btn { display:inline-flex; align-items:center; gap:8px; padding:9px 18px; border-radius:var(--radius-sm); font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; border:none; transition:all 0.15s ease; }
    .btn-primary { background:var(--primary); color:#000; }
    .btn-primary:hover { background:#E8930C; transform:translateY(-1px); }
    .btn-ghost { background:var(--surface2); color:var(--text2); border:1px solid var(--border); }
    .btn-ghost:hover { background:var(--surface3); color:var(--text); }
    .btn-sm { padding:6px 12px; font-size:12px; }
    .btn-danger { background:var(--red-dim); color:var(--red); }
    .btn-danger:hover { background:rgba(248,113,113,0.2); }
    
    /* Filter Pills */
    .filter-pills { display:flex; gap:6px; flex-wrap:wrap; }
    .pill { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--border); background:var(--surface); color:var(--text2); transition:all 0.15s; }
    .pill:hover { background:var(--surface2); color:var(--text); }
    .pill.active { background:var(--primary-dim); color:var(--primary); border-color:transparent; }
    
    /* Modal / Sheet */
    .sheet-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:200; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); animation:fadeIn 0.2s ease; }
    .sheet { background:var(--surface); border-radius:18px; border:1px solid var(--border); width:90%; max-width:560px; max-height:85vh; overflow-y:auto; animation:slideUp 0.25s ease; }
    .sheet-header { padding:20px 24px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--surface); z-index:1; border-radius:18px 18px 0 0; }
    .sheet-header h3 { font-family:'Bricolage Grotesque',sans-serif; font-size:17px; font-weight:700; }
    .sheet-close { background:var(--surface2); border:none; color:var(--text2); width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .sheet-close:hover { background:var(--surface3); color:var(--text); }
    .sheet-body { padding:24px; }
    
    .detail-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { font-size:12.5px; color:var(--text3); font-weight:500; }
    .detail-value { font-size:13.5px; color:var(--text); font-weight:500; text-align:right; }
    
    /* Chart bars */
    .chart-bar-group { display:flex; align-items:flex-end; gap:4px; }
    .chart-bar { border-radius:4px 4px 0 0; transition:height 0.5s cubic-bezier(0.4,0,0.2,1); min-width:16px; }
    
    /* Animations */
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes stagger { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    .stagger { animation: stagger 0.35s ease backwards; }
    
    /* Route execution */
    .route-exec-status { display:flex; align-items:center; gap:8px; padding:8px 0; }
    .route-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .route-dot.waiting { background:var(--text3); }
    .route-dot.embarked { background:var(--green); box-shadow:0 0 8px rgba(45,212,160,0.4); }
    .route-dot.disembarked { background:var(--blue); }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--surface3); border-radius:3px; }
    ::-webkit-scrollbar-thumb:hover { background:var(--text3); }
    
    /* Notification dot */
    .notif-dot { width:8px; height:8px; background:var(--red); border-radius:50%; position:absolute; top:-1px; right:-1px; }
  `}</style>
);

// ─── Layout Components ───────────────────────────────────
const Sidebar = ({ current, setCurrent, open, setOpen, setView }) => {
  const nav = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "alunos", icon: "alunos", label: "Alunos" },
    { id: "rotas", icon: "rotas", label: "Rotas" },
    { id: "financeiro", icon: "financeiro", label: "Financeiro" },
    { id: "comunicacao", icon: "comunicacao", label: "Comunicação" },
  ];
  const nav2 = [
    { id: "config", icon: "config", label: "Configurações" },
  ];

  const handleNav = (id) => {
    setCurrent(id);
    setView(null);
    setOpen(false);
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><Icon name="van" size={22} /></div>
          <div>
            <h1>KeepVan</h1>
            <span>Transporte Escolar</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Menu</div>
          {nav.map(n => (
            <button key={n.id} className={`nav-item ${current === n.id ? "active" : ""}`} onClick={() => handleNav(n.id)}>
              <Icon name={n.icon} size={18} />
              {n.label}
            </button>
          ))}
          <div className="nav-section">Sistema</div>
          {nav2.map(n => (
            <button key={n.id} className={`nav-item ${current === n.id ? "active" : ""}`} onClick={() => handleNav(n.id)}>
              <Icon name={n.icon} size={18} />
              {n.label}
            </button>
          ))}
          <button className={`nav-item ${current === "pais" ? "active" : ""}`} onClick={() => handleNav("pais")} style={{ marginTop: "auto" }}>
            <Icon name="pais" size={18} />
            Visão Pais
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-plan">
            <div className="sidebar-plan-label">Plano atual</div>
            <div className="sidebar-plan-name">Premium</div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ title, setOpen, children }) => (
  <header className="topbar">
    <button className="topbar-hamburger" onClick={() => setOpen(true)}>
      <Icon name="menu" size={22} />
    </button>
    <h2>{title}</h2>
    <div className="topbar-actions">{children}</div>
  </header>
);

// ─── Dashboard ───────────────────────────────────────────
const DashboardPage = ({ setCurrent, setView }) => {
  const alunosAtivos = ALUNOS.filter(a => a.status === "ativo").length;
  const rotasAtivas = ROTAS.filter(r => r.status === "ativa").length;
  const totalPrevisto = MENSALIDADES.filter(m => m.mes === "Mar/2026").reduce((s, m) => s + m.valor, 0);
  const totalRecebido = MENSALIDADES.filter(m => m.mes === "Mar/2026" && m.status === "pago").reduce((s, m) => s + m.valor, 0);
  const pendentes = MENSALIDADES.filter(m => m.status === "pendente").length;
  const vencidos = MENSALIDADES.filter(m => m.status === "vencido").length;

  return (
    <div className="page">
      <div className="stats-grid">
        {[
          { icon: "alunos", label: "Alunos Ativos", value: alunosAtivos, color: "var(--green)", dim: "var(--green-dim)" },
          { icon: "rotas", label: "Rotas Ativas", value: rotasAtivas, color: "var(--blue)", dim: "var(--blue-dim)" },
          { icon: "financeiro", label: "Recebido / Previsto", value: `${fmt(totalRecebido)}`, sub: `de ${fmt(totalPrevisto)}`, color: "var(--primary)", dim: "var(--primary-dim)" },
          { icon: "alert", label: "Pagamentos Atrasados", value: vencidos, color: "var(--red)", dim: "var(--red-dim)" },
        ].map((s, i) => (
          <div key={i} className="card stat-card stagger" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-icon" style={{ background: s.dim, color: s.color }}><Icon name={s.icon} size={20} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>{s.sub}</div>}
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Próximas Rotas */}
        <div className="card stagger" style={{ animationDelay: "0.25s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700 }}>Próximas Rotas</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrent("rotas")}>Ver todas</button>
          </div>
          {ROTAS.filter(r => r.status === "ativa").slice(0, 3).map(r => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--blue-dim)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="van" size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.nome}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.saida} → {r.chegada} · {r.alunos.length} alunos</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setCurrent("rotas"); setView({ type: "exec", route: r }); }}>
                <Icon name="play" size={12} /> Iniciar
              </button>
            </div>
          ))}
        </div>

        {/* Inadimplentes */}
        <div className="card stagger" style={{ animationDelay: "0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700 }}>Cobranças Pendentes</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrent("financeiro")}>Ver todas</button>
          </div>
          {MENSALIDADES.filter(m => m.status === "vencido" || m.status === "pendente").slice(0, 4).map(m => {
            const aluno = ALUNOS.find(a => a.id === m.alunoId);
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                <Avatar name={aluno?.nome || "?"} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{aluno?.nome}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{m.mes} · {fmt(m.valor)}</div>
                </div>
                <Badge status={m.status} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="card stagger" style={{ marginTop: 16, animationDelay: "0.35s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Histórico Financeiro — 6 meses</h3>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: 160, gap: 12 }}>
          {HISTORICO_FINANCEIRO.map((h, i) => {
            const maxVal = 4000;
            const rH = (h.receita / maxVal) * 140;
            const dH = (h.despesa / maxVal) * 140;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className="chart-bar-group">
                  <div className="chart-bar" style={{ height: rH, background: "var(--green)", width: 18, opacity: 0.8 }} title={`Receita: ${fmt(h.receita)}`} />
                  <div className="chart-bar" style={{ height: dH, background: "var(--red)", width: 18, opacity: 0.6 }} title={`Despesa: ${fmt(h.despesa)}`} />
                </div>
                <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>{h.mes}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 14 }}>
          <span style={{ fontSize: 11.5, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--green)", opacity: 0.8 }} /> Receita</span>
          <span style={{ fontSize: 11.5, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red)", opacity: 0.6 }} /> Despesas</span>
        </div>
      </div>
    </div>
  );
};

// ─── Alunos ──────────────────────────────────────────────
const AlunoDetail = ({ aluno, onClose }) => (
  <div className="sheet-overlay" onClick={onClose}>
    <div className="sheet" onClick={e => e.stopPropagation()}>
      <div className="sheet-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={aluno.nome} size={42} />
          <div>
            <h3>{aluno.nome}</h3>
            <Badge status={aluno.status} />
          </div>
        </div>
        <button className="sheet-close" onClick={onClose}><Icon name="close" size={16} /></button>
      </div>
      <div className="sheet-body">
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Dados Pessoais</div>
        {[
          ["Nascimento", aluno.nascimento],
          ["Escola", aluno.escola],
          ["Série", aluno.serie],
          ["Turno", aluno.turno],
          ["Bairro", aluno.bairro],
        ].map(([l, v]) => (
          <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
        ))}

        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>Saúde & Emergência</div>
        {[
          ["Tipo Sanguíneo", aluno.tipoSanguineo],
          ["Alergias", aluno.alergias],
          ["Emergência", aluno.emergencia],
        ].map(([l, v]) => (
          <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value" style={{ maxWidth: 240 }}>{v}</span></div>
        ))}

        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>Responsável & Financeiro</div>
        {[
          ["Responsável", aluno.responsavel],
          ["Telefone", aluno.telefone],
          ["Mensalidade", fmt(aluno.valor)],
          ["Vencimento", `Dia ${aluno.vencimento}`],
        ].map(([l, v]) => (
          <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <a href={`https://wa.me/55${aluno.telefone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>
            <Icon name="whatsapp" size={16} /> WhatsApp
          </a>
          <a href={`tel:${aluno.telefone.replace(/\D/g, "")}`} className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>
            <Icon name="phone" size={16} /> Ligar
          </a>
        </div>
      </div>
    </div>
  </div>
);

const AlunosPage = () => {
  const [search, setSearch] = useState("");
  const [turnoFilter, setTurnoFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = ALUNOS.filter(a => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || a.escola.toLowerCase().includes(search.toLowerCase());
    const matchTurno = turnoFilter === "Todos" || a.turno === turnoFilter;
    return matchSearch && matchTurno;
  });

  return (
    <div className="page">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Icon name="search" size={16} className="" />
          <input placeholder="Buscar aluno ou escola..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {["Todos", "Manhã", "Tarde"].map(t => (
            <button key={t} className={`pill ${turnoFilter === t ? "active" : ""}`} onClick={() => setTurnoFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Aluno</th><th>Escola</th><th>Turno</th><th>Bairro</th><th>Mensalidade</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ cursor: "pointer", animation: `stagger 0.3s ease ${i * 0.04}s backwards` }} onClick={() => setSelected(a)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar name={a.nome} size={34} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.nome}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{a.serie}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.escola}</td>
                  <td><span style={{ fontSize: 12.5, color: "var(--text2)" }}>{a.turno}</span></td>
                  <td style={{ fontSize: 13 }}>{a.bairro}</td>
                  <td style={{ fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{fmt(a.valor)}</td>
                  <td><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Nenhum aluno encontrado.</div>
          )}
        </div>
      </div>

      {selected && <AlunoDetail aluno={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

// ─── Rotas ───────────────────────────────────────────────
const RouteExec = ({ route, onClose }) => {
  const [studentStatus, setStudentStatus] = useState(
    route.alunos.reduce((acc, id) => ({ ...acc, [id]: "waiting" }), {})
  );
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const cycleStatus = (id) => {
    setStudentStatus(prev => {
      const order = ["waiting", "embarked", "disembarked"];
      const next = order[(order.indexOf(prev[id]) + 1) % 3];
      return { ...prev, [id]: next };
    });
  };

  const statusLabel = { waiting: "Aguardando", embarked: "Embarcou", disembarked: "Desembarcou" };
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="sheet-header">
          <div>
            <h3>Executando Rota</h3>
            <span style={{ fontSize: 12.5, color: "var(--text3)" }}>{route.nome}</span>
          </div>
          <button className="sheet-close" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <div className="sheet-body">
          {/* Timer */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 48, fontWeight: 700, color: running ? "var(--green)" : "var(--text3)", letterSpacing: -1 }}>
              {mm}:{ss}
            </div>
            <button className={`btn ${running ? "btn-danger" : "btn-primary"}`} style={{ marginTop: 10 }} onClick={() => setRunning(!running)}>
              {running ? "Pausar Rota" : "Iniciar Rota"}
            </button>
          </div>

          {/* Students checklist */}
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Check-in dos Alunos</div>
          {route.alunos.map(id => {
            const aluno = ALUNOS.find(a => a.id === id);
            const st = studentStatus[id];
            return (
              <div key={id} className="route-exec-status" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }} onClick={() => cycleStatus(id)}>
                <div className={`route-dot ${st}`} />
                <Avatar name={aluno?.nome || "?"} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{aluno?.nome}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{aluno?.bairro}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: st === "embarked" ? "var(--green)" : st === "disembarked" ? "var(--blue)" : "var(--text3)" }}>
                  {statusLabel[st]}
                </span>
              </div>
            );
          })}
          <div style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 14, textAlign: "center" }}>Toque no aluno para alterar o status</div>
        </div>
      </div>
    </div>
  );
};

const RotasPage = ({ view, setView }) => {
  return (
    <div className="page">
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Rota</th><th>Turno</th><th>Horário</th><th>Alunos</th><th>Distância</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {ROTAS.map((r, i) => (
                <tr key={r.id} style={{ animation: `stagger 0.3s ease ${i * 0.05}s backwards` }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--blue-dim)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="van" size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.nome}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{r.escola}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.turno}</td>
                  <td style={{ fontSize: 13 }}>{r.saida} → {r.chegada}</td>
                  <td style={{ fontWeight: 600 }}>{r.alunos.length}</td>
                  <td style={{ fontSize: 13 }}>{r.distancia} km · {r.tempo} min</td>
                  <td><Badge status={r.status} /></td>
                  <td>
                    {r.status === "ativa" && (
                      <button className="btn btn-primary btn-sm" onClick={() => setView({ type: "exec", route: r })}>
                        <Icon name="play" size={12} /> Iniciar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {view?.type === "exec" && <RouteExec route={view.route} onClose={() => setView(null)} />}
    </div>
  );
};

// ─── Financeiro ──────────────────────────────────────────
const FinanceiroPage = () => {
  const [tab, setTab] = useState("mensalidades");
  const [filter, setFilter] = useState("Todos");

  const totalReceita = MENSALIDADES.filter(m => m.mes === "Mar/2026").reduce((s, m) => s + m.valor, 0);
  const totalRecebido = MENSALIDADES.filter(m => m.mes === "Mar/2026" && m.status === "pago").reduce((s, m) => s + m.valor, 0);
  const totalDespesas = DESPESAS.reduce((s, d) => s + d.valor, 0);

  const mensFiltered = MENSALIDADES.filter(m => filter === "Todos" || m.status === filter.toLowerCase());

  const despIcon = { combustivel: "fuel", manutencao: "wrench", seguro: "shield", outros: "config" };

  return (
    <div className="page">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="card stat-card stagger">
          <div className="stat-icon" style={{ background: "var(--primary-dim)", color: "var(--primary)" }}><Icon name="financeiro" size={20} /></div>
          <div className="stat-value" style={{ color: "var(--primary)", fontSize: 24 }}>{fmt(totalReceita)}</div>
          <div className="stat-label">Previsto Mar/2026</div>
        </div>
        <div className="card stat-card stagger" style={{ animationDelay: "0.06s" }}>
          <div className="stat-icon" style={{ background: "var(--green-dim)", color: "var(--green)" }}><Icon name="check" size={20} /></div>
          <div className="stat-value" style={{ color: "var(--green)", fontSize: 24 }}>{fmt(totalRecebido)}</div>
          <div className="stat-label">Recebido</div>
        </div>
        <div className="card stat-card stagger" style={{ animationDelay: "0.12s" }}>
          <div className="stat-icon" style={{ background: "var(--red-dim)", color: "var(--red)" }}><Icon name="arrowDown" size={20} /></div>
          <div className="stat-value" style={{ color: "var(--red)", fontSize: 24 }}>{fmt(totalDespesas)}</div>
          <div className="stat-label">Despesas do mês</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button className={`pill ${tab === "mensalidades" ? "active" : ""}`} onClick={() => setTab("mensalidades")}>Mensalidades</button>
        <button className={`pill ${tab === "despesas" ? "active" : ""}`} onClick={() => setTab("despesas")}>Despesas</button>
      </div>

      {tab === "mensalidades" && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {["Todos", "Pago", "Pendente", "Vencido"].map(f => (
              <button key={f} className={`pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead><tr><th>Aluno</th><th>Mês</th><th>Valor</th><th>Método</th><th>Status</th><th>Atraso</th></tr></thead>
                <tbody>
                  {mensFiltered.map((m, i) => {
                    const aluno = ALUNOS.find(a => a.id === m.alunoId);
                    return (
                      <tr key={m.id} style={{ animation: `stagger 0.3s ease ${i * 0.03}s backwards` }}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar name={aluno?.nome || "?"} size={32} />
                            <span style={{ fontWeight: 500 }}>{aluno?.nome}</span>
                          </div>
                        </td>
                        <td>{m.mes}</td>
                        <td style={{ fontWeight: 600, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{fmt(m.valor)}</td>
                        <td style={{ color: "var(--text2)" }}>{m.metodo || "—"}</td>
                        <td><Badge status={m.status} /></td>
                        <td style={{ color: m.diasAtraso > 0 ? "var(--red)" : "var(--text3)", fontWeight: m.diasAtraso > 0 ? 600 : 400 }}>
                          {m.diasAtraso > 0 ? `${m.diasAtraso} dias` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "despesas" && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Descrição</th><th>Categoria</th><th>Data</th><th>Valor</th></tr></thead>
              <tbody>
                {DESPESAS.map((d, i) => (
                  <tr key={d.id} style={{ animation: `stagger 0.3s ease ${i * 0.05}s backwards` }}>
                    <td style={{ fontWeight: 500 }}>{d.desc}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
                          <Icon name={despIcon[d.categoria]} size={15} />
                        </div>
                        <span style={{ fontSize: 13, textTransform: "capitalize" }}>{d.categoria}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text2)" }}>{d.data}</td>
                    <td style={{ fontWeight: 600, color: "var(--red)", fontFamily: "'Bricolage Grotesque',sans-serif" }}>- {fmt(d.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Comunicação ─────────────────────────────────────────
const ComunicacaoPage = () => {
  const [msgType, setMsgType] = useState("cobranca");
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [generated, setGenerated] = useState(null);

  const templates = {
    cobranca: (nome, valor, mes) => `Olá! Aqui é da van escolar do(a) ${nome}. Informamos que a mensalidade de ${mes} no valor de ${fmt(valor)} encontra-se em aberto. O pagamento pode ser feito via PIX. Qualquer dúvida, estou à disposição!`,
    comunicado: (nome) => `Prezados pais e responsáveis, informamos que amanhã (26/03) não haverá transporte escolar devido ao feriado municipal. As rotas retornam normalmente na quinta-feira. Obrigado pela compreensão!`,
    ausencia: (nome) => `Olá! Gostaríamos de confirmar se o(a) ${nome} irá utilizar o transporte escolar amanhã. Caso haja alguma ausência, por favor nos avise com antecedência. Obrigado!`,
  };

  const handleGenerate = () => {
    const aluno = selectedAluno ? ALUNOS.find(a => a.id === selectedAluno) : ALUNOS[0];
    const msg = templates[msgType](aluno.nome, aluno.valor, "Mar/2026");
    setGenerated(msg);
  };

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card stagger">
          <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Gerar Mensagem</h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Tipo</div>
            <div className="filter-pills">
              {[["cobranca", "Cobrança"], ["comunicado", "Comunicado"], ["ausencia", "Confirmação"]].map(([k, l]) => (
                <button key={k} className={`pill ${msgType === k ? "active" : ""}`} onClick={() => setMsgType(k)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Destinatário</div>
            <select
              value={selectedAluno || ""}
              onChange={e => setSelectedAluno(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 14px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 13, fontFamily: "inherit", outline: "none" }}
            >
              <option value="">Todos os pais</option>
              {ALUNOS.filter(a => a.status === "ativo").map(a => (
                <option key={a.id} value={a.id}>{a.nome} — {a.responsavel}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleGenerate}>
            <Icon name="send" size={16} /> Gerar Mensagem
          </button>
        </div>

        <div className="card stagger" style={{ animationDelay: "0.1s" }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Preview</h3>
          {generated ? (
            <>
              <div style={{ background: "var(--surface2)", borderRadius: 14, padding: 18, fontSize: 13.5, lineHeight: 1.65, color: "var(--text)", marginBottom: 16, border: "1px solid var(--border)" }}>
                {generated}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  <Icon name="whatsapp" size={16} /> Enviar via WhatsApp
                </button>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(generated)}>
                  Copiar
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
              Selecione o tipo e clique em "Gerar Mensagem"
            </div>
          )}
        </div>
      </div>

      {/* Convites Pendentes */}
      <div className="card stagger" style={{ marginTop: 16, animationDelay: "0.15s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Convidar Pais para o App</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          {ALUNOS.filter(a => a.status === "ativo").slice(0, 6).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <Avatar name={a.nome} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.nome}</div>
                <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{a.responsavel}</div>
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="send" size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Configurações ───────────────────────────────────────
const ConfigPage = () => (
  <div className="page">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div className="card stagger">
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Perfil do Motorista</h3>
        {[
          ["Nome", "Fábio Costa"],
          ["CPF", "•••.•••.789-00"],
          ["Telefone", "(32) 99908-9957"],
          ["E-mail", "fabio@keepcoding.net.br"],
          ["CNH", "Categoria D — Venc. 08/2027"],
        ].map(([l, v]) => (
          <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
        ))}
      </div>

      <div className="card stagger" style={{ animationDelay: "0.06s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Veículo</h3>
        {[
          ["Marca / Modelo", "Renault Master 2.3"],
          ["Ano", "2022"],
          ["Placa", "RJK-4E29"],
          ["Cor", "Branca"],
          ["Capacidade", "16 passageiros"],
        ].map(([l, v]) => (
          <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
        ))}
      </div>

      <div className="card stagger" style={{ animationDelay: "0.12s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Plano & Assinatura</h3>
        <div style={{ background: "var(--primary-dim)", borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Plano Atual</div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>Premium</div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>R$ 179/mês · Renovação em 01/04</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["Básico", "R$ 79"], ["Pro", "R$ 129"], ["Premium", "R$ 179"]].map(([n, p]) => (
            <div key={n} style={{ textAlign: "center", padding: 12, borderRadius: 10, background: n === "Premium" ? "var(--primary-dim)" : "var(--surface2)", border: `1px solid ${n === "Premium" ? "var(--primary)" : "var(--border)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: n === "Premium" ? "var(--primary)" : "var(--text)" }}>{n}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{p}/mês</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card stagger" style={{ animationDelay: "0.18s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Notificações</h3>
        {["Embarque / Desembarque", "Pagamentos recebidos", "Mensalidades vencidas", "Ausências reportadas", "Atualizações do sistema"].map((n, i) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontSize: 13, color: "var(--text)" }}>{n}</span>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: i < 3 ? "var(--green)" : "var(--surface3)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: i < 3 ? 20 : 2, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Visão Pais ──────────────────────────────────────────
const PaisView = () => {
  const aluno = ALUNOS[0]; // Simulating parent of Lucas Silva
  const mensalidade = MENSALIDADES.find(m => m.alunoId === aluno.id && m.mes === "Mar/2026");

  return (
    <div className="page">
      {/* Status Card */}
      <div className="card stagger" style={{ background: "linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
            <Icon name="van" size={28} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500 }}>Status da Van</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif", color: "var(--green)" }}>Em Rota</div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Previsão de chegada: 07:12</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button className="btn btn-primary" style={{ justifyContent: "center" }}>
            <Icon name="mapPin" size={16} /> Acompanhar Van
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: "center" }}>
            <Icon name="alert" size={16} /> Avisar Falta
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Student Card */}
        <div className="card stagger" style={{ animationDelay: "0.08s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <Avatar name={aluno.nome} size={48} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque',sans-serif" }}>{aluno.nome}</div>
              <div style={{ fontSize: 12.5, color: "var(--text3)" }}>{aluno.escola} · {aluno.serie}</div>
            </div>
          </div>
          {[
            ["Turno", aluno.turno],
            ["Bairro", aluno.bairro],
            ["Motorista", "Fábio Costa"],
            ["Veículo", "Renault Master · RJK-4E29"],
          ].map(([l, v]) => (
            <div className="detail-row" key={l}><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
          ))}
        </div>

        {/* Payment Card */}
        <div className="card stagger" style={{ animationDelay: "0.14s" }}>
          <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Mensalidade</h3>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Mar/2026</div>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 36, fontWeight: 700, color: mensalidade?.status === "pago" ? "var(--green)" : "var(--primary)", margin: "8px 0" }}>
              {fmt(mensalidade?.valor || 0)}
            </div>
            <Badge status={mensalidade?.status || "pendente"} />
          </div>
          {mensalidade?.status !== "pago" && (
            <div style={{ marginTop: 20 }}>
              {/* Fake PIX QR */}
              <div style={{ width: 140, height: 140, margin: "0 auto 16px", background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 100, height: 100, background: "repeating-conic-gradient(var(--text3) 0% 25%, var(--surface2) 0% 50%) 0 0 / 10px 10px", borderRadius: 4, opacity: 0.5 }} />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Pagar com PIX</button>
            </div>
          )}
          {mensalidade?.status === "pago" && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <div style={{ color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
                <Icon name="check" size={16} /> Pago em {mensalidade.dataPgto} via {mensalidade.metodo}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Motorist Contact */}
      <div className="card stagger" style={{ marginTop: 16, animationDelay: "0.2s" }}>
        <h3 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Contato do Motorista</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name="Fábio Costa" size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Fábio Costa</div>
            <div style={{ fontSize: 12.5, color: "var(--text3)" }}>Renault Master 2022 · Placa RJK-4E29</div>
          </div>
          <a href="https://wa.me/5532999089957" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
            <Icon name="whatsapp" size={15} /> WhatsApp
          </a>
          <a href="tel:5532999089957" className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>
            <Icon name="phone" size={15} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────
const pageLabels = {
  dashboard: "Dashboard",
  alunos: "Alunos",
  rotas: "Rotas",
  financeiro: "Financeiro",
  comunicacao: "Comunicação",
  config: "Configurações",
  pais: "Visão Pais",
};

export default function App() {
  const [current, setCurrent] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState(null);

  const renderPage = () => {
    switch (current) {
      case "dashboard": return <DashboardPage setCurrent={setCurrent} setView={setView} />;
      case "alunos": return <AlunosPage />;
      case "rotas": return <RotasPage view={view} setView={setView} />;
      case "financeiro": return <FinanceiroPage />;
      case "comunicacao": return <ComunicacaoPage />;
      case "config": return <ConfigPage />;
      case "pais": return <PaisView />;
      default: return <DashboardPage setCurrent={setCurrent} setView={setView} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="keepvan-root">
        <Sidebar current={current} setCurrent={setCurrent} open={sidebarOpen} setOpen={setSidebarOpen} setView={setView} />
        <div className="main-content">
          <Topbar title={pageLabels[current]} setOpen={setSidebarOpen}>
            {current !== "pais" && (
              <div style={{ position: "relative" }}>
                <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}>
                  <Icon name="bell" size={18} />
                </button>
                <div className="notif-dot" />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={current === "pais" ? "Maria Silva" : "Fábio Costa"} size={32} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>{current === "pais" ? "Maria Silva" : "Fábio Costa"}</span>
            </div>
          </Topbar>
          {renderPage()}
        </div>
      </div>
    </>
  );
}
