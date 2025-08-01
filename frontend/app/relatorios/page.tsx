"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Filter, RefreshCcw, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/use-api"
import type { Chamado } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "ALTA":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "MODERADA":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "BAIXA":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function RelatoriosPage() {
  const [filteredChamados, setFilteredChamados] = useState<Chamado[]>([])
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("")
  const [responsavelFilter, setResponsavelFilter] = useState<string>("")
  const [abertoPorFilter, setAbertoPorFilter] = useState<string>("")
  const [dataInicioFilter, setDataInicioFilter] = useState<Date | undefined>(undefined)
  const [dataFimFilter, setDataFimFilter] = useState<Date | undefined>(undefined)

  const { getChamadosWithFilters, loading, error } = useApi()

  const applyFilters = async () => {
    const filters = {
      prioridade: prioridadeFilter === "TODAS" ? undefined : prioridadeFilter,
      responsavel: responsavelFilter || undefined,
      abertoPor: abertoPorFilter || undefined,
      dataInicio: dataInicioFilter ? dataInicioFilter.toISOString() : undefined,
      dataFim: dataFimFilter ? dataFimFilter.toISOString() : undefined,
    }
    const data = await getChamadosWithFilters(filters)
    setFilteredChamados(data)
  }

  useEffect(() => {
    applyFilters()
  }, []) // Initial load

  const handleResetFilters = () => {
    setPrioridadeFilter("")
    setResponsavelFilter("")
    setAbertoPorFilter("")
    setDataInicioFilter(undefined)
    setDataFimFilter(undefined)
    // Re-apply filters after state reset
    setTimeout(applyFilters, 0)
  }

  // Calculate summary stats for filtered data
  const totalFiltered = filteredChamados.length
  const altaPrioridadeFiltered = filteredChamados.filter((c) => c.prioridade === "ALTA").length
  const moderadaPrioridadeFiltered = filteredChamados.filter((c) => c.prioridade === "MODERADA").length
  const baixaPrioridadeFiltered = filteredChamados.filter((c) => c.prioridade === "BAIXA").length

  if (error) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Análises e estatísticas do sistema</p>
          </div>
        </header>
        <div className="flex-1 p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600">Erro ao carregar relatórios: {error}</p>
                <Button onClick={applyFilters} className="mt-4">
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análises e estatísticas do sistema</p>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Relatório</CardTitle>
            <CardDescription>Selecione os critérios para filtrar os chamados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="prioridadeFilter">Prioridade</Label>
                <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                  <SelectTrigger id="prioridadeFilter">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODAS">Todas</SelectItem>
                    <SelectItem value="BAIXA">Baixa</SelectItem>
                    <SelectItem value="MODERADA">Moderada</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavelFilter">Responsável</Label>
                <Input
                  id="responsavelFilter"
                  placeholder="Nome do responsável"
                  value={responsavelFilter}
                  onChange={(e) => setResponsavelFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abertoPorFilter">Aberto Por</Label>
                <Input
                  id="abertoPorFilter"
                  placeholder="Nome do solicitante"
                  value={abertoPorFilter}
                  onChange={(e) => setAbertoPorFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicioFilter">Data de Abertura (Início)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataInicioFilter && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicioFilter ? (
                        format(dataInicioFilter, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataInicioFilter}
                      onSelect={setDataInicioFilter}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFimFilter">Data de Abertura (Fim)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataFimFilter && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFimFilter ? format(dataFimFilter, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataFimFilter}
                      onSelect={setDataFimFilter}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
              <Button onClick={applyFilters} disabled={loading}>
                <Filter className="mr-2 h-4 w-4" />
                {loading ? "Aplicando..." : "Aplicar Filtros"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Filtrado</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFiltered}</div>
              <p className="text-xs text-muted-foreground">Chamados que correspondem aos filtros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridade (Filtrados)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{altaPrioridadeFiltered}</div>
              <p className="text-xs text-muted-foreground">Chamados de alta prioridade nos filtros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moderada Prioridade (Filtrados)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moderadaPrioridadeFiltered}</div>
              <p className="text-xs text-muted-foreground">Chamados de moderada prioridade nos filtros</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chamados Filtrados</CardTitle>
            <CardDescription>Lista de chamados que correspondem aos filtros aplicados.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando chamados filtrados...</p>
              </div>
            ) : filteredChamados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum chamado encontrado com os filtros aplicados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Aberto Por</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data de Abertura</TableHead>
                      <TableHead>Última Atualização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChamados.map((chamado) => (
                      <TableRow key={chamado.id}>
                        <TableCell className="font-medium">{chamado.numero}</TableCell>
                        <TableCell>
                          <Badge className={getPrioridadeColor(chamado.prioridade)}>{chamado.prioridade}</Badge>
                        </TableCell>
                        <TableCell>{chamado.abertoPor}</TableCell>
                        <TableCell>{chamado.responsavel}</TableCell>
                        <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                        <TableCell>{formatDate(chamado.ultimaAtualizacao)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
