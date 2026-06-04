"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Search,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Calendar,
  X,
  Building2,
  ArrowUpDown,
  Pencil,
  Trash2
} from "lucide-react"
import { mockFinancialRecords, mockAssets } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import { useBancos, type CuentaBancaria } from "@/lib/bancos-context"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"

const cashFlowData = [
  { mes: "Ene", ingresos: 2400000, egresos: 1800000 },
  { mes: "Feb", ingresos: 2100000, egresos: 1600000 },
  { mes: "Mar", ingresos: 2800000, egresos: 2100000 },
  { mes: "Abr", ingresos: 3200000, egresos: 2400000 },
  { mes: "May", ingresos: 2900000, egresos: 2200000 },
  { mes: "Jun", ingresos: 3500000, egresos: 2600000 },
]

const expenseCategories = [
  { name: "Mantenimiento", value: 35, color: "#0ea5e9" },
  { name: "Administración", value: 25, color: "#22c55e" },
  { name: "Impuestos", value: 20, color: "#f59e0b" },
  { name: "Seguros", value: 12, color: "#8b5cf6" },
  { name: "Otros", value: 8, color: "#64748b" },
]

export default function FinanzasPage() {
  const { cuentas: cuentasBancarias, movimientos: movimientosBancarios, getSaldoTotal, addCuenta, updateCuenta, deleteCuenta } = useBancos()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  
  // Estados para gestión de cuentas bancarias
  const [isNewCuentaOpen, setIsNewCuentaOpen] = useState(false)
  const [isEditCuentaOpen, setIsEditCuentaOpen] = useState(false)
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaBancaria | null>(null)
  const [cuentaBanco, setCuentaBanco] = useState("")
  const [cuentaTipo, setCuentaTipo] = useState("")
  const [cuentaNumero, setCuentaNumero] = useState("")
  const [cuentaClabe, setCuentaClabe] = useState("")
  const [cuentaSaldo, setCuentaSaldo] = useState("")
  const [cuentaMoneda, setCuentaMoneda] = useState("MXN")
  const [cuentaColor, setCuentaColor] = useState("#3b82f6")

  const coloresDisponibles = [
    { nombre: "Azul", valor: "#3b82f6" },
    { nombre: "Azul Oscuro", valor: "#0d47a1" },
    { nombre: "Rojo", valor: "#c62828" },
    { nombre: "Verde", valor: "#16a34a" },
    { nombre: "Morado", valor: "#7c3aed" },
    { nombre: "Naranja", valor: "#ea580c" },
    { nombre: "Rosa", valor: "#db2777" },
  ]

  const resetCuentaForm = () => {
    setCuentaBanco("")
    setCuentaTipo("")
    setCuentaNumero("")
    setCuentaClabe("")
    setCuentaSaldo("")
    setCuentaMoneda("MXN")
    setCuentaColor("#3b82f6")
    setSelectedCuenta(null)
  }

  const handleCreateCuenta = () => {
    if (!cuentaBanco || !cuentaTipo || !cuentaNumero) {
      alert("Por favor complete los campos requeridos")
      return
    }
    addCuenta({
      banco: cuentaBanco,
      tipoCuenta: cuentaTipo,
      numeroCuenta: cuentaNumero,
      clabe: cuentaClabe,
      saldo: parseFloat(cuentaSaldo) || 0,
      moneda: cuentaMoneda,
      color: cuentaColor,
    })
    resetCuentaForm()
    setIsNewCuentaOpen(false)
  }

  const handleEditCuenta = (cuenta: CuentaBancaria) => {
    setSelectedCuenta(cuenta)
    setCuentaBanco(cuenta.banco)
    setCuentaTipo(cuenta.tipoCuenta)
    setCuentaNumero(cuenta.numeroCuenta)
    setCuentaClabe(cuenta.clabe)
    setCuentaSaldo(cuenta.saldo.toString())
    setCuentaMoneda(cuenta.moneda)
    setCuentaColor(cuenta.color)
    setIsEditCuentaOpen(true)
  }

  const handleUpdateCuenta = () => {
    if (!selectedCuenta || !cuentaBanco || !cuentaTipo) return
    updateCuenta(selectedCuenta.id, {
      banco: cuentaBanco,
      tipoCuenta: cuentaTipo,
      numeroCuenta: cuentaNumero,
      clabe: cuentaClabe,
      saldo: parseFloat(cuentaSaldo) || 0,
      moneda: cuentaMoneda,
      color: cuentaColor,
    })
    resetCuentaForm()
    setIsEditCuentaOpen(false)
  }

  const handleDeleteCuenta = (cuenta: CuentaBancaria) => {
    if (confirm(`¿Estás seguro de eliminar la cuenta ${cuenta.banco} - ${cuenta.numeroCuenta}? Esto también eliminará todos los movimientos asociados.`)) {
      deleteCuenta(cuenta.id)
    }
  }
  
  // Funcion para filtrar por rango de fechas
  const filtrarPorFechas = <T extends { date: string }>(records: T[]): T[] => {
    if (!fechaInicio && !fechaFin) return records
    
    return records.filter(record => {
      const recordDate = new Date(record.date)
      const inicio = fechaInicio ? new Date(fechaInicio) : null
      const fin = fechaFin ? new Date(fechaFin) : null
      
      if (inicio && fin) {
        return recordDate >= inicio && recordDate <= fin
      } else if (inicio) {
        return recordDate >= inicio
      } else if (fin) {
        return recordDate <= fin
      }
      return true
    })
  }
  
  const limpiarFiltroFechas = () => {
    setFechaInicio("")
    setFechaFin("")
  }
  
  const hayFiltroFechas = fechaInicio || fechaFin

  // Aplicar filtro de fechas a los registros
  const recordsFiltradosPorFecha = filtrarPorFechas(mockFinancialRecords)
  
  const filteredRecords = recordsFiltradosPorFecha.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || record.type === filterType
    return matchesSearch && matchesType
  })

  const totalIngresos = recordsFiltradosPorFecha
    .filter(r => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0)

  const totalEgresos = recordsFiltradosPorFecha
    .filter(r => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0)

  const balance = totalIngresos - totalEgresos

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
            <p className="text-muted-foreground">
              Control financiero y flujo de caja
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Filtro de Rango de Fechas */}
            <div className="flex items-center gap-2 p-2 rounded-lg border bg-card">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="h-8 w-[130px] text-sm"
                  placeholder="Desde"
                />
                <span className="text-muted-foreground text-sm">a</span>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="h-8 w-[130px] text-sm"
                  placeholder="Hasta"
                />
              </div>
              {hayFiltroFechas && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={limpiarFiltroFechas}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Registro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Registro Financiero</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo ingreso o egreso
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Ingreso</SelectItem>
                          <SelectItem value="expense">Egreso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">Renta</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                          <SelectItem value="taxes">Impuestos</SelectItem>
                          <SelectItem value="insurance">Seguros</SelectItem>
                          <SelectItem value="admin">Administración</SelectItem>
                          <SelectItem value="other">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Activo Relacionado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar activo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General (sin activo)</SelectItem>
                        {mockAssets.map(asset => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input placeholder="Descripción del movimiento" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monto</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewRecordOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsNewRecordOpen(false)}>
                    Guardar Registro
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Indicador de periodo filtrado */}
        {hayFiltroFechas && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Periodo: {fechaInicio ? new Date(fechaInicio).toLocaleDateString('es-MX') : 'Inicio'} - {fechaFin ? new Date(fechaFin).toLocaleDateString('es-MX') : 'Actual'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={limpiarFiltroFechas} className="h-7 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Quitar filtro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIngresos)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                +12.5% vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalEgresos)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3 text-red-500" />
                +5.2% vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatCurrency(balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {hayFiltroFechas ? 'Periodo filtrado' : 'Periodo actual'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Margen Operativo</CardTitle>
              <PiggyBank className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((balance / totalIngresos) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Rentabilidad operativa
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="bancos">Bancos</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
            <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Flujo de Caja</CardTitle>
                  <CardDescription>Ingresos vs Egresos mensuales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000000}M`} />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="ingresos"
                          stackId="1"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.3}
                          name="Ingresos"
                        />
                        <Area
                          type="monotone"
                          dataKey="egresos"
                          stackId="2"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                          name="Egresos"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Gastos</CardTitle>
                  <CardDescription>Por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comparativa Mensual</CardTitle>
                <CardDescription>Ingresos y egresos por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000000}M`} />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="ingresos" name="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="egresos" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Bancos */}
          <TabsContent value="bancos" className="space-y-6">
            {/* Resumen de Saldos */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Total en Bancos</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(getSaldoTotal())}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En {cuentasBancarias.length} cuentas activas
                  </p>
                </CardContent>
              </Card>
              
              {cuentasBancarias.map((cuenta) => (
                <Card key={cuenta.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cuenta.color }}
                      />
                      <CardTitle className="text-sm font-medium">{cuenta.banco}</CardTitle>
                    </div>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{formatCurrency(cuenta.saldo)}</div>
                    <p className="text-xs text-muted-foreground">
                      {cuenta.tipoCuenta} {cuenta.numeroCuenta}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detalle de Cuentas y Movimientos */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Lista de Cuentas */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Cuentas Bancarias</CardTitle>
                      <CardDescription>Detalle de cada cuenta</CardDescription>
                    </div>
                    <Dialog open={isNewCuentaOpen} onOpenChange={setIsNewCuentaOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => resetCuentaForm()}>
                          <Plus className="mr-2 h-4 w-4" />
                          Nueva
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
                          <DialogDescription>Agrega una nueva cuenta bancaria al sistema</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="banco">Banco *</Label>
                            <Input id="banco" value={cuentaBanco} onChange={(e) => setCuentaBanco(e.target.value)} placeholder="Ej: BBVA, Banorte, Santander" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="tipoCuenta">Tipo de Cuenta *</Label>
                            <Input id="tipoCuenta" value={cuentaTipo} onChange={(e) => setCuentaTipo(e.target.value)} placeholder="Ej: Cuenta Corriente, Inversión" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="numeroCuenta">Numero de Cuenta *</Label>
                              <Input id="numeroCuenta" value={cuentaNumero} onChange={(e) => setCuentaNumero(e.target.value)} placeholder="****1234" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="clabe">CLABE</Label>
                              <Input id="clabe" value={cuentaClabe} onChange={(e) => setCuentaClabe(e.target.value)} placeholder="18 dígitos" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="saldo">Saldo Inicial</Label>
                              <Input id="saldo" type="number" value={cuentaSaldo} onChange={(e) => setCuentaSaldo(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="moneda">Moneda</Label>
                              <Select value={cuentaMoneda} onValueChange={setCuentaMoneda}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MXN">MXN</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Color identificador</Label>
                            <div className="flex gap-2 flex-wrap">
                              {coloresDisponibles.map((c) => (
                                <button
                                  key={c.valor}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${cuentaColor === c.valor ? 'border-foreground scale-110' : 'border-transparent'}`}
                                  style={{ backgroundColor: c.valor }}
                                  onClick={() => setCuentaColor(c.valor)}
                                  title={c.nombre}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsNewCuentaOpen(false)}>Cancelar</Button>
                          <Button onClick={handleCreateCuenta}>Crear Cuenta</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cuentasBancarias.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay cuentas bancarias registradas
                    </div>
                  ) : (
                    cuentasBancarias.map((cuenta) => (
                      <div 
                        key={cuenta.id} 
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-8 rounded-full" 
                              style={{ backgroundColor: cuenta.color }}
                            />
                            <div>
                              <p className="font-semibold">{cuenta.banco}</p>
                              <p className="text-xs text-muted-foreground">{cuenta.tipoCuenta}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{cuenta.moneda}</Badge>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditCuenta(cuenta)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteCuenta(cuenta)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cuenta:</span>
                            <span className="font-mono">{cuenta.numeroCuenta}</span>
                          </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CLABE:</span>
                          <span className="font-mono text-xs">{cuenta.clabe.slice(0, 6)}...{cuenta.clabe.slice(-4)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t mt-2">
                          <span className="font-medium">Saldo:</span>
                          <span className="font-bold text-primary">{formatCurrency(cuenta.saldo)}</span>
                        </div>
                      </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Diálogo de Editar Cuenta */}
              <Dialog open={isEditCuentaOpen} onOpenChange={setIsEditCuentaOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Cuenta Bancaria</DialogTitle>
                    <DialogDescription>Modifica los datos de la cuenta {selectedCuenta?.banco}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-banco">Banco *</Label>
                      <Input id="edit-banco" value={cuentaBanco} onChange={(e) => setCuentaBanco(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-tipoCuenta">Tipo de Cuenta *</Label>
                      <Input id="edit-tipoCuenta" value={cuentaTipo} onChange={(e) => setCuentaTipo(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-numeroCuenta">Numero de Cuenta *</Label>
                        <Input id="edit-numeroCuenta" value={cuentaNumero} onChange={(e) => setCuentaNumero(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-clabe">CLABE</Label>
                        <Input id="edit-clabe" value={cuentaClabe} onChange={(e) => setCuentaClabe(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-saldo">Saldo</Label>
                        <Input id="edit-saldo" type="number" value={cuentaSaldo} onChange={(e) => setCuentaSaldo(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-moneda">Moneda</Label>
                        <Select value={cuentaMoneda} onValueChange={setCuentaMoneda}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MXN">MXN</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Color identificador</Label>
                      <div className="flex gap-2 flex-wrap">
                        {coloresDisponibles.map((c) => (
                          <button
                            key={c.valor}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-all ${cuentaColor === c.valor ? 'border-foreground scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c.valor }}
                            onClick={() => setCuentaColor(c.valor)}
                            title={c.nombre}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setIsEditCuentaOpen(false); resetCuentaForm(); }}>Cancelar</Button>
                    <Button onClick={handleUpdateCuenta}>Guardar Cambios</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Movimientos Recientes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Movimientos Bancarios</CardTitle>
                      <CardDescription>Entradas y salidas recientes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Filtrar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Banco</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientosBancarios.map((mov) => {
                        const cuenta = cuentasBancarias.find(c => c.id === mov.cuentaId);
                        return (
                          <TableRow key={mov.id}>
                            <TableCell className="text-sm">
                              {formatDate(mov.fecha)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  mov.tipo === 'entrada' ? 'bg-emerald-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium">{mov.concepto}</p>
                                  <p className="text-xs text-muted-foreground">{mov.referencia}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: cuenta?.color }}
                                />
                                <span className="text-sm">{cuenta?.banco}</span>
                              </div>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${
                              mov.tipo === 'entrada' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {mov.tipo === 'entrada' ? '+' : '-'}{formatCurrency(mov.monto)}
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {formatCurrency(mov.saldoResultante)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Gráfica de distribución por banco */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución de Fondos por Banco</CardTitle>
                <CardDescription>Porcentaje del saldo total en cada cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cuentasBancarias.map(c => ({ 
                            name: c.banco, 
                            value: c.saldo, 
                            color: c.color 
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {cuentasBancarias.map((cuenta, index) => (
                            <Cell key={`cell-${index}`} fill={cuenta.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    {cuentasBancarias.map((cuenta) => {
                      const total = getSaldoTotal();
                      const porcentaje = ((cuenta.saldo / total) * 100).toFixed(1);
                      return (
                        <div key={cuenta.id} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: cuenta.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{cuenta.banco}</span>
                              <span className="text-sm text-muted-foreground">{porcentaje}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${porcentaje}%`,
                                  backgroundColor: cuenta.color 
                                }}
                              />
                            </div>
                            <p className="text-sm text-right mt-1 font-medium">{formatCurrency(cuenta.saldo)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Registros Financieros</CardTitle>
                    <CardDescription>Historial de ingresos y egresos</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar registros..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-[250px]"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[150px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="income">Ingresos</SelectItem>
                        <SelectItem value="expense">Egresos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell className="font-medium">{record.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.type === "income" ? "default" : "secondary"}>
                            {record.type === "income" ? "Ingreso" : "Egreso"}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          record.type === "income" ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {record.type === "income" ? "+" : "-"}{formatCurrency(record.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {expenseCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{category.value}%</div>
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${category.value}%`, backgroundColor: category.color }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatCurrency(totalEgresos * category.value / 100)} del total
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
