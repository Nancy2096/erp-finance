'use client';

import { use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Edit,
  CreditCard,
  TrendingUp,
  FileText,
  Building2,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  UserCircle,
  FileCheck,
  ExternalLink,
  Download,
  FileSignature,
  Receipt,
  Scale,
  PieChart as PieChartIcon,
  Calculator,
  Landmark,
  FolderOpen,
} from 'lucide-react';
import { pagos, dividendos, movimientos } from '@/lib/mock-data';
import { useActivos } from '@/lib/activos-context';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatPercentage,
  formatMonths,
  getEstadoLabel,
  getEstadoColor,
  getTipoActivoLabel,
  getEstatusPagoColor,
  getEstatusDividendoColor,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetalleActivoPage({ params }: PageProps) {
  const { id } = use(params);
  const { getActivoById, activos } = useActivos();
  const activo = getActivoById(id) || activos[0];
  const pagosActivo = pagos.filter((p) => p.activoId === activo?.id);
  const dividendosActivo = dividendos.filter((d) => d.activoId === activo.id);
  const movimientosActivo = movimientos.filter((m) => m.activoId === activo.id);

  const pieData = [
    { name: 'Pagado', value: activo.montoPagado, fill: '#10b981' },
    { name: 'Pendiente', value: activo.montoPendiente, fill: '#ef4444' },
  ];

  const timelineEvents = [
    { fecha: activo.fechaCompra, evento: 'Registro de compra', tipo: 'compra' },
    ...pagosActivo.map((p) => ({ fecha: p.fecha, evento: `Pago: ${formatCurrency(p.monto)}`, tipo: 'pago' })),
    ...(activo.fechaRealEntrega ? [{ fecha: activo.fechaRealEntrega, evento: 'Entrega del activo', tipo: 'entrega' }] : []),
    ...(activo.fechaRealDividendos ? [{ fecha: activo.fechaRealDividendos, evento: 'Inicio de dividendos', tipo: 'dividendo' }] : []),
  ].filter((e) => e.fecha).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild className="mt-1">
              <Link href="/activos">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{activo.nombre}</h1>
                <Badge variant="outline" className={cn('text-xs', getEstadoColor(activo.estado))}>
                  {getEstadoLabel(activo.estado)}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {getTipoActivoLabel(activo.tipoActivo)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {activo.ubicacion}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {activo.responsableInterno}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/activos/${activo.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Registrar Pago
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">{formatCurrencyCompact(activo.valorTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pagado</p>
                  <p className="text-xl font-bold">{formatCurrencyCompact(activo.montoPagado)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pendiente</p>
                  <p className="text-xl font-bold">{formatCurrencyCompact(activo.montoPendiente)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="text-xl font-bold">{activo.roi > 0 ? formatPercentage(activo.roi) : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
            <TabsTrigger value="dividendos">Dividendos</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Resumen Tab */}
          <TabsContent value="resumen" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Información General */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa relacionada</p>
                    <p className="font-medium">{activo.empresaRelacionada}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RFC</p>
                    <p className="font-medium">{activo.rfc || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de compra</p>
                    <p className="font-medium">{formatDate(activo.fechaCompra)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de entrega</p>
                    <p className="font-medium">{formatDate(activo.fechaRealEntrega || activo.fechaEstimadaEntrega || '')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inicio dividendos</p>
                    <p className="font-medium">{formatDate(activo.fechaRealDividendos || activo.fechaEstimadaDividendos || '')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de compra</p>
                    <p className="font-medium capitalize">{activo.formaCompra}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Descripción</p>
                    <p className="font-medium">{activo.descripcion || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Avance de Adquisición */}
              <Card>
                <CardHeader>
                  <CardTitle>Avance de Adquisición</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{formatPercentage(activo.porcentajeAdquisicion, 1)}</span>
                    </div>
                    <Progress value={activo.porcentajeAdquisicion} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Pagado</p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(activo.montoPagado)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Pendiente</p>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(activo.montoPendiente)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de Rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rentabilidad Mensual Esperada</p>
                    <p className="text-xl font-bold">{formatCurrency(activo.rentabilidadMensualEsperada)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rentabilidad Anual Esperada</p>
                    <p className="text-xl font-bold">{formatCurrency(activo.rentabilidadAnualEsperada)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dividendos Acumulados</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(activo.dividendosAcumulados)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor Actual Estimado</p>
                    <p className="text-xl font-bold">{formatCurrency(activo.valorActualEstimado)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-xl font-bold">{activo.roi > 0 ? formatPercentage(activo.roi) : '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payback</p>
                    <p className="text-xl font-bold">{activo.payback > 0 ? formatMonths(activo.payback) : '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Apreciación Esperada</p>
                    <p className="text-xl font-bold">{formatPercentage(activo.porcentajeApreciacion)} anual</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Periodicidad</p>
                    <p className="text-xl font-bold capitalize">{activo.periodicidadDividendos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ubicacion del Activo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicacion del Activo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-sm text-muted-foreground">Direccion</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.direccion || activo.ubicacion || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Colonia</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.colonia || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ciudad</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.ciudad || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.estado || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Codigo Postal</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.codigoPostal || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pais</p>
                    <p className="font-medium">{activo.ubicacionDetalle?.pais || 'Mexico'}</p>
                  </div>
                  {activo.ubicacionDetalle?.referencias && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-sm text-muted-foreground">Referencias</p>
                      <p className="font-medium">{activo.ubicacionDetalle.referencias}</p>
                    </div>
                  )}
                </div>
                
                {/* Mapa de Google Maps */}
                {(activo.ubicacionDetalle?.latitud && activo.ubicacionDetalle?.longitud) ? (
                  <div className="mt-4 rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${activo.ubicacionDetalle.latitud},${activo.ubicacionDetalle.longitud}&zoom=16`}
                    />
                  </div>
                ) : (activo.ubicacionDetalle?.direccion || activo.ubicacion) ? (
                  <div className="mt-4 rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                        [
                          activo.ubicacionDetalle?.direccion || activo.ubicacion,
                          activo.ubicacionDetalle?.colonia,
                          activo.ubicacionDetalle?.ciudad,
                          activo.ubicacionDetalle?.estado,
                          activo.ubicacionDetalle?.codigoPostal,
                          activo.ubicacionDetalle?.pais || 'Mexico'
                        ].filter(Boolean).join(', ')
                      )}`}
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border bg-muted/50 h-[200px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay ubicacion configurada</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Datos Generales de la Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Datos Generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre Comercial</p>
                      <p className="font-medium">{activo.empresaInfo?.nombre || activo.empresaRelacionada}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Razon Social</p>
                      <p className="font-medium">{activo.empresaInfo?.razonSocial || activo.razonSocial || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RFC</p>
                      <p className="font-medium font-mono">{activo.empresaInfo?.rfc || activo.rfc || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pais</p>
                      <p className="font-medium">{activo.empresaInfo?.pais || 'Mexico'}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Direccion</p>
                    <p className="font-medium">{activo.empresaInfo?.direccion || activo.direccionFiscal || '-'}</p>
                    {(activo.empresaInfo?.ciudad || activo.empresaInfo?.estado) && (
                      <p className="text-sm text-muted-foreground">
                        {[activo.empresaInfo?.ciudad, activo.empresaInfo?.estado, activo.empresaInfo?.codigoPostal].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contacto de la Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefono</p>
                        <p className="font-medium">{activo.empresaInfo?.telefono || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{activo.empresaInfo?.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pagina Web</p>
                        {activo.empresaInfo?.paginaWeb ? (
                          <a href={activo.empresaInfo.paginaWeb} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center gap-1">
                            {activo.empresaInfo.paginaWeb}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="font-medium">-</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Redes Sociales</p>
                    <div className="flex gap-2">
                      {activo.empresaInfo?.facebook && (
                        <a href={activo.empresaInfo.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-muted/80">
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {activo.empresaInfo?.instagram && (
                        <a href={activo.empresaInfo.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-muted/80">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {activo.empresaInfo?.linkedin && (
                        <a href={activo.empresaInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-muted/80">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {activo.empresaInfo?.twitter && (
                        <a href={activo.empresaInfo.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-muted/80">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {!activo.empresaInfo?.facebook && !activo.empresaInfo?.instagram && !activo.empresaInfo?.linkedin && !activo.empresaInfo?.twitter && (
                        <p className="text-sm text-muted-foreground">Sin redes sociales registradas</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Representante Legal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Representante Legal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{activo.empresaInfo?.representanteLegal || '-'}</p>
                      <p className="text-sm text-muted-foreground">Representante Legal</p>
                    </div>
                  </div>
                  <div className="grid gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activo.empresaInfo?.representanteTelefono || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activo.empresaInfo?.representanteEmail || '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documentos Legales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Documentos Legales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Acta Constitutiva</p>
                        <p className="text-xs text-muted-foreground">PDF</p>
                      </div>
                    </div>
                    {activo.empresaInfo?.actaConstitutivaUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={activo.empresaInfo.actaConstitutivaUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Ver
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-amber-600">Pendiente</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Poder Notarial</p>
                        <p className="text-xs text-muted-foreground">PDF</p>
                      </div>
                    </div>
                    {activo.empresaInfo?.poderNotarialUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={activo.empresaInfo.poderNotarialUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Ver
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-amber-600">Pendiente</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Comprobante de Domicilio</p>
                        <p className="text-xs text-muted-foreground">PDF</p>
                      </div>
                    </div>
                    {activo.empresaInfo?.comprobanteDomicilioUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={activo.empresaInfo.comprobanteDomicilioUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Ver
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-amber-600">Pendiente</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">ID Representante Legal</p>
                        <p className="text-xs text-muted-foreground">PDF</p>
                      </div>
                    </div>
                    {activo.empresaInfo?.identificacionRepresentanteUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={activo.empresaInfo.identificacionRepresentanteUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Ver
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-amber-600">Pendiente</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notas */}
            {activo.empresaInfo?.notas && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{activo.empresaInfo.notas}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pagos Tab */}
          <TabsContent value="pagos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial de Pagos</CardTitle>
                  <CardDescription>Todos los pagos realizados para este activo</CardDescription>
                </div>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Nuevo Pago
                </Button>
              </CardHeader>
              <CardContent>
                {pagosActivo.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay pagos registrados</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Estatus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagosActivo.map((pago) => (
                        <TableRow key={pago.id}>
                          <TableCell>{formatDate(pago.fecha)}</TableCell>
                          <TableCell className="capitalize">{pago.tipoPago.replace(/_/g, ' ')}</TableCell>
                          <TableCell>{pago.concepto}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(pago.monto)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('text-xs', getEstatusPagoColor(pago.estatus))}>
                              {pago.estatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dividendos Tab */}
          <TabsContent value="dividendos">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Dividendos y Rentas</CardTitle>
                  <CardDescription>Historial de ingresos generados por este activo</CardDescription>
                </div>
                <Button>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Registrar Dividendo
                </Button>
              </CardHeader>
              <CardContent>
                {dividendosActivo.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay dividendos registrados</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Periodo</TableHead>
                        <TableHead>Fecha Recepción</TableHead>
                        <TableHead className="text-right">Esperado</TableHead>
                        <TableHead className="text-right">Recibido</TableHead>
                        <TableHead className="text-right">Diferencia</TableHead>
                        <TableHead>Estatus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dividendosActivo.map((div) => (
                        <TableRow key={div.id}>
                          <TableCell className="font-medium">{div.periodo}</TableCell>
                          <TableCell>{formatDate(div.fechaRecepcion)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(div.montoEsperado)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(div.montoRecibido)}</TableCell>
                          <TableCell className={cn(
                            'text-right',
                            div.diferencia > 0 ? 'text-emerald-600 dark:text-emerald-400' : div.diferencia < 0 ? 'text-red-600 dark:text-red-400' : ''
                          )}>
                            {div.diferencia > 0 ? '+' : ''}{formatCurrency(div.diferencia)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('text-xs', getEstatusDividendoColor(div.estatus))}>
                              {div.estatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Movimientos Tab */}
          <TabsContent value="movimientos">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Financieros</CardTitle>
                <CardDescription>Todos los ingresos y egresos relacionados</CardDescription>
              </CardHeader>
              <CardContent>
                {movimientosActivo.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay movimientos registrados</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Comentarios</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movimientosActivo.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell>{formatDate(mov.fecha)}</TableCell>
                          <TableCell>
                            <Badge variant={mov.tipo === 'ingreso' ? 'default' : 'secondary'} className="text-xs">
                              {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{mov.categoria.replace(/_/g, ' ')}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{mov.comentarios}</TableCell>
                          <TableCell className={cn(
                            'text-right font-medium',
                            mov.tipo === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          )}>
                            {mov.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(mov.monto)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Documentos del Activo</h3>
                <p className="text-sm text-muted-foreground">Archivos vinculados a Google Drive organizados por categoria</p>
              </div>
              <Button asChild>
                <Link href={`/activos/${id}/editar`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Agregar Documento
                </Link>
              </Button>
            </div>

            {/* Categorias de documentos */}
            {(() => {
              const categorias = [
                { key: 'contratos', label: 'Contratos', icon: FileSignature, color: 'bg-blue-500/10 text-blue-500', tipos: ['contrato', 'escritura'] },
                { key: 'facturas', label: 'Facturas', icon: Receipt, color: 'bg-green-500/10 text-green-500', tipos: ['factura'] },
                { key: 'comprobantes', label: 'Comprobantes de Pago', icon: CreditCard, color: 'bg-purple-500/10 text-purple-500', tipos: ['comprobante_pago'] },
                { key: 'legal', label: 'Legal', icon: Scale, color: 'bg-amber-500/10 text-amber-500', tipos: ['acta_constitutiva', 'poder_notarial', 'identificacion'] },
                { key: 'reportes', label: 'Reportes', icon: PieChartIcon, color: 'bg-cyan-500/10 text-cyan-500', tipos: ['reporte', 'avaluo'] },
                { key: 'fiscal', label: 'Fiscal', icon: Calculator, color: 'bg-red-500/10 text-red-500', tipos: ['fiscal', 'declaracion'] },
                { key: 'estados_cuenta', label: 'Estados de Cuenta', icon: Landmark, color: 'bg-indigo-500/10 text-indigo-500', tipos: ['estado_cuenta', 'bancario'] },
                { key: 'otros', label: 'Otros Documentos', icon: FolderOpen, color: 'bg-gray-500/10 text-gray-500', tipos: ['otro', 'plano', 'fotografia'] },
              ];

              const documentosPorCategoria = categorias.map(cat => ({
                ...cat,
                docs: activo.documentos?.filter(d => cat.tipos.includes(d.tipo)) || []
              }));

              const hayDocumentos = activo.documentos && activo.documentos.length > 0;

              if (!hayDocumentos) {
                return (
                  <Card>
                    <CardContent className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground font-medium">No hay documentos vinculados</p>
                        <p className="text-sm text-muted-foreground mb-4">Agrega enlaces a Google Drive desde la seccion de edicion</p>
                        <Button variant="outline" asChild>
                          <Link href={`/activos/${id}/editar`}>
                            Agregar documentos
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div className="grid gap-4 md:grid-cols-2">
                  {documentosPorCategoria.map((categoria) => {
                    const IconComponent = categoria.icon;
                    return (
                      <Card key={categoria.key} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${categoria.color}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{categoria.label}</CardTitle>
                              <CardDescription className="text-xs">
                                {categoria.docs.length} documento{categoria.docs.length !== 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {categoria.docs.length > 0 ? (
                            <div className="space-y-2">
                              {categoria.docs.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{doc.nombre}</p>
                                    {doc.descripcion && (
                                      <p className="text-xs text-muted-foreground truncate">{doc.descripcion}</p>
                                    )}
                                    {doc.fechaCarga && (
                                      <p className="text-xs text-muted-foreground">Subido: {doc.fechaCarga}</p>
                                    )}
                                  </div>
                                  {doc.googleDriveUrl ? (
                                    <Button variant="ghost" size="sm" asChild className="ml-2 shrink-0">
                                      <a href={doc.googleDriveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        <svg className="h-4 w-4" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                                          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                                          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                                          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                                          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                                          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                                          <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                                        </svg>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="text-amber-500 text-xs ml-2">Sin enlace</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                              <IconComponent className="h-8 w-8 text-muted-foreground/30 mb-2" />
                              <p className="text-xs text-muted-foreground">Sin documentos</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              );
            })()}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline del Activo</CardTitle>
                <CardDescription>Historial de eventos importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-border">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary" />
                      <div className="flex-1 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.evento}</p>
                          <span className="text-sm text-muted-foreground">{formatDate(event.fecha)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
