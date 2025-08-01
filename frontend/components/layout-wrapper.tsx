"use client"

import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { ReactNode } from "react"

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <ProtectedRoute>
      {isLoginPage || !isAuthenticated ? (
        <>{children}</>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarProvider>
      )}
    </ProtectedRoute>
  )
}