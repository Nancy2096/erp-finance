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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { activos } from '@/lib/mock-data';
import { useDividendos, type Dividendo } from '@/lib/dividendos-context';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatPercentage,
  getEstatusDividendoColor,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DividendosPage() {
  const { dividendos: localDividendos, addDividendo, updateDividendo, getStats, isLoaded } = useDividendos();
  const [searchTerm, setSearchTerm] = useState('');
  const [estatusFilter, setEstatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDividendo, setSelectedDividendo] = useState<Dividendo | null>(null);
  
  // Estados para edicion
  const [editMontoEsperado, setEditMontoEsperado] = useState('');
  const [editMontoRecibido, setEditMontoRecibido] = useState('');
  const [editEstatus, setEditEstatus] = useState('');
  const [editFechaRecepcion, setEditFechaRecepcion] = useState('');
  const [editComentarios, setEditComentarios] = useState('');
  
  // Estados para nuevo dividendo
  const [newActivoId, setNewActivoId] = useState('');
  const [newPeriodo, setNewPeriodo] = useState('');
  const [newFechaRecepcion, setNewFechaRecepcion] = useState('');
  const [newMontoEsperado, setNewMontoEsperado] = useState('');
  const [newMontoRecibido, setNewMontoRecibido] = useState('');
  const [newEstatus, setNewEstatus] = useState('');
  const [newComentarios, setNewComentarios] = useState('');
  
  const resetNewDividendoForm = () => {
    setNewActivoId('');
    setNewPeriodo('');
    setNewFechaRecepcion('');
    setNewMontoEsperado('');
    setNewMontoRecibido('');
    setNewEstatus('');
    setNewComentarios('');
  };
  
  const handleSaveNewDividendo = () => {
    if (!newActivoId || !newPeriodo || !newMontoRecibido || !newEstatus) {
      alert('Por favor complete los campos requeridos');
      return;
    }
    
    const activoSeleccionado = activos.find(a => a.id === newActivoId);
    addDividendo({
      activoId: newActivoId,
      activoNombre: activoSeleccionado?.nombre || '',
      periodo: newPeriodo,
      fechaRecepcion: newFechaRecepcion || new Date().toISOString().split('T')[0],
      montoEsperado: parseFloat(newMontoEsperado) || 0,
      montoRecibido: parseFloat(newMontoRecibido) || 0,
      estatus: newEstatus as 'recibido' | 'pendiente' | 'parcial' | 'no_recibido',
      comentarios: newComentarios,
      responsable: '',
    });
    
    resetNewDividendoForm();
    setDialogOpen(false);
  };
  
  const handleEditClick = (div: typeof dividendos[0]) => {
    setSelectedDividendo(div);
    setEditMontoEsperado(div.montoEsperado.toString());
    setEditMontoRecibido(div.montoRecibido.toString());
    setEditEstatus(div.estatus);
    setEditFechaRecepcion(div.fechaRecepcion);
    setEditComentarios(div.comentarios || '');
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!selectedDividendo) return;
    updateDividendo(selectedDividendo.id, {
      montoEsperado: parseFloat(editMontoEsperado),
      montoRecibido: parseFloat(editMontoRecibido),
      estatus: editEstatus as 'recibido' | 'pendiente' | 'parcial' | 'no_recibido',
      fechaRecepcion: editFechaRecepcion,
      comentarios: editComentarios,
    });
    setEditDialogOpen(false);
    setSelectedDividendo(null);
  };

  const filteredDividendos = useMemo(() => {
    return localDividendos.filter((div) => {
      const matchesSearch =
        div.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        div.periodo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstatus = estatusFilter === 'all' || div.estatus === estatusFilter;
      return matchesSearch && matchesEstatus;
    });
  }, [searchTerm, estatusFilter, localDividendos]);

  const stats = useMemo(() => {
    return getStats();
  }, [localDividendos, getStats]);

  const chartData = useMemo(() => {
    const grouped = localDividendos.reduce((acc, div) => {
      const periodo = div.periodo;
      if (!acc[periodo]) {
        acc[periodo] = { periodo, esperado: 0, recibido: 0 };
      }
      acc[periodo].esperado += div.montoEsperado;
      acc[periodo].recibido += div.montoRecibido;
      return acc;
    }, {} as Record<string, { periodo: string; esperado: number; recibido: number }>);
    return Object.values(grouped);
  }, [localDividendos]);

  const getEstatusIcon = (estatus: string) => {
    switch (estatus) {
      case 'recibido':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pendiente':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'no_recibido':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {!isLoaded ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando dividendos...</div>
        </div>
      ) : (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dividendos y Rentas</h1>
            <p className="text-muted-foreground">
              Control de ingresos por dividendos y rentas de activos
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Dividendo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Dividendo</DialogTitle>
                <DialogDescription>
                  Registra un dividendo o renta recibida
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="activo">Activo *</Label>
                  <Select value={newActivoId} onValueChange={setNewActivoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar activo" />
                    </SelectTrigger>
                    <SelectContent>
                      {activos.filter((a) => a.estado === 'generando_rentas').map((activo) => (
                        <SelectItem key={activo.id} value={activo.id}>
                          {activo.nombre}
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
                    <Label htmlFor="fechaRecepcion">Fecha de Recepcion *</Label>
                    <Input 
                      type="date" 
                      value={newFechaRecepcion}
                      onChange={(e) => setNewFechaRecepcion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montoEsperado">Monto Esperado</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      min="0" 
                      value={newMontoEsperado}
                      onChange={(e) => setNewMontoEsperado(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montoRecibido">Monto Recibido *</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      min="0" 
                      value={newMontoRecibido}
                      onChange={(e) => setNewMontoRecibido(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estatus">Estatus *</Label>
                  <Select value={newEstatus} onValueChange={setNewEstatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recibido">Recibido</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="no_recibido">No recibido</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button variant="outline" onClick={() => { resetNewDividendoForm(); setDialogOpen(false); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveNewDividendo}>
                  Guardar Dividendo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatCurrencyCompact(stats.totalEsperado)}</p>
                  <p className="text-xs text-muted-foreground">Total esperado</p>
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
                  <p className="text-xl font-bold">{formatCurrencyCompact(stats.totalRecibido)}</p>
                  <p className="text-xs text-muted-foreground">Total recibido</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  stats.diferencia >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                )}>
                  {stats.diferencia >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
                <div>
                  <p className={cn(
                    'text-xl font-bold',
                    stats.diferencia >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {stats.diferencia >= 0 ? '+' : ''}{formatCurrencyCompact(stats.diferencia)}
                  </p>
                  <p className="text-xs text-muted-foreground">Diferencia</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatPercentage(stats.cumplimiento, 1)}</p>
                  <p className="text-xs text-muted-foreground">Cumplimiento</p>
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
                  <p className="text-xl font-bold">{stats.pendientes}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Dividendos por Periodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="periodo" tick={{ fill: 'currentColor' }} />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="esperado" name="Esperado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recibido" name="Recibido" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar dividendos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={estatusFilter} onValueChange={setEstatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estatus</SelectItem>
                  <SelectItem value="recibido">Recibido</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="no_recibido">No recibido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Fecha Recepción</TableHead>
                  <TableHead className="text-right">Esperado</TableHead>
                  <TableHead className="text-right">Recibido</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDividendos.map((div) => (
                  <TableRow key={div.id}>
                    <TableCell>
                      <Link href={`/activos/${div.activoId}`} className="font-medium hover:underline">
                        {div.activoNombre}
                      </Link>
                    </TableCell>
                    <TableCell>{div.periodo}</TableCell>
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
                      <div className="flex items-center gap-2">
                        {getEstatusIcon(div.estatus)}
                        <Badge variant="outline" className={cn('text-xs', getEstatusDividendoColor(div.estatus))}>
                          {div.estatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(div)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog para Editar Dividendo */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Dividendo</DialogTitle>
              <DialogDescription>
                {selectedDividendo && (
                  <span>
                    {selectedDividendo.activoNombre} - {selectedDividendo.periodo}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editMontoEsperado">Monto Esperado</Label>
                  <Input
                    id="editMontoEsperado"
                    type="number"
                    value={editMontoEsperado}
                    onChange={(e) => setEditMontoEsperado(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editMontoRecibido">Monto Recibido *</Label>
                  <Input
                    id="editMontoRecibido"
                    type="number"
                    value={editMontoRecibido}
                    onChange={(e) => setEditMontoRecibido(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFechaRecepcion">Fecha de Recepcion</Label>
                  <Input
                    id="editFechaRecepcion"
                    type="date"
                    value={editFechaRecepcion}
                    onChange={(e) => setEditFechaRecepcion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEstatus">Estatus *</Label>
                  <Select value={editEstatus} onValueChange={setEditEstatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recibido">Recibido</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="no_recibido">No recibido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editComentarios">Comentarios</Label>
                <Textarea
                  id="editComentarios"
                  value={editComentarios}
                  onChange={(e) => setEditComentarios(e.target.value)}
                  placeholder="Notas adicionales..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      )}
    </DashboardLayout>
  );
}
