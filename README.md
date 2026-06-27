# VanGuarda 🚐

Plataforma SaaS de gestão de transporte escolar — **KeepCoding**.
Conecta **motoristas** de van escolar e **pais/responsáveis** num só app (PWA):
alunos, rotas com GPS, cobrança no Pix, comunicação e assistente de IA.

> Foco inicial: Juiz de Fora & Zona da Mata Mineira.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS (PWA)
- **Backend (produção):** Firebase — Auth, Firestore, Cloud Functions, Storage, FCM
- **Mapas/GPS:** Google Maps API · **Pagamentos:** Asaas (Pix) · **Mensageria:** WhatsApp Business API · **IA:** Anthropic Claude

## Rodando localmente

```bash
npm install
npm run dev          # http://localhost:5173
```

O app sobe em **modo mock** (`VITE_DATA_MODE=mock`) — roda 100% sem backend,
com dados de demonstração persistidos em `localStorage`. Entre com **qualquer
e-mail e senha** na tela de login.

Para produção, copie `.env.example` → `.env`, defina `VITE_DATA_MODE=firebase`
e preencha as chaves.

## Arquitetura

```
src/
  components/      # ui.jsx (design system) + layout/AppShell
  contexts/        # AuthContext (mock hoje, Firebase Auth depois)
  data/repo.js     # repositório — ÚNICA porta de dados (mock ↔ Firestore)
  lib/             # firebase.js (init gated) + mock/seed.js
  pages/           # Login + motorista/{Dashboard,Alunos,...}
```

A regra de ouro: **telas nunca falam com o backend direto** — só com `data/repo.js`.
Trocar mock por Firestore é reimplementar o repositório, sem tocar nas telas.

## Status (build incremental)

- [x] Fundação: scaffold, design system, PWA, auth (mock), navegação
- [x] Dashboard do motorista
- [x] Alunos (CRUD completo)
- [ ] Rotas & GPS (geofence, execução)
- [ ] Financeiro (Pix/Asaas, despesas)
- [ ] App dos Pais + notificações (FCM/WhatsApp)
- [ ] Premium: Assistente IA, contratos digitais

## Planos

Básico **R$ 79** (até 20 alunos, 2 rotas) · Pro **R$ 129** (até 40, ilimitadas, WhatsApp+contratos) · Premium **R$ 179** (ilimitado + IA). Trial 30 dias.

---
KeepCoding © 2026
