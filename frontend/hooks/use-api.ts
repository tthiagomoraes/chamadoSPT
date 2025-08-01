"use client"

import { useState, useCallback } from "react"
import type { Chamado, ChamadoForm } from "@/lib/types"
import {
  fetchChamados,
  fetchChamado,
  createChamado as apiCreateChamado,
  updateChamado as apiUpdateChamado,
  deleteChamado as apiDeleteChamado,
  fetchDashboardStats,
  fetchChamadosWithFilters,
  ApiError,
} from "@/lib/api-functions"

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequest = useCallback(async (request: () => Promise<any>): Promise<any | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await request()
      return result
    } catch (err) {
      let errorMessage = "Erro desconhecido"

      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
      console.error("API Error:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getChamados = useCallback(async (): Promise<Chamado[]> => {
    const result = await handleRequest(() => fetchChamados())
    return result || []
  }, [handleRequest])

  const getChamado = useCallback(
    async (id: number): Promise<Chamado | null> => {
      return await handleRequest(() => fetchChamado(id))
    },
    [handleRequest],
  )

  const createChamado = useCallback(
    async (chamado: ChamadoForm): Promise<Chamado | null> => {
      return await handleRequest(() => apiCreateChamado(chamado))
    },
    [handleRequest],
  )

  const updateChamado = useCallback(
    async (id: number, chamado: ChamadoForm): Promise<Chamado | null> => {
      return await handleRequest(() => apiUpdateChamado(id, chamado))
    },
    [handleRequest],
  )

  const deleteChamado = useCallback(
    async (id: number): Promise<boolean> => {
      const result = await handleRequest(() => apiDeleteChamado(id))
      return result !== null
    },
    [handleRequest],
  )

  const getDashboardStats = useCallback(async () => {
    return await handleRequest(() => fetchDashboardStats())
  }, [handleRequest])

  const getChamadosWithFilters = useCallback(
    async (filters: {
      prioridade?: string
      responsavel?: string
      abertoPor?: string
      dataInicio?: string
      dataFim?: string
    }): Promise<Chamado[]> => {
      const result = await handleRequest(() => fetchChamadosWithFilters(filters))
      return result || []
    },
    [handleRequest],
  )

  return {
    loading,
    error,
    getChamados,
    getChamado,
    createChamado,
    updateChamado,
    deleteChamado,
    getDashboardStats,
    getChamadosWithFilters,
  }
}
