"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { activos as mockActivos, Activo } from "./mock-data"

// Version de datos
const ACTIVOS_DATA_VERSION = "v1"

interface ActivosContextType {
  activos: Activo[]
  isLoaded: boolean
  addActivo: (activo: Omit<Activo, "id">) => void
  updateActivo: (id: string, updates: Partial<Activo>) => void
  deleteActivo: (id: string) => void
  getActivoById: (id: string) => Activo | undefined
}

const ActivosContext = createContext<ActivosContextType | undefined>(undefined)

export function ActivosProvider({ children }: { children: ReactNode }) {
  const [activos, setActivos] = useState<Activo[]>(mockActivos)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar activos al iniciar
  useEffect(() => {
    const savedVersion = localStorage.getItem("1d10-activos-version")
    if (savedVersion !== ACTIVOS_DATA_VERSION) {
      localStorage.removeItem("1d10-activos")
      localStorage.setItem("1d10-activos-version", ACTIVOS_DATA_VERSION)
    }
    
    const saved = localStorage.getItem("1d10-activos")
    if (saved) {
      try {
        const parsedActivos = JSON.parse(saved)
        if (Array.isArray(parsedActivos) && parsedActivos.length > 0) {
          setActivos(parsedActivos)
          setIsLoaded(true)
          return
        }
      } catch {
        // Error parsing
      }
    }
    setActivos(mockActivos)
    localStorage.setItem("1d10-activos", JSON.stringify(mockActivos))
    setIsLoaded(true)
  }, [])

  // Guardar en localStorage cuando cambien los activos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("1d10-activos", JSON.stringify(activos))
      // Disparar evento para sincronizar con otros componentes
      window.dispatchEvent(new CustomEvent("activos-updated", { detail: activos }))
    }
  }, [activos, isLoaded])

  const addActivo = (activoData: Omit<Activo, "id">) => {
    const newActivo: Activo = {
      ...activoData,
      id: `activo-${Date.now()}`,
    }
    setActivos(prev => [...prev, newActivo])
  }

  const updateActivo = (id: string, updates: Partial<Activo>) => {
    setActivos(prev =>
      prev.map(activo =>
        activo.id === id ? { ...activo, ...updates } : activo
      )
    )
  }

  const deleteActivo = (id: string) => {
    setActivos(prev => prev.filter(activo => activo.id !== id))
  }

  const getActivoById = (id: string) => {
    return activos.find(activo => activo.id === id)
  }

  return (
    <ActivosContext.Provider value={{
      activos,
      isLoaded,
      addActivo,
      updateActivo,
      deleteActivo,
      getActivoById,
    }}>
      {children}
    </ActivosContext.Provider>
  )
}

export function useActivos() {
  const context = useContext(ActivosContext)
  if (context === undefined) {
    throw new Error("useActivos debe usarse dentro de ActivosProvider")
  }
  return context
}
