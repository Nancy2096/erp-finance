'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Pencil,
  X,
  ArrowUpRight,
  Banknote,
  Send,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { activos } from '@/lib/mock-data';
import { useInversionistas } from '@/lib/inversionistas-context';
import type { Distribucion, EstatusDistribucion } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getEstatusColor = (estatus: EstatusDistribucion) => {
  switch (estatus) {
    case 'pagado':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'pendiente':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'parcial':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'programado':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'cancelado':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getEstatusIcon = (estatus: EstatusDistribucion) => {
  switch (estatus) {
    case 'pagado':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'pendiente':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'parcial':
      return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
    case 'programado':
      return <Clock className="h-4 w-4 text-purple-500" />;
    case 'cancelado':
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const estatusLabels: Record<EstatusDistribucion, string> = {
  pagado: 'Pagado',
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  programado: 'Programado',
  cancelado: 'Cancelado',
};

export default function DistribucionesPage() {
  const { inversionistas, distribuciones, addDistribucion, updateDistribucion, deleteDistribucion, isLoaded } = useInversionistas();
  const [searchTerm, setSearchTerm] = useState('');
  const [estatusFilter, setEstatusFilter] = useState<string>('all');
  const [inversionistaFilter, setInversionistaFilter] = useState<string>('all');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDistribucion, setSelectedDistribucion] = useState<Distribucion | null>(null);

  // Estados para nueva distribución
  const [newInversionistaId, setNewInversionistaId] = useState('');
  const [newActivoId, setNewActivoId] = useState('');
  const [newPeriodo, setNewPeriodo] = useState('');
  const [newFechaProgramada, setNewFechaProgramada] = useState('');
  const [newMontoCalculado, setNewMontoCalculado] = useState('');
  const [newMetodoPago, setNewMetodoPago] = useState('transferencia');
  const [newComentarios, setNewComentarios] = useState('');

  // Estados para edición
  const [editMontoPagado, setEditMontoPagado] = useState('');
  const [editFechaPago, setEditFechaPago] = useState('');
  const [editEstatus, setEditEstatus] = useState('');
  const [editReferencia, setEditReferencia] = useState('');
  const [editComentarios, setEditComentarios] = useState('');

  const resetNewForm = () => {
    setNewInversionistaId('');
    setNewActivoId('');
    setNewPeriodo('');
    setNewFechaProgramada('');
    setNewMontoCalculado('');
    setNewMetodoPago('transferencia');
    setNewComentarios('');
  };

  const handleSaveNew = () => {
    if (!newInversionistaId || !newPeriodo || !newFechaProgramada || !newMontoCalculado) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    const inv = inversionistas.find((i) => i.id === newInversionistaId);
    const activoIdFinal = newActivoId === 'none' ? undefined : newActivoId;
    const act = activoIdFinal ? activos.find((a) => a.id === activoIdFinal) : undefined;

    const nuevaDistribucion: Omit<Distribucion, 'id'> = {
      inversionistaId: newInversionistaId,
      inversionistaNombre: inv?.nombre || '',
      activoId: activoIdFinal,
      activoNombre: act?.nombre,
      periodo: newPeriodo,
      fechaProgramada: newFechaProgramada,
      montoCalculado: parseFloat(newMontoCalculado) || 0,
      montoPagado: 0,
      porcentajeParticipacion: inv?.porcentajeParticipacion || 0,
      metodoPago: newMetodoPago as 'transferencia' | 'cheque' | 'efectivo' | 'otro',
      cuentaDestino: inv?.cuentaBancaria,
      bancoDestino: inv?.banco,
      estatus: 'programado',
      comentarios: newComentarios || undefined,
      creadoPor: 'Usuario Actual',
      fechaCreacion: new Date().toISOString().split('T')[0],
    };

    addDistribucion(nuevaDistribucion as Distribucion);
    resetNewForm();
    setDialogOpen(false);
  };

  const handleEditClick = (dist: Distribucion) => {
    setSelectedDistribucion(dist);
    setEditMontoPagado(dist.montoPagado.toString());
    setEditFechaPago(dist.fechaPago || '');
    setEditEstatus(dist.estatus);
    setEditReferencia(dist.referencia || '');
    setEditComentarios(dist.comentarios || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedDistribucion) return;

    updateDistribucion(selectedDistribucion.id, {
      montoPagado: parseFloat(editMontoPagado) || 0,
      fechaPago: editFechaPago || undefined,
      estatus: editEstatus as EstatusDistribucion,
      referencia: editReferencia || undefined,
      comentarios: editComentarios || undefined,
    });
    setEditDialogOpen(false);
    setSelectedDistribucion(null);
  };

  const handleMarcarPagado = (dist: Distribucion) => {
    updateDistribucion(dist.id, {
      montoPagado: dist.montoCalculado,
      fechaPago: new Date().toISOString().split('T')[0],
      estatus: 'pagado' as EstatusDistribucion,
    });
  };

  const handleEliminar = (dist: Distribucion) => {
    if (confirm(`¿Estás seguro de eliminar la distribución de ${dist.inversionistaNombre} - ${dist.periodo}?`)) {
      deleteDistribucion(dist.id);
    }
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setEstatusFilter('all');
    setInversionistaFilter('all');
    setFechaInicio('');
    setFechaFin('');
  };

  const hayFiltros = searchTerm || estatusFilter !== 'all' || inversionistaFilter !== 'all' || fechaInicio || fechaFin;

  const filteredDistribuciones = useMemo(() => {
    return distribuciones.filter((dist) => {
      const matchesSearch =
        dist.inversionistaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.periodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dist.activoNombre && dist.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesEstatus = estatusFilter === 'all' || dist.estatus === estatusFilter;
      const matchesInversionista = inversionistaFilter === 'all' || dist.inversionistaId === inversionistaFilter;

      let matchesFecha = true;
      if (fechaInicio || fechaFin) {
        const distDate = new Date(dist.fechaProgramada);
        if (fechaInicio) matchesFecha = matchesFecha && distDate >= new Date(fechaInicio);
        if (fechaFin) matchesFecha = matchesFecha && distDate <= new Date(fechaFin);
      }

      return matchesSearch && matchesEstatus && matchesInversionista && matchesFecha;
    });
  }, [searchTerm, estatusFilter, inversionistaFilter, fechaInicio, fechaFin, distribuciones]);

  const stats = useMemo(() => {
    const totalCalculado = distribuciones.reduce((sum, d) => sum + d.montoCalculado, 0);
    const totalPagado = distribuciones.reduce((sum, d) => sum + d.montoPagado, 0);
    const pendiente = totalCalculado - totalPagado;
    const pagados = distribuciones.filter((d) => d.estatus === 'pagado').length;
    const pendientes = distribuciones.filter((d) => d.estatus === 'pendiente' || d.estatus === 'programado').length;
    return { totalCalculado, totalPagado, pendiente, pagados, pendientes };
  }, [distribuciones]);

  // Datos para gráfica por inversionista
  const chartDataPorInversionista = useMemo(() => {
    const porInversionista: Record<string, { nombre: string; pagado: number; pendiente: number; total: number }> = {};
    
    distribuciones.forEach((d) => {
      if (!porInversionista[d.inversionistaNombre]) {
        porInversionista[d.inversionistaNombre] = { nombre: d.inversionistaNombre, pagado: 0, pendiente: 0, total: 0 };
      }
      porInversionista[d.inversionistaNombre].pagado += d.montoPagado;
      porInversionista[d.inversionistaNombre].pendiente += d.montoCalculado - d.montoPagado;
      porInversionista[d.inversionistaNombre].total += d.montoCalculado;
    });
    
    return Object.values(porInversionista);
  }, [distribuciones]);

  // Datos para gráfica de porcentaje de distribución por inversionista (pie)
  const chartDataPorcentajeDistribucion = useMemo(() => {
    const porInversionista: Record<string, number> = {};
    
    distribuciones.forEach((d) => {
      porInversionista[d.inversionistaNombre] = (porInversionista[d.inversionistaNombre] || 0) + d.montoCalculado;
    });
    
    const total = Object.values(porInversionista).reduce((sum, val) => sum + val, 0);
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    
    return Object.entries(porInversionista).map(([nombre, monto], index) => ({
      nombre,
      monto,
      porcentaje: total > 0 ? ((monto / total) * 100).toFixed(1) : '0',
      color: colors[index % colors.length],
    }));
  }, [distribuciones]);

  // Datos para gráfica de estatus (pie chart)
  const chartDataEstatus = useMemo(() => {
    const estatusCounts: Record<string, number> = {};
    
    distribuciones.forEach((d) => {
      const label = estatusLabels[d.estatus] || d.estatus;
      estatusCounts[label] = (estatusCounts[label] || 0) + d.montoCalculado;
    });
    
    const colors: Record<string, string> = {
      'Pagado': '#10b981',
      'Pendiente': '#f59e0b',
      'Parcial': '#3b82f6',
      'Programado': '#8b5cf6',
      'Cancelado': '#ef4444',
    };
    
    return Object.entries(estatusCounts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748b',
    }));
  }, [distribuciones]);

  // Datos para gráfica por periodo
  const chartDataPorPeriodo = useMemo(() => {
    const porPeriodo: Record<string, { pagado: number; calculado: number }> = {};
    
    distribuciones.forEach((d) => {
      if (!porPeriodo[d.periodo]) {
        porPeriodo[d.periodo] = { pagado: 0, calculado: 0 };
      }
      porPeriodo[d.periodo].pagado += d.montoPagado;
      porPeriodo[d.periodo].calculado += d.montoCalculado;
    });
    
    return Object.entries(porPeriodo)
      .map(([periodo, data]) => ({
        periodo,
        pagado: data.pagado,
        calculado: data.calculado,
      }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo));
  }, [distribuciones]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Distribuciones</h1>
            <p className="text-muted-foreground">Gestiona los pagos y distribuciones a inversionistas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Distribución
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Calculado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalCalculado)}</div>
              <p className="text-xs text-muted-foreground">Monto total a distribuir</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalPagado)}</div>
              <p className="text-xs text-muted-foreground">{stats.pagados} distribuciones pagadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pendiente)}</div>
              <p className="text-xs text-muted-foreground">{stats.pendientes} distribuciones pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inversionistas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inversionistas.filter((i) => i.estatus === 'activo').length}</div>
              <p className="text-xs text-muted-foreground">Inversionistas activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Graficas de Distribuciones */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Grafica de Porcentaje de Distribución por Inversionista (Pie) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Participacion en Distribuciones</CardTitle>
              <CardDescription>Porcentaje de distribuciones por inversionista</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataPorcentajeDistribucion}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="monto"
                      nameKey="nombre"
                    >
                      {chartDataPorcentajeDistribucion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      formatter={(value, entry) => {
                        const item = chartDataPorcentajeDistribucion.find(d => d.nombre === value);
                        return `${value} (${item?.porcentaje}%)`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Grafica de Estatus (Pie) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado de Distribuciones</CardTitle>
              <CardDescription>Distribucion por estatus de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataEstatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartDataEstatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Grafica por Inversionista - Tabla visual mejorada */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Distribuciones por Inversionista</CardTitle>
              <CardDescription>Desglose de montos pagados y pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartDataPorInversionista.map((inv, index) => {
                  const porcentajePagado = inv.total > 0 ? (inv.pagado / inv.total) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{inv.nombre}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-emerald-600">Pagado: {formatCurrency(inv.pagado)}</span>
                          <span className="text-amber-600">Pendiente: {formatCurrency(inv.pendiente)}</span>
                          <span className="text-muted-foreground">Total: {formatCurrency(inv.total)}</span>
                        </div>
                      </div>
                      <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-l-full transition-all"
                          style={{ width: `${porcentajePagado}%` }}
                        />
                        <div 
                          className="absolute inset-y-0 bg-amber-500 rounded-r-full transition-all"
                          style={{ left: `${porcentajePagado}%`, width: `${100 - porcentajePagado}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
                          {porcentajePagado.toFixed(0)}% pagado
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Grafica por Periodo */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Distribuciones por Periodo</CardTitle>
              <CardDescription>Comparativa de montos calculados vs pagados por periodo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataPorPeriodo} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="periodo" className="text-xs" />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      className="text-xs"
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="calculado" name="Calculado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pagado" name="Pagado" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filtros</CardTitle>
              {hayFiltros && (
                <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                  <X className="mr-1 h-3 w-3" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar inversionista, periodo, activo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={estatusFilter} onValueChange={setEstatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={inversionistaFilter} onValueChange={setInversionistaFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Inversionista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {inversionistas.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-[140px]"
                />
                <span className="text-muted-foreground">a</span>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-[140px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Distribuciones */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Distribuciones</CardTitle>
            <CardDescription>
              {filteredDistribuciones.length} distribuciones encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Inversionista</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Fecha Prog.</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead>Estatus</TableHead>
                    <TableHead className="w-[120px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistribuciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Banknote className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No se encontraron distribuciones</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDistribuciones.map((dist) => (
                      <TableRow key={dist.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {dist.inversionistaNombre.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{dist.inversionistaNombre}</p>
                              <p className="text-xs text-muted-foreground">{dist.porcentajeParticipacion}%</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm truncate max-w-[150px]">{dist.activoNombre || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {dist.periodo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{dist.fechaProgramada}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(dist.montoCalculado)}</TableCell>
                        <TableCell className="text-right">
                          <span className={cn(dist.montoPagado > 0 ? 'text-emerald-600' : 'text-muted-foreground')}>
                            {formatCurrency(dist.montoPagado)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getEstatusIcon(dist.estatus)}
                            <Badge variant="outline" className={cn('text-xs', getEstatusColor(dist.estatus))}>
                              {estatusLabels[dist.estatus]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {(dist.estatus === 'programado' || dist.estatus === 'pendiente') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleMarcarPagado(dist)}
                                title="Marcar como pagado"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(dist)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleEliminar(dist)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Nueva Distribución */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Nueva Distribución</DialogTitle>
              <DialogDescription>Programa un nuevo pago a inversionista</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="inversionista">Inversionista *</Label>
                <Select value={newInversionistaId} onValueChange={setNewInversionistaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar inversionista" />
                  </SelectTrigger>
                  <SelectContent>
                    {inversionistas
                      .filter((i) => i.estatus === 'activo')
                      .map((inv) => (
                        <SelectItem key={inv.id} value={inv.id}>
                          {inv.nombre} ({inv.porcentajeParticipacion}%)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activo">Activo (opcional)</Label>
                <Select value={newActivoId} onValueChange={setNewActivoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar activo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin activo específico</SelectItem>
                    {activos
                      .filter((a) => a.estado === 'generando_rentas')
                      .map((act) => (
                        <SelectItem key={act.id} value={act.id}>
                          {act.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo">Periodo *</Label>
                  <Input
                    placeholder="Ej: Mayo 2025"
                    value={newPeriodo}
                    onChange={(e) => setNewPeriodo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaProgramada">Fecha Programada *</Label>
                  <Input
                    type="date"
                    value={newFechaProgramada}
                    onChange={(e) => setNewFechaProgramada(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto a Distribuir *</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={newMontoCalculado}
                    onChange={(e) => setNewMontoCalculado(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodoPago">Método de Pago</Label>
                  <Select value={newMetodoPago} onValueChange={setNewMetodoPago}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Textarea
                  placeholder="Notas adicionales..."
                  rows={2}
                  value={newComentarios}
                  onChange={(e) => setNewComentarios(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetNewForm();
                  setDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveNew}>Programar Distribución</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Editar Distribución */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Distribución</DialogTitle>
              <DialogDescription>
                {selectedDistribucion && (
                  <span>
                    {selectedDistribucion.inversionistaNombre} - {selectedDistribucion.periodo}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monto Pagado</Label>
                  <Input
                    type="number"
                    value={editMontoPagado}
                    onChange={(e) => setEditMontoPagado(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Pago</Label>
                  <Input
                    type="date"
                    value={editFechaPago}
                    onChange={(e) => setEditFechaPago(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estatus</Label>
                  <Select value={editEstatus} onValueChange={setEditEstatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="programado">Programado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Referencia</Label>
                  <Input
                    placeholder="Ej: TRF-2025-001"
                    value={editReferencia}
                    onChange={(e) => setEditReferencia(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Comentarios</Label>
                <Textarea
                  placeholder="Notas adicionales..."
                  rows={2}
                  value={editComentarios}
                  onChange={(e) => setEditComentarios(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
