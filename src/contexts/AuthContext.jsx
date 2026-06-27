import { createContext, useContext, useEffect, useState } from 'react'
import { DATA_MODE } from '../lib/firebase'
import { repo } from '../data/repo'

const AuthContext = createContext(null)
const SESSION_KEY = 'keepvan_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restaura sessão (mock). Em produção, isto vira onAuthStateChanged do Firebase.
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  async function login({ email }) {
    if (DATA_MODE === 'mock') {
      const motorista = await repo.getMotorista()
      const u = { uid: motorista.userId, nome: motorista.nome, email: email || motorista.email, role: 'motorista' }
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      setUser(u)
      return u
    }
    // TODO(produção): signInWithEmailAndPassword / signInWithPopup(Google)
    throw new Error('Login Firebase ainda não configurado.')
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
