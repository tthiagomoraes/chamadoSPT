"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, Clock, FileText, TrendingUp } from "lucide-react"
import { useApi } from "@/hooks/use-api"

interface DashboardStats {
  total: number
  emAberto: number
  alta: number
  moderada: number
  baixa: number
  resolvidosHoje: number
  distribuicaoPrioridade: {
    alta: { count: number; percentage: number }
    moderada: { count: number; percentage: number }
    baixa: { count: number; percentage: number }
  }
  chamadosRecentes: Array<{
    id: number
    numero: string
    prioridade: string
    descricaoResumida: string
  }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { getDashboardStats, loading, error } = useApi()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const data = await getDashboardStats()
    if (data) {
      setStats(data)
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p>Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Erro ao carregar</p>
          </div>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p className="text-red-600">Erro: {error}</p>
            <button onClick={loadStats} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do sistema</p>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">Todos os chamados registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.emAberto || 0}</div>
              <p className="text-xs text-muted-foreground">Aguardando resolução</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.alta || 0}</div>
              <p className="text-xs text-muted-foreground">Requer atenção imediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos Hoje</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.resolvidosHoje || 0}</div>
              <p className="text-xs text-muted-foreground">Chamados finalizados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Prioridade</CardTitle>
              <CardDescription>Distribuição dos chamados ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Alta</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.distribuicaoPrioridade?.alta?.count || 0} (
                    {stats?.distribuicaoPrioridade?.alta?.percentage || 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Moderada</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.distribuicaoPrioridade?.moderada?.count || 0} (
                    {stats?.distribuicaoPrioridade?.moderada?.percentage || 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Baixa</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats?.distribuicaoPrioridade?.baixa?.count || 0} (
                    {stats?.distribuicaoPrioridade?.baixa?.percentage || 0}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chamados Recentes</CardTitle>
              <CardDescription>Últimos chamados abertos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.chamadosRecentes.map((chamado) => (
                  <div key={chamado.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{chamado.numero}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {chamado.descricaoResumida}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          chamado.prioridade === "ALTA"
                            ? "bg-red-500"
                            : chamado.prioridade === "MODERADA"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-xs">{chamado.prioridade}</span>
                    </div>
                  </div>
                )) || <p className="text-sm text-muted-foreground">Nenhum chamado recente</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
