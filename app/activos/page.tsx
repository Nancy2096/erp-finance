'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CreditCard,
  TrendingUp,
  FileText,
  History,
  LayoutGrid,
  List,
  Building2,
} from 'lucide-react';
import { useActivos } from '@/lib/activos-context';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatPercentage,
  getEstadoLabel,
  getEstadoColor,
  getTipoActivoLabel,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import type { EstadoActivo, TipoActivo } from '@/lib/types';

type ViewMode = 'table' | 'cards';

export default function ActivosPage() {
  const { activos } = useActivos();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  
  const filteredActivos = useMemo(() => {
  return activos.filter((activo) => {
      const matchesSearch =
        activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activo.empresaRelacionada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = estadoFilter === 'all' || activo.estado === estadoFilter;
      const matchesTipo = tipoFilter === 'all' || activo.tipoActivo === tipoFilter;
      return matchesSearch && matchesEstado && matchesTipo;
    });
  }, [searchTerm, estadoFilter, tipoFilter]);

  const stats = useMemo(() => {
    const total = activos.length;
    const generando = activos.filter((a) => a.estado === 'generando_rentas').length;
    const enProceso = activos.filter((a) => ['en_pago', 'en_proceso_compra', 'en_espera_entrega'].includes(a.estado)).length;
    const valorTotal = activos.reduce((sum, a) => sum + a.valorTotal, 0);
    return { total, generando, enProceso, valorTotal };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los activos del portafolio
            </p>
          </div>
          <Button asChild>
            <Link href="/activos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Activo
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total de activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.generando}</p>
                  <p className="text-xs text-muted-foreground">Generando rentas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.enProceso}</p>
                  <p className="text-xs text-muted-foreground">En proceso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.valorTotal)}</p>
                  <p className="text-xs text-muted-foreground">Valor total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar activos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="en_analisis">En análisis</SelectItem>
                    <SelectItem value="en_negociacion">En negociación</SelectItem>
                    <SelectItem value="en_proceso_compra">En proceso de compra</SelectItem>
                    <SelectItem value="en_pago">En pago</SelectItem>
                    <SelectItem value="generando_rentas">Generando rentas</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Building2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="inmueble_completo">Inmueble completo</SelectItem>
                    <SelectItem value="pool_rentas">Pool de rentas</SelectItem>
                    <SelectItem value="participacion_parcial">Participación parcial</SelectItem>
                    <SelectItem value="camion_renta">Camión en renta</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="local_comercial">Local comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead className="text-right">Renta Mensual</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivos.map((activo) => (
                    <TableRow key={activo.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/activos/${activo.id}`}
                            className="font-medium hover:underline"
                          >
                            {activo.nombre}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {activo.ubicacion}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getTipoActivoLabel(activo.tipoActivo)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', getEstadoColor(activo.estado))}
                        >
                          {getEstadoLabel(activo.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(activo.valorTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(activo.montoPagado)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={activo.porcentajeAdquisicion} className="h-2 w-16" />
                          <span className="text-xs font-medium">
                            {formatPercentage(activo.porcentajeAdquisicion, 0)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {activo.estado === 'generando_rentas'
                          ? formatCurrency(activo.rentabilidadMensualEsperada)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {activo.roi > 0 ? formatPercentage(activo.roi) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/activos/${activo.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalle
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/activos/${activo.id}/editar`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Registrar pago
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Registrar ingreso
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Subir documento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <History className="mr-2 h-4 w-4" />
                              Ver historial
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivos.map((activo) => (
              <Card key={activo.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        <Link href={`/activos/${activo.id}`} className="hover:underline">
                          {activo.nombre}
                        </Link>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activo.ubicacion}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] shrink-0', getEstadoColor(activo.estado))}
                    >
                      {getEstadoLabel(activo.estado)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium">{getTipoActivoLabel(activo.tipoActivo)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valor Total</span>
                    <span className="font-medium">{formatCurrency(activo.valorTotal)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avance de adquisición</span>
                      <span className="font-medium">{formatPercentage(activo.porcentajeAdquisicion, 0)}</span>
                    </div>
                    <Progress value={activo.porcentajeAdquisicion} className="h-2" />
                  </div>
                  {activo.estado === 'generando_rentas' && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Renta mensual</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(activo.rentabilidadMensualEsperada)}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/activos/${activo.id}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        Ver
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/activos/${activo.id}/editar`}>
                        <Edit className="mr-2 h-3 w-3" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredActivos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No se encontraron activos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Intenta ajustar los filtros o crea un nuevo activo
              </p>
              <Button className="mt-4" asChild>
                <Link href="/activos/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Activo
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
