"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Printer,
  Mail,
  Clock,
  CheckCircle2,
  Building2,
  DollarSign,
  Users,
  Receipt,
  X
} from "lucide-react"
import { activos, inversionistas, movimientos, kpiData } from "@/lib/mock-data"
import { formatCurrency, formatPercent, formatDate } from "@/lib/format"

export default function InformesPage() {
  const [selectedAsset, setSelectedAsset] = useState<string>("all")
  const [activeReport, setActiveReport] = useState<string>("financial")
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  
  const limpiarFiltroFechas = () => {
    setFechaInicio("")
    setFechaFin("")
  }
  
  const hayFiltroFechas = fechaInicio || fechaFin
  
  // Obtener label del periodo
  const getPeriodLabel = () => {
    if (fechaInicio && fechaFin) {
      return `${new Date(fechaInicio).toLocaleDateString('es-MX')} - ${new Date(fechaFin).toLocaleDateString('es-MX')}`
    } else if (fechaInicio) {
      return `Desde ${new Date(fechaInicio).toLocaleDateString('es-MX')}`
    } else if (fechaFin) {
      return `Hasta ${new Date(fechaFin).toLocaleDateString('es-MX')}`
    }
    return "Periodo actual"
  }

  // Filtrar datos segun activo seleccionado
  const filteredActivos = selectedAsset === "all" 
    ? activos 
    : activos.filter(a => a.id === selectedAsset)

  const totalValorActivos = filteredActivos.reduce((sum, a) => sum + (a.valorTotal || 0), 0)
  
  // Calculos financieros (simulados, ajustados por activo)
  const factorActivo = selectedAsset === "all" ? 1 : 0.25
  const ingresos = Math.round(12850000 * factorActivo)
  const egresos = Math.round(4120000 * factorActivo)
  const utilidadBruta = ingresos - egresos
  const impuestos = Math.round(utilidadBruta * 0.30)
  const utilidadNeta = utilidadBruta - impuestos
  
  // EBITDA
  const costosOperativos = Math.round(3200000 * factorActivo)
  const gastosAdmin = Math.round(920000 * factorActivo)
  const ebitda = ingresos - costosOperativos - gastosAdmin
  const depreciacion = Math.round(1200000 * factorActivo)
  const amortizacion = Math.round(350000 * factorActivo)
  const ebit = ebitda - depreciacion - amortizacion
  const margenEbitda = ingresos > 0 ? (ebitda / ingresos) * 100 : 0

  const reportTabs = [
    { id: "financial", name: "Estado Financiero", icon: BarChart3, color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20", description: "Ingresos y egresos" },
    { id: "balance", name: "Balance General", icon: FileSpreadsheet, color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20", description: "Activos y pasivos" },
    { id: "cashflow", name: "Flujo de Caja", icon: DollarSign, color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20", description: "Movimientos de efectivo" },
    { id: "equity", name: "Cambios Patrimonio", icon: PieChart, color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20", description: "Capital y utilidades" },
    { id: "ebitda", name: "EBITDA", icon: TrendingUp, color: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20", description: "Rendimiento operativo" },
    { id: "assets", name: "Valuacion Activos", icon: Building2, color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20", description: "Valor de propiedades" },
    { id: "investors", name: "Inversionistas", icon: Users, color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20", description: "Distribucion capital" },
    { id: "tax", name: "Fiscal", icon: Receipt, color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20", description: "Obligaciones tributarias" },
  ]
  
  // Datos para Balance General
  const activosCorrientes = Math.round(15200000 * factorActivo)
  const activosNoCorrientes = Math.round(totalValorActivos * 0.85)
  const totalActivosBalance = activosCorrientes + activosNoCorrientes
  const pasivosCorrientes = Math.round(4800000 * factorActivo)
  const pasivosNoCorrientes = Math.round(12500000 * factorActivo)
  const totalPasivos = pasivosCorrientes + pasivosNoCorrientes
  const capitalSocial = Math.round(25000000 * factorActivo)
  const utilidadesRetenidas = Math.round(8900000 * factorActivo)
  const utilidadEjercicio = utilidadNeta
  const totalPatrimonio = capitalSocial + utilidadesRetenidas + utilidadEjercicio
  
  // Datos para Flujo de Caja
  const flujoOperativo = Math.round(9200000 * factorActivo)
  const flujoInversion = Math.round(-3500000 * factorActivo)
  const flujoFinanciamiento = Math.round(-2100000 * factorActivo)
  const flujoNeto = flujoOperativo + flujoInversion + flujoFinanciamiento
  const saldoInicial = Math.round(8500000 * factorActivo)
  const saldoFinal = saldoInicial + flujoNeto

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Informes Financieros</h1>
            <p className="text-muted-foreground">
              Visualizacion de reportes en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Filtro de Rango de Fechas */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Fecha Inicio</Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="h-9 w-[150px]"
                />
              </div>
              <span className="text-muted-foreground mt-5">a</span>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Fecha Fin</Label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="h-9 w-[150px]"
                />
              </div>
            </div>
            {hayFiltroFechas && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mt-5"
                onClick={limpiarFiltroFechas}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Seleccionar activo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Activos (Consolidado)</SelectItem>
                <Separator className="my-1" />
                {activos.map((activo) => (
                  <SelectItem key={activo.id} value={activo.id}>
                    {activo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {hayFiltroFechas && (
            <Badge variant="outline" className="gap-1 py-1.5">
              <Calendar className="h-3 w-3" />
              {getPeriodLabel()}
            </Badge>
          )}
        </div>

        {/* Menu de Reportes - Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {reportTabs.map((tab) => {
            const isActive = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  isActive 
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                    : "border-transparent bg-card hover:border-muted-foreground/20 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-3 rounded-lg transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : tab.color
                )}>
                  <tab.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-medium leading-tight",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {tab.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenido de Reportes */}
        <div className="space-y-6">
          {/* ESTADO FINANCIERO */}
          {activeReport === "financial" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Estado de Resultados</p>
              <p className="text-sm text-muted-foreground">
                Periodo: {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Ingresos Totales</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(ingresos)}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.5% vs periodo anterior
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Egresos Totales</div>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(egresos)}</div>
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    -2.1% vs periodo anterior
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Utilidad Bruta</div>
                  <div className="text-2xl font-bold">{formatCurrency(utilidadBruta)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margen: {((utilidadBruta / ingresos) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Utilidad Neta</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(utilidadNeta)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Margen neto: {((utilidadNeta / ingresos) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tablas de detalle */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Ingresos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-2">Concepto</th>
                        <th className="pb-2 text-right">Monto</th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="py-2">Rentas comerciales</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(ingresos * 0.56))}</td>
                        <td className="py-2 text-right">56.0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Rentas residenciales</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(ingresos * 0.30))}</td>
                        <td className="py-2 text-right">30.0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Estacionamientos</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(ingresos * 0.093))}</td>
                        <td className="py-2 text-right">9.3%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Otros ingresos</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(ingresos * 0.047))}</td>
                        <td className="py-2 text-right">4.7%</td>
                      </tr>
                      <tr className="font-semibold bg-emerald-500/5">
                        <td className="py-2">Total Ingresos</td>
                        <td className="py-2 text-right text-emerald-600">{formatCurrency(ingresos)}</td>
                        <td className="py-2 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Egresos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-2">Concepto</th>
                        <th className="pb-2 text-right">Monto</th>
                        <th className="pb-2 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="py-2">Mantenimiento</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.352))}</td>
                        <td className="py-2 text-right">35.2%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Administracion</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.238))}</td>
                        <td className="py-2 text-right">23.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Seguros</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.158))}</td>
                        <td className="py-2 text-right">15.8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Servicios</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.131))}</td>
                        <td className="py-2 text-right">13.1%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Otros gastos</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.121))}</td>
                        <td className="py-2 text-right">12.1%</td>
                      </tr>
                      <tr className="font-semibold bg-red-500/5">
                        <td className="py-2">Total Egresos</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(egresos)}</td>
                        <td className="py-2 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Resumen final */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <table className="w-full max-w-md mx-auto">
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 font-medium">Utilidad Bruta</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(utilidadBruta)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-muted-foreground">(-) Impuestos (30%)</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(impuestos)}</td>
                    </tr>
                    <tr className="text-xl font-bold">
                      <td className="py-4">Utilidad Neta</td>
                      <td className="py-4 text-right text-emerald-600">{formatCurrency(utilidadNeta)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          )}

          {/* BALANCE GENERAL */}
          {activeReport === "balance" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Balance General</p>
              <p className="text-sm text-muted-foreground">
                Al cierre de {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* ACTIVOS */}
              <Card>
                <CardHeader className="bg-blue-500/5">
                  <CardTitle className="text-lg">ACTIVOS</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="font-semibold border-b">
                        <td className="py-2">Activos Corrientes</td>
                        <td className="py-2 text-right"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Efectivo y equivalentes</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosCorrientes * 0.45))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Cuentas por cobrar</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosCorrientes * 0.35))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Otros activos corrientes</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosCorrientes * 0.20))}</td>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Total Activos Corrientes</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(activosCorrientes)}</td>
                      </tr>
                      <tr className="font-semibold border-b pt-4">
                        <td className="py-2 pt-4">Activos No Corrientes</td>
                        <td className="py-2 text-right"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Propiedades de inversion</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosNoCorrientes * 0.82))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Propiedades, planta y equipo</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosNoCorrientes * 0.12))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Otros activos no corrientes</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(activosNoCorrientes * 0.06))}</td>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Total Activos No Corrientes</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(activosNoCorrientes)}</td>
                      </tr>
                      <tr className="bg-blue-500/10 text-lg font-bold">
                        <td className="py-3">TOTAL ACTIVOS</td>
                        <td className="py-3 text-right text-blue-600">{formatCurrency(totalActivosBalance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* PASIVOS Y PATRIMONIO */}
              <Card>
                <CardHeader className="bg-amber-500/5">
                  <CardTitle className="text-lg">PASIVOS Y PATRIMONIO</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="font-semibold border-b">
                        <td className="py-2">Pasivos Corrientes</td>
                        <td className="py-2 text-right"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Cuentas por pagar</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(pasivosCorrientes * 0.45))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Impuestos por pagar</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(pasivosCorrientes * 0.30))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Obligaciones corto plazo</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(pasivosCorrientes * 0.25))}</td>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Total Pasivos Corrientes</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(pasivosCorrientes)}</td>
                      </tr>
                      <tr className="font-semibold border-b">
                        <td className="py-2 pt-4">Pasivos No Corrientes</td>
                        <td className="py-2 text-right"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Prestamos bancarios LP</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(pasivosNoCorrientes * 0.75))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Otros pasivos LP</td>
                        <td className="py-2 text-right">{formatCurrency(Math.round(pasivosNoCorrientes * 0.25))}</td>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <td className="py-2 font-medium">Total Pasivos No Corrientes</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(pasivosNoCorrientes)}</td>
                      </tr>
                      <tr className="border-b bg-red-500/5">
                        <td className="py-2 font-semibold">TOTAL PASIVOS</td>
                        <td className="py-2 text-right font-semibold text-red-600">{formatCurrency(totalPasivos)}</td>
                      </tr>
                      <tr className="font-semibold border-b">
                        <td className="py-2 pt-4">Patrimonio</td>
                        <td className="py-2 text-right"></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Capital social</td>
                        <td className="py-2 text-right">{formatCurrency(capitalSocial)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Utilidades retenidas</td>
                        <td className="py-2 text-right">{formatCurrency(utilidadesRetenidas)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pl-4 text-muted-foreground">Utilidad del ejercicio</td>
                        <td className="py-2 text-right">{formatCurrency(utilidadEjercicio)}</td>
                      </tr>
                      <tr className="border-b bg-emerald-500/10">
                        <td className="py-2 font-semibold">TOTAL PATRIMONIO</td>
                        <td className="py-2 text-right font-semibold text-emerald-600">{formatCurrency(totalPatrimonio)}</td>
                      </tr>
                      <tr className="bg-amber-500/10 text-lg font-bold">
                        <td className="py-3">TOTAL PASIVO + PATRIMONIO</td>
                        <td className="py-3 text-right text-amber-600">{formatCurrency(totalPasivos + totalPatrimonio)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Ecuacion contable */}
            <Card className="bg-muted/30">
              <CardContent className="py-6">
                <div className="flex items-center justify-center gap-4 text-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(totalActivosBalance)}</p>
                  </div>
                  <span className="text-2xl">=</span>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Pasivos</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(totalPasivos)}</p>
                  </div>
                  <span className="text-2xl">+</span>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Patrimonio</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalPatrimonio)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* FLUJO DE CAJA */}
          {activeReport === "cashflow" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Estado de Flujo de Efectivo</p>
              <p className="text-sm text-muted-foreground">
                Periodo: {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs Flujo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Saldo Inicial</div>
                  <div className="text-2xl font-bold">{formatCurrency(saldoInicial)}</div>
                </CardContent>
              </Card>
              <Card className={flujoNeto >= 0 ? "border-emerald-500/30" : "border-red-500/30"}>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Flujo Neto</div>
                  <div className={`text-2xl font-bold ${flujoNeto >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatCurrency(flujoNeto)}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Saldo Final</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(saldoFinal)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Variacion</div>
                  <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${flujoNeto >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {flujoNeto >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    {((flujoNeto / saldoInicial) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalle de flujos */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="bg-emerald-500/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Actividades Operativas
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Cobros de clientes</td>
                        <td className="py-2 text-right text-emerald-600">+{formatCurrency(Math.round(flujoOperativo * 1.2))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Pagos a proveedores</td>
                        <td className="py-2 text-right text-red-600">-{formatCurrency(Math.round(flujoOperativo * 0.15))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Pagos de nomina</td>
                        <td className="py-2 text-right text-red-600">-{formatCurrency(Math.round(flujoOperativo * 0.05))}</td>
                      </tr>
                      <tr className="font-semibold bg-emerald-500/10">
                        <td className="py-2">Flujo Operativo</td>
                        <td className="py-2 text-right text-emerald-600">{formatCurrency(flujoOperativo)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-blue-500/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Actividades de Inversion
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Compra de activos</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(Math.round(flujoInversion * 0.7))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Mejoras inmuebles</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(Math.round(flujoInversion * 0.3))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Venta de activos</td>
                        <td className="py-2 text-right text-emerald-600">+{formatCurrency(0)}</td>
                      </tr>
                      <tr className="font-semibold bg-blue-500/10">
                        <td className="py-2">Flujo de Inversion</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(flujoInversion)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-purple-500/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    Actividades de Financiamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Pago dividendos</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(Math.round(flujoFinanciamiento * 0.6))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Pago prestamos</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(Math.round(flujoFinanciamiento * 0.4))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Nuevos prestamos</td>
                        <td className="py-2 text-right text-emerald-600">+{formatCurrency(0)}</td>
                      </tr>
                      <tr className="font-semibold bg-purple-500/10">
                        <td className="py-2">Flujo Financiamiento</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(flujoFinanciamiento)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Resumen final */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <table className="w-full max-w-lg mx-auto text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Saldo inicial de efectivo</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(saldoInicial)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4 text-emerald-600">(+) Flujo de operaciones</td>
                      <td className="py-2 text-right text-emerald-600">+{formatCurrency(flujoOperativo)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4 text-red-600">(-) Flujo de inversiones</td>
                      <td className="py-2 text-right text-red-600">{formatCurrency(flujoInversion)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pl-4 text-red-600">(-) Flujo de financiamiento</td>
                      <td className="py-2 text-right text-red-600">{formatCurrency(flujoFinanciamiento)}</td>
                    </tr>
                    <tr className="text-lg font-bold">
                      <td className="py-3">Saldo final de efectivo</td>
                      <td className="py-3 text-right text-primary">{formatCurrency(saldoFinal)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
</div>
          )}

          {/* CAMBIOS EN PATRIMONIO */}
          {activeReport === "equity" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Estado de Cambios en el Patrimonio</p>
              <p className="text-sm text-muted-foreground">
                Periodo: {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs Patrimonio */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Capital Social</div>
                  <div className="text-2xl font-bold">{formatCurrency(capitalSocial)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Utilidades Retenidas</div>
                  <div className="text-2xl font-bold">{formatCurrency(utilidadesRetenidas)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Resultado Ejercicio</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(utilidadEjercicio)}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Total Patrimonio</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPatrimonio)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de movimientos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movimientos del Periodo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 font-semibold">Concepto</th>
                        <th className="py-3 text-right font-semibold">Capital Social</th>
                        <th className="py-3 text-right font-semibold">Reserva Legal</th>
                        <th className="py-3 text-right font-semibold">Util. Retenidas</th>
                        <th className="py-3 text-right font-semibold">Resultado Ejerc.</th>
                        <th className="py-3 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-muted/30">
                        <td className="py-3 font-medium">Saldo inicial</td>
                        <td className="py-3 text-right">{formatCurrency(capitalSocial)}</td>
                        <td className="py-3 text-right">{formatCurrency(Math.round(capitalSocial * 0.05))}</td>
                        <td className="py-3 text-right">{formatCurrency(Math.round(utilidadesRetenidas * 0.85))}</td>
                        <td className="py-3 text-right">{formatCurrency(Math.round(utilidadesRetenidas * 0.15))}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(Math.round(totalPatrimonio * 0.88))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pl-4 text-muted-foreground">Aportaciones de capital</td>
                        <td className="py-3 text-right text-emerald-600">+{formatCurrency(0)}</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-emerald-600">+{formatCurrency(0)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pl-4 text-muted-foreground">Transferencia a reserva legal</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-emerald-600">+{formatCurrency(Math.round(utilidadEjercicio * 0.05))}</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-red-600">-{formatCurrency(Math.round(utilidadEjercicio * 0.05))}</td>
                        <td className="py-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pl-4 text-muted-foreground">Dividendos decretados</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-red-600">-{formatCurrency(Math.round(utilidadesRetenidas * 0.15))}</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-red-600">-{formatCurrency(Math.round(utilidadesRetenidas * 0.15))}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 pl-4 text-muted-foreground">Utilidad del periodo</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right">-</td>
                        <td className="py-3 text-right text-emerald-600">+{formatCurrency(utilidadNeta)}</td>
                        <td className="py-3 text-right text-emerald-600">+{formatCurrency(utilidadNeta)}</td>
                      </tr>
                      <tr className="bg-emerald-500/10 font-bold">
                        <td className="py-3">Saldo final</td>
                        <td className="py-3 text-right">{formatCurrency(capitalSocial)}</td>
                        <td className="py-3 text-right">{formatCurrency(Math.round(capitalSocial * 0.05) + Math.round(utilidadEjercicio * 0.05))}</td>
                        <td className="py-3 text-right">{formatCurrency(utilidadesRetenidas - Math.round(utilidadesRetenidas * 0.15))}</td>
                        <td className="py-3 text-right">{formatCurrency(utilidadEjercicio + utilidadNeta - Math.round(utilidadEjercicio * 0.05))}</td>
                        <td className="py-3 text-right text-emerald-600">{formatCurrency(totalPatrimonio)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Grafico de composicion */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Composicion del Patrimonio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capital Social</span>
                      <span>{((capitalSocial / totalPatrimonio) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(capitalSocial / totalPatrimonio) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilidades Retenidas</span>
                      <span>{((utilidadesRetenidas / totalPatrimonio) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${(utilidadesRetenidas / totalPatrimonio) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resultado del Ejercicio</span>
                      <span>{((utilidadEjercicio / totalPatrimonio) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(utilidadEjercicio / totalPatrimonio) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* EBITDA */}
          {activeReport === "ebitda" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Analisis de EBITDA</p>
              <p className="text-sm text-muted-foreground">
                Periodo: {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs EBITDA */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-2 border-cyan-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">EBITDA</div>
                  <div className="text-3xl font-bold text-cyan-600">{formatCurrency(ebitda)}</div>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +12.5% vs periodo anterior
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Margen EBITDA</div>
                  <div className="text-3xl font-bold">{margenEbitda.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Objetivo: 65%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">EBIT</div>
                  <div className="text-3xl font-bold">{formatCurrency(ebit)}</div>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +8.3% vs periodo anterior
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculo EBITDA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculo del EBITDA</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full max-w-2xl">
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 font-medium">Ingresos Operativos</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(ingresos)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Costos Operativos</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(costosOperativos)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Gastos de Administracion</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(gastosAdmin)}</td>
                    </tr>
                    <tr className="border-b bg-cyan-500/10">
                      <td className="py-3 font-bold text-cyan-700">= EBITDA</td>
                      <td className="py-3 text-right font-bold text-cyan-700">{formatCurrency(ebitda)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Depreciacion</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(depreciacion)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Amortizacion</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(amortizacion)}</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="py-3 font-bold">= EBIT (Utilidad Operativa)</td>
                      <td className="py-3 text-right font-bold">{formatCurrency(ebit)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Comparativo trimestral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparativo Trimestral</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-2">Periodo</th>
                      <th className="pb-2 text-right">EBITDA</th>
                      <th className="pb-2 text-right">Margen</th>
                      <th className="pb-2 text-right">Variacion</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-2">Q1 2024</td>
                      <td className="py-2 text-right">{formatCurrency(Math.round(ebitda * 0.82))}</td>
                      <td className="py-2 text-right">62.5%</td>
                      <td className="py-2 text-right">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Q2 2024</td>
                      <td className="py-2 text-right">{formatCurrency(Math.round(ebitda * 0.87))}</td>
                      <td className="py-2 text-right">64.1%</td>
                      <td className="py-2 text-right text-emerald-600">+6.3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Q3 2024</td>
                      <td className="py-2 text-right">{formatCurrency(Math.round(ebitda * 0.89))}</td>
                      <td className="py-2 text-right">66.2%</td>
                      <td className="py-2 text-right text-emerald-600">+1.4%</td>
                    </tr>
                    <tr className="font-semibold bg-muted/50">
                      <td className="py-2">Q4 2024</td>
                      <td className="py-2 text-right">{formatCurrency(ebitda)}</td>
                      <td className="py-2 text-right">{margenEbitda.toFixed(1)}%</td>
                      <td className="py-2 text-right text-emerald-600">+12.5%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          )}

          {/* VALUACION DE ACTIVOS */}
          {activeReport === "assets" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Valuacion de Activos</p>
              <p className="text-sm text-muted-foreground">
                Fecha de corte: {formatDate(new Date().toISOString())} | {selectedAsset === "all" ? "Todos los activos" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs Activos */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Total Activos</div>
                  <div className="text-3xl font-bold">{filteredActivos.length}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-emerald-500/30">
                <CardContent className="pt-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                  <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalValorActivos)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-muted-foreground">Plusvalia Promedio</div>
                  <div className="text-3xl font-bold text-blue-600">+18.5%</div>
                </CardContent>
              </Card>
            </div>

            {/* Detalle por activo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle de Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-2">Activo</th>
                        <th className="pb-2">Tipo</th>
                        <th className="pb-2">Ubicacion</th>
                        <th className="pb-2 text-right">Valor Actual</th>
                        <th className="pb-2 text-right">Plusvalia</th>
                        <th className="pb-2 text-right">Ocupacion</th>
                        <th className="pb-2 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredActivos.map((activo, index) => (
                        <tr key={activo.id} className="border-b hover:bg-muted/30">
                          <td className="py-3 font-medium">{activo.nombre}</td>
                          <td className="py-3">
                            <Badge variant="outline">{activo.tipo}</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">{activo.ubicacion}</td>
                          <td className="py-3 text-right font-medium">{formatCurrency(activo.valorTotal || 0)}</td>
                          <td className="py-3 text-right">
                            <span className="text-emerald-600">+{(15 + index * 2.5).toFixed(1)}%</span>
                          </td>
                          <td className="py-3 text-right">{activo.ocupacion}%</td>
                          <td className="py-3 text-right">
                            <Badge className={activo.estado === 'activo' ? 'bg-emerald-500/15 text-emerald-600 border-0' : 'bg-amber-500/15 text-amber-600 border-0'}>
                              {activo.estado}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold bg-muted/50">
                        <td className="py-3" colSpan={3}>Total</td>
                        <td className="py-3 text-right">{formatCurrency(totalValorActivos)}</td>
                        <td className="py-3 text-right text-emerald-600">+18.5%</td>
                        <td className="py-3 text-right">92%</td>
                        <td className="py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Distribucion por tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribucion por Tipo de Activo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {['comercial', 'residencial', 'mixto', 'desarrollo'].map((tipo, index) => {
                      const tipoActivos = filteredActivos.filter(a => a.tipo === tipo)
                      const valorTipo = tipoActivos.reduce((sum, a) => sum + (a.valorTotal || 0), 0)
                      const porcentaje = totalValorActivos > 0 ? (valorTipo / totalValorActivos) * 100 : 0
                      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500']
                      return (
                        <div key={tipo} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{tipo}</span>
                            <span className="font-medium">{formatCurrency(valorTipo)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${colors[index]} rounded-full`}
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{porcentaje.toFixed(1)}% del portafolio</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{formatCurrency(totalValorActivos)}</div>
                      <p className="text-muted-foreground mt-1">Valor Total del Portafolio</p>
                      <p className="text-sm text-emerald-600 mt-2">
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                        Apreciacion anual: +18.5%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* INVERSIONISTAS */}
          {activeReport === "investors" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Reporte de Inversionistas</p>
              <p className="text-sm text-muted-foreground">
                Periodo: {getPeriodLabel()} | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs Inversionistas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Inversionistas</div>
                  <div className="text-2xl font-bold">{inversionistas.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                  <div className="text-sm text-muted-foreground">Capital Total</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(inversionistas.reduce((sum, i) => sum + i.montoInvertido, 0))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <PieChart className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-muted-foreground">Dividendos Pagados</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(inversionistas.reduce((sum, i) => sum + (i.dividendosAcumulados || 0), 0))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                  <div className="text-sm text-muted-foreground">ROI Promedio</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {(inversionistas.reduce((sum, i) => sum + i.rendimiento, 0) / inversionistas.length).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalle por inversionista */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle por Inversionista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-2">Inversionista</th>
                        <th className="pb-2 text-right">Participacion</th>
                        <th className="pb-2 text-right">Capital Invertido</th>
                        <th className="pb-2 text-right">Dividendos</th>
                        <th className="pb-2 text-right">Rendimiento</th>
                        <th className="pb-2 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {inversionistas.map((inv) => (
                        <tr key={inv.id} className="border-b hover:bg-muted/30">
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{inv.nombre}</p>
                              <p className="text-xs text-muted-foreground">{inv.email}</p>
                            </div>
                          </td>
                          <td className="py-3 text-right font-medium">{inv.participacion}%</td>
                          <td className="py-3 text-right">{formatCurrency(inv.montoInvertido)}</td>
                          <td className="py-3 text-right text-emerald-600">
                            {formatCurrency(inv.dividendosAcumulados || 0)}
                          </td>
                          <td className="py-3 text-right">
                            <span className={inv.rendimiento >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                              {inv.rendimiento >= 0 ? '+' : ''}{inv.rendimiento}%
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-0">
                              {inv.estado}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold bg-muted/50">
                        <td className="py-3">Total</td>
                        <td className="py-3 text-right">100%</td>
                        <td className="py-3 text-right">
                          {formatCurrency(inversionistas.reduce((sum, i) => sum + i.montoInvertido, 0))}
                        </td>
                        <td className="py-3 text-right text-emerald-600">
                          {formatCurrency(inversionistas.reduce((sum, i) => sum + (i.dividendosAcumulados || 0), 0))}
                        </td>
                        <td className="py-3 text-right">
                          +{(inversionistas.reduce((sum, i) => sum + i.rendimiento, 0) / inversionistas.length).toFixed(1)}%
                        </td>
                        <td className="py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* FISCAL */}
          {activeReport === "tax" && (
            <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
              <p className="text-muted-foreground">Reporte Fiscal</p>
              <p className="text-sm text-muted-foreground">
                Ejercicio: 2024 | {selectedAsset === "all" ? "Consolidado" : activos.find(a => a.id === selectedAsset)?.nombre}
              </p>
            </div>

            {/* KPIs Fiscal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Base Gravable</div>
                  <div className="text-2xl font-bold">{formatCurrency(utilidadBruta)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Deducciones</div>
                  <div className="text-2xl font-bold text-emerald-600">{formatCurrency(Math.round(utilidadBruta * 0.15))}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">ISR a Pagar</div>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(impuestos)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-sm text-muted-foreground">Tasa Efectiva</div>
                  <div className="text-2xl font-bold">30%</div>
                </CardContent>
              </Card>
            </div>

            {/* Calculo ISR */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculo del ISR</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full max-w-2xl">
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 font-medium">Ingresos Acumulables</td>
                      <td className="py-3 text-right">{formatCurrency(ingresos)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Deducciones Autorizadas</td>
                      <td className="py-3 text-right text-red-600">{formatCurrency(egresos)}</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="py-3 font-medium">= Utilidad Fiscal</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(utilidadBruta)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">(-) Perdidas de ejercicios anteriores</td>
                      <td className="py-3 text-right">{formatCurrency(0)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium">= Base Gravable</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(utilidadBruta)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pl-4 text-muted-foreground">Tasa ISR (30%)</td>
                      <td className="py-3 text-right">30%</td>
                    </tr>
                    <tr className="bg-red-500/10">
                      <td className="py-3 font-bold text-red-700">= ISR del Ejercicio</td>
                      <td className="py-3 text-right font-bold text-red-700">{formatCurrency(impuestos)}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Deducciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle de Deducciones</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-2">Concepto</th>
                      <th className="pb-2 text-right">Monto</th>
                      <th className="pb-2 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-2">Depreciacion de inmuebles</td>
                      <td className="py-2 text-right">{formatCurrency(depreciacion)}</td>
                      <td className="py-2 text-right">29.1%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Gastos de mantenimiento</td>
                      <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.35))}</td>
                      <td className="py-2 text-right">35.0%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Gastos de administracion</td>
                      <td className="py-2 text-right">{formatCurrency(gastosAdmin)}</td>
                      <td className="py-2 text-right">22.3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Seguros y fianzas</td>
                      <td className="py-2 text-right">{formatCurrency(Math.round(egresos * 0.16))}</td>
                      <td className="py-2 text-right">13.6%</td>
                    </tr>
                    <tr className="font-semibold bg-muted/50">
                      <td className="py-2">Total Deducciones</td>
                      <td className="py-2 text-right">{formatCurrency(egresos)}</td>
                      <td className="py-2 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
