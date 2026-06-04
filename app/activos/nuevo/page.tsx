'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Plus, Trash2, Upload, Link2, ExternalLink } from 'lucide-react';

export default function NuevoActivoPage() {
  const router = useRouter();
  const [contactos, setContactos] = useState([{ id: '1', nombre: '', cargo: '', telefono: '', correo: '', tipoContacto: 'vendedor' }]);
  
  // Estado para documentos
  const [documentos, setDocumentos] = useState<Record<string, { tipo: 'archivo' | 'link' | null; archivo?: File; link?: string }>>({});

  const handleDocumentoTipoChange = (label: string, tipo: 'archivo' | 'link') => {
    setDocumentos(prev => ({
      ...prev,
      [label]: { ...prev[label], tipo }
    }));
  };

  const handleLinkChange = (label: string, link: string) => {
    setDocumentos(prev => ({
      ...prev,
      [label]: { ...prev[label], tipo: 'link', link }
    }));
  };

  const handleFileChange = (label: string, file: File | null) => {
    if (file) {
      setDocumentos(prev => ({
        ...prev,
        [label]: { ...prev[label], tipo: 'archivo', archivo: file }
      }));
    }
  };

  const removeDocumento = (label: string) => {
    setDocumentos(prev => {
      const newDocs = { ...prev };
      delete newDocs[label];
      return newDocs;
    });
  };

  const addContacto = () => {
    setContactos([...contactos, { id: Date.now().toString(), nombre: '', cargo: '', telefono: '', correo: '', tipoContacto: 'otro' }]);
  };

  const removeContacto = (id: string) => {
    if (contactos.length > 1) {
      setContactos(contactos.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular guardado
    router.push('/activos');
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/activos">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Nuevo Activo</h1>
              <p className="text-muted-foreground">
                Registra un nuevo activo en el portafolio
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/activos">Cancelar</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Activo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="financiero">Financiero</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos básicos del activo</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nombre">Nombre del Activo *</Label>
                  <Input id="nombre" placeholder="Ej: Pool de Rentas Corporativo Monterrey" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoActivo">Tipo de Activo *</Label>
                  <Select required>
                    <SelectTrigger id="tipoActivo">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inmueble_completo">Inmueble completo</SelectItem>
                      <SelectItem value="pool_rentas">Pool de rentas</SelectItem>
                      <SelectItem value="participacion_parcial">Participación parcial</SelectItem>
                      <SelectItem value="camion_renta">Camión en renta</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="local_comercial">Local comercial</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Actual *</Label>
                  <Select required>
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_analisis">En análisis</SelectItem>
                      <SelectItem value="en_negociacion">En negociación</SelectItem>
                      <SelectItem value="en_proceso_compra">En proceso de compra</SelectItem>
                      <SelectItem value="en_pago">En pago</SelectItem>
                      <SelectItem value="en_espera_entrega">En espera de entrega</SelectItem>
                      <SelectItem value="en_espera_operacion">En espera de operación</SelectItem>
                      <SelectItem value="generando_rentas">Generando rentas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input id="ubicacion" placeholder="Ciudad, Estado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable Interno</Label>
                  <Select>
                    <SelectTrigger id="responsable">
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carlos">Carlos Mendoza</SelectItem>
                      <SelectItem value="ana">Ana García</SelectItem>
                      <SelectItem value="roberto">Roberto Sánchez</SelectItem>
                      <SelectItem value="maria">María López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Descripción detallada del activo..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresa Relacionada</CardTitle>
                <CardDescription>Datos de la empresa propietaria o administradora</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="empresaRelacionada">Nombre de la Empresa</Label>
                  <Input id="empresaRelacionada" placeholder="Ej: Grupo Patrimonial Norte" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input id="razonSocial" placeholder="Ej: Grupo Patrimonial Norte S.A. de C.V." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input id="rfc" placeholder="Ej: GPN180501XY7" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="direccionFiscal">Dirección Fiscal</Label>
                  <Input id="direccionFiscal" placeholder="Dirección completa" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="datosLegales">Datos Legales</Label>
                  <Textarea
                    id="datosLegales"
                    placeholder="Escrituras, notaría, número de acta..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financiero Tab */}
          <TabsContent value="financiero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Compra</CardTitle>
                <CardDescription>Datos financieros de la adquisición</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total del Activo *</Label>
                  <Input id="valorTotal" type="number" placeholder="0" min="0" step="1000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montoInicial">Monto Inicial Pagado</Label>
                  <Input id="montoInicial" type="number" placeholder="0" min="0" step="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montoPendiente">Monto Pendiente</Label>
                  <Input id="montoPendiente" type="number" placeholder="0" min="0" step="1000" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaCompra">Forma de Compra</Label>
                  <Select>
                    <SelectTrigger id="formaCompra">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contado">Contado</SelectItem>
                      <SelectItem value="parcialidades">Parcialidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaCompra">Fecha de Compra</Label>
                  <Input id="fechaCompra" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaLimitePago">Fecha Límite de Pago</Label>
                  <Input id="fechaLimitePago" type="date" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fechas de Operación</CardTitle>
                <CardDescription>Tiempos estimados y reales de entrega y operación</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaEstimadaEntrega">Fecha Estimada de Entrega</Label>
                  <Input id="fechaEstimadaEntrega" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaRealEntrega">Fecha Real de Entrega</Label>
                  <Input id="fechaRealEntrega" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaEstimadaDividendos">Fecha Estimada Inicio Dividendos</Label>
                  <Input id="fechaEstimadaDividendos" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaRealDividendos">Fecha Real Inicio Dividendos</Label>
                  <Input id="fechaRealDividendos" type="date" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad y Proyecciones</CardTitle>
                <CardDescription>Expectativas de rendimiento del activo</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="rentabilidadMensual">Rentabilidad Mensual Esperada</Label>
                  <Input id="rentabilidadMensual" type="number" placeholder="0" min="0" step="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentabilidadAnual">Rentabilidad Anual Esperada</Label>
                  <Input id="rentabilidadAnual" type="number" placeholder="0" min="0" step="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodicidadDividendos">Periodicidad de Dividendos</Label>
                  <Select>
                    <SelectTrigger id="periodicidadDividendos">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="porcentajeApreciacion">Apreciación Esperada (%)</Label>
                  <Input id="porcentajeApreciacion" type="number" placeholder="5" step="0.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inflacionEstimada">Inflación Estimada (%)</Label>
                  <Input id="inflacionEstimada" type="number" placeholder="4.5" step="0.1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notas Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="notasInternas"
                  placeholder="Notas adicionales sobre el activo..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contactos Tab */}
          <TabsContent value="contactos" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Contactos Relacionados</CardTitle>
                  <CardDescription>Personas involucradas con este activo</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addContacto}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Contacto
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactos.map((contacto, index) => (
                  <div key={contacto.id} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Contacto {index + 1}</h4>
                      {contactos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContacto(contacto.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input placeholder="Nombre completo" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input placeholder="Cargo o puesto" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Contacto</Label>
                        <Select defaultValue={contacto.tipoContacto}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendedor">Vendedor</SelectItem>
                            <SelectItem value="socio">Socio</SelectItem>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="contador">Contador</SelectItem>
                            <SelectItem value="abogado">Abogado</SelectItem>
                            <SelectItem value="contacto_operativo">Contacto operativo</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input placeholder="+52 81 1234 5678" type="tel" />
                      </div>
                      <div className="space-y-2">
                        <Label>Correo</Label>
                        <Input placeholder="correo@ejemplo.com" type="email" />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input placeholder="+52 81 1234 5678" type="tel" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notas</Label>
                      <Textarea placeholder="Notas sobre este contacto..." rows={2} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentos del Activo</CardTitle>
                <CardDescription>Sube archivos o agrega links de Google Drive para cada documento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: 'Contrato', required: true },
                  { label: 'Escrituras', required: true },
                  { label: 'Facturas', required: false },
                  { label: 'Comprobantes de Pago', required: false },
                  { label: 'Identificaciones', required: false },
                  { label: 'Estados de Cuenta', required: false },
                  { label: 'Fotografías', required: false },
                  { label: 'Documentos Legales', required: false },
                ].map((doc) => {
                  const docState = documentos[doc.label];
                  return (
                    <div key={doc.label} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {doc.label}
                            {doc.required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          {!docState?.tipo && (
                            <p className="text-sm text-muted-foreground">Sin archivo ni link</p>
                          )}
                          {docState?.tipo === 'archivo' && docState.archivo && (
                            <p className="text-sm text-emerald-600">Archivo: {docState.archivo.name}</p>
                          )}
                          {docState?.tipo === 'link' && docState.link && (
                            <a href={docState.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                              Ver en Google Drive <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {docState?.tipo && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeDocumento(doc.label)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      
                      {!docState?.tipo ? (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleFileChange(doc.label, file);
                              };
                              input.click();
                            }}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Subir Archivo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDocumentoTipoChange(doc.label, 'link')}
                          >
                            <Link2 className="mr-2 h-4 w-4" />
                            Agregar Link
                          </Button>
                        </div>
                      ) : docState.tipo === 'link' && !docState.link ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://drive.google.com/..."
                            className="flex-1"
                            onBlur={(e) => handleLinkChange(doc.label, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLinkChange(doc.label, (e.target as HTMLInputElement).value);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocumento(doc.label)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </DashboardLayout>
  );
}
