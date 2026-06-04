'use client';

import { use, useState, useEffect } from 'react';
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
import { ArrowLeft, Save, Plus, Trash2, Upload, Calendar, CheckCircle, Clock, AlertCircle, FileText, ExternalLink, FileSignature, Receipt, CreditCard, Scale, PieChart, Calculator, Landmark, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PagoPlanificado } from '@/lib/types';
import { useActivos } from '@/lib/activos-context';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarActivoPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getActivoById, updateActivo } = useActivos();
  const activo = getActivoById(id);
  
  const [nombre, setNombre] = useState('');
  const [tipoActivo, setTipoActivo] = useState('');
  const [estado, setEstado] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ubicacionColonia, setUbicacionColonia] = useState('');
  const [ubicacionCiudad, setUbicacionCiudad] = useState('');
  const [ubicacionEstado, setUbicacionEstado] = useState('');
  const [ubicacionCP, setUbicacionCP] = useState('');
  const [ubicacionPais, setUbicacionPais] = useState('Mexico');
  const [ubicacionLatitud, setUbicacionLatitud] = useState('');
  const [ubicacionLongitud, setUbicacionLongitud] = useState('');
  const [ubicacionReferencias, setUbicacionReferencias] = useState('');
  const [responsable, setResponsable] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [empresaRelacionada, setEmpresaRelacionada] = useState('');
  const [rfc, setRfc] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [montoPagado, setMontoPagado] = useState('');
  const [formaCompra, setFormaCompra] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [rentabilidadMensual, setRentabilidadMensual] = useState('');
  const [rentabilidadAnual, setRentabilidadAnual] = useState('');
  const [porcentajeRentabilidad, setPorcentajeRentabilidad] = useState('');
  const [periodicidadDividendos, setPeriodicidadDividendos] = useState('');
  const [porcentajeApreciacion, setPorcentajeApreciacion] = useState('');
  
  const [contactos, setContactos] = useState([
    { id: '1', nombre: '', cargo: '', telefono: '', correo: '', tipoContacto: 'vendedor' }
  ]);
  
  // Estados para documentos
  const [documentos, setDocumentos] = useState<{
    id: string;
    nombre: string;
    tipo: string;
    googleDriveUrl: string;
    descripcion: string;
  }[]>([]);
  
  // Estados para certificados/acciones (solo para Pool de rentas)
  const [certificados, setCertificados] = useState([
    { id: '1', nombre: '', porcentajeAdquirido: 0, valor: 0 }
  ]);
  
  // Estados para empresa relacionada
  const [empresaNombre, setEmpresaNombre] = useState('');
  const [empresaRazonSocial, setEmpresaRazonSocial] = useState('');
  const [empresaRfc, setEmpresaRfc] = useState('');
  const [empresaDireccion, setEmpresaDireccion] = useState('');
  const [empresaCodigoPostal, setEmpresaCodigoPostal] = useState('');
  const [empresaCiudad, setEmpresaCiudad] = useState('');
  const [empresaEstado, setEmpresaEstado] = useState('');
  const [empresaPais, setEmpresaPais] = useState('Mexico');
  const [empresaTelefono, setEmpresaTelefono] = useState('');
  const [empresaEmail, setEmpresaEmail] = useState('');
  const [empresaPaginaWeb, setEmpresaPaginaWeb] = useState('');
  const [empresaFacebook, setEmpresaFacebook] = useState('');
  const [empresaInstagram, setEmpresaInstagram] = useState('');
  const [empresaLinkedin, setEmpresaLinkedin] = useState('');
  const [empresaTwitter, setEmpresaTwitter] = useState('');
  const [representanteLegal, setRepresentanteLegal] = useState('');
  const [representanteTelefono, setRepresentanteTelefono] = useState('');
  const [representanteEmail, setRepresentanteEmail] = useState('');
  const [actaConstitutivaUrl, setActaConstitutivaUrl] = useState('');
  const [poderNotarialUrl, setPoderNotarialUrl] = useState('');
  const [comprobanteDomicilioUrl, setComprobanteDomicilioUrl] = useState('');
  const [identificacionRepresentanteUrl, setIdentificacionRepresentanteUrl] = useState('');
  // Documentos para Contrato
  const [contratoCompraventaUrl, setContratoCompraventaUrl] = useState('');
  const [escriturasUrl, setEscriturasUrl] = useState('');
  const [avaluoUrl, setAvaluoUrl] = useState('');
  const [certificadoLibertadGravamenUrl, setCertificadoLibertadGravamenUrl] = useState('');
  const [boletaPredialUrl, setBoletaPredialUrl] = useState('');
  const [recibosServiciosUrl, setRecibosServiciosUrl] = useState('');
  // Documentos para Fideicomiso/Empresa
  const [contratoFideicomisoUrl, setContratoFideicomisoUrl] = useState('');
  const [reglamentoFideicomisoUrl, setReglamentoFideicomisoUrl] = useState('');
  const [cedulaFiscalUrl, setCedulaFiscalUrl] = useState('');
  const [estadosFinancierosUrl, setEstadosFinancierosUrl] = useState('');
  const [cartaPoderesUrl, setCartaPoderesUrl] = useState('');
  const [empresaNotas, setEmpresaNotas] = useState('');
  
  // Estados para plan de compra
  const [planFechaInicio, setPlanFechaInicio] = useState('');
  const [planFechaFin, setPlanFechaFin] = useState('');
  const [planEnganche, setPlanEnganche] = useState('');
  const [planNumeroPagos, setPlanNumeroPagos] = useState('12');
  const [planPeriodicidad, setPlanPeriodicidad] = useState<'semanal' | 'quincenal' | 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'unico'>('mensual');
  const [planNotas, setPlanNotas] = useState('');
  const [pagosPlan, setPagosPlan] = useState<PagoPlanificado[]>([]);

  // Cargar datos del activo
  useEffect(() => {
    if (activo) {
      setNombre(activo.nombre);
      setTipoActivo(activo.tipoActivo);
      setEstado(activo.estado);
      setUbicacion(activo.ubicacion);
      setResponsable(activo.responsableInterno);
      setDescripcion(activo.descripcion || '');
      setEmpresaRelacionada(activo.empresaRelacionada);
      setRfc(activo.rfc || '');
      setValorTotal(activo.valorTotal.toString());
      setMontoPagado(activo.montoPagado.toString());
      setFormaCompra(activo.formaCompra);
      setFechaCompra(activo.fechaCompra);
      setRentabilidadMensual(activo.rentabilidadMensualEsperada.toString());
      setRentabilidadAnual(activo.rentabilidadAnualEsperada.toString());
      setPeriodicidadDividendos(activo.periodicidadDividendos);
      setPorcentajeApreciacion(activo.porcentajeApreciacion.toString());
      
      // Cargar datos de ubicacion detallada
      if (activo.ubicacionDetalle) {
        setUbicacionColonia(activo.ubicacionDetalle.colonia || '');
        setUbicacionCiudad(activo.ubicacionDetalle.ciudad || '');
        setUbicacionEstado(activo.ubicacionDetalle.estado || '');
        setUbicacionCP(activo.ubicacionDetalle.codigoPostal || '');
        setUbicacionPais(activo.ubicacionDetalle.pais || 'Mexico');
        setUbicacionLatitud(activo.ubicacionDetalle.latitud?.toString() || '');
        setUbicacionLongitud(activo.ubicacionDetalle.longitud?.toString() || '');
        setUbicacionReferencias(activo.ubicacionDetalle.referencias || '');
      }
      
      if (activo.contactos && activo.contactos.length > 0) {
        setContactos(activo.contactos.map(c => ({
          id: c.id,
          nombre: c.nombre,
          cargo: c.cargo || '',
          telefono: c.telefono || '',
          correo: c.correo || '',
          tipoContacto: c.tipoContacto
        })));
      }
      
      // Cargar datos de empresa relacionada
      if (activo.empresaInfo) {
        setEmpresaNombre(activo.empresaInfo.nombre || '');
        setEmpresaRazonSocial(activo.empresaInfo.razonSocial || '');
        setEmpresaRfc(activo.empresaInfo.rfc || '');
        setEmpresaDireccion(activo.empresaInfo.direccion || '');
        setEmpresaCodigoPostal(activo.empresaInfo.codigoPostal || '');
        setEmpresaCiudad(activo.empresaInfo.ciudad || '');
        setEmpresaEstado(activo.empresaInfo.estado || '');
        setEmpresaPais(activo.empresaInfo.pais || 'Mexico');
        setEmpresaTelefono(activo.empresaInfo.telefono || '');
        setEmpresaEmail(activo.empresaInfo.email || '');
        setEmpresaPaginaWeb(activo.empresaInfo.paginaWeb || '');
        setEmpresaFacebook(activo.empresaInfo.facebook || '');
        setEmpresaInstagram(activo.empresaInfo.instagram || '');
        setEmpresaLinkedin(activo.empresaInfo.linkedin || '');
        setEmpresaTwitter(activo.empresaInfo.twitter || '');
        setRepresentanteLegal(activo.empresaInfo.representanteLegal || '');
        setRepresentanteTelefono(activo.empresaInfo.representanteTelefono || '');
        setRepresentanteEmail(activo.empresaInfo.representanteEmail || '');
        setActaConstitutivaUrl(activo.empresaInfo.actaConstitutivaUrl || '');
        setPoderNotarialUrl(activo.empresaInfo.poderNotarialUrl || '');
        setComprobanteDomicilioUrl(activo.empresaInfo.comprobanteDomicilioUrl || '');
        setIdentificacionRepresentanteUrl(activo.empresaInfo.identificacionRepresentanteUrl || '');
        setEmpresaNotas(activo.empresaInfo.notas || '');
      } else {
        // Usar datos legacy del activo
        setEmpresaNombre(activo.empresaRelacionada || '');
        setEmpresaRazonSocial(activo.razonSocial || '');
        setEmpresaRfc(activo.rfc || '');
        setEmpresaDireccion(activo.direccionFiscal || '');
      }
      
      // Cargar certificados si existen
      if (activo.certificados && activo.certificados.length > 0) {
        setCertificados(activo.certificados.map(c => ({
          id: c.id,
          nombre: c.nombre,
          porcentajeAdquirido: c.porcentajeAdquirido,
          valor: c.valor
        })));
      }
      
      // Cargar plan de compra si existe
      if (activo.planCompra) {
        setPlanFechaInicio(activo.planCompra.fechaInicio || '');
        setPlanFechaFin(activo.planCompra.fechaFin || '');
        setPlanEnganche(activo.planCompra.enganche?.toString() || '');
        setPlanNumeroPagos(activo.planCompra.numeroPagos?.toString() || '12');
        setPlanPeriodicidad(activo.planCompra.periodicidad || 'mensual');
        setPlanNotas(activo.planCompra.notas || '');
        if (activo.planCompra.pagos && activo.planCompra.pagos.length > 0) {
          setPagosPlan(activo.planCompra.pagos);
        }
      }
      
      // Cargar documentos si existen
      if (activo.documentos && activo.documentos.length > 0) {
        setDocumentos(activo.documentos.map(d => ({
          id: d.id,
          nombre: d.nombre,
          tipo: d.tipo,
          googleDriveUrl: d.googleDriveUrl || '',
          descripcion: d.descripcion || ''
        })));
      }
    }
  }, [activo]);

  // Calcular rentabilidad automáticamente basada en porcentaje y valor total
  useEffect(() => {
    const valor = parseFloat(valorTotal) || 0;
    const porcentaje = parseFloat(porcentajeRentabilidad) || 0;
    
    if (valor > 0 && porcentaje > 0) {
      const rentAnual = (valor * porcentaje) / 100;
      const rentMensual = rentAnual / 12;
      setRentabilidadAnual(Math.round(rentAnual).toString());
      setRentabilidadMensual(Math.round(rentMensual).toString());
    }
  }, [valorTotal, porcentajeRentabilidad]);

  // Funciones para manejar certificados
  const addCertificado = () => {
    setCertificados([
      ...certificados,
      { id: Date.now().toString(), nombre: '', porcentajeAdquirido: 0, valor: 0 }
    ]);
  };

  const removeCertificado = (certificadoId: string) => {
    if (certificados.length > 1) {
      setCertificados(certificados.filter((c) => c.id !== certificadoId));
    }
  };

  const updateCertificado = (certificadoId: string, field: string, value: string | number) => {
    setCertificados(certificados.map((c) => 
      c.id === certificadoId ? { ...c, [field]: value } : c
    ));
  };

  // Calcular valor total de certificados
  const valorTotalCertificados = certificados.reduce((sum, c) => sum + (c.valor || 0), 0);

  // Funciones para manejar pagos del plan
  const generarPagosPlan = () => {
    const numPagos = parseInt(planNumeroPagos) || 1;
    const montoTotal = tipoActivo === 'pool_rentas' ? valorTotalCertificados : (parseFloat(valorTotal) || 0);
    const enganche = parseFloat(planEnganche) || 0;
    const montoFinanciar = montoTotal - enganche;
    const montoPorPago = montoFinanciar / numPagos;
    
    const fechaBase = planFechaInicio ? new Date(planFechaInicio) : new Date();
    const nuevosPagos: PagoPlanificado[] = [];
    
    for (let i = 0; i < numPagos; i++) {
      const fechaPago = new Date(fechaBase);
      switch (planPeriodicidad) {
        case 'semanal':
          fechaPago.setDate(fechaPago.getDate() + (i * 7));
          break;
        case 'quincenal':
          fechaPago.setDate(fechaPago.getDate() + (i * 15));
          break;
        case 'mensual':
          fechaPago.setMonth(fechaPago.getMonth() + i);
          break;
        case 'bimestral':
          fechaPago.setMonth(fechaPago.getMonth() + (i * 2));
          break;
        case 'trimestral':
          fechaPago.setMonth(fechaPago.getMonth() + (i * 3));
          break;
        case 'semestral':
          fechaPago.setMonth(fechaPago.getMonth() + (i * 6));
          break;
        case 'anual':
          fechaPago.setFullYear(fechaPago.getFullYear() + i);
          break;
        case 'unico':
          break;
      }
      
      nuevosPagos.push({
        id: `pago-${Date.now()}-${i}`,
        numeroPago: i + 1,
        fechaProgramada: fechaPago.toISOString().split('T')[0],
        monto: Math.round(montoPorPago * 100) / 100,
        estado: 'pendiente',
      });
    }
    
    setPagosPlan(nuevosPagos);
  };

  const updatePagoPlan = (pagoId: string, field: keyof PagoPlanificado, value: string | number) => {
    setPagosPlan(pagosPlan.map(p => 
      p.id === pagoId ? { ...p, [field]: value } : p
    ));
  };

  const marcarPagado = (pagoId: string) => {
    setPagosPlan(pagosPlan.map(p => {
      if (p.id === pagoId) {
        return {
          ...p,
          estado: 'pagado' as const,
          fechaPago: new Date().toISOString().split('T')[0],
          montoPagado: p.monto
        };
      }
      return p;
    }));
  };

  const calcularTotalPagado = () => {
    return pagosPlan.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + (p.montoPagado || p.monto), 0);
  };

  const calcularTotalPendiente = () => {
    return pagosPlan.filter(p => p.estado !== 'pagado').reduce((sum, p) => sum + p.monto, 0);
  };

  const getEstadoBadge = (estado: PagoPlanificado['estado']) => {
    switch (estado) {
      case 'pagado':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Pagado</Badge>;
      case 'pendiente':
        return <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'vencido':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><AlertCircle className="h-3 w-3 mr-1" />Vencido</Badge>;
      case 'parcial':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><Clock className="h-3 w-3 mr-1" />Parcial</Badge>;
    }
  };

  const addContacto = () => {
    setContactos([
      ...contactos,
      { id: Date.now().toString(), nombre: '', cargo: '', telefono: '', correo: '', tipoContacto: 'otro' }
    ]);
  };

  const removeContacto = (contactoId: string) => {
    if (contactos.length > 1) {
      setContactos(contactos.filter((c) => c.id !== contactoId));
    }
  };

  // Funciones para manejar documentos
  const addDocumento = () => {
    setDocumentos([
      ...documentos,
      { id: Date.now().toString(), nombre: '', tipo: 'otro', googleDriveUrl: '', descripcion: '' }
    ]);
  };

  const removeDocumento = (docId: string) => {
    setDocumentos(documentos.filter((d) => d.id !== docId));
  };

  const updateDocumento = (docId: string, field: string, value: string) => {
    setDocumentos(documentos.map((d) => 
      d.id === docId ? { ...d, [field]: value } : d
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Guardar los cambios usando el contexto
    updateActivo(id, {
      nombre,
      tipoActivo,
      estado,
      ubicacion,
      ubicacionDetalle: {
        direccion: ubicacion,
        colonia: ubicacionColonia,
        ciudad: ubicacionCiudad,
        estado: ubicacionEstado,
        codigoPostal: ubicacionCP,
        pais: ubicacionPais,
        latitud: parseFloat(ubicacionLatitud) || undefined,
        longitud: parseFloat(ubicacionLongitud) || undefined,
        referencias: ubicacionReferencias,
      },
      responsableInterno: responsable,
      descripcion,
      empresaRelacionada: empresaNombre,
      rfc: empresaRfc,
      razonSocial: empresaRazonSocial,
      direccionFiscal: empresaDireccion,
      valorTotal: tipoActivo === 'pool_rentas' ? valorTotalCertificados : (parseFloat(valorTotal) || 0),
      montoPagado: parseFloat(montoPagado) || 0,
      certificados: tipoActivo === 'pool_rentas' ? certificados.filter(c => c.nombre && c.valor > 0) : undefined,
      formaCompra,
      fechaCompra,
      rentabilidadMensualEsperada: parseFloat(rentabilidadMensual) || 0,
      rentabilidadAnualEsperada: parseFloat(rentabilidadAnual) || 0,
      periodicidadDividendos,
      porcentajeApreciacion: parseFloat(porcentajeApreciacion) || 0,
      contactos: contactos.map(c => ({
        id: c.id,
        nombre: c.nombre,
        cargo: c.cargo,
        telefono: c.telefono,
        correo: c.correo,
        tipoContacto: c.tipoContacto,
      })),
      empresaInfo: {
        nombre: empresaNombre,
        razonSocial: empresaRazonSocial,
        rfc: empresaRfc,
        direccion: empresaDireccion,
        codigoPostal: empresaCodigoPostal,
        ciudad: empresaCiudad,
        estado: empresaEstado,
        pais: empresaPais,
        telefono: empresaTelefono,
        email: empresaEmail,
        paginaWeb: empresaPaginaWeb,
        facebook: empresaFacebook,
        instagram: empresaInstagram,
        linkedin: empresaLinkedin,
        twitter: empresaTwitter,
        representanteLegal,
        representanteTelefono,
        representanteEmail,
        actaConstitutivaUrl,
        poderNotarialUrl,
        comprobanteDomicilioUrl,
        identificacionRepresentanteUrl,
        notas: empresaNotas,
      },
      planCompra: pagosPlan.length > 0 ? {
        fechaInicio: planFechaInicio,
        fechaFin: planFechaFin,
        montoTotal: tipoActivo === 'pool_rentas' ? valorTotalCertificados : (parseFloat(valorTotal) || 0),
        enganche: parseFloat(planEnganche) || 0,
        numeroPagos: parseInt(planNumeroPagos) || 1,
        periodicidad: planPeriodicidad,
        pagos: pagosPlan,
        notas: planNotas,
      } : undefined,
      documentos: documentos.filter(d => d.nombre && d.googleDriveUrl).map(d => ({
        id: d.id,
        nombre: d.nombre,
        tipo: d.tipo,
        categoria: d.tipo,
        fechaCarga: new Date().toISOString().split('T')[0],
        usuarioCargo: '',
        estatus: 'vigente',
        archivoUrl: '',
        googleDriveUrl: d.googleDriveUrl,
        descripcion: d.descripcion,
      })),
    });
    
    router.push(`/activos/${id}`);
  };

  if (!activo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-xl font-semibold">Activo no encontrado</h1>
          <Button asChild className="mt-4">
            <Link href="/activos">Volver a Activos</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/activos/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Editar Activo</h1>
              <p className="text-muted-foreground">{activo.nombre}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/activos/${id}`}>Cancelar</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="financiero">Financiero</TabsTrigger>
            <TabsTrigger value="plancompra">Plan de Compra</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informacion General</CardTitle>
                <CardDescription>Datos basicos del activo</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nombre">Nombre del Activo *</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Pool de Rentas Corporativo Monterrey"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoActivo">Tipo de Activo *</Label>
                  <Select value={tipoActivo} onValueChange={setTipoActivo} required>
                    <SelectTrigger id="tipoActivo">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inmueble_completo">Inmueble completo</SelectItem>
                      <SelectItem value="pool_rentas">Pool de rentas</SelectItem>
                      <SelectItem value="participacion_parcial">Participacion parcial</SelectItem>
                      <SelectItem value="camion_renta">Camion en renta</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="local_comercial">Local comercial</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Actual *</Label>
                  <Select value={estado} onValueChange={setEstado} required>
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_analisis">En analisis</SelectItem>
                      <SelectItem value="en_negociacion">En negociacion</SelectItem>
                      <SelectItem value="en_proceso_compra">En proceso de compra</SelectItem>
                      <SelectItem value="en_pago">En pago</SelectItem>
                      <SelectItem value="en_espera_entrega">En espera de entrega</SelectItem>
                      <SelectItem value="en_espera_operacion">En espera de operacion</SelectItem>
                      <SelectItem value="generando_rentas">Generando rentas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable Interno</Label>
                  <Select value={responsable} onValueChange={setResponsable}>
                    <SelectTrigger id="responsable">
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Enrique Guzmán">Enrique Guzman</SelectItem>
                      <SelectItem value="Keila Jozabed Hernandez">Keila Jozabed Hernandez</SelectItem>
                      <SelectItem value="Tony Lara">Tony Lara</SelectItem>
                      <SelectItem value="Alejandra">Alejandra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="descripcion">Descripcion</Label>
                  <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripcion detallada del activo..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ubicacion del Activo */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicacion del Activo</CardTitle>
                <CardDescription>Direccion completa y coordenadas para mostrar en el mapa</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="ubicacion">Direccion (Calle y Numero)</Label>
                  <Input
                    id="ubicacion"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    placeholder="Av. Principal #123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionColonia">Colonia</Label>
                  <Input
                    id="ubicacionColonia"
                    value={ubicacionColonia}
                    onChange={(e) => setUbicacionColonia(e.target.value)}
                    placeholder="Colonia Centro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionCiudad">Ciudad</Label>
                  <Input
                    id="ubicacionCiudad"
                    value={ubicacionCiudad}
                    onChange={(e) => setUbicacionCiudad(e.target.value)}
                    placeholder="Monterrey"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionEstado">Estado</Label>
                  <Input
                    id="ubicacionEstado"
                    value={ubicacionEstado}
                    onChange={(e) => setUbicacionEstado(e.target.value)}
                    placeholder="Nuevo Leon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionCP">Codigo Postal</Label>
                  <Input
                    id="ubicacionCP"
                    value={ubicacionCP}
                    onChange={(e) => setUbicacionCP(e.target.value)}
                    placeholder="64000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionPais">Pais</Label>
                  <Input
                    id="ubicacionPais"
                    value={ubicacionPais}
                    onChange={(e) => setUbicacionPais(e.target.value)}
                    placeholder="Mexico"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="ubicacionReferencias">Referencias</Label>
                  <Input
                    id="ubicacionReferencias"
                    value={ubicacionReferencias}
                    onChange={(e) => setUbicacionReferencias(e.target.value)}
                    placeholder="Entre calles, cerca de..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionLatitud">Latitud (opcional)</Label>
                  <Input
                    id="ubicacionLatitud"
                    type="number"
                    step="any"
                    value={ubicacionLatitud}
                    onChange={(e) => setUbicacionLatitud(e.target.value)}
                    placeholder="25.6866"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacionLongitud">Longitud (opcional)</Label>
                  <Input
                    id="ubicacionLongitud"
                    type="number"
                    step="any"
                    value={ubicacionLongitud}
                    onChange={(e) => setUbicacionLongitud(e.target.value)}
                    placeholder="-100.3161"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3 text-xs text-muted-foreground">
                  Tip: Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en la ubicacion deseada.
                </div>
                
                {/* Preview del mapa */}
                {(ubicacion || ubicacionCiudad) && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <Label className="mb-2 block">Vista previa del mapa</Label>
                    <div className="rounded-lg overflow-hidden border">
                      <iframe
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={
                          ubicacionLatitud && ubicacionLongitud
                            ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${ubicacionLatitud},${ubicacionLongitud}&zoom=16`
                            : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                                [ubicacion, ubicacionColonia, ubicacionCiudad, ubicacionEstado, ubicacionCP, ubicacionPais].filter(Boolean).join(', ')
                              )}`
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            </TabsContent>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos Generales de la Empresa</CardTitle>
                <CardDescription>Informacion fiscal y comercial de la empresa relacionada</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="empresaNombre">Nombre Comercial *</Label>
                  <Input
                    id="empresaNombre"
                    value={empresaNombre}
                    onChange={(e) => setEmpresaNombre(e.target.value)}
                    placeholder="Ej: Grupo Patrimonial Norte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaRazonSocial">Razon Social</Label>
                  <Input
                    id="empresaRazonSocial"
                    value={empresaRazonSocial}
                    onChange={(e) => setEmpresaRazonSocial(e.target.value)}
                    placeholder="Ej: Grupo Patrimonial Norte S.A. de C.V."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaRfc">RFC</Label>
                  <Input
                    id="empresaRfc"
                    value={empresaRfc}
                    onChange={(e) => setEmpresaRfc(e.target.value)}
                    placeholder="Ej: GPN180501XY7"
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Direccion</CardTitle>
                <CardDescription>Domicilio fiscal de la empresa</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="empresaDireccion">Direccion</Label>
                  <Input
                    id="empresaDireccion"
                    value={empresaDireccion}
                    onChange={(e) => setEmpresaDireccion(e.target.value)}
                    placeholder="Calle, Numero, Colonia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaCiudad">Ciudad</Label>
                  <Input
                    id="empresaCiudad"
                    value={empresaCiudad}
                    onChange={(e) => setEmpresaCiudad(e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaEstado">Estado</Label>
                  <Input
                    id="empresaEstado"
                    value={empresaEstado}
                    onChange={(e) => setEmpresaEstado(e.target.value)}
                    placeholder="Estado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaCodigoPostal">Codigo Postal</Label>
                  <Input
                    id="empresaCodigoPostal"
                    value={empresaCodigoPostal}
                    onChange={(e) => setEmpresaCodigoPostal(e.target.value)}
                    placeholder="C.P."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaPais">Pais</Label>
                  <Input
                    id="empresaPais"
                    value={empresaPais}
                    onChange={(e) => setEmpresaPais(e.target.value)}
                    placeholder="Mexico"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
                <CardDescription>Datos de contacto de la empresa</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="empresaTelefono">Telefono</Label>
                  <Input
                    id="empresaTelefono"
                    value={empresaTelefono}
                    onChange={(e) => setEmpresaTelefono(e.target.value)}
                    placeholder="+52 (81) 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaEmail">Correo Electronico</Label>
                  <Input
                    id="empresaEmail"
                    type="email"
                    value={empresaEmail}
                    onChange={(e) => setEmpresaEmail(e.target.value)}
                    placeholder="contacto@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaPaginaWeb">Pagina Web</Label>
                  <Input
                    id="empresaPaginaWeb"
                    value={empresaPaginaWeb}
                    onChange={(e) => setEmpresaPaginaWeb(e.target.value)}
                    placeholder="https://www.empresa.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
                <CardDescription>Perfiles de la empresa en redes sociales</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="empresaFacebook">Facebook</Label>
                  <Input
                    id="empresaFacebook"
                    value={empresaFacebook}
                    onChange={(e) => setEmpresaFacebook(e.target.value)}
                    placeholder="https://facebook.com/empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaInstagram">Instagram</Label>
                  <Input
                    id="empresaInstagram"
                    value={empresaInstagram}
                    onChange={(e) => setEmpresaInstagram(e.target.value)}
                    placeholder="https://instagram.com/empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaLinkedin">LinkedIn</Label>
                  <Input
                    id="empresaLinkedin"
                    value={empresaLinkedin}
                    onChange={(e) => setEmpresaLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaTwitter">Twitter / X</Label>
                  <Input
                    id="empresaTwitter"
                    value={empresaTwitter}
                    onChange={(e) => setEmpresaTwitter(e.target.value)}
                    placeholder="https://twitter.com/empresa"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Representante Legal</CardTitle>
                <CardDescription>Datos del representante legal de la empresa</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="representanteLegal">Nombre Completo</Label>
                  <Input
                    id="representanteLegal"
                    value={representanteLegal}
                    onChange={(e) => setRepresentanteLegal(e.target.value)}
                    placeholder="Nombre del representante legal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representanteTelefono">Telefono</Label>
                  <Input
                    id="representanteTelefono"
                    value={representanteTelefono}
                    onChange={(e) => setRepresentanteTelefono(e.target.value)}
                    placeholder="+52 (81) 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representanteEmail">Correo Electronico</Label>
                  <Input
                    id="representanteEmail"
                    type="email"
                    value={representanteEmail}
                    onChange={(e) => setRepresentanteEmail(e.target.value)}
                    placeholder="representante@empresa.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={empresaNotas}
                  onChange={(e) => setEmpresaNotas(e.target.value)}
                  placeholder="Notas o comentarios adicionales sobre la empresa..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financiero Tab */}
          <TabsContent value="financiero" className="space-y-6">
            {/* Seccion de Certificados/Acciones - Solo para Pool de Rentas */}
            {tipoActivo === 'pool_rentas' && (
              <Card>
                <CardHeader>
                  <CardTitle>Certificados / Acciones</CardTitle>
                  <CardDescription>Desglose de certificados o acciones que componen el Pool de Rentas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Encabezados */}
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div className="col-span-5">Certificado / Accion</div>
                    <div className="col-span-2 text-center">% Adquirido</div>
                    <div className="col-span-3 text-right">Valor</div>
                    <div className="col-span-2"></div>
                  </div>
                  
                  {/* Lista de certificados */}
                  {certificados.map((certificado, index) => (
                    <div key={certificado.id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input
                          value={certificado.nombre}
                          onChange={(e) => updateCertificado(certificado.id, 'nombre', e.target.value)}
                          placeholder={`Certificado ${index + 1}`}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={certificado.porcentajeAdquirido || ''}
                          onChange={(e) => updateCertificado(certificado.id, 'porcentajeAdquirido', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                          className="text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={certificado.valor || ''}
                          onChange={(e) => updateCertificado(certificado.id, 'valor', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className="text-right"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCertificado(certificado.id)}
                          disabled={certificados.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Boton agregar */}
                  <Button type="button" variant="outline" onClick={addCertificado} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Certificado
                  </Button>
                  
                  {/* Total */}
                  <div className="grid grid-cols-12 gap-4 items-center pt-4 border-t">
                    <div className="col-span-5 font-semibold">Valor Total del Activo</div>
                    <div className="col-span-2 text-center font-medium">
                      {certificados.reduce((sum, c) => sum + (c.porcentajeAdquirido || 0), 0).toFixed(2)}%
                    </div>
                    <div className="col-span-3 text-right font-bold text-lg">
                      ${valorTotalCertificados.toLocaleString('es-MX')}
                    </div>
                    <div className="col-span-2"></div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informacion de Compra</CardTitle>
                <CardDescription>Datos financieros de la adquisicion</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tipoActivo !== 'pool_rentas' && (
                  <div className="space-y-2">
                    <Label htmlFor="valorTotal">Valor Total del Activo *</Label>
                    <Input
                      id="valorTotal"
                      type="number"
                      value={valorTotal}
                      onChange={(e) => setValorTotal(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>
                )}
                {tipoActivo === 'pool_rentas' && (
                  <div className="space-y-2">
                    <Label>Valor Total del Activo</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted px-3 font-medium">
                      ${valorTotalCertificados.toLocaleString('es-MX')}
                    </div>
                    <p className="text-xs text-muted-foreground">Calculado desde certificados</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="montoPagado">Monto Pagado</Label>
                  <Input
                    id="montoPagado"
                    type="number"
                    value={montoPagado}
                    onChange={(e) => setMontoPagado(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montoPendiente">Monto Pendiente</Label>
                  <Input
                    id="montoPendiente"
                    type="number"
                    value={(Number(valorTotal) - Number(montoPagado)).toString()}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaCompra">Forma de Compra</Label>
                  <Select value={formaCompra} onValueChange={setFormaCompra}>
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
                  <Input
                    id="fechaCompra"
                    type="date"
                    value={fechaCompra}
                    onChange={(e) => setFechaCompra(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad y Proyecciones</CardTitle>
                <CardDescription>Ingresa el porcentaje de rentabilidad esperada para calcular automaticamente los montos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Inputs de porcentajes */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="porcentajeRentabilidad">% Rentabilidad Anual *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="porcentajeRentabilidad"
                        type="number"
                        value={porcentajeRentabilidad}
                        onChange={(e) => setPorcentajeRentabilidad(e.target.value)}
                        placeholder="8"
                        min="0"
                        max="100"
                        step="0.1"
                        className="flex-1"
                      />
                      <span className="text-muted-foreground font-medium">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Porcentaje de retorno anual sobre la inversion</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="porcentajeApreciacion">% Apreciacion Anual</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="porcentajeApreciacion"
                        type="number"
                        value={porcentajeApreciacion}
                        onChange={(e) => setPorcentajeApreciacion(e.target.value)}
                        placeholder="5"
                        min="0"
                        max="100"
                        step="0.1"
                        className="flex-1"
                      />
                      <span className="text-muted-foreground font-medium">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Incremento anual esperado del valor del activo</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodicidadDividendos">Periodicidad de Dividendos</Label>
                    <Select value={periodicidadDividendos} onValueChange={setPeriodicidadDividendos}>
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
                    <p className="text-xs text-muted-foreground">Frecuencia de pago de dividendos</p>
                  </div>
                </div>

                {/* Rentabilidad calculada */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium mb-4 text-muted-foreground">Rentabilidad Calculada (basada en Valor Total: ${parseFloat(valorTotal || '0').toLocaleString('es-MX')})</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rentabilidadMensual">Rentabilidad Mensual Esperada</Label>
                      <div className="p-3 rounded-md bg-background border">
                        <p className="text-xl font-bold text-emerald-600">
                          ${parseFloat(rentabilidadMensual || '0').toLocaleString('es-MX')}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Calculado: (Valor Total x % Rentabilidad) / 12</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentabilidadAnual">Rentabilidad Anual Esperada</Label>
                      <div className="p-3 rounded-md bg-background border">
                        <p className="text-xl font-bold text-emerald-600">
                          ${parseFloat(rentabilidadAnual || '0').toLocaleString('es-MX')}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Calculado: Valor Total x % Rentabilidad</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan de Compra Tab */}
          <TabsContent value="plancompra" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Configuracion del Plan de Pagos
                </CardTitle>
                <CardDescription>Define como se realizara o se realizo la compra de este activo</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="planFechaInicio">Fecha de Inicio *</Label>
                  <Input
                    id="planFechaInicio"
                    type="date"
                    value={planFechaInicio}
                    onChange={(e) => setPlanFechaInicio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planFechaFin">Fecha de Finalizacion</Label>
                  <Input
                    id="planFechaFin"
                    type="date"
                    value={planFechaFin}
                    onChange={(e) => setPlanFechaFin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planEnganche">Enganche / Pago Inicial</Label>
                  <Input
                    id="planEnganche"
                    type="number"
                    value={planEnganche}
                    onChange={(e) => setPlanEnganche(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planNumeroPagos">Numero de Pagos</Label>
                  <Input
                    id="planNumeroPagos"
                    type="number"
                    value={planNumeroPagos}
                    onChange={(e) => setPlanNumeroPagos(e.target.value)}
                    placeholder="12"
                    min="1"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planPeriodicidad">Periodicidad</Label>
                  <Select value={planPeriodicidad} onValueChange={(v) => setPlanPeriodicidad(v as typeof planPeriodicidad)}>
                    <SelectTrigger id="planPeriodicidad">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="bimestral">Bimestral</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                      <SelectItem value="unico">Pago Unico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="planNotas">Notas del Plan</Label>
                  <Textarea
                    id="planNotas"
                    value={planNotas}
                    onChange={(e) => setPlanNotas(e.target.value)}
                    placeholder="Observaciones sobre el plan de pagos..."
                    rows={2}
                  />
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Button type="button" onClick={generarPagosPlan} disabled={!planFechaInicio}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Generar Plan de Pagos
                </Button>
              </div>
            </Card>

            {/* Resumen del Plan */}
            {pagosPlan.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total a Pagar</p>
                        <p className="text-2xl font-bold">${(tipoActivo === 'pool_rentas' ? valorTotalCertificados : parseFloat(valorTotal) || 0).toLocaleString('es-MX')}</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center bg-green-500/10">
                        <p className="text-sm text-muted-foreground">Total Pagado</p>
                        <p className="text-2xl font-bold text-green-600">${calcularTotalPagado().toLocaleString('es-MX')}</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center bg-amber-500/10">
                        <p className="text-sm text-muted-foreground">Pendiente</p>
                        <p className="text-2xl font-bold text-amber-600">${calcularTotalPendiente().toLocaleString('es-MX')}</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-sm text-muted-foreground">Progreso</p>
                        <p className="text-2xl font-bold">
                          {pagosPlan.filter(p => p.estado === 'pagado').length} / {pagosPlan.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalle de Pagos</CardTitle>
                    <CardDescription>Calendario de pagos programados y realizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Encabezados */}
                      <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                        <div className="col-span-1">#</div>
                        <div className="col-span-2">Fecha Programada</div>
                        <div className="col-span-2">Monto</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-2">Fecha de Pago</div>
                        <div className="col-span-2">Comprobante</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {/* Lista de pagos */}
                      {pagosPlan.map((pago) => (
                        <div key={pago.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                          <div className="sm:col-span-1">
                            <span className="text-sm font-medium">#{pago.numeroPago}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <Input
                              type="date"
                              value={pago.fechaProgramada}
                              onChange={(e) => updatePagoPlan(pago.id, 'fechaProgramada', e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Input
                              type="number"
                              value={pago.monto}
                              onChange={(e) => updatePagoPlan(pago.id, 'monto', parseFloat(e.target.value) || 0)}
                              className="h-9 text-right"
                              min="0"
                              step="100"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            {getEstadoBadge(pago.estado)}
                          </div>
                          <div className="sm:col-span-2">
                            {pago.estado === 'pagado' ? (
                              <span className="text-sm">{pago.fechaPago}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            {pago.comprobanteUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={pago.comprobanteUrl} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Ver
                                </a>
                              </Button>
                            ) : (
                              <Input
                                type="text"
                                placeholder="URL comprobante"
                                value={pago.comprobanteUrl || ''}
                                onChange={(e) => updatePagoPlan(pago.id, 'comprobanteUrl', e.target.value)}
                                className="h-9 text-xs"
                              />
                            )}
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            {pago.estado !== 'pagado' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => marcarPagado(pago.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {pagosPlan.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No hay plan de pagos configurado</p>
                    <p className="text-sm">Completa los datos arriba y haz clic en &quot;Generar Plan de Pagos&quot;</p>
                  </div>
                </CardContent>
              </Card>
            )}
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
                        <Input
                          value={contacto.nombre}
                          onChange={(e) => {
                            const updated = contactos.map(c =>
                              c.id === contacto.id ? { ...c, nombre: e.target.value } : c
                            );
                            setContactos(updated);
                          }}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          value={contacto.cargo}
                          onChange={(e) => {
                            const updated = contactos.map(c =>
                              c.id === contacto.id ? { ...c, cargo: e.target.value } : c
                            );
                            setContactos(updated);
                          }}
                          placeholder="Cargo o puesto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de Contacto</Label>
                        <Select
                          value={contacto.tipoContacto}
                          onValueChange={(value) => {
                            const updated = contactos.map(c =>
                              c.id === contacto.id ? { ...c, tipoContacto: value } : c
                            );
                            setContactos(updated);
                          }}
                        >
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
                        <Label>Telefono</Label>
                        <Input
                          value={contacto.telefono}
                          onChange={(e) => {
                            const updated = contactos.map(c =>
                              c.id === contacto.id ? { ...c, telefono: e.target.value } : c
                            );
                            setContactos(updated);
                          }}
                          placeholder="+52 81 1234 5678"
                          type="tel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Correo</Label>
                        <Input
                          value={contacto.correo}
                          onChange={(e) => {
                            const updated = contactos.map(c =>
                              c.id === contacto.id ? { ...c, correo: e.target.value } : c
                            );
                            setContactos(updated);
                          }}
                          placeholder="correo@ejemplo.com"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-6">
            {/* Documentos para Firma de Contrato */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos para Firma de Contrato</CardTitle>
                <CardDescription>Documentacion requerida para formalizar la compra del activo</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contratoCompraventa">Contrato de Compraventa</Label>
                  <Input
                    id="contratoCompraventa"
                    value={contratoCompraventaUrl}
                    onChange={(e) => setContratoCompraventaUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escrituras">Escrituras del Inmueble</Label>
                  <Input
                    id="escrituras"
                    value={escriturasUrl}
                    onChange={(e) => setEscriturasUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avaluo">Avaluo Comercial</Label>
                  <Input
                    id="avaluo"
                    value={avaluoUrl}
                    onChange={(e) => setAvaluoUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificadoLibertad">Certificado de Libertad de Gravamen</Label>
                  <Input
                    id="certificadoLibertad"
                    value={certificadoLibertadGravamenUrl}
                    onChange={(e) => setCertificadoLibertadGravamenUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boletaPredial">Boleta Predial</Label>
                  <Input
                    id="boletaPredial"
                    value={boletaPredialUrl}
                    onChange={(e) => setBoletaPredialUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recibosServicios">Recibos de Servicios (Agua, Luz, Gas)</Label>
                  <Input
                    id="recibosServicios"
                    value={recibosServiciosUrl}
                    onChange={(e) => setRecibosServiciosUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documentos para Fideicomiso/Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos para Fideicomiso / Empresa</CardTitle>
                <CardDescription>Documentacion requerida para formar parte de un fideicomiso o constituir una empresa</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="actaConstitutiva">Acta Constitutiva</Label>
                  <Input
                    id="actaConstitutiva"
                    value={actaConstitutivaUrl}
                    onChange={(e) => setActaConstitutivaUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poderNotarial">Poder Notarial</Label>
                  <Input
                    id="poderNotarial"
                    value={poderNotarialUrl}
                    onChange={(e) => setPoderNotarialUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contratoFideicomiso">Contrato de Fideicomiso</Label>
                  <Input
                    id="contratoFideicomiso"
                    value={contratoFideicomisoUrl}
                    onChange={(e) => setContratoFideicomisoUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reglamentoFideicomiso">Reglamento del Fideicomiso</Label>
                  <Input
                    id="reglamentoFideicomiso"
                    value={reglamentoFideicomisoUrl}
                    onChange={(e) => setReglamentoFideicomisoUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cedulaFiscal">Cedula Fiscal (RFC)</Label>
                  <Input
                    id="cedulaFiscal"
                    value={cedulaFiscalUrl}
                    onChange={(e) => setCedulaFiscalUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comprobanteDomicilio">Comprobante de Domicilio Fiscal</Label>
                  <Input
                    id="comprobanteDomicilio"
                    value={comprobanteDomicilioUrl}
                    onChange={(e) => setComprobanteDomicilioUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identificacionRepresentante">Identificacion del Representante Legal</Label>
                  <Input
                    id="identificacionRepresentante"
                    value={identificacionRepresentanteUrl}
                    onChange={(e) => setIdentificacionRepresentanteUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartaPoderes">Carta de Poderes</Label>
                  <Input
                    id="cartaPoderes"
                    value={cartaPoderesUrl}
                    onChange={(e) => setCartaPoderesUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadosFinancieros">Estados Financieros</Label>
                  <Input
                    id="estadosFinancieros"
                    value={estadosFinancierosUrl}
                    onChange={(e) => setEstadosFinancierosUrl(e.target.value)}
                    placeholder="URL o link de Google Drive"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Otros Documentos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Otros Documentos</CardTitle>
                  <CardDescription>Documentos adicionales vinculados a este activo</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addDocumento}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Documento
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay documentos vinculados</p>
                    <p className="text-sm text-muted-foreground mb-4">Agrega enlaces a tus documentos en Google Drive</p>
                    <Button type="button" variant="outline" onClick={addDocumento}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar primer documento
                    </Button>
                  </div>
                ) : (
                  documentos.map((doc, index) => {
                    const getDocIcon = (tipo: string) => {
                      const iconConfig: Record<string, { icon: React.ElementType; color: string }> = {
                        contrato: { icon: FileSignature, color: 'bg-blue-500/10 text-blue-500' },
                        escritura: { icon: FileSignature, color: 'bg-blue-500/10 text-blue-500' },
                        factura: { icon: Receipt, color: 'bg-green-500/10 text-green-500' },
                        comprobante_pago: { icon: CreditCard, color: 'bg-purple-500/10 text-purple-500' },
                        acta_constitutiva: { icon: Scale, color: 'bg-amber-500/10 text-amber-500' },
                        poder_notarial: { icon: Scale, color: 'bg-amber-500/10 text-amber-500' },
                        identificacion: { icon: Scale, color: 'bg-amber-500/10 text-amber-500' },
                        reporte: { icon: PieChart, color: 'bg-cyan-500/10 text-cyan-500' },
                        avaluo: { icon: PieChart, color: 'bg-cyan-500/10 text-cyan-500' },
                        fiscal: { icon: Calculator, color: 'bg-red-500/10 text-red-500' },
                        declaracion: { icon: Calculator, color: 'bg-red-500/10 text-red-500' },
                        estado_cuenta: { icon: Landmark, color: 'bg-indigo-500/10 text-indigo-500' },
                        bancario: { icon: Landmark, color: 'bg-indigo-500/10 text-indigo-500' },
                        otro: { icon: FolderOpen, color: 'bg-gray-500/10 text-gray-500' },
                        plano: { icon: FolderOpen, color: 'bg-gray-500/10 text-gray-500' },
                        fotografia: { icon: FolderOpen, color: 'bg-gray-500/10 text-gray-500' },
                      };
                      return iconConfig[tipo] || iconConfig.otro;
                    };
                    const { icon: DocIcon, color: iconColor } = getDocIcon(doc.tipo);
                    
                    return (
                    <div key={doc.id} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                            <DocIcon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">Documento {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocumento(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nombre del Documento *</Label>
                          <Input
                            value={doc.nombre}
                            onChange={(e) => updateDocumento(doc.id, 'nombre', e.target.value)}
                            placeholder="Ej: Contrato de compraventa"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Documento</Label>
                          <Select 
                            value={doc.tipo} 
                            onValueChange={(v) => updateDocumento(doc.id, 'tipo', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contrato">Contratos - Contrato</SelectItem>
                              <SelectItem value="escritura">Contratos - Escritura</SelectItem>
                              <SelectItem value="factura">Facturas - Factura</SelectItem>
                              <SelectItem value="comprobante_pago">Comprobantes - Comprobante de Pago</SelectItem>
                              <SelectItem value="acta_constitutiva">Legal - Acta Constitutiva</SelectItem>
                              <SelectItem value="poder_notarial">Legal - Poder Notarial</SelectItem>
                              <SelectItem value="identificacion">Legal - Identificacion</SelectItem>
                              <SelectItem value="reporte">Reportes - Reporte</SelectItem>
                              <SelectItem value="avaluo">Reportes - Avaluo</SelectItem>
                              <SelectItem value="fiscal">Fiscal - Documento Fiscal</SelectItem>
                              <SelectItem value="declaracion">Fiscal - Declaracion</SelectItem>
                              <SelectItem value="estado_cuenta">Estados de Cta - Estado de Cuenta</SelectItem>
                              <SelectItem value="bancario">Estados de Cta - Documento Bancario</SelectItem>
                              <SelectItem value="plano">Otros - Plano</SelectItem>
                              <SelectItem value="fotografia">Otros - Fotografia</SelectItem>
                              <SelectItem value="otro">Otros - Otro Documento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Enlace de Google Drive *</Label>
                          <Input
                            value={doc.googleDriveUrl}
                            onChange={(e) => updateDocumento(doc.id, 'googleDriveUrl', e.target.value)}
                            placeholder="https://drive.google.com/file/d/..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Pega aqui el enlace compartido de tu documento en Google Drive
                          </p>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Descripcion (opcional)</Label>
                          <Textarea
                            value={doc.descripcion}
                            onChange={(e) => updateDocumento(doc.id, 'descripcion', e.target.value)}
                            placeholder="Breve descripcion del documento..."
                            rows={2}
                          />
                        </div>
                      </div>
                      
                      {doc.googleDriveUrl && (
                        <div className="pt-2 border-t">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <a href={doc.googleDriveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Abrir en Google Drive
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </DashboardLayout>
  );
}
