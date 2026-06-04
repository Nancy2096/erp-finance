'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, User, Building2, CreditCard } from 'lucide-react';
import { useInversionistas } from '@/lib/inversionistas-context';
import { useActivos } from '@/lib/activos-context';
import { Checkbox } from '@/components/ui/checkbox';

export default function NuevoInversionistaPage() {
  const router = useRouter();
  const { addInversionista } = useInversionistas();
  const { activos } = useActivos();
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rfc, setRfc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [banco, setBanco] = useState('');
  const [clabe, setClabe] = useState('');
  const [cuentaBancaria, setCuentaBancaria] = useState('');
  const [porcentajeParticipacion, setPorcentajeParticipacion] = useState('');
  const [montoInvertido, setMontoInvertido] = useState('');
  const [estatus, setEstatus] = useState('activo');
  const [notasInternas, setNotasInternas] = useState('');
  const [activosSeleccionados, setActivosSeleccionados] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !correo) {
      alert('Por favor complete los campos requeridos (Nombre y Correo)');
      return;
    }

    addInversionista({
      nombre,
      correo,
      telefono,
      rfc,
      direccion,
      banco,
      clabe,
      cuentaBancaria,
      porcentajeParticipacion: parseFloat(porcentajeParticipacion) || 0,
      montoInvertido: parseFloat(montoInvertido) || 0,
      estatus: estatus as 'activo' | 'inactivo',
      notasInternas,
      activosRelacionados: activosSeleccionados,
      documentos: [],
      fechaAlta: new Date().toISOString().split('T')[0],
      dividendosEsperados: 0,
      dividendosRecibidos: 0,
      dividendosPagados: 0,
      dividendosPendientes: 0,
      roi: 0,
      payback: 0,
    });

    router.push('/inversionistas');
  };

  const toggleActivo = (activoId: string) => {
    setActivosSeleccionados(prev => 
      prev.includes(activoId) 
        ? prev.filter(id => id !== activoId)
        : [...prev, activoId]
    );
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Nuevo Inversionista</h1>
              <p className="text-muted-foreground">Registra un nuevo inversionista en el sistema</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </div>

        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Datos Personales</CardTitle>
            </div>
            <CardDescription>Informacion basica del inversionista</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del inversionista"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electronico *</Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+52 81 1234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input
                id="rfc"
                value={rfc}
                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                placeholder="XXXX000000XXX"
                maxLength={13}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="direccion">Direccion</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Direccion completa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estatus">Estatus</Label>
              <Select value={estatus} onValueChange={setEstatus}>
                <SelectTrigger id="estatus">
                  <SelectValue placeholder="Seleccionar estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Datos Bancarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Datos Bancarios</CardTitle>
            </div>
            <CardDescription>Informacion para transferencias y pagos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="banco">Banco</Label>
              <Select value={banco} onValueChange={setBanco}>
                <SelectTrigger id="banco">
                  <SelectValue placeholder="Seleccionar banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BBVA">BBVA</SelectItem>
                  <SelectItem value="Santander">Santander</SelectItem>
                  <SelectItem value="Banorte">Banorte</SelectItem>
                  <SelectItem value="HSBC">HSBC</SelectItem>
                  <SelectItem value="Citibanamex">Citibanamex</SelectItem>
                  <SelectItem value="Scotiabank">Scotiabank</SelectItem>
                  <SelectItem value="Inbursa">Inbursa</SelectItem>
                  <SelectItem value="Banregio">Banregio</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clabe">CLABE Interbancaria</Label>
              <Input
                id="clabe"
                value={clabe}
                onChange={(e) => setClabe(e.target.value)}
                placeholder="18 digitos"
                maxLength={18}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuentaBancaria">Numero de Cuenta</Label>
              <Input
                id="cuentaBancaria"
                value={cuentaBancaria}
                onChange={(e) => setCuentaBancaria(e.target.value)}
                placeholder="Numero de cuenta"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inversion */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Inversion</CardTitle>
            </div>
            <CardDescription>Datos de la inversion y activos relacionados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="montoInvertido">Monto Invertido</Label>
                <Input
                  id="montoInvertido"
                  type="number"
                  value={montoInvertido}
                  onChange={(e) => setMontoInvertido(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="porcentajeParticipacion">Porcentaje de Participacion (%)</Label>
                <Input
                  id="porcentajeParticipacion"
                  type="number"
                  value={porcentajeParticipacion}
                  onChange={(e) => setPorcentajeParticipacion(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Activos Relacionados</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {activos.map((activo) => (
                  <div
                    key={activo.id}
                    className="flex items-center space-x-2 rounded-lg border p-3"
                  >
                    <Checkbox
                      id={`activo-${activo.id}`}
                      checked={activosSeleccionados.includes(activo.id)}
                      onCheckedChange={() => toggleActivo(activo.id)}
                    />
                    <label
                      htmlFor={`activo-${activo.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {activo.nombre}
                    </label>
                  </div>
                ))}
              </div>
              {activos.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay activos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Internas</CardTitle>
            <CardDescription>Comentarios o notas adicionales sobre el inversionista</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
              placeholder="Notas internas..."
              rows={4}
            />
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  );
}
