'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { dividendos as mockDividendos, activos } from './mock-data'
import type { Dividendo, EstatusDividendo } from './types'

const STORAGE_KEY = 'capital-1d10-dividendos-v1'

interface DividendosContextType {
  dividendos: Dividendo[]
  isLoaded: boolean
  // CRUD
  addDividendo: (dividendo: Omit<Dividendo, 'id' | 'diferencia'>) => void
  updateDividendo: (id: string, data: Partial<Dividendo>) => void
  deleteDividendo: (id: string) => void
  // Queries
  getDividendosByActivo: (activoId: string) => Dividendo[]
  getDividendoById: (id: string) => Dividendo | undefined
  // Stats
  getStats: () => {
    totalEsperado: number
    totalRecibido: number
    diferencia: number
    cumplimiento: number
    pendientes: number
  }
  getTotalDividendosRecibidosByActivo: (activoId: string) => number
}

const DividendosContext = createContext<DividendosContextType | undefined>(undefined)

export function DividendosProvider({ children }: { children: ReactNode }) {
  const [dividendos, setDividendos] = useState<Dividendo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar dividendos desde localStorage o mock data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDividendos(parsed)
          setIsLoaded(true)
          return
        }
      } catch {
        // Error parsing, usar mock data
      }
    }
    // Usar mock data si no hay datos guardados
    setDividendos(mockDividendos)
    setIsLoaded(true)
  }, [])

  // Guardar cambios en localStorage
  useEffect(() => {
    if (isLoaded && dividendos.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dividendos))
    }
  }, [dividendos, isLoaded])

  const addDividendo = (dividendoData: Omit<Dividendo, 'id' | 'diferencia'>) => {
    const diferencia = dividendoData.montoRecibido - dividendoData.montoEsperado
    const nuevoDividendo: Dividendo = {
      ...dividendoData,
      id: `div-${Date.now()}`,
      diferencia,
    }
    setDividendos(prev => [nuevoDividendo, ...prev])
  }

  const updateDividendo = (id: string, data: Partial<Dividendo>) => {
    setDividendos(prev => prev.map(d => {
      if (d.id !== id) return d
      const updated = { ...d, ...data }
      // Recalcular diferencia si se actualizó montoEsperado o montoRecibido
      if (data.montoEsperado !== undefined || data.montoRecibido !== undefined) {
        updated.diferencia = updated.montoRecibido - updated.montoEsperado
      }
      return updated
    }))
  }

  const deleteDividendo = (id: string) => {
    setDividendos(prev => prev.filter(d => d.id !== id))
  }

  const getDividendosByActivo = (activoId: string) => {
    return dividendos.filter(d => d.activoId === activoId)
  }

  const getDividendoById = (id: string) => {
    return dividendos.find(d => d.id === id)
  }

  const getStats = () => {
    const totalEsperado = dividendos.reduce((sum, d) => sum + d.montoEsperado, 0)
    const totalRecibido = dividendos.reduce((sum, d) => sum + d.montoRecibido, 0)
    const diferencia = totalRecibido - totalEsperado
    const cumplimiento = totalEsperado > 0 ? (totalRecibido / totalEsperado) * 100 : 0
    const pendientes = dividendos.filter(d => d.estatus === 'pendiente').length
    return { totalEsperado, totalRecibido, diferencia, cumplimiento, pendientes }
  }

  const getTotalDividendosRecibidosByActivo = (activoId: string) => {
    return dividendos
      .filter(d => d.activoId === activoId && d.estatus === 'recibido')
      .reduce((sum, d) => sum + d.montoRecibido, 0)
  }

  return (
    <DividendosContext.Provider value={{
      dividendos,
      isLoaded,
      addDividendo,
      updateDividendo,
      deleteDividendo,
      getDividendosByActivo,
      getDividendoById,
      getStats,
      getTotalDividendosRecibidosByActivo,
    }}>
      {children}
    </DividendosContext.Provider>
  )
}

export function useDividendos() {
  const context = useContext(DividendosContext)
  if (context === undefined) {
    throw new Error('useDividendos debe usarse dentro de un DividendosProvider')
  }
  return context
}

export type { Dividendo }
