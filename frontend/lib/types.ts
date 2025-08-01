export interface Chamado {
  id: number
  numero: string
  prioridade: "BAIXA" | "MODERADA" | "ALTA"
  abertoPor: string
  responsavel: string
  dataAbertura: string
  ultimaAtualizacao: string
  descricaoResumida: string
}

export interface ChamadoForm {
  prioridade: "BAIXA" | "MODERADA" | "ALTA"
  numero: string
  abertoPor: string
  responsavel: string
  descricaoResumida: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface User {
  id: number
  username: string
  nome: string
  role: "ADMIN" | "USER"
  enabled: boolean
}

export interface CreateUserForm {
  username: string
  password: string
  nome: string
  role: "ADMIN" | "USER"
  enabled?: boolean
}
