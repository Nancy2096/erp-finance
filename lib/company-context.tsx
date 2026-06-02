"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CompanySettings {
  name: string
  logo: string | null
}

interface CompanyContextType {
  settings: CompanySettings
  updateLogo: (logo: string | null) => void
  updateName: (name: string) => void
  isLoaded: boolean
}

// Ruta del logo por defecto
const DEFAULT_LOGO_PATH = "/logo.png"

const defaultSettings: CompanySettings = {
  name: "Capital 1D10",
  logo: DEFAULT_LOGO_PATH,
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar configuracion de localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("company-settings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Si tiene un logo guardado, usarlo; si no, usar el default
        if (!parsed.logo) {
          parsed.logo = DEFAULT_LOGO_PATH
        }
        setSettings(parsed)
      } catch {
        // Si hay error, usar valores por defecto
        setSettings(defaultSettings)
      }
    }
    // Si no hay nada guardado, usar defaults (ya estan seteados)
    setIsLoaded(true)
  }, [])

  // Guardar en localStorage cuando cambie (solo despues de cargar)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("company-settings", JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  const updateLogo = (logo: string | null) => {
    setSettings(prev => ({ ...prev, logo }))
  }

  const updateName = (name: string) => {
    setSettings(prev => ({ ...prev, name }))
  }

  return (
    <CompanyContext.Provider value={{ settings, updateLogo, updateName, isLoaded }}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}
