"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Bell, 
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Settings,
  Plus,
  X,
  Check,
  Eye,
  Trash2
} from "lucide-react"
import { mockAlerts } from "@/lib/mock-data"
import { formatDate, formatRelativeTime } from "@/lib/format"

const alertTypes = [
  { id: "payment", name: "Pagos", icon: DollarSign, color: "text-emerald-500" },
  { id: "contract", name: "Contratos", icon: FileText, color: "text-blue-500" },
  { id: "maintenance", name: "Mantenimiento", icon: Building2, color: "text-amber-500" },
  { id: "document", name: "Documentos", icon: FileText, color: "text-purple-500" },
  { id: "system", name: "Sistema", icon: Settings, color: "text-muted-foreground" },
]

const getAlertIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    case "medium":
      return <AlertCircle className="h-5 w-5 text-amber-500" />
    case "low":
      return <Info className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Alta</Badge>
    case "medium":
      return <Badge className="bg-amber-500">Media</Badge>
    case "low":
      return <Badge variant="secondary">Baja</Badge>
    default:
      return <Badge variant="outline">Normal</Badge>
  }
}

export default function AlertasPage() {
  const [filter, setFilter] = useState("all")
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  const unreadAlerts = mockAlerts.filter(a => !a.read)
  const filteredAlerts = mockAlerts.filter(alert => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.read
    return alert.type === filter
  })

  const toggleSelectAlert = (id: string) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
            <p className="text-muted-foreground">
              Centro de notificaciones y avisos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Configuración de Alertas</DialogTitle>
                  <DialogDescription>
                    Personaliza qué alertas deseas recibir
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {alertTypes.map(type => (
                    <div key={type.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <type.icon className={`h-5 w-5 ${type.color}`} />
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Recibir alertas de {type.name.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-medium">Canales de Notificación</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Email</p>
                        <p className="text-xs text-muted-foreground">Recibir por correo electrónico</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Push</p>
                        <p className="text-xs text-muted-foreground">Notificaciones en el navegador</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">SMS</p>
                        <p className="text-xs text-muted-foreground">Solo para alertas críticas</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsConfigOpen(false)}>
                    Guardar Configuración
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {selectedAlerts.length > 0 && (
              <>
                <Button variant="outline" onClick={() => setSelectedAlerts([])}>
                  <Check className="mr-2 h-4 w-4" />
                  Marcar como leídas ({selectedAlerts.length})
                </Button>
                <Button variant="destructive" onClick={() => setSelectedAlerts([])}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
              <BellRing className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                alertas pendientes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockAlerts.filter(a => a.priority === "high" && !a.read).length}
              </div>
              <p className="text-xs text-muted-foreground">
                requieren atención
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAlerts.filter(a => {
                  const today = new Date()
                  const alertDate = new Date(a.createdAt)
                  return alertDate.toDateString() === today.toDateString()
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                alertas nuevas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {mockAlerts.filter(a => a.read).length}
              </div>
              <p className="text-xs text-muted-foreground">
                este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Todas las Alertas</CardTitle>
                <CardDescription>
                  {filteredAlerts.length} alertas encontradas
                </CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="unread">Sin leer</SelectItem>
                  <SelectItem value="payment">Pagos</SelectItem>
                  <SelectItem value="contract">Contratos</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="document">Documentos</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    !alert.read ? "bg-muted/50 border-primary/20" : ""
                  } ${selectedAlerts.includes(alert.id) ? "ring-2 ring-primary" : ""}`}
                >
                  <button
                    onClick={() => toggleSelectAlert(alert.id)}
                    className={`mt-1 h-5 w-5 rounded border flex items-center justify-center ${
                      selectedAlerts.includes(alert.id) 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedAlerts.includes(alert.id) && <Check className="h-3 w-3" />}
                  </button>
                  <div className="mt-0.5">
                    {getAlertIcon(alert.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${!alert.read ? "" : "text-muted-foreground"}`}>
                          {alert.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getPriorityBadge(alert.priority)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                      {!alert.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
