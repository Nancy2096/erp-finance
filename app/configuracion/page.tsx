"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Key,
  CreditCard,
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Upload,
  ImageIcon,
  Trash2,
  Calendar,
  ExternalLink,
  Link2
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCompany } from "@/lib/company-context"

// Icono de Google Drive como componente
const GoogleDriveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
  </svg>
)

// Definir integraciones
const integrationsData = [
  { 
    id: "google-drive",
    name: "Google Drive", 
    icon: GoogleDriveIcon,
    status: "disconnected" as const, 
    desc: "Vincula documentos y archivos desde Google Drive",
    color: "text-blue-600",
    isCustomIcon: true
  },
  { 
    id: "google-calendar",
    name: "Google Calendar", 
    icon: Calendar,
    status: "disconnected" as const, 
    desc: "Sincroniza eventos y recordatorios de pagos",
    color: "text-blue-500"
  },
  { 
    id: "google-mail",
    name: "Google Mail", 
    icon: Mail,
    status: "disconnected" as const, 
    desc: "Envio de notificaciones y reportes por email",
    color: "text-red-500"
  },
  { 
    id: "api-bancaria",
    name: "API Bancaria", 
    icon: CreditCard,
    status: "connected" as const, 
    desc: "Conciliacion de pagos automatica",
    color: "text-emerald-500"
  },
  { 
    id: "contabilidad",
    name: "Sistema Contable", 
    icon: FileText,
    status: "connected" as const, 
    desc: "Exportacion de movimientos y reportes",
    color: "text-amber-500"
  },
]

export default function ConfiguracionPage() {
  const { theme, setTheme } = useTheme()
  const { settings, updateLogo, updateName } = useCompany()
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Estados para integraciones con persistencia
  const [integrations, setIntegrations] = useState(integrationsData)
  const [integrationsLoaded, setIntegrationsLoaded] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrationsData[0] | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [configEmail, setConfigEmail] = useState("")
  const [configApiKey, setConfigApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  // Cargar integraciones de localStorage
  useEffect(() => {
    const saved = localStorage.getItem("1d10-integrations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge con datos base para mantener iconos y colores
        const merged = integrationsData.map(base => {
          const savedItem = parsed.find((s: { id: string }) => s.id === base.id)
          return savedItem ? { ...base, status: savedItem.status } : base
        })
        setIntegrations(merged)
      } catch {
        // Error parsing, usar defaults
      }
    }
    setIntegrationsLoaded(true)
  }, [])

  // Guardar integraciones cuando cambien
  useEffect(() => {
    if (integrationsLoaded) {
      const toSave = integrations.map(i => ({ id: i.id, status: i.status }))
      localStorage.setItem("1d10-integrations", JSON.stringify(toSave))
    }
  }, [integrations, integrationsLoaded])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen valida')
        return
      }
      // Validar tamano (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar 2MB')
        return
      }
      // Convertir a base64 para guardar en localStorage
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        updateLogo(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    updateLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleConfigureIntegration = (integration: typeof integrationsData[0]) => {
    setSelectedIntegration(integration)
    setConfigEmail("")
    setConfigApiKey("")
    setIsConfigOpen(true)
  }

  const handleConnectIntegration = () => {
    if (selectedIntegration) {
      setIsConnecting(true)
      // Simular proceso de conexion
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(i => 
            i.id === selectedIntegration.id 
              ? { ...i, status: "connected" as const }
              : i
          )
        )
        setIsConnecting(false)
        setIsConfigOpen(false)
      }, 1500)
    }
  }

  const handleDisconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(i => 
        i.id === integrationId 
          ? { ...i, status: "disconnected" as const }
          : i
      )
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
            <p className="text-muted-foreground">
              Ajustes generales del sistema
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="billing">Facturación</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Logotipo de la Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Logotipo de la Empresa
                </CardTitle>
                <CardDescription>
                  Sube el logotipo que se mostrara en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Preview del logotipo */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30 overflow-hidden">
                      {settings.logo ? (
                        <Image
                          src={settings.logo}
                          alt="Logotipo de la empresa"
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/50" />
                          <p className="text-xs text-muted-foreground mt-2">Sin logotipo</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Vista previa</p>
                  </div>

                  {/* Controles de carga */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Subir Logotipo</Label>
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Seleccionar Imagen
                        </Button>
                        {settings.logo && (
                          <Button
                            variant="outline"
                            onClick={handleRemoveLogo}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formatos aceptados: PNG, JPG, SVG, WebP. Tamano maximo: 2MB
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <p className="text-sm font-medium mb-2">Donde se mostrara:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          En la parte superior del menu lateral
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          En la pantalla de inicio de sesion
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          En los reportes e informes generados
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informacion de la Empresa
                </CardTitle>
                <CardDescription>
                  Datos generales de la organizacion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
<Label>Nombre de la Empresa</Label>
                        <Input 
                          value={settings.name} 
                          onChange={(e) => updateName(e.target.value)}
                          placeholder="Nombre de tu empresa"
                        />
                  </div>
                  <div className="space-y-2">
                    <Label>RFC</Label>
                    <Input defaultValue="INV123456ABC" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email de Contacto</Label>
                    <Input type="email" defaultValue="contacto@1d10.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input defaultValue="+52 55 1234 5678" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <Textarea 
                    defaultValue="Av. Reforma 123, Col. Juárez, CDMX 06600"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración Regional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español (México)</SelectItem>
                        <SelectItem value="en">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Horaria</Label>
                    <Select defaultValue="america_mexico">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america_mexico">América/México (GMT-6)</SelectItem>
                        <SelectItem value="america_ny">América/New York (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Moneda</Label>
                    <Select defaultValue="mxn">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mxn">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="usd">USD - Dólar Americano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Formato de Fecha</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Año Fiscal Inicia</Label>
                    <Select defaultValue="january">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">Enero</SelectItem>
                        <SelectItem value="april">Abril</SelectItem>
                        <SelectItem value="july">Julio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tema de la Interfaz
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Modo de Color</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "light" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Claro</p>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "dark" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Oscuro</p>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "system" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"
                      }`}
                    >
                      <Monitor className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Sistema</p>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Densidad de la Interfaz</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compacta</SelectItem>
                      <SelectItem value="comfortable">Cómoda</SelectItem>
                      <SelectItem value="spacious">Espaciosa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animaciones</p>
                    <p className="text-sm text-muted-foreground">
                      Habilitar transiciones y animaciones
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sidebar Colapsado por Defecto</p>
                    <p className="text-sm text-muted-foreground">
                      Iniciar con el menú lateral minimizado
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Canales de Notificación</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Correo Electrónico</p>
                          <p className="text-sm text-muted-foreground">
                            Recibir notificaciones por email
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Notificaciones Push</p>
                          <p className="text-sm text-muted-foreground">
                            Alertas en el navegador
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Tipos de Alertas</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Pagos vencidos", desc: "Alertas de pagos pendientes" },
                      { name: "Contratos por vencer", desc: "Aviso antes del vencimiento" },
                      { name: "Nuevos documentos", desc: "Cuando se suben documentos" },
                      { name: "Reportes generados", desc: "Al completar un reporte" },
                      { name: "Actividad de usuarios", desc: "Inicios de sesión y cambios" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad de la Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Autenticación de Dos Factores</p>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Activo</Badge>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Políticas de Contraseña</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Longitud mínima de contraseña</span>
                      <Select defaultValue="12">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8 caracteres</SelectItem>
                          <SelectItem value="10">10 caracteres</SelectItem>
                          <SelectItem value="12">12 caracteres</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Requerir mayúsculas y números</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expiración de contraseña</span>
                      <Select defaultValue="90">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="60">60 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                          <SelectItem value="never">Nunca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Sesiones</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tiempo de inactividad para cerrar sesión</span>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="text-destructive">
                    Cerrar Todas las Sesiones Activas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Integraciones
                </CardTitle>
                <CardDescription>
                  Conecta con servicios externos para automatizar procesos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => {
                  const IconComponent = integration.icon;
                  return (
                  <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-muted ${'isCustomIcon' in integration && integration.isCustomIcon ? '' : integration.color}`}>
                        <IconComponent className={`h-5 w-5 ${'isCustomIcon' in integration && integration.isCustomIcon ? '' : ''}`} />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">{integration.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={integration.status === "connected" ? "default" : "secondary"}
                        className={integration.status === "connected" ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : ""}
                      >
                        {integration.status === "connected" ? (
                          <><CheckCircle2 className="mr-1 h-3 w-3" /> Conectado</>
                        ) : (
                          <><AlertCircle className="mr-1 h-3 w-3" /> Desconectado</>
                        )}
                      </Badge>
                      {integration.status === "connected" ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleConfigureIntegration(integration)}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            Configurar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDisconnectIntegration(integration.id)}
                          >
                            Desconectar
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleConfigureIntegration(integration)}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plan y Facturación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border bg-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-lg">Plan Empresarial</p>
                      <p className="text-sm text-muted-foreground">
                        Usuarios ilimitados, todas las funciones
                      </p>
                    </div>
                    <Badge className="text-lg px-4 py-1">$2,499/mes</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Cambiar Plan</Button>
                    <Button variant="outline">Ver Facturas</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Método de Pago</h4>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa terminada en 4242</p>
                        <p className="text-sm text-muted-foreground">Vence 12/2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Actualizar</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Datos de Facturación</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Razón Social</Label>
                      <Input defaultValue="1D10 Inversiones S.A. de C.V." />
                    </div>
                    <div className="space-y-2">
                      <Label>RFC</Label>
                      <Input defaultValue="INV123456ABC" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email para Facturas</Label>
                    <Input type="email" defaultValue="facturas@1d10.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Configuracion de Integracion */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedIntegration && (
                  <>
                    <selectedIntegration.icon className={`h-5 w-5 ${selectedIntegration.color}`} />
                    {selectedIntegration.status === "connected" ? "Configurar" : "Conectar"} {selectedIntegration.name}
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedIntegration?.status === "connected" 
                  ? "Modifica la configuracion de esta integracion"
                  : "Ingresa los datos necesarios para conectar este servicio"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {selectedIntegration?.id.startsWith("google") ? (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-2">Autenticacion con Google</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Seras redirigido a Google para autorizar el acceso a tu cuenta.
                    </p>
                    <Button className="w-full" onClick={handleConnectIntegration} disabled={isConnecting}>
                      {isConnecting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Conectar con Google
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {selectedIntegration.status === "connected" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm">Cuenta conectada</p>
                          <p className="text-sm text-muted-foreground">usuario@empresa.com</p>
                        </div>
                        <Badge variant="outline" className="text-emerald-600">Activo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Sincronizacion automatica</p>
                          <p className="text-xs text-muted-foreground">Sincronizar cada hora</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input 
                      type="password"
                      placeholder="Ingresa tu API Key"
                      value={configApiKey}
                      onChange={(e) => setConfigApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de notificaciones</Label>
                    <Input 
                      type="email"
                      placeholder="admin@empresa.com"
                      value={configEmail}
                      onChange={(e) => setConfigEmail(e.target.value)}
                    />
                  </div>
                  {selectedIntegration?.status === "connected" && (
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-emerald-500/5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">Conexion activa</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Ultima sync: hace 5 min</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)} disabled={isConnecting}>
                Cancelar
              </Button>
              {!selectedIntegration?.id.startsWith("google") && (
                <Button onClick={handleConnectIntegration} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    selectedIntegration?.status === "connected" ? "Guardar Cambios" : "Conectar"
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
