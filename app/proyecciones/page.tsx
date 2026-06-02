"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Lightbulb,
  Calculator,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Save,
  Play,
  DollarSign,
  Building2,
  Calendar
} from "lucide-react"
import { formatCurrency, formatPercent } from "@/lib/format"
import { activos } from "@/lib/mock-data"
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  Bar
} from "recharts"

const projectionData = [
  { year: "2024", actual: 45000000, projected: 45000000, optimistic: 48000000, pessimistic: 42000000 },
  { year: "2025", actual: null, projected: 52000000, optimistic: 58000000, pessimistic: 46000000 },
  { year: "2026", actual: null, projected: 61000000, optimistic: 72000000, pessimistic: 52000000 },
  { year: "2027", actual: null, projected: 72000000, optimistic: 88000000, pessimistic: 58000000 },
  { year: "2028", actual: null, projected: 85000000, optimistic: 108000000, pessimistic: 65000000 },
]

const revenueProjection = [
  { month: "Ene", renta: 2800000, servicios: 400000, otros: 200000 },
  { month: "Feb", renta: 2850000, servicios: 420000, otros: 180000 },
  { month: "Mar", renta: 2900000, servicios: 450000, otros: 220000 },
  { month: "Abr", renta: 2950000, servicios: 480000, otros: 200000 },
  { month: "May", renta: 3000000, servicios: 500000, otros: 250000 },
  { month: "Jun", renta: 3100000, servicios: 520000, otros: 280000 },
  { month: "Jul", renta: 3150000, servicios: 550000, otros: 300000 },
  { month: "Ago", renta: 3200000, servicios: 580000, otros: 320000 },
  { month: "Sep", renta: 3300000, servicios: 600000, otros: 350000 },
  { month: "Oct", renta: 3400000, servicios: 620000, otros: 380000 },
  { month: "Nov", renta: 3500000, servicios: 650000, otros: 400000 },
  { month: "Dic", renta: 3600000, servicios: 700000, otros: 450000 },
]

const scenarios = [
  {
    name: "Conservador",
    growth: 8,
    occupancy: 85,
    expenses: 35,
    roi: 12.5,
    color: "text-amber-500"
  },
  {
    name: "Base",
    growth: 12,
    occupancy: 90,
    expenses: 32,
    roi: 15.2,
    color: "text-blue-500"
  },
  {
    name: "Optimista",
    growth: 18,
    occupancy: 95,
    expenses: 28,
    roi: 19.8,
    color: "text-emerald-500"
  }
]

export default function ProyeccionesPage() {
  const [growthRate, setGrowthRate] = useState([12])
  const [occupancyRate, setOccupancyRate] = useState([90])
  const [expenseRatio, setExpenseRatio] = useState([32])
  const [includeInflation, setIncludeInflation] = useState(true)
  const [projectionYears, setProjectionYears] = useState("5")
  
  // Nuevos estados para seleccion de activo/proyecto
  const [assetSelection, setAssetSelection] = useState<string>("all") // "all", "new", o id del activo
  const [customProjectValue, setCustomProjectValue] = useState<string>("") // valor manual
  const [useCustomValue, setUseCustomValue] = useState(false)
  
  // Nuevos parametros: Rentas y Apreciacion
  const [monthlyRent, setMonthlyRent] = useState<string>("") // renta mensual esperada
  const [appreciationRate, setAppreciationRate] = useState([5]) // tasa de apreciacion anual %
  
  // Parametros de financiamiento
  const [hasFinancing, setHasFinancing] = useState(false)
  const [financingAmount, setFinancingAmount] = useState<string>("") // monto del credito
  const [interestRate, setInterestRate] = useState([12]) // tasa de interes anual
  const [loanTermYears, setLoanTermYears] = useState("15") // plazo del credito

  // Calcular valor base segun seleccion
  const getBaseValue = (): number => {
    if (useCustomValue && customProjectValue) {
      return parseFloat(customProjectValue.replace(/,/g, '')) || 0
    }
    
    if (assetSelection === "all") {
      // Sumar todos los activos
      return activos.reduce((sum, a) => sum + (a.valorTotal || 0), 0)
    } else if (assetSelection === "new") {
      // Nuevo activo - usar valor personalizado o 0
      return parseFloat(customProjectValue.replace(/,/g, '')) || 0
    } else {
      // Activo especifico
      const selectedAsset = activos.find(a => a.id === assetSelection)
      return selectedAsset?.valorTotal || 0
    }
  }

  const baseValue = getBaseValue()

  const calculateProjectedValue = () => {
    const years = parseInt(projectionYears)
    const growth = growthRate[0] / 100
    return baseValue * Math.pow(1 + growth, years)
  }

  const projectedValue = calculateProjectedValue()
  const projectedROI = (growthRate[0] * occupancyRate[0]) / 100
  
  // Calculos de renta y apreciacion
  const rentaMensual = parseFloat(monthlyRent.replace(/,/g, '')) || (baseValue * 0.008) // default 0.8% del valor
  const rentaAnualBruta = rentaMensual * 12 * (occupancyRate[0] / 100)
  const gastosOperativos = rentaAnualBruta * (expenseRatio[0] / 100)
  const rentaAnualNeta = rentaAnualBruta - gastosOperativos
  
  // Valor del activo con apreciacion
  const calcularValorConApreciacion = (anos: number): number => {
    return baseValue * Math.pow(1 + appreciationRate[0] / 100, anos)
  }
  
  // Calculos de financiamiento
  const montoFinanciamiento = parseFloat(financingAmount.replace(/,/g, '')) || (baseValue * 0.7)
  const tasaMensual = interestRate[0] / 100 / 12
  const plazoMeses = parseInt(loanTermYears) * 12
  
  // Pago mensual (formula de amortizacion)
  const pagoMensual = montoFinanciamiento * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1)
  const pagoAnual = pagoMensual * 12
  
  // Flujo de caja anual (renta - pago de credito si hay financiamiento)
  const flujoCajaAnual = hasFinancing ? rentaAnualNeta - pagoAnual : rentaAnualNeta
  
  // Anos para recuperar inversion (payback)
  const inversionInicial = hasFinancing ? (baseValue - montoFinanciamiento) : baseValue
  const anosPayback = inversionInicial > 0 && flujoCajaAnual > 0 
    ? inversionInicial / flujoCajaAnual 
    : 0
  
  // Cap Rate
  const capRate = baseValue > 0 ? (rentaAnualNeta / baseValue) * 100 : 0
  
  // Cash on Cash Return (si hay financiamiento)
  const cashOnCash = inversionInicial > 0 ? (flujoCajaAnual / inversionInicial) * 100 : 0
  
  // Generar proyeccion anual detallada
  const generarProyeccionAnual = () => {
    const anos = parseInt(projectionYears)
    const proyeccion = []
    let saldoCredito = hasFinancing ? montoFinanciamiento : 0
    
    for (let i = 1; i <= anos; i++) {
      const valorActivo = calcularValorConApreciacion(i)
      const rentaAno = rentaAnualNeta * Math.pow(1 + (includeInflation ? 0.04 : 0), i - 1)
      const pagoAnualCredito = hasFinancing && saldoCredito > 0 ? Math.min(pagoAnual, saldoCredito + (saldoCredito * interestRate[0] / 100)) : 0
      
      // Amortizacion del ano
      const interesAnual = saldoCredito * (interestRate[0] / 100)
      const capitalAnual = pagoAnualCredito - interesAnual
      saldoCredito = Math.max(0, saldoCredito - capitalAnual)
      
      const flujoCaja = rentaAno - pagoAnualCredito
      const flujoCajaAcumulado = i === 1 ? flujoCaja - inversionInicial : flujoCaja
      
      proyeccion.push({
        ano: i,
        valorActivo,
        rentaBruta: rentaAno / (1 - expenseRatio[0] / 100),
        rentaNeta: rentaAno,
        pagoCredito: pagoAnualCredito,
        saldoCredito,
        flujoCaja,
        plusvalia: valorActivo - baseValue,
        roi: ((rentaAno + (valorActivo - baseValue)) / baseValue) * 100
      })
    }
    return proyeccion
  }
  
  const proyeccionAnual = generarProyeccionAnual()
  
  // Obtener nombre del activo seleccionado
  const getSelectedAssetName = (): string => {
    if (assetSelection === "all") return "Todos los Activos"
    if (assetSelection === "new") return "Nuevo Activo"
    const asset = activos.find(a => a.id === assetSelection)
    return asset?.nombre || "Activo"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proyecciones</h1>
            <p className="text-muted-foreground">
              Análisis predictivo y escenarios financieros
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalcular
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Guardar Escenario
            </Button>
          </div>
        </div>

        {/* Scenario Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card key={scenario.name} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${scenario.color}`}>{scenario.name}</CardTitle>
                <CardDescription>Escenario de proyección</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Crecimiento</span>
                  <span className="font-medium">{scenario.growth}% anual</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ocupación</span>
                  <span className="font-medium">{scenario.occupancy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ratio Gastos</span>
                  <span className="font-medium">{scenario.expenses}%</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI Esperado</span>
                    <span className={`font-bold ${scenario.color}`}>{scenario.roi}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="simulator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="longterm">Largo Plazo</TabsTrigger>
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          </TabsList>

          <TabsContent value="simulator" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Parameters */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Parámetros
                  </CardTitle>
                  <CardDescription>Ajusta las variables de proyección</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Selector de Activo */}
                    <div className="space-y-2">
                      <Label>Seleccionar Activo/Proyecto</Label>
                      <Select value={assetSelection} onValueChange={(value) => {
                        setAssetSelection(value)
                        if (value !== "new") {
                          setUseCustomValue(false)
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un activo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los Activos (Portafolio)</SelectItem>
                          <SelectItem value="new">Nuevo Activo (Personalizado)</SelectItem>
                          <div className="h-px bg-border my-1" />
                          {activos.map((activo) => (
                            <SelectItem key={activo.id} value={activo.id}>
                              {activo.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Analiza un activo especifico o todo el portafolio
                      </p>
                    </div>

                    {/* Valor del Proyecto */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Valor del Proyecto</Label>
                        {assetSelection !== "new" && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor="use-custom" className="text-xs text-muted-foreground cursor-pointer">
                              Personalizar
                            </Label>
                            <Switch 
                              id="use-custom"
                              checked={useCustomValue}
                              onCheckedChange={setUseCustomValue}
                            />
                          </div>
                        )}
                      </div>
                      {(useCustomValue || assetSelection === "new") ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="text"
                            placeholder="0"
                            value={customProjectValue}
                            onChange={(e) => {
                              // Solo permitir numeros y comas
                              const value = e.target.value.replace(/[^0-9,]/g, '')
                              setCustomProjectValue(value)
                            }}
                            className="pl-7"
                          />
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="text-lg font-semibold">{formatCurrency(baseValue)}</p>
                          <p className="text-xs text-muted-foreground">
                            {assetSelection === "all" 
                              ? `Valor total de ${activos.length} activos`
                              : "Valor registrado del activo"
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-border" />

                    {/* Renta Mensual Esperada */}
                    <div className="space-y-2">
                      <Label>Renta Mensual Esperada</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="text"
                          placeholder={formatCurrency(baseValue * 0.008).replace('$', '')}
                          value={monthlyRent}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9,]/g, '')
                            setMonthlyRent(value)
                          }}
                          className="pl-7"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ingreso mensual por arrendamiento
                      </p>
                    </div>

                    {/* Tasa de Apreciacion */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Tasa de Apreciacion</Label>
                        <span className="text-sm font-medium">{appreciationRate[0]}%</span>
                      </div>
                      <Slider
                        value={appreciationRate}
                        onValueChange={setAppreciationRate}
                        min={0}
                        max={15}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Incremento anual del valor del activo
                      </p>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Tasa de Crecimiento Rentas</Label>
                        <span className="text-sm font-medium">{growthRate[0]}%</span>
                      </div>
                      <Slider
                        value={growthRate}
                        onValueChange={setGrowthRate}
                        max={30}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Crecimiento anual esperado de las rentas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Tasa de Ocupación</Label>
                        <span className="text-sm font-medium">{occupancyRate[0]}%</span>
                      </div>
                      <Slider
                        value={occupancyRate}
                        onValueChange={setOccupancyRate}
                        min={50}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Ocupación promedio de los activos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Ratio de Gastos</Label>
                        <span className="text-sm font-medium">{expenseRatio[0]}%</span>
                      </div>
                      <Slider
                        value={expenseRatio}
                        onValueChange={setExpenseRatio}
                        min={15}
                        max={50}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Gastos operativos como % de ingresos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Horizonte de Proyección</Label>
                      <Select value={projectionYears} onValueChange={setProjectionYears}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 año</SelectItem>
                          <SelectItem value="3">3 años</SelectItem>
                          <SelectItem value="5">5 años</SelectItem>
                          <SelectItem value="10">10 años</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Incluir Inflacion</Label>
                        <p className="text-xs text-muted-foreground">
                          Ajustar rentas por inflacion (4% anual)
                        </p>
                      </div>
                      <Switch 
                        checked={includeInflation}
                        onCheckedChange={setIncludeInflation}
                      />
                    </div>

                    <div className="h-px bg-border" />

                    {/* Seccion Financiamiento */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Incluir Financiamiento</Label>
                        <p className="text-xs text-muted-foreground">
                          Calcular con credito hipotecario
                        </p>
                      </div>
                      <Switch 
                        checked={hasFinancing}
                        onCheckedChange={setHasFinancing}
                      />
                    </div>

                    {hasFinancing && (
                      <div className="space-y-4 p-3 rounded-lg bg-muted/50 border">
                        <div className="space-y-2">
                          <Label className="text-sm">Monto del Credito</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                            <Input
                              type="text"
                              placeholder={formatCurrency(baseValue * 0.7).replace('$', '')}
                              value={financingAmount}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9,]/g, '')
                                setFinancingAmount(value)
                              }}
                              className="pl-7 h-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <Label>Tasa de Interes</Label>
                            <span className="font-medium">{interestRate[0]}%</span>
                          </div>
                          <Slider
                            value={interestRate}
                            onValueChange={setInterestRate}
                            min={6}
                            max={20}
                            step={0.5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Plazo del Credito</Label>
                          <Select value={loanTermYears} onValueChange={setLoanTermYears}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 anos</SelectItem>
                              <SelectItem value="10">10 anos</SelectItem>
                              <SelectItem value="15">15 anos</SelectItem>
                              <SelectItem value="20">20 anos</SelectItem>
                              <SelectItem value="25">25 anos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="pt-2 border-t text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pago mensual:</span>
                            <span className="font-semibold">{formatCurrency(pagoMensual)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Ejecutar Simulacion
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Resultados de Proyección</span>
                    <Badge variant="outline" className="font-normal">
                      {getSelectedAssetName()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Basado en los parámetros seleccionados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPIs Principales */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <BarChart3 className="h-4 w-4" />
                        Valor Actual
                      </div>
                      <div className="text-xl font-bold">
                        {formatCurrency(baseValue)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {hasFinancing ? `Enganche: ${formatCurrency(inversionInicial)}` : 'Inversion total'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border-emerald-500/30 border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Target className="h-4 w-4" />
                        Valor en {projectionYears} anos
                      </div>
                      <div className="text-xl font-bold text-emerald-600">
                        {formatCurrency(calcularValorConApreciacion(parseInt(projectionYears)))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Plusvalia: {formatCurrency(calcularValorConApreciacion(parseInt(projectionYears)) - baseValue)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4" />
                        Cap Rate
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        {capRate.toFixed(2)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Rendimiento sobre valor
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Lightbulb className="h-4 w-4" />
                        {hasFinancing ? 'Cash on Cash' : 'ROI Anual'}
                      </div>
                      <div className="text-xl font-bold text-amber-600">
                        {cashOnCash.toFixed(2)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Retorno sobre inversion
                      </p>
                    </div>
                  </div>

                  {/* KPIs de Ingresos */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Renta Mensual</div>
                      <div className="text-lg font-bold text-emerald-600">{formatCurrency(rentaMensual)}</div>
                      <p className="text-xs text-muted-foreground">Ingreso bruto mensual</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Ingreso Anual Neto</div>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(rentaAnualNeta)}</div>
                      <p className="text-xs text-muted-foreground">Despues de gastos operativos</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${flujoCajaAnual >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="text-sm text-muted-foreground mb-1">Flujo de Caja Anual</div>
                      <div className={`text-lg font-bold ${flujoCajaAnual >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(flujoCajaAnual)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {hasFinancing ? 'Despues de pago de credito' : 'Disponible para distribuir'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
                      <div className="text-sm text-muted-foreground mb-1">Recuperacion Inversion</div>
                      <div className="text-lg font-bold text-purple-600">
                        {anosPayback > 0 ? `${anosPayback.toFixed(1)} anos` : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Payback period</p>
                    </div>
                  </div>

                  {/* Info Financiamiento si aplica */}
                  {hasFinancing && (
                    <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-5 w-5 text-amber-600" />
                        <span className="font-semibold">Detalle del Financiamiento</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monto del Credito</p>
                          <p className="font-semibold">{formatCurrency(montoFinanciamiento)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pago Mensual</p>
                          <p className="font-semibold">{formatCurrency(pagoMensual)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pago Anual</p>
                          <p className="font-semibold">{formatCurrency(pagoAnual)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Termina de Pagar</p>
                          <p className="font-semibold text-emerald-600">{parseInt(loanTermYears)} anos ({new Date().getFullYear() + parseInt(loanTermYears)})</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="year" className="text-xs" />
                        <YAxis 
                          className="text-xs" 
                          tickFormatter={(value) => `$${value / 1000000}M`}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="optimistic"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.1}
                          name="Optimista"
                        />
                        <Area
                          type="monotone"
                          dataKey="projected"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.2}
                          name="Proyectado"
                        />
                        <Area
                          type="monotone"
                          dataKey="pessimistic"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.1}
                          name="Conservador"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabla de Proyeccion Anual Detallada */}
                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-4">Proyeccion Anual Detallada</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-2 font-semibold">Ano</th>
                            <th className="py-2 text-right font-semibold">Valor Activo</th>
                            <th className="py-2 text-right font-semibold">Plusvalia</th>
                            <th className="py-2 text-right font-semibold">Renta Neta</th>
                            {hasFinancing && <th className="py-2 text-right font-semibold">Pago Credito</th>}
                            {hasFinancing && <th className="py-2 text-right font-semibold">Saldo Deuda</th>}
                            <th className="py-2 text-right font-semibold">Flujo Caja</th>
                            <th className="py-2 text-right font-semibold">ROI Acum.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proyeccionAnual.map((row) => (
                            <tr key={row.ano} className="border-b hover:bg-muted/30">
                              <td className="py-2 font-medium">Ano {row.ano}</td>
                              <td className="py-2 text-right">{formatCurrency(row.valorActivo)}</td>
                              <td className="py-2 text-right text-emerald-600">+{formatCurrency(row.plusvalia)}</td>
                              <td className="py-2 text-right">{formatCurrency(row.rentaNeta)}</td>
                              {hasFinancing && (
                                <td className="py-2 text-right text-red-600">-{formatCurrency(row.pagoCredito)}</td>
                              )}
                              {hasFinancing && (
                                <td className="py-2 text-right text-muted-foreground">
                                  {row.saldoCredito > 0 ? formatCurrency(row.saldoCredito) : <span className="text-emerald-600">Pagado</span>}
                                </td>
                              )}
                              <td className={`py-2 text-right font-medium ${row.flujoCaja >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {formatCurrency(row.flujoCaja)}
                              </td>
                              <td className="py-2 text-right text-blue-600">{row.roi.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-muted/50 font-semibold">
                            <td className="py-2">Total</td>
                            <td className="py-2 text-right">
                              {formatCurrency(proyeccionAnual[proyeccionAnual.length - 1]?.valorActivo || 0)}
                            </td>
                            <td className="py-2 text-right text-emerald-600">
                              +{formatCurrency(proyeccionAnual[proyeccionAnual.length - 1]?.plusvalia || 0)}
                            </td>
                            <td className="py-2 text-right">
                              {formatCurrency(proyeccionAnual.reduce((sum, r) => sum + r.rentaNeta, 0))}
                            </td>
                            {hasFinancing && (
                              <td className="py-2 text-right text-red-600">
                                -{formatCurrency(proyeccionAnual.reduce((sum, r) => sum + r.pagoCredito, 0))}
                              </td>
                            )}
                            {hasFinancing && <td className="py-2 text-right">-</td>}
                            <td className={`py-2 text-right ${proyeccionAnual.reduce((sum, r) => sum + r.flujoCaja, 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {formatCurrency(proyeccionAnual.reduce((sum, r) => sum + r.flujoCaja, 0))}
                            </td>
                            <td className="py-2 text-right text-blue-600">
                              {proyeccionAnual[proyeccionAnual.length - 1]?.roi.toFixed(1) || 0}%
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Resumen ejecutivo */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border">
                    <h4 className="font-semibold mb-3">Resumen de la Inversion</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Inversion Inicial</p>
                        <p className="font-semibold">{formatCurrency(inversionInicial)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ingresos Totales ({projectionYears} anos)</p>
                        <p className="font-semibold text-emerald-600">
                          {formatCurrency(proyeccionAnual.reduce((sum, r) => sum + r.rentaNeta, 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Plusvalia Esperada</p>
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(proyeccionAnual[proyeccionAnual.length - 1]?.plusvalia || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ganancia Total</p>
                        <p className="font-semibold text-emerald-600">
                          {formatCurrency(
                            proyeccionAnual.reduce((sum, r) => sum + r.flujoCaja, 0) + 
                            (proyeccionAnual[proyeccionAnual.length - 1]?.plusvalia || 0)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="longterm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proyección a 5 Años</CardTitle>
                <CardDescription>Evolución del valor del portafolio con diferentes escenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis 
                        className="text-xs" 
                        tickFormatter={(value) => `$${value / 1000000}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => value ? formatCurrency(value) : "N/A"}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="actual" name="Actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Line
                        type="monotone"
                        dataKey="optimistic"
                        stroke="#22c55e"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Optimista"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="projected"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Proyectado"
                      />
                      <Line
                        type="monotone"
                        dataKey="pessimistic"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Conservador"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">CAGR Proyectado</span>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600">13.6%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">TIR Estimada</span>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600">15.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Payback Period</span>
                    <span className="font-bold">6.5 años</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Múltiplo de Capital</span>
                    <span className="font-bold">1.89x</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Riesgos y Sensibilidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sensibilidad a Tasas de Interés</span>
                      <Badge variant="secondary">Media</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[55%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Riesgo de Vacancia</span>
                      <Badge variant="secondary">Bajo</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[25%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exposición al Mercado</span>
                      <Badge variant="secondary">Media-Alta</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Diversificación</span>
                      <Badge>Alta</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proyección de Ingresos 2024</CardTitle>
                <CardDescription>Desglose por fuente de ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueProjection}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis 
                        className="text-xs" 
                        tickFormatter={(value) => `$${value / 1000000}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="renta"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Rentas"
                      />
                      <Area
                        type="monotone"
                        dataKey="servicios"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.6}
                        name="Servicios"
                      />
                      <Area
                        type="monotone"
                        dataKey="otros"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.6}
                        name="Otros"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
