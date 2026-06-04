"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { inversionistas as mockInversionistas, distribuciones as mockDistribuciones } from "./mock-data"
import type { Inversionista, Distribucion } from "./types"

// Version de datos
const DATA_VERSION = "v1"

interface InversionistasContextType {
  inversionistas: Inversionista[]
  distribuciones: Distribucion[]
  isLoaded: boolean
  // Inversionistas
  addInversionista: (inversionista: Omit<Inversionista, "id">) => void
  updateInversionista: (id: string, updates: Partial<Inversionista>) => void
  deleteInversionista: (id: string) => void
  getInversionistaById: (id: string) => Inversionista | undefined
  // Distribuciones
  addDistribucion: (distribucion: Omit<Distribucion, "id">) => void
  updateDistribucion: (id: string, updates: Partial<Distribucion>) => void
  deleteDistribucion: (id: string) => void
  getDistribucionesByInversionista: (inversionistaId: string) => Distribucion[]
}

const InversionistasContext = createContext<InversionistasContextType | undefined>(undefined)

export function InversionistasProvider({ children }: { children: ReactNode }) {
  const [inversionistas, setInversionistas] = useState<Inversionista[]>(mockInversionistas)
  const [distribuciones, setDistribuciones] = useState<Distribucion[]>(mockDistribuciones)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar datos al iniciar
  useEffect(() => {
    const savedVersion = localStorage.getItem("1d10-inversionistas-version")
    if (savedVersion !== DATA_VERSION) {
      localStorage.removeItem("1d10-inversionistas")
      localStorage.removeItem("1d10-distribuciones")
      localStorage.setItem("1d10-inversionistas-version", DATA_VERSION)
    }
    
    // Cargar inversionistas
    const savedInversionistas = localStorage.getItem("1d10-inversionistas")
    if (savedInversionistas) {
      try {
        const parsed = JSON.parse(savedInversionistas)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInversionistas(parsed)
        }
      } catch {
        setInversionistas(mockInversionistas)
      }
    } else {
      localStorage.setItem("1d10-inversionistas", JSON.stringify(mockInversionistas))
    }

    // Cargar distribuciones
    const savedDistribuciones = localStorage.getItem("1d10-distribuciones")
    if (savedDistribuciones) {
      try {
        const parsed = JSON.parse(savedDistribuciones)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDistribuciones(parsed)
        }
      } catch {
        setDistribuciones(mockDistribuciones)
      }
    } else {
      localStorage.setItem("1d10-distribuciones", JSON.stringify(mockDistribuciones))
    }

    setIsLoaded(true)
  }, [])

  // Guardar inversionistas en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("1d10-inversionistas", JSON.stringify(inversionistas))
      window.dispatchEvent(new CustomEvent("inversionistas-updated", { detail: inversionistas }))
    }
  }, [inversionistas, isLoaded])

  // Guardar distribuciones en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("1d10-distribuciones", JSON.stringify(distribuciones))
      window.dispatchEvent(new CustomEvent("distribuciones-updated", { detail: distribuciones }))
    }
  }, [distribuciones, isLoaded])

  // --- Inversionistas ---
  const addInversionista = (inversionistaData: Omit<Inversionista, "id">) => {
    const newInversionista: Inversionista = {
      ...inversionistaData,
      id: `inv-${Date.now()}`,
    }
    setInversionistas(prev => [...prev, newInversionista])
  }

  const updateInversionista = (id: string, updates: Partial<Inversionista>) => {
    setInversionistas(prev =>
      prev.map(inv =>
        inv.id === id ? { ...inv, ...updates } : inv
      )
    )
    // Actualizar el nombre en las distribuciones si cambió
    if (updates.nombre) {
      setDistribuciones(prev =>
        prev.map(dist =>
          dist.inversionistaId === id ? { ...dist, inversionistaNombre: updates.nombre! } : dist
        )
      )
    }
  }

  const deleteInversionista = (id: string) => {
    setInversionistas(prev => prev.filter(inv => inv.id !== id))
    // También eliminar las distribuciones asociadas
    setDistribuciones(prev => prev.filter(dist => dist.inversionistaId !== id))
  }

  const getInversionistaById = (id: string) => {
    return inversionistas.find(inv => inv.id === id)
  }

  // --- Distribuciones ---
  const addDistribucion = (distribucionData: Omit<Distribucion, "id">) => {
    const newDistribucion: Distribucion = {
      ...distribucionData,
      id: `dist-${Date.now()}`,
    }
    setDistribuciones(prev => [...prev, newDistribucion])
  }

  const updateDistribucion = (id: string, updates: Partial<Distribucion>) => {
    setDistribuciones(prev =>
      prev.map(dist =>
        dist.id === id ? { ...dist, ...updates } : dist
      )
    )
  }

  const deleteDistribucion = (id: string) => {
    setDistribuciones(prev => prev.filter(dist => dist.id !== id))
  }

  const getDistribucionesByInversionista = (inversionistaId: string) => {
    return distribuciones.filter(dist => dist.inversionistaId === inversionistaId)
  }

  return (
    <InversionistasContext.Provider value={{
      inversionistas,
      distribuciones,
      isLoaded,
      addInversionista,
      updateInversionista,
      deleteInversionista,
      getInversionistaById,
      addDistribucion,
      updateDistribucion,
      deleteDistribucion,
      getDistribucionesByInversionista,
    }}>
      {children}
    </InversionistasContext.Provider>
  )
}

export function useInversionistas() {
  const context = useContext(InversionistasContext)
  if (context === undefined) {
    throw new Error("useInversionistas must be used within an InversionistasProvider")
  }
  return context
}
