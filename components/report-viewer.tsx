"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  Printer, 
  Mail, 
  X,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  PieChart,
  BarChart3
} from "lucide-react"
import { formatCurrency, formatPercent, formatDate } from "@/lib/format"
import { activos, inversionistas, kpiData } from "@/lib/mock-data"

interface ReportViewerProps {
  report: {
    id: string
    name: string
    type: string
    status: string
    createdAt: string
    format: string
    size?: number
    description?: string
  } | null
  open: boolean
  onClose: () => void
}

export function ReportViewer({ report, open, onClose }: ReportViewerProps) {
  if (!report) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{report.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Generado: {formatDate(report.createdAt)} | {report.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar {report.format?.toUpperCase()}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <ReportContent type={report.type} reportName={report.name} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReportContent({ type, reportName }: { type: string; reportName: string }) {
  // Calculos generales
  const totalActivos = activos.reduce((sum, a) => sum + (a.valorTotal || 0), 0)
  const totalInversion = inversionistas.reduce((sum, i) => sum + i.montoInvertido, 0)
  
  switch (type) {
    case "financial":
      return <FinancialReport />
    case "ebitda":
      return <EbitdaReport />
    case "assets":
      return <AssetsReport />
    case "investors":
      return <InvestorsReport />
    case "tax":
      return <TaxReport />
    default:
      return <FinancialReport />
  }
}

function FinancialReport() {
  const ingresos = 12850000
  const egresos = 4120000
  const utilidadBruta = ingresos - egresos
  const impuestos = utilidadBruta * 0.30
  const utilidadNeta = utilidadBruta - impuestos

  return (
    <div className="space-y-6 py-4">
      {/* Header del reporte */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
        <p className="text-muted-foreground">Estado de Resultados</p>
        <p className="text-sm text-muted-foreground">Periodo: Enero - Diciembre 2024</p>
      </div>

      {/* Resumen KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Ingresos Totales</div>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(ingresos)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Egresos Totales</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(egresos)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Utilidad Bruta</div>
            <div className="text-2xl font-bold">{formatCurrency(utilidadBruta)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Utilidad Neta</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(utilidadNeta)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de ingresos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ingresos</CardTitle>
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
                <td className="py-2 text-right">{formatCurrency(7200000)}</td>
                <td className="py-2 text-right">56.0%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Rentas residenciales</td>
                <td className="py-2 text-right">{formatCurrency(3850000)}</td>
                <td className="py-2 text-right">30.0%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Estacionamientos</td>
                <td className="py-2 text-right">{formatCurrency(1200000)}</td>
                <td className="py-2 text-right">9.3%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Otros ingresos</td>
                <td className="py-2 text-right">{formatCurrency(600000)}</td>
                <td className="py-2 text-right">4.7%</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2">Total Ingresos</td>
                <td className="py-2 text-right">{formatCurrency(ingresos)}</td>
                <td className="py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detalle de egresos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Egresos</CardTitle>
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
                <td className="py-2 text-right">{formatCurrency(1450000)}</td>
                <td className="py-2 text-right">35.2%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Administracion</td>
                <td className="py-2 text-right">{formatCurrency(980000)}</td>
                <td className="py-2 text-right">23.8%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Seguros</td>
                <td className="py-2 text-right">{formatCurrency(650000)}</td>
                <td className="py-2 text-right">15.8%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Servicios</td>
                <td className="py-2 text-right">{formatCurrency(540000)}</td>
                <td className="py-2 text-right">13.1%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Otros gastos</td>
                <td className="py-2 text-right">{formatCurrency(500000)}</td>
                <td className="py-2 text-right">12.1%</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2">Total Egresos</td>
                <td className="py-2 text-right">{formatCurrency(egresos)}</td>
                <td className="py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Resumen */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <table className="w-full">
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-2 font-medium">Utilidad Bruta</td>
                <td className="py-2 text-right font-medium">{formatCurrency(utilidadBruta)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">(-) Impuestos (30%)</td>
                <td className="py-2 text-right text-red-600">{formatCurrency(impuestos)}</td>
              </tr>
              <tr className="font-bold text-lg">
                <td className="py-3">Utilidad Neta</td>
                <td className="py-3 text-right text-emerald-600">{formatCurrency(utilidadNeta)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function EbitdaReport() {
  const ingresos = 12850000
  const costosOperativos = 3200000
  const gastosAdmin = 920000
  const ebitda = ingresos - costosOperativos - gastosAdmin
  const depreciacion = 1200000
  const amortizacion = 350000
  const ebit = ebitda - depreciacion - amortizacion
  const margenEbitda = (ebitda / ingresos) * 100

  return (
    <div className="space-y-6 py-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
        <p className="text-muted-foreground">Analisis de EBITDA</p>
        <p className="text-sm text-muted-foreground">Periodo: Q4 2024</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2 border-cyan-500/20">
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">EBITDA</div>
            <div className="text-3xl font-bold text-cyan-600">{formatCurrency(ebitda)}</div>
            <div className="flex items-center justify-center gap-1 text-emerald-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4" />
              +12.5% vs Q3
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
              +8.3% vs Q3
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
          <table className="w-full">
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3 font-medium">Ingresos Operativos</td>
                <td className="py-3 text-right font-medium">{formatCurrency(ingresos)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pl-4">(-) Costos Operativos</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(costosOperativos)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pl-4">(-) Gastos de Administracion</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(gastosAdmin)}</td>
              </tr>
              <tr className="border-b bg-cyan-500/5">
                <td className="py-3 font-bold text-cyan-700">EBITDA</td>
                <td className="py-3 text-right font-bold text-cyan-700">{formatCurrency(ebitda)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pl-4">(-) Depreciacion</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(depreciacion)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 pl-4">(-) Amortizacion</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(amortizacion)}</td>
              </tr>
              <tr className="bg-muted/50">
                <td className="py-3 font-bold">EBIT (Utilidad Operativa)</td>
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
                <td className="py-2 text-right">{formatCurrency(7200000)}</td>
                <td className="py-2 text-right">62.5%</td>
                <td className="py-2 text-right">-</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Q2 2024</td>
                <td className="py-2 text-right">{formatCurrency(7650000)}</td>
                <td className="py-2 text-right">64.1%</td>
                <td className="py-2 text-right text-emerald-600">+6.3%</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Q3 2024</td>
                <td className="py-2 text-right">{formatCurrency(7760000)}</td>
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
  )
}

function AssetsReport() {
  const totalValor = activos.reduce((sum, a) => sum + (a.valorTotal || 0), 0)
  
  return (
    <div className="space-y-6 py-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
        <p className="text-muted-foreground">Valuacion de Activos</p>
        <p className="text-sm text-muted-foreground">Fecha de corte: {formatDate(new Date().toISOString())}</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Total Activos</div>
            <div className="text-3xl font-bold">{activos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
            <div className="text-sm text-muted-foreground">Valor Total</div>
            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalValor)}</div>
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
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-2">Activo</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Ubicacion</th>
                <th className="pb-2 text-right">Valor Actual</th>
                <th className="pb-2 text-right">Plusvalia</th>
                <th className="pb-2 text-right">Ocupacion</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activos.map((activo) => (
                <tr key={activo.id} className="border-b">
                  <td className="py-3 font-medium">{activo.nombre}</td>
                  <td className="py-3">
                    <Badge variant="outline">{activo.tipo}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">{activo.ubicacion}</td>
                  <td className="py-3 text-right">{formatCurrency(activo.valorTotal || 0)}</td>
                  <td className="py-3 text-right">
                    <span className="text-emerald-600">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
                  </td>
                  <td className="py-3 text-right">{activo.ocupacion}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-muted/50">
                <td className="py-3" colSpan={3}>Total</td>
                <td className="py-3 text-right">{formatCurrency(totalValor)}</td>
                <td className="py-3 text-right text-emerald-600">+18.5%</td>
                <td className="py-3 text-right">92%</td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function InvestorsReport() {
  const totalInversion = inversionistas.reduce((sum, i) => sum + i.montoInvertido, 0)
  const totalDividendos = inversionistas.reduce((sum, i) => sum + (i.dividendosAcumulados || 0), 0)

  return (
    <div className="space-y-6 py-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
        <p className="text-muted-foreground">Reporte de Inversionistas</p>
        <p className="text-sm text-muted-foreground">Periodo: Q4 2024</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">Inversionistas</div>
            <div className="text-2xl font-bold">{inversionistas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">Capital Total</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInversion)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">Dividendos Distribuidos</div>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalDividendos)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">Rendimiento Promedio</div>
            <div className="text-2xl font-bold text-blue-600">12.8%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalle por Inversionista</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-2">Inversionista</th>
                <th className="pb-2 text-right">Inversion</th>
                <th className="pb-2 text-right">Participacion</th>
                <th className="pb-2 text-right">Dividendos Q4</th>
                <th className="pb-2 text-right">Rendimiento</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {inversionistas.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="py-3">
                    <div className="font-medium">{inv.nombre}</div>
                    <div className="text-xs text-muted-foreground">{inv.email}</div>
                  </td>
                  <td className="py-3 text-right">{formatCurrency(inv.montoInvertido)}</td>
                  <td className="py-3 text-right">{inv.porcentajeParticipacion}%</td>
                  <td className="py-3 text-right text-emerald-600">
                    {formatCurrency((inv.dividendosAcumulados || 0) * 0.25)}
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-0">
                      {inv.rentabilidad}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function TaxReport() {
  const ingresosBrutos = 12850000
  const deducciones = 4120000
  const baseGravable = ingresosBrutos - deducciones
  const isr = baseGravable * 0.30
  const iva = ingresosBrutos * 0.16

  return (
    <div className="space-y-6 py-4">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold">1D10 INVERSIONES S.A. DE C.V.</h2>
        <p className="text-muted-foreground">Reporte Fiscal</p>
        <p className="text-sm text-muted-foreground">Ejercicio Fiscal 2024</p>
        <Badge className="mt-2">En Proceso</Badge>
      </div>

      {/* Resumen fiscal */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">Base Gravable</div>
            <div className="text-2xl font-bold">{formatCurrency(baseGravable)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">ISR a Pagar</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(isr)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">IVA Trasladado</div>
            <div className="text-2xl font-bold">{formatCurrency(iva)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calculo ISR */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calculo del ISR</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3">Ingresos Acumulables</td>
                <td className="py-3 text-right">{formatCurrency(ingresosBrutos)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">(-) Deducciones Autorizadas</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(deducciones)}</td>
              </tr>
              <tr className="border-b font-medium">
                <td className="py-3">Base Gravable</td>
                <td className="py-3 text-right">{formatCurrency(baseGravable)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Tasa ISR (30%)</td>
                <td className="py-3 text-right">30%</td>
              </tr>
              <tr className="bg-muted/50 font-bold">
                <td className="py-3">ISR a Pagar</td>
                <td className="py-3 text-right text-red-600">{formatCurrency(isr)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Deducciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deducciones Aplicadas</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-2">Concepto</th>
                <th className="pb-2 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-2">Gastos de operacion</td>
                <td className="py-2 text-right">{formatCurrency(1800000)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Depreciacion de activos</td>
                <td className="py-2 text-right">{formatCurrency(1200000)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Gastos de administracion</td>
                <td className="py-2 text-right">{formatCurrency(720000)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Seguros y fianzas</td>
                <td className="py-2 text-right">{formatCurrency(400000)}</td>
              </tr>
              <tr className="font-semibold">
                <td className="py-2">Total Deducciones</td>
                <td className="py-2 text-right">{formatCurrency(deducciones)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
