import type { Chamado, ChamadoForm, ApiResponse, User, CreateUserForm } from "./types"

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Função auxiliar para fazer requisições HTTP
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Obter o token do localStorage
  const token = localStorage.getItem("token")
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log('API Request:', { url, token: token ? 'present' : 'missing', config })
    const response = await fetch(url, config)
    console.log('API Response:', { status: response.status, ok: response.ok })
    
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.log('Error response data:', errorData)
      } catch (parseError) {
        console.log('Failed to parse error response:', parseError)
        errorData = { message: "Erro desconhecido" }
      }
      
      if (response.status === 401 || response.status === 403) {
        // Token expirado, inválido ou sem permissão - limpar localStorage e redirecionar
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new ApiError("Sessão expirada ou sem permissão. Faça login novamente.", response.status)
      }
      
      throw new ApiError(errorData.message || `HTTP error! status: ${response.status}`, response.status)
    }

    const data: ApiResponse<T> = await response.json()
    console.log('API Success data:', data)
    
    if (!data.success) {
      throw new ApiError(data.message || "Erro na operação", 400)
    }
    
    return data.data
  } catch (error) {
    console.error('API Request error:', error)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError("Erro de conexão com o servidor", 500)
    }
    
    throw new ApiError(`Erro desconhecido: ${error instanceof Error ? error.message : 'Unknown error'}`, 500)
  }
}

// Função para buscar todos os chamados
export async function fetchChamados(): Promise<Chamado[]> {
  return await apiRequest<Chamado[]>("/chamados")
}

// Função para buscar um chamado específico
export async function fetchChamado(id: number): Promise<Chamado | null> {
  try {
    return await apiRequest<Chamado>(`/chamados/${id}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

// Função para criar um novo chamado
export async function createChamado(data: ChamadoForm): Promise<Chamado> {
  return await apiRequest<Chamado>("/chamados", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Função para atualizar um chamado existente
export async function updateChamado(id: number, data: ChamadoForm): Promise<Chamado | null> {
  try {
    return await apiRequest<Chamado>(`/chamados/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

// Função para excluir um chamado
export async function deleteChamado(id: number): Promise<boolean> {
  try {
    await apiRequest<void>(`/chamados/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError("Chamado não encontrado", 404)
    }
    throw error
  }
}

// Função para buscar estatísticas do dashboard
export async function fetchDashboardStats() {
  return await apiRequest<any>("/chamados/dashboard/stats")
}

// Função para buscar chamados com filtros
export async function fetchChamadosWithFilters(filters: {
  prioridade?: string
  responsavel?: string
  abertoPor?: string
  dataInicio?: string
  dataFim?: string
}): Promise<Chamado[]> {
  const params = new URLSearchParams()
  
  if (filters.prioridade) params.append("prioridade", filters.prioridade)
  if (filters.responsavel) params.append("responsavel", filters.responsavel)
  if (filters.abertoPor) params.append("abertoPor", filters.abertoPor)
  if (filters.dataInicio) params.append("dataInicio", filters.dataInicio)
  if (filters.dataFim) params.append("dataFim", filters.dataFim)
  
  const queryString = params.toString()
  const endpoint = queryString ? `/chamados/filter?${queryString}` : "/chamados/filter"
  
  return await apiRequest<Chamado[]>(endpoint)
}

// ========== FUNÇÕES DE USUÁRIOS ==========

// Função para buscar todos os usuários
export async function fetchUsers(): Promise<User[]> {
  return await apiRequest<User[]>("/users")
}

// Função para buscar um usuário específico
export async function fetchUser(id: number): Promise<User | null> {
  try {
    return await apiRequest<User>(`/users/${id}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

// Função para buscar usuário por username
export async function fetchUserByUsername(username: string): Promise<User | null> {
  try {
    return await apiRequest<User>(`/users/username/${username}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

// Função para criar um novo usuário
export async function createUser(data: CreateUserForm): Promise<User> {
  return await apiRequest<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Função para atualizar um usuário existente
export async function updateUser(id: number, data: CreateUserForm): Promise<User | null> {
  try {
    return await apiRequest<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

// Função para excluir um usuário
export async function deleteUser(id: number): Promise<boolean> {
  try {
    await apiRequest<void>(`/users/${id}`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError("Usuário não encontrado", 404)
    }
    throw error
  }
}

// Função para ativar/desativar um usuário
export async function toggleUserStatus(id: number): Promise<User | null> {
  try {
    return await apiRequest<User>(`/users/${id}/toggle-status`, {
      method: "PATCH",
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null
    }
    throw error
  }
}
