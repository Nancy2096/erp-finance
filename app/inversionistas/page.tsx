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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Mail,
  Phone,
  Trash2,
} from 'lucide-react';
import { inversionistas, activos } from '@/lib/mock-data';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatPercentage,
} from '@/lib/format';
import { cn } from '@/lib/utils';

export default function InversionistasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [estatusFilter, setEstatusFilter] = useState<string>('all');
  const [localInversionistas, setLocalInversionistas] = useState(inversionistas);
  
  // Estados para editar inversionista
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInversionista, setSelectedInversionista] = useState<typeof inversionistas[0] | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCorreo, setEditCorreo] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editRfc, setEditRfc] = useState('');
  const [editDireccion, setEditDireccion] = useState('');
  const [editBanco, setEditBanco] = useState('');
  const [editClabe, setEditClabe] = useState('');
  const [editCuentaBancaria, setEditCuentaBancaria] = useState('');
  const [editPorcentaje, setEditPorcentaje] = useState('');
  const [editEstatus, setEditEstatus] = useState('');
  const [editNotas, setEditNotas] = useState('');

  const filteredInversionistas = useMemo(() => {
    return localInversionistas.filter((inv) => {
      const matchesSearch =
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.rfc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstatus = estatusFilter === 'all' || inv.estatus === estatusFilter;
      return matchesSearch && matchesEstatus;
    });
  }, [searchTerm, estatusFilter, localInversionistas]);

  const stats = useMemo(() => {
    const totalInversionistas = localInversionistas.length;
    const totalInvertido = localInversionistas.reduce((sum, i) => sum + i.montoInvertido, 0);
    const totalDividendosRecibidos = localInversionistas.reduce((sum, i) => sum + i.dividendosRecibidos, 0);
    const totalDividendosPendientes = localInversionistas.reduce((sum, i) => sum + i.dividendosPendientes, 0);
    return { totalInversionistas, totalInvertido, totalDividendosRecibidos, totalDividendosPendientes };
  }, [localInversionistas]);

  const handleEliminar = (inv: typeof inversionistas[0]) => {
    if (confirm(`¿Estás seguro de eliminar al inversionista "${inv.nombre}"? Esta acción no se puede deshacer.`)) {
      setLocalInversionistas(localInversionistas.filter((i) => i.id !== inv.id));
    }
  };

  const handleEditClick = (inv: typeof inversionistas[0]) => {
    setSelectedInversionista(inv);
    setEditNombre(inv.nombre);
    setEditCorreo(inv.correo);
    setEditTelefono(inv.telefono);
    setEditRfc(inv.rfc);
    setEditDireccion(inv.direccion);
    setEditBanco(inv.banco);
    setEditClabe(inv.clabe);
    setEditCuentaBancaria(inv.cuentaBancaria);
    setEditPorcentaje(inv.porcentajeParticipacion.toString());
    setEditEstatus(inv.estatus);
    setEditNotas(inv.notasInternas || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedInversionista || !editNombre || !editCorreo) return;

    setLocalInversionistas(
      localInversionistas.map((inv) =>
        inv.id === selectedInversionista.id
          ? {
              ...inv,
              nombre: editNombre,
              correo: editCorreo,
              telefono: editTelefono,
              rfc: editRfc,
              direccion: editDireccion,
              banco: editBanco,
              clabe: editClabe,
              cuentaBancaria: editCuentaBancaria,
              porcentajeParticipacion: parseFloat(editPorcentaje) || 0,
              estatus: editEstatus as 'activo' | 'inactivo',
              notasInternas: editNotas,
            }
          : inv
      )
    );
    setEditDialogOpen(false);
    setSelectedInversionista(null);
  };

  const handleEnviarCorreo = (inv: typeof inversionistas[0]) => {
    window.location.href = `mailto:${inv.correo}?subject=Comunicación - ${inv.nombre}`;
  };

  const handleContactar = (inv: typeof inversionistas[0]) => {
    if (inv.telefono) {
      window.location.href = `tel:${inv.telefono}`;
    } else {
      alert('Este inversionista no tiene teléfono registrado.');
    }
  };

  const handleGenerarReporte = (inv: typeof inversionistas[0]) => {
    alert(`Generando reporte para ${inv.nombre}...`);
    // Aquí iría la lógica para generar el reporte PDF
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getActivosNames = (activoIds: string[]) => {
    return activoIds
      .map((id) => activos.find((a) => a.id === id)?.nombre)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inversionistas</h1>
            <p className="text-muted-foreground">
              Gestiona los inversionistas y sus participaciones
            </p>
          </div>
          <Button asChild>
            <Link href="/inversionistas/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Inversionista
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalInversionistas}</p>
                  <p className="text-xs text-muted-foreground">Total inversionistas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.totalInvertido)}</p>
                  <p className="text-xs text-muted-foreground">Total invertido</p>
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
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.totalDividendosRecibidos)}</p>
                  <p className="text-xs text-muted-foreground">Dividendos recibidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrencyCompact(stats.totalDividendosPendientes)}</p>
                  <p className="text-xs text-muted-foreground">Dividendos pendientes</p>
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
                  placeholder="Buscar inversionistas..."
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inversionistas Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredInversionistas.map((inv) => (
            <Card key={inv.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(inv.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`/inversionistas/${inv.id}`} className="font-semibold hover:underline truncate">
                        {inv.nombre}
                      </Link>
                      <Badge
                        variant={inv.estatus === 'activo' ? 'default' : 'secondary'}
                        className="text-[10px] ml-2 shrink-0"
                      >
                        {inv.estatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{inv.correo}</p>
                    <p className="text-xs text-muted-foreground">RFC: {inv.rfc}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Monto Invertido</p>
                    <p className="text-lg font-bold">{formatCurrencyCompact(inv.montoInvertido)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Participación</p>
                    <p className="text-lg font-bold">{formatPercentage(inv.porcentajeParticipacion, 0)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Dividendos Recibidos</p>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(inv.dividendosRecibidos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dividendos Pendientes</p>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      {formatCurrency(inv.dividendosPendientes)}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Activos relacionados ({inv.activosRelacionados.length})</p>
                  <p className="text-xs line-clamp-2">{getActivosNames(inv.activosRelacionados) || 'Sin activos'}</p>
                </div>
                {inv.roi > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="text-sm font-medium">{formatPercentage(inv.roi)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Payback</p>
                      <p className="text-sm font-medium">{inv.payback} meses</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/inversionistas/${inv.id}`}>
                      <Eye className="mr-2 h-3 w-3" />
                      Ver
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(inv)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerarReporte(inv)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar reporte
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEnviarCorreo(inv)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar correo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleContactar(inv)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Contactar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleEliminar(inv)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInversionistas.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No se encontraron inversionistas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Intenta ajustar los filtros o registra un nuevo inversionista
              </p>
              <Button className="mt-4" asChild>
                <Link href="/inversionistas/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Inversionista
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog para Editar Inversionista */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inversionista</DialogTitle>
            <DialogDescription>
              Modifica los datos del inversionista {selectedInversionista?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editNombre">Nombre Completo *</Label>
                <Input
                  id="editNombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  placeholder="Nombre del inversionista"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCorreo">Correo Electronico *</Label>
                <Input
                  id="editCorreo"
                  type="email"
                  value={editCorreo}
                  onChange={(e) => setEditCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editTelefono">Telefono</Label>
                <Input
                  id="editTelefono"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  placeholder="+52 81 1234 5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRfc">RFC</Label>
                <Input
                  id="editRfc"
                  value={editRfc}
                  onChange={(e) => setEditRfc(e.target.value)}
                  placeholder="XXXX000000XXX"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDireccion">Direccion</Label>
              <Input
                id="editDireccion"
                value={editDireccion}
                onChange={(e) => setEditDireccion(e.target.value)}
                placeholder="Direccion completa"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editBanco">Banco</Label>
                <Input
                  id="editBanco"
                  value={editBanco}
                  onChange={(e) => setEditBanco(e.target.value)}
                  placeholder="BBVA, Santander, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCuentaBancaria">Cuenta Bancaria</Label>
                <Input
                  id="editCuentaBancaria"
                  value={editCuentaBancaria}
                  onChange={(e) => setEditCuentaBancaria(e.target.value)}
                  placeholder="Numero de cuenta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClabe">CLABE</Label>
                <Input
                  id="editClabe"
                  value={editClabe}
                  onChange={(e) => setEditClabe(e.target.value)}
                  placeholder="18 digitos"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPorcentaje">Porcentaje de Participacion (%)</Label>
                <Input
                  id="editPorcentaje"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={editPorcentaje}
                  onChange={(e) => setEditPorcentaje(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEstatus">Estatus</Label>
                <Select value={editEstatus} onValueChange={setEditEstatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotas">Notas Internas</Label>
              <Textarea
                id="editNotas"
                value={editNotas}
                onChange={(e) => setEditNotas(e.target.value)}
                placeholder="Notas adicionales sobre el inversionista..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editNombre || !editCorreo}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
