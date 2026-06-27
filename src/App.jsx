import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Spinner, EmptyState } from './components/ui'
import { Construction } from 'lucide-react'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/motorista/Dashboard'
import Alunos from './pages/motorista/Alunos'
import AlunoForm from './pages/motorista/AlunoForm'
import AlunoDetail from './pages/motorista/AlunoDetail'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid h-screen place-items-center"><Spinner className="h-8 w-8" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function EmBreve({ titulo }) {
  return (
    <EmptyState icon={Construction} title={`${titulo} — em construção`}>
      Este módulo entra nas próximas fases do KeepVan. A navegação e a base já estão prontas.
    </EmptyState>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><AppShell /></Protected>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/alunos/novo" element={<AlunoForm />} />
        <Route path="/alunos/:id" element={<AlunoDetail />} />
        <Route path="/alunos/:id/editar" element={<AlunoForm />} />
        <Route path="/rotas" element={<EmBreve titulo="Rotas & GPS" />} />
        <Route path="/financeiro" element={<EmBreve titulo="Financeiro" />} />
        <Route path="/assistente" element={<EmBreve titulo="Assistente IA" />} />
        <Route path="/config" element={<EmBreve titulo="Configurações" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
