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
  loginWithoutPassword: () => Promise<boolean>
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
      const response = await fetch("http://localhost:8080/api/auth/login", {
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

  const loginWithoutPassword = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Login automático com credenciais padrão admin/admin
      const userData: User = {
        username: "admin",
        nome: "Administrador",
        role: "ADMIN",
        token: "demo-token-" + Date.now(),
        expiresIn: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      }

      setUser(userData)
      
      // Salvar no localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", userData.token)
      
      return true
    } catch (err) {
      setError("Erro ao fazer login automático")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
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
    loginWithoutPassword,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  }
}

export { AuthContext }