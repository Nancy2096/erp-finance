"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  FileText,
  Settings,
  DollarSign,
  Building2,
  Shield,
  Clock,
  ArrowRight,
  RefreshCw,
  Circle,
  Users
} from "lucide-react"
import { useUsers } from "@/lib/users-context"
import { formatDate, formatRelativeTime } from "@/lib/format"

const actionTypes = [
  { id: "create", name: "Creación", color: "bg-emerald-500" },
  { id: "update", name: "Actualización", color: "bg-blue-500" },
  { id: "delete", name: "Eliminación", color: "bg-red-500" },
  { id: "view", name: "Visualización", color: "bg-muted-foreground" },
  { id: "login", name: "Inicio Sesión", color: "bg-purple-500" },
  { id: "export", name: "Exportación", color: "bg-amber-500" },
]

const getActionIcon = (module: string) => {
  switch (module) {
    case "assets":
      return <Building2 className="h-4 w-4" />
    case "payments":
      return <DollarSign className="h-4 w-4" />
    case "documents":
      return <FileText className="h-4 w-4" />
    case "users":
      return <User className="h-4 w-4" />
    case "settings":
      return <Settings className="h-4 w-4" />
    case "auth":
      return <Shield className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

const getActionBadge = (action: string) => {
  const actionConfig = actionTypes.find(a => a.id === action)
  if (!actionConfig) return <Badge variant="outline">{action}</Badge>
  
  return (
    <Badge className={`${actionConfig.color} text-white`}>
      {actionConfig.name}
    </Badge>
  )
}

// Tipo para logs de auditoria
interface AuditLog {
  id: string
  userId: string
  user: string
  avatar: string
  action: string
  module: string
  description: string
  timestamp: string
  ipAddress: string
  details?: string
}

// Tipo para usuario del sistema
interface SystemUserType {
  id: string
  name: string
  avatar?: string
  status: string
}

// Generar logs basados en usuarios activos
const generateLogsFromUsers = (users: SystemUserType[]): AuditLog[] => {
  if (users.length === 0) return []
  
  const actions = [
    { action: "login", module: "auth", desc: "Inicio sesion en el sistema" },
    { action: "view", module: "assets", desc: "Visualizo listado de activos" },
    { action: "view", module: "payments", desc: "Consulto pagos pendientes" },
    { action: "update", module: "assets", desc: "Actualizo informacion de activo" },
    { action: "create", module: "documents", desc: "Subio nuevo documento" },
    { action: "export", module: "assets", desc: "Exporto reporte de activos" },
    { action: "view", module: "users", desc: "Consulto listado de usuarios" },
    { action: "update", module: "settings", desc: "Modifico configuracion del sistema" },
  ]
  
  const logs: AuditLog[] = []
  const now = new Date()
  
  // Generar logs para cada usuario activo
  users.forEach((user, userIndex) => {
    // Cada usuario tiene entre 1-3 acciones recientes
    const numActions = Math.min(3, Math.max(1, 3 - userIndex))
    
    for (let i = 0; i < numActions; i++) {
      const actionIndex = (userIndex + i) % actions.length
      const actionData = actions[actionIndex]
      const minutesAgo = userIndex * 15 + i * 5
      const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000)
      
      logs.push({
        id: `log-${user.id}-${i}`,
        userId: user.id,
        user: user.name,
        avatar: user.avatar || "",
        action: actionData.action,
        module: actionData.module,
        description: actionData.desc,
        timestamp: timestamp.toISOString(),
        ipAddress: `192.168.1.${100 + userIndex}`,
        details: i === 0 ? undefined : `Accion realizada desde panel principal`
      })
    }
  })
  
  // Ordenar por timestamp descendente (mas reciente primero)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export default function BitacoraPage() {
  const { users, getActiveUsers } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterModule, setFilterModule] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  
  // Obtener usuarios activos del contexto
  const activeUsers = getActiveUsers()
  
  // Generar logs cuando cambien los usuarios
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  
  useEffect(() => {
    if (activeUsers.length > 0) {
      setAuditLogs(generateLogsFromUsers(activeUsers))
    }
  }, [activeUsers])

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesModule = filterModule === "all" || log.module === filterModule
    return matchesSearch && matchesAction && matchesModule
  })

  const todayLogs = auditLogs.filter(log => {
    const today = new Date()
    const logDate = new Date(log.timestamp)
    return logDate.toDateString() === today.toDateString()
  }).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bitácora</h1>
            <p className="text-muted-foreground">
              Registro de actividades y auditoría del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                en el sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLogs}</div>
              <p className="text-xs text-muted-foreground">
                actividades registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {activeUsers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                en el sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Última Actividad</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hace 2m</div>
              <p className="text-xs text-muted-foreground">
                último registro
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usuarios Activos en el Sistema */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuarios Activos en el Sistema
                </CardTitle>
                <CardDescription>
                  Usuarios con sesion activa actualmente
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                <Circle className="h-2 w-2 mr-1 fill-emerald-500 text-emerald-500" />
                {activeUsers.length} en linea
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {activeUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No hay usuarios activos en este momento</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activeUsers.map((user) => {
                  const role = user.role === "admin" ? "Administrador" 
                    : user.role === "manager" ? "Gerente" 
                    : user.role === "analyst" ? "Analista" 
                    : user.role === "viewer" ? "Visualizador" 
                    : "Usuario"
                  
                  return (
                    <div 
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{role}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar en bitácora..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  {actionTypes.map(action => (
                    <SelectItem key={action.id} value={action.id}>{action.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los módulos</SelectItem>
                  <SelectItem value="assets">Activos</SelectItem>
                  <SelectItem value="payments">Pagos</SelectItem>
                  <SelectItem value="documents">Documentos</SelectItem>
                  <SelectItem value="users">Usuarios</SelectItem>
                  <SelectItem value="settings">Configuración</SelectItem>
                  <SelectItem value="auth">Autenticación</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="Desde"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registro de Actividades</CardTitle>
                <CardDescription>
                  {filteredLogs.length} registros encontrados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={log.avatar} />
                        <AvatarFallback>
                          {log.user.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background border">
                        {getActionIcon(log.module)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{log.user}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getActionBadge(log.action)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(log.timestamp)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.module}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          IP: {log.ipAddress}
                        </span>
                      </div>
                      {log.details && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm">
                          <p className="text-muted-foreground flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            {log.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mostrando 1-{Math.min(filteredLogs.length, 10)} de {filteredLogs.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
