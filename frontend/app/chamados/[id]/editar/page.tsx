"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/hooks/use-api"
import type { ChamadoForm } from "@/lib/types"

interface EditarChamadoPageProps {
  params: {
    id: string
  }
}

export default function EditarChamadoPage({ params }: EditarChamadoPageProps) {
  const router = useRouter()
  const { getChamado, updateChamado, loading } = useApi()
  const { toast } = useToast()

  const [formData, setFormData] = useState<ChamadoForm>({
    prioridade: "BAIXA",
    numero: "",
    abertoPor: "",
    responsavel: "",
    descricaoResumida: "",
  })

  const [errors, setErrors] = useState<Partial<ChamadoForm>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChamado()
  }, [params.id])

  const loadChamado = async () => {
    const chamado = await getChamado(Number.parseInt(params.id))
    if (chamado) {
      setFormData({
        prioridade: chamado.prioridade,
        numero: chamado.numero,
        abertoPor: chamado.abertoPor,
        responsavel: chamado.responsavel,
        descricaoResumida: chamado.descricaoResumida,
      })
    } else {
      toast({
        title: "Erro",
        description: "Chamado não encontrado.",
        variant: "destructive",
      })
      router.push("/chamados")
    }
    setIsLoading(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ChamadoForm> = {}

    if (!formData.numero.trim()) {
      newErrors.numero = "Número é obrigatório"
    }

    if (!formData.abertoPor.trim()) {
      newErrors.abertoPor = 'Campo "Aberto Por" é obrigatório'
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = "Responsável é obrigatório"
    }

    if (!formData.descricaoResumida.trim()) {
      newErrors.descricaoResumida = "Descrição é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const result = await updateChamado(Number.parseInt(params.id), formData)

    if (result) {
      toast({
        title: "Chamado atualizado",
        description: `Chamado ${result.numero} foi atualizado com sucesso.`,
      })
      router.push("/chamados")
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o chamado.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof ChamadoForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Editar Chamado</h1>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="text-center">
            <p>Carregando dados do chamado...</p>
          </div>
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
            <h1 className="text-lg font-semibold">Editar Chamado</h1>
            <p className="text-sm text-muted-foreground">Editar chamado {formData.numero}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/chamados">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Chamado</CardTitle>
              <CardDescription>Edite os dados do chamado</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade *</Label>
                    <Select
                      value={formData.prioridade}
                      onValueChange={(value: "BAIXA" | "MODERADA" | "ALTA") => handleInputChange("prioridade", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BAIXA">Baixa</SelectItem>
                        <SelectItem value="MODERADA">Moderada</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange("numero", e.target.value)}
                      placeholder="Ex: CH-2024-001"
                      className={errors.numero ? "border-red-500" : ""}
                    />
                    {errors.numero && <p className="text-sm text-red-500">{errors.numero}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="abertoPor">Aberto Por *</Label>
                    <Input
                      id="abertoPor"
                      value={formData.abertoPor}
                      onChange={(e) => handleInputChange("abertoPor", e.target.value)}
                      placeholder="Nome do solicitante"
                      className={errors.abertoPor ? "border-red-500" : ""}
                    />
                    {errors.abertoPor && <p className="text-sm text-red-500">{errors.abertoPor}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={formData.responsavel}
                      onChange={(e) => handleInputChange("responsavel", e.target.value)}
                      placeholder="Nome do responsável"
                      className={errors.responsavel ? "border-red-500" : ""}
                    />
                    {errors.responsavel && <p className="text-sm text-red-500">{errors.responsavel}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoResumida">Descrição Resumida *</Label>
                  <Textarea
                    id="descricaoResumida"
                    value={formData.descricaoResumida}
                    onChange={(e) => handleInputChange("descricaoResumida", e.target.value)}
                    placeholder="Descreva brevemente o problema ou solicitação"
                    rows={4}
                    className={errors.descricaoResumida ? "border-red-500" : ""}
                  />
                  {errors.descricaoResumida && <p className="text-sm text-red-500">{errors.descricaoResumida}</p>}
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/chamados">Cancelar</Link>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
