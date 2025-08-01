"use client"

import { ReactNode } from "react"
import { AuthContext, useAuthLogic } from "@/hooks/use-auth"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authValue = useAuthLogic()

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}