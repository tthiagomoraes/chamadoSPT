import type { Chamado } from "./types"

// Dados mock para simular a API
export const mockChamados: Chamado[] = [
  {
    id: 1,
    numero: "CH-2024-001",
    prioridade: "ALTA",
    abertoPor: "João Silva",
    responsavel: "Maria Santos",
    dataAbertura: "2024-01-15T08:30:00Z",
    ultimaAtualizacao: "2024-01-15T14:20:00Z",
    descricaoResumida: "Sistema de vendas apresentando lentidão extrema, impactando atendimento aos clientes",
  },
  {
    id: 2,
    numero: "CH-2024-002",
    prioridade: "MODERADA",
    abertoPor: "Ana Costa",
    responsavel: "Pedro Oliveira",
    dataAbertura: "2024-01-14T10:15:00Z",
    ultimaAtualizacao: "2024-01-15T09:45:00Z",
    descricaoResumida: "Erro intermitente no módulo de relatórios financeiros",
  },
  {
    id: 3,
    numero: "CH-2024-003",
    prioridade: "BAIXA",
    abertoPor: "Carlos Mendes",
    responsavel: "Lucia Ferreira",
    dataAbertura: "2024-01-13T16:20:00Z",
    ultimaAtualizacao: "2024-01-14T11:30:00Z",
    descricaoResumida: "Solicitação de melhoria na interface do cadastro de produtos",
  },
  {
    id: 4,
    numero: "CH-2024-004",
    prioridade: "ALTA",
    abertoPor: "Fernanda Lima",
    responsavel: "Roberto Silva",
    dataAbertura: "2024-01-12T14:45:00Z",
    ultimaAtualizacao: "2024-01-15T16:10:00Z",
    descricaoResumida: "Falha crítica no sistema de backup automático",
  },
  {
    id: 5,
    numero: "CH-2024-005",
    prioridade: "MODERADA",
    abertoPor: "Ricardo Santos",
    responsavel: "Amanda Costa",
    dataAbertura: "2024-01-11T09:30:00Z",
    ultimaAtualizacao: "2024-01-14T15:20:00Z",
    descricaoResumida: "Problemas de sincronização entre filiais",
  },
  {
    id: 6,
    numero: "CH-2024-006",
    prioridade: "BAIXA",
    abertoPor: "Juliana Rocha",
    responsavel: "Marcos Pereira",
    dataAbertura: "2024-01-10T11:15:00Z",
    ultimaAtualizacao: "2024-01-13T10:45:00Z",
    descricaoResumida: "Atualização de layout da tela de login",
  },
  {
    id: 7,
    numero: "CH-2024-007",
    prioridade: "ALTA",
    abertoPor: "Gabriel Alves",
    responsavel: "Carla Souza",
    dataAbertura: "2024-01-09T13:20:00Z",
    ultimaAtualizacao: "2024-01-15T12:30:00Z",
    descricaoResumida: "Vulnerabilidade de segurança detectada no módulo de autenticação",
  },
  {
    id: 8,
    numero: "CH-2024-008",
    prioridade: "MODERADA",
    abertoPor: "Patrícia Dias",
    responsavel: "Eduardo Lima",
    dataAbertura: "2024-01-08T15:40:00Z",
    ultimaAtualizacao: "2024-01-12T14:15:00Z",
    descricaoResumida: "Integração com API externa apresentando timeout",
  },
]

// Função para gerar próximo ID
export const getNextId = (): number => {
  const maxId = Math.max(...mockChamados.map((c) => c.id), 0)
  return maxId + 1
}

// Função para gerar próximo número de chamado
export const getNextNumero = (): string => {
  const year = new Date().getFullYear()
  const existingNumbers = mockChamados
    .map((c) => c.numero)
    .filter((n) => n.startsWith(`CH-${year}-`))
    .map((n) => Number.parseInt(n.split("-")[2]))
    .sort((a, b) => b - a)

  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1
  return `CH-${year}-${nextNumber.toString().padStart(3, "0")}`
}
