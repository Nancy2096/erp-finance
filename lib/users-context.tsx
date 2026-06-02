"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { mockUsers } from "./mock-data"

// Version de datos - cambiar para forzar reset de usuarios (solo cuando sea necesario)
const USERS_DATA_VERSION = "v2-alejandra"

export interface SystemUser {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  avatar?: string
  lastAccess?: string
  lastLogin?: string
  createdAt?: string
}

interface UsersContextType {
  users: SystemUser[]
  addUser: (user: Omit<SystemUser, "id">) => void
  updateUser: (id: string, updates: Partial<SystemUser>) => void
  deleteUser: (id: string) => void
  getActiveUsers: () => SystemUser[]
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar usuarios al iniciar
  useEffect(() => {
    // Verificar si necesitamos resetear los datos (cambio de version)
    const savedVersion = localStorage.getItem("1d10-users-version")
    if (savedVersion !== USERS_DATA_VERSION) {
      // Nueva version, resetear con datos correctos
      localStorage.removeItem("1d10-users")
      localStorage.setItem("1d10-users-version", USERS_DATA_VERSION)
    }
    
    const saved = localStorage.getItem("1d10-users")
    if (saved) {
      try {
        const parsedUsers = JSON.parse(saved)
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers)
          setIsLoaded(true)
          return
        }
      } catch {
        // Si hay error, usar defaults
      }
    }
    // Usar mockUsers como datos iniciales (solo la primera vez o despues de reset)
    setUsers(mockUsers)
    localStorage.setItem("1d10-users", JSON.stringify(mockUsers))
    setIsLoaded(true)
  }, [])

  // Guardar en localStorage cuando cambien los usuarios
  useEffect(() => {
    if (isLoaded && users.length > 0) {
      localStorage.setItem("1d10-users", JSON.stringify(users))
      // Disparar evento para que otros componentes se actualicen
      window.dispatchEvent(new CustomEvent("users-updated", { detail: users }))
    }
  }, [users, isLoaded])

  const addUser = (userData: Omit<SystemUser, "id">) => {
    const newUser: SystemUser = {
      ...userData,
      id: `user-${Date.now()}`,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, newUser])
  }

  const updateUser = (id: string, updates: Partial<SystemUser>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ))
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id))
  }

  const getActiveUsers = () => {
    return users.filter(user => user.status === "active")
  }

  return (
    <UsersContext.Provider value={{
      users,
      addUser,
      updateUser,
      deleteUser,
      getActiveUsers,
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}
