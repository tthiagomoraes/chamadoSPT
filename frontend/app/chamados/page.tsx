"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import type { Chamado } from "@/lib/types"

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

export default function ChamadosPage() {
  const [chamados, setChamados] = useState<Chamado[]>([])
  const { getChamados, deleteChamado, loading, error } = useApi()
  const { toast } = useToast()

  useEffect(() => {
    loadChamados()
  }, [])

  const loadChamados = async () => {
    const data = await getChamados()
    setChamados(data)
  }

  const handleDelete = async (id: number, numero: string) => {
    const success = await deleteChamado(id)
    if (success) {
      toast({
        title: "Chamado excluído",
        description: `Chamado ${numero} foi excluído com sucesso.`,
      })
      loadChamados()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o chamado.",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Chamados</h1>
            <p className="text-sm text-muted-foreground">Gerenciar chamados do sistema</p>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600">Erro ao carregar chamados: {error}</p>
                <Button onClick={loadChamados} className="mt-4">
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
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Chamados</h1>
            <p className="text-sm text-muted-foreground">Gerenciar chamados do sistema</p>
          </div>
          <Button asChild>
            <Link href="/chamados/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Chamado
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Chamados</CardTitle>
            <CardDescription>
              {chamados.length} chamado{chamados.length !== 1 ? "s" : ""} encontrado{chamados.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando chamados...</p>
              </div>
            ) : chamados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum chamado encontrado.</p>
                <Button asChild className="mt-4">
                  <Link href="/chamados/novo">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeiro chamado
                  </Link>
                </Button>
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
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chamados.map((chamado) => (
                      <TableRow key={chamado.id}>
                        <TableCell className="font-medium">{chamado.numero}</TableCell>
                        <TableCell>
                          <Badge className={getPrioridadeColor(chamado.prioridade)}>{chamado.prioridade}</Badge>
                        </TableCell>
                        <TableCell>{chamado.abertoPor}</TableCell>
                        <TableCell>{chamado.responsavel}</TableCell>
                        <TableCell>{formatDate(chamado.dataAbertura)}</TableCell>
                        <TableCell>{formatDate(chamado.ultimaAtualizacao)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/chamados/${chamado.id}/editar`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o chamado {chamado.numero}? Esta ação não pode ser
                                    desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(chamado.id, chamado.numero)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
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
