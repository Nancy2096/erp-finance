"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { mockUsers } from "./mock-data"
import bcrypt from "bcryptjs"

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
}

interface StoredUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  passwordHash: string
}

interface AuthContextType {
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  permissions: RolePermissions | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateCurrentUser: (updates: Partial<CurrentUser>) => void
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  canAccess: (module: keyof RolePermissions, action?: keyof Permission) => boolean
  canAccessRoute: (route: string) => boolean
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Salt rounds para bcrypt
const SALT_ROUNDS = 10
const STORAGE_KEY_USERS = "1d10-secure-users-v4"
const STORAGE_KEY_SESSION = "1d10-current-session"

// Contraseñas específicas por email
const userPasswords: Record<string, string> = {
  "enrique@agency4realestate.com": "Gp3dv67w.",
  "keila@agency4realestate.com": "Keila123!",
  "antonio@agency4realestate.com": "Tony123!",
  "administracion.finanzas@agency4realestate.com": "Admin123!",
}

// Inicializar usuarios con contraseñas hasheadas
const initializeUsers = async (): Promise<StoredUser[]> => {
  // Limpiar versiones anteriores de usuarios
  const oldKeys = ["1d10-secure-users-v1", "1d10-secure-users-v2", "1d10-secure-users-v3"]
  oldKeys.forEach(key => localStorage.removeItem(key))
  
  const saved = localStorage.getItem(STORAGE_KEY_USERS)
  if (saved) {
    try {
      const users = JSON.parse(saved)
      if (Array.isArray(users) && users.length > 0) {
        return users
      }
    } catch {
      // Error parsing, reinicializar
    }
  }
  
  // Crear usuarios con contraseñas específicas por email
  const users: StoredUser[] = await Promise.all(
    mockUsers
      .filter(u => u.status === "active")
      .map(async (u) => {
        const role = (u.role as UserRole) || "viewer"
        // Usar contraseña específica por email o default
        const password = userPasswords[u.email.toLowerCase()] || "User123!"
        const hash = await bcrypt.hash(password, SALT_ROUNDS)
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: role,
          avatar: u.avatar,
          passwordHash: hash
        }
      })
  )
  
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
  return users
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Cargar usuarios y sesión al iniciar
  useEffect(() => {
    const loadAuth = async () => {
      // Inicializar usuarios
      const users = await initializeUsers()
      setStoredUsers(users)
      
      // Cargar sesión actual
      const sessionToken = localStorage.getItem(STORAGE_KEY_SESSION)
      if (sessionToken) {
        try {
          const session = JSON.parse(sessionToken)
          // Verificar que el usuario todavía existe
          const user = users.find(u => u.id === session.userId)
          if (user && session.expiresAt > Date.now()) {
            setCurrentUser({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar
            })
          } else {
            localStorage.removeItem(STORAGE_KEY_SESSION)
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY_SESSION)
        }
      }
      setIsLoaded(true)
    }
    
    loadAuth()
  }, [])

  // Redirigir a login si no hay usuario autenticado (excepto en /login)
  useEffect(() => {
    if (isLoaded && !currentUser && pathname !== "/login") {
      router.push("/login")
    }
  }, [isLoaded, currentUser, pathname, router])

  const permissions = currentUser ? rolePermissions[currentUser.role] : null

  // Login con verificación de contraseña hasheada
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      return { success: false, error: "El correo electrónico no está registrado en el sistema." }
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValidPassword) {
      return { success: false, error: "La contraseña es incorrecta." }
    }
    
    // Crear sesión con expiración de 24 horas
    const session = {
      userId: user.id,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    }
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session))
    
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    })
    
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem(STORAGE_KEY_SESSION)
    router.push("/login")
  }

  const updateCurrentUser = (updates: Partial<CurrentUser>) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    
    // Actualizar en la lista de usuarios almacenados
    const updatedStoredUsers = storedUsers.map(u => 
      u.id === currentUser.id 
        ? { ...u, name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar }
        : u
    )
    setStoredUsers(updatedStoredUsers)
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedStoredUsers))
  }
  
  // Cambiar contraseña
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "No hay usuario autenticado." }
    }
    
    const user = storedUsers.find(u => u.id === currentUser.id)
    if (!user) {
      return { success: false, error: "Usuario no encontrado." }
    }
    
    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      return { success: false, error: "La contraseña actual es incorrecta." }
    }
    
    // Validar nueva contraseña
    if (newPassword.length < 8) {
      return { success: false, error: "La nueva contraseña debe tener al menos 8 caracteres." }
    }
    
    // Hashear nueva contraseña y actualizar
    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
    const updatedStoredUsers = storedUsers.map(u => 
      u.id === currentUser.id ? { ...u, passwordHash: newHash } : u
    )
    setStoredUsers(updatedStoredUsers)
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedStoredUsers))
    
    return { success: true }
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
      updateCurrentUser,
      updatePassword,
      canAccess,
      canAccessRoute,
      isLoaded,
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
