'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { activos } from '@/lib/mock-data';
import { usePagos } from '@/lib/pagos-context';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  getEstatusPagoColor,
} from '@/lib/format';
import { cn } from '@/lib/utils';

export default function PagosPage() {
  const { pagos, addPago, isLoaded } = usePagos();
  const [searchTerm, setSearchTerm] = useState('');
  const [estatusFilter, setEstatusFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Estados para nuevo pago
  const [newActivoId, setNewActivoId] = useState('');
  const [newTipoPago, setNewTipoPago] = useState('');
  const [newFecha, setNewFecha] = useState('');
  const [newMonto, setNewMonto] = useState('');
  const [newMetodoPago, setNewMetodoPago] = useState('');
  const [newCuentaOrigen, setNewCuentaOrigen] = useState('');
  const [newDestinatario, setNewDestinatario] = useState('');
  const [newEmpresaReceptora, setNewEmpresaReceptora] = useState('');
  const [newConcepto, setNewConcepto] = useState('');
  const [newComentarios, setNewComentarios] = useState('');
  const [newEstatus, setNewEstatus] = useState('pendiente');

  const resetForm = () => {
    setNewActivoId('');
    setNewTipoPago('');
    setNewFecha('');
    setNewMonto('');
    setNewMetodoPago('');
    setNewCuentaOrigen('');
    setNewDestinatario('');
    setNewEmpresaReceptora('');
    setNewConcepto('');
    setNewComentarios('');
    setNewEstatus('pendiente');
  };

  const handleSavePago = () => {
    if (!newActivoId || !newMonto || !newConcepto) {
      alert('Por favor complete los campos requeridos');
      return;
    }
    
    const activoSeleccionado = activos.find(a => a.id === newActivoId);
    addPago({
      activoId: newActivoId,
      activoNombre: activoSeleccionado?.nombre || '',
      tipoPago: newTipoPago || 'otro',
      fecha: newFecha || new Date().toISOString().split('T')[0],
      monto: parseFloat(newMonto),
      metodoPago: newMetodoPago,
      cuentaBancariaOrigen: newCuentaOrigen,
      destinatario: newDestinatario,
      empresaReceptora: newEmpresaReceptora,
      concepto: newConcepto,
      responsable: '',
      comentarios: newComentarios,
      estatus: newEstatus as 'completado' | 'pendiente' | 'cancelado' | 'programado',
    });
    
    resetForm();
    setDialogOpen(false);
  };

  const filteredPagos = useMemo(() => {
    return pagos.filter((pago) => {
      const matchesSearch =
        pago.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.destinatario.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstatus = estatusFilter === 'all' || pago.estatus === estatusFilter;
      const matchesTipo = tipoFilter === 'all' || pago.tipoPago === tipoFilter;
      return matchesSearch && matchesEstatus && matchesTipo;
    });
  }, [searchTerm, estatusFilter, tipoFilter]);

  const stats = useMemo(() => {
    const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0);
    const pagosRealizados = pagos.filter((p) => p.estatus === 'realizado').reduce((sum, p) => sum + p.monto, 0);
    const pagosComprometidos = pagos.filter((p) => p.estatus === 'comprometido').reduce((sum, p) => sum + p.monto, 0);
    const pagosVencidos = pagos.filter((p) => p.estatus === 'vencido').length;
    return { totalPagos, pagosRealizados, pagosComprometidos, pagosVencidos };
  }, []);

  const getEstatusIcon = (estatus: string) => {
    switch (estatus) {
      case 'realizado':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'comprometido':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'vencido':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compras y Pagos</h1>
            <p className="text-muted-foreground">
              Gestiona los pagos de adquisición de activos
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                <DialogDescription>
                  Registra un pago para un activo del portafolio
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="activo">Activo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar activo" />
                    </SelectTrigger>
                    <SelectContent>
                      {activos.map((activo) => (
                        <SelectItem key={activo.id} value={activo.id}>
                          {activo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoPago">Tipo de Pago *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anticipo">Anticipo</SelectItem>
                        <SelectItem value="parcialidad">Parcialidad</SelectItem>
                        <SelectItem value="liquidacion">Liquidación</SelectItem>
                        <SelectItem value="comision">Comisión</SelectItem>
                        <SelectItem value="gasto_compra">Gasto de compra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estatus">Estatus *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprometido">Comprometido</SelectItem>
                        <SelectItem value="realizado">Realizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto *</Label>
                    <Input type="number" placeholder="0" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodoPago">Método de Pago</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinatario">Destinatario</Label>
                  <Input placeholder="Nombre o empresa receptora" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concepto">Concepto</Label>
                  <Input placeholder="Descripción del pago" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comentarios">Comentarios</Label>
                  <Textarea placeholder="Notas adicionales..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Guardar Pago
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.totalPagos)}</p>
                  <p className="text-xs text-muted-foreground">Total de pagos</p>
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
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.pagosRealizados)}</p>
                  <p className="text-xs text-muted-foreground">Pagos realizados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.pagosComprometidos)}</p>
                  <p className="text-xs text-muted-foreground">Pagos comprometidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pagosVencidos}</p>
                  <p className="text-xs text-muted-foreground">Pagos vencidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar pagos..."
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
                  <SelectItem value="comprometido">Comprometido</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[180px]">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="anticipo">Anticipo</SelectItem>
                  <SelectItem value="parcialidad">Parcialidad</SelectItem>
                  <SelectItem value="liquidacion">Liquidación</SelectItem>
                  <SelectItem value="comision">Comisión</SelectItem>
                  <SelectItem value="gasto_compra">Gasto de compra</SelectItem>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estatus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>
                      <Link href={`/activos/${pago.activoId}`} className="font-medium hover:underline">
                        {pago.activoNombre}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{pago.tipoPago.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{formatDate(pago.fecha)}</TableCell>
                    <TableCell>{pago.destinatario}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{pago.concepto}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(pago.monto)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEstatusIcon(pago.estatus)}
                        <Badge variant="outline" className={cn('text-xs', getEstatusPagoColor(pago.estatus))}>
                          {pago.estatus}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredPagos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No se encontraron pagos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Intenta ajustar los filtros o registra un nuevo pago
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
