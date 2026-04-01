import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface User { id: number; email: string; name: string; country: string; phone?: string }
interface AuthCtx {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, country: string, phone?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('em_token')
    if (token) {
      api.me().then(d => setUser(d.user)).catch(() => localStorage.removeItem('em_token')).finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const login = async (email: string, password: string) => {
    const d = await api.login(email, password)
    localStorage.setItem('em_token', d.token)
    setUser(d.user)
  }

  const register = async (email: string, password: string, name: string, country: string, phone?: string) => {
    const d = await api.register(email, password, name, country, phone)
    localStorage.setItem('em_token', d.token)
    setUser(d.user)
  }

  const logout = () => { localStorage.removeItem('em_token'); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
