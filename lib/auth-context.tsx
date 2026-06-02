"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { mockUsers } from "./mock-data"

// Definicion de roles y sus permisos
export type UserRole = "admin" | "manager" | "analyst" | "viewer"

export interface Permission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export interface RolePermissions {
  dashboard: Permission
  activos: Permission
  pagos: Permission
  dividendos: Permission
  inversionistas: Permission
  finanzas: Permission
  informes: Permission
  proyecciones: Permission
  documentos: Permission
  alertas: Permission
  usuarios: Permission
  bitacora: Permission
  configuracion: Permission
}

// Permisos por rol
const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    activos: { view: true, create: true, edit: true, delete: true },
    pagos: { view: true, create: true, edit: true, delete: true },
    dividendos: { view: true, create: true, edit: true, delete: true },
    inversionistas: { view: true, create: true, edit: true, delete: true },
    finanzas: { view: true, create: true, edit: true, delete: true },
    informes: { view: true, create: true, edit: true, delete: true },
    proyecciones: { view: true, create: true, edit: true, delete: true },
    documentos: { view: true, create: true, edit: true, delete: true },
    alertas: { view: true, create: true, edit: true, delete: true },
    usuarios: { view: true, create: true, edit: true, delete: true },
    bitacora: { view: true, create: false, edit: false, delete: false },
    configuracion: { view: true, create: true, edit: true, delete: true },
  },
  manager: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    activos: { view: true, create: true, edit: true, delete: false },
    pagos: { view: true, create: true, edit: true, delete: false },
    dividendos: { view: true, create: true, edit: true, delete: false },
    inversionistas: { view: true, create: true, edit: true, delete: false },
    finanzas: { view: true, create: true, edit: true, delete: false },
    informes: { view: true, create: true, edit: false, delete: false },
    proyecciones: { view: true, create: true, edit: true, delete: false },
    documentos: { view: true, create: true, edit: true, delete: false },
    alertas: { view: true, create: true, edit: true, delete: false },
    usuarios: { view: false, create: false, edit: false, delete: false },
    bitacora: { view: true, create: false, edit: false, delete: false },
    configuracion: { view: false, create: false, edit: false, delete: false },
  },
  analyst: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    activos: { view: true, create: false, edit: false, delete: false },
    pagos: { view: true, create: false, edit: false, delete: false },
    dividendos: { view: true, create: false, edit: false, delete: false },
    inversionistas: { view: true, create: false, edit: false, delete: false },
    finanzas: { view: true, create: false, edit: false, delete: false },
    informes: { view: true, create: true, edit: false, delete: false },
    proyecciones: { view: true, create: true, edit: false, delete: false },
    documentos: { view: true, create: false, edit: false, delete: false },
    alertas: { view: true, create: false, edit: false, delete: false },
    usuarios: { view: false, create: false, edit: false, delete: false },
    bitacora: { view: false, create: false, edit: false, delete: false },
    configuracion: { view: false, create: false, edit: false, delete: false },
  },
  viewer: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    activos: { view: true, create: false, edit: false, delete: false },
    pagos: { view: true, create: false, edit: false, delete: false },
    dividendos: { view: true, create: false, edit: false, delete: false },
    inversionistas: { view: true, create: false, edit: false, delete: false },
    finanzas: { view: true, create: false, edit: false, delete: false },
    informes: { view: true, create: false, edit: false, delete: false },
    proyecciones: { view: true, create: false, edit: false, delete: false },
    documentos: { view: true, create: false, edit: false, delete: false },
    alertas: { view: true, create: false, edit: false, delete: false },
    usuarios: { view: false, create: false, edit: false, delete: false },
    bitacora: { view: false, create: false, edit: false, delete: false },
    configuracion: { view: false, create: false, edit: false, delete: false },
  },
}

// Mapeo de rutas a modulos
const routeToModule: Record<string, keyof RolePermissions> = {
  "/": "dashboard",
  "/activos": "activos",
  "/activos/nuevo": "activos",
  "/pagos": "pagos",
  "/dividendos": "dividendos",
  "/inversionistas": "inversionistas",
  "/finanzas": "finanzas",
  "/informes": "informes",
  "/proyecciones": "proyecciones",
  "/documentos": "documentos",
  "/alertas": "alertas",
  "/usuarios": "usuarios",
  "/bitacora": "bitacora",
  "/configuracion": "configuracion",
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  password?: string
}

interface AuthContextType {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  permissions: RolePermissions | null
  login: (user: CurrentUser) => void
  logout: () => void
  switchUser: (userId: string) => void
  updateCurrentUser: (updates: Partial<CurrentUser>) => void
  canAccess: (module: keyof RolePermissions, action?: keyof Permission) => boolean
  canAccessRoute: (route: string) => boolean
  availableUsers: CurrentUser[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convertir mockUsers a formato de autenticacion
const getDefaultUsers = (): CurrentUser[] => {
  return mockUsers
    .filter(u => u.status === "active")
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.role as UserRole) || "viewer",
      avatar: u.avatar,
      password: "password123"
    }))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  // Inicializar con usuarios por defecto inmediatamente
  const [availableUsers, setAvailableUsers] = useState<CurrentUser[]>(() => getDefaultUsers())
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Cargar usuarios de localStorage o usar defaults
  const loadUsersFromStorage = () => {
    const saved = localStorage.getItem("1d10-users")
    if (saved) {
      try {
        const parsedUsers = JSON.parse(saved)
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          const authUsers: CurrentUser[] = parsedUsers
            .filter((u: { status?: string }) => u.status === "active")
            .map((u: { id: string; name: string; email: string; role: string; avatar?: string }) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: (u.role as UserRole) || "viewer",
              avatar: u.avatar,
              password: "password123"
            }))
          if (authUsers.length > 0) {
            setAvailableUsers(authUsers)
            return
          }
        }
      } catch {
        // Error parsing, usar defaults
      }
    }
    // Solo si no hay datos en localStorage, usar defaults (primera vez)
    const defaults = getDefaultUsers()
    setAvailableUsers(defaults)
    // Solo guardar si no existe nada en localStorage
    if (!localStorage.getItem("1d10-users")) {
      localStorage.setItem("1d10-users", JSON.stringify(mockUsers))
    }
  }

  // Cargar usuario actual y lista de usuarios
  useEffect(() => {
    // Cargar usuarios disponibles
    loadUsersFromStorage()
    
    // Cargar sesion actual
    const saved = localStorage.getItem("1d10-current-user")
    if (saved) {
      try {
        const user = JSON.parse(saved)
        setCurrentUser(user)
      } catch {
        setCurrentUser(null)
      }
    } else {
      setCurrentUser(null)
    }
    setIsLoaded(true)
    
    // Escuchar cambios en localStorage de usuarios (desde otras pestanas)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "1d10-users") {
        loadUsersFromStorage()
      }
    }
    
    // Escuchar evento personalizado de actualizacion de usuarios (misma pestana)
    const handleUsersUpdated = (e: CustomEvent) => {
      const updatedUsers = e.detail
      if (Array.isArray(updatedUsers) && updatedUsers.length > 0) {
        const authUsers: CurrentUser[] = updatedUsers
          .filter((u: { status?: string }) => u.status === "active")
          .map((u: { id: string; name: string; email: string; role: string; avatar?: string }) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role as UserRole) || "viewer",
            avatar: u.avatar,
            password: "password123"
          }))
        setAvailableUsers(authUsers)
      }
    }
    
    window.addEventListener("storage", handleStorage)
    window.addEventListener("users-updated", handleUsersUpdated as EventListener)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("users-updated", handleUsersUpdated as EventListener)
    }
  }, [])

  // Redirigir a login si no hay usuario autenticado (excepto en /login)
  useEffect(() => {
    if (isLoaded && !currentUser && pathname !== "/login") {
      router.push("/login")
    }
  }, [isLoaded, currentUser, pathname, router])

  // Guardar usuario en localStorage
  useEffect(() => {
    if (isLoaded && currentUser) {
      localStorage.setItem("1d10-current-user", JSON.stringify(currentUser))
    }
  }, [currentUser, isLoaded])

  const permissions = currentUser ? rolePermissions[currentUser.role] : null

  const login = (user: CurrentUser) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("1d10-current-user")
    router.push("/login")
  }

  const switchUser = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const updateCurrentUser = (updates: Partial<CurrentUser>) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    
    // Actualizar en la lista de usuarios disponibles
    setAvailableUsers(prev => 
      prev.map(u => u.id === currentUser.id ? updatedUser : u)
    )
    
    // Actualizar en localStorage (1d10-users)
    const savedUsers = localStorage.getItem("1d10-users")
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers)
        const updatedUsers = parsedUsers.map((u: { id: string }) => 
          u.id === currentUser.id 
            ? { ...u, name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar }
            : u
        )
        localStorage.setItem("1d10-users", JSON.stringify(updatedUsers))
      } catch {
        // Error al actualizar
      }
    }
  }

  const canAccess = (module: keyof RolePermissions, action: keyof Permission = "view"): boolean => {
    if (!permissions) return false
    return permissions[module]?.[action] ?? false
  }

  const canAccessRoute = (route: string): boolean => {
    if (!permissions) return false
    const module = routeToModule[route]
    if (!module) return true // Rutas no mapeadas se permiten
    return permissions[module]?.view ?? false
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      permissions,
      login,
      logout,
      switchUser,
      updateCurrentUser,
      canAccess,
      canAccessRoute,
      availableUsers,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { rolePermissions, routeToModule }
