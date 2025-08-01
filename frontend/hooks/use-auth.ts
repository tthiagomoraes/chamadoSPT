"use client"

import { useState, useCallback, useEffect, createContext, useContext } from "react"

interface User {
  username: string
  nome: string
  role: string
  token: string
  expiresIn: number
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthLogic() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Fazer requisição direta para o endpoint de login
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const userData: User = {
          username: data.data.username,
          nome: data.data.nome,
          role: data.data.role,
          token: data.data.token,
          expiresIn: data.data.expiresIn,
        }

        setUser(userData)
        
        // Salvar no localStorage
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", userData.token)
        
        return true
      } else {
        setError(data.message || "Erro ao fazer login")
        return false
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
      return false
    } finally {
      setLoading(false)
    }
  }, [])



  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    // Redirecionar para login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])

  // Verificar se há um usuário salvo no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (err) {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
  }, [])

  return {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  }
}

export { AuthContext }