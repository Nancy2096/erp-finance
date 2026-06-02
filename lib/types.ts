// Tipos de activos
export type TipoActivo = 
  | 'inmueble_completo'
  | 'pool_rentas'
  | 'participacion_parcial'
  | 'camion_renta'
  | 'terreno'
  | 'local_comercial'
  | 'otro';

export type EstadoActivo = 
  | 'en_analisis'
  | 'en_negociacion'
  | 'en_proceso_compra'
  | 'en_pago'
  | 'en_espera_entrega'
  | 'en_espera_operacion'
  | 'generando_rentas'
  | 'vendido'
  | 'liquidado'
  | 'cancelado';

export type PeriodicidadDividendos = 
  | 'mensual'
  | 'trimestral'
  | 'semestral'
  | 'anual'
  | 'personalizado';

export type TipoContacto = 
  | 'vendedor'
  | 'socio'
  | 'administrador'
  | 'contador'
  | 'abogado'
  | 'contacto_operativo'
  | 'otro';

export type EstatusPago = 
  | 'comprometido'
  | 'realizado'
  | 'cancelado'
  | 'vencido';

export type TipoPago = 
  | 'contado'
  | 'parcialidad'
  | 'anticipo'
  | 'liquidacion'
  | 'comision'
  | 'gasto_compra';

export type EstatusDividendo = 
  | 'recibido'
  | 'pendiente'
  | 'parcial'
  | 'no_recibido';

export type TipoMovimiento = 'ingreso' | 'egreso';

export type TipoDocumento = 
  | 'contrato'
  | 'escritura'
  | 'factura'
  | 'comprobante_pago'
  | 'identificacion'
  | 'acta_constitutiva'
  | 'poder_notarial'
  | 'avaluo'
  | 'plano'
  | 'fotografia'
  | 'otro';

export interface DocumentoActivo {
  id: string;
  nombre: string;
  tipo: TipoDocumento;
  descripcion?: string;
  googleDriveUrl: string;
  fechaSubida: string;
  subidoPor?: string;
}

export type CategoriaIngreso = 
  | 'rentas'
  | 'dividendos_recibidos'
  | 'aportaciones_inversionistas'
  | 'venta_activos'
  | 'reembolsos'
  | 'otros_ingresos';

export type CategoriaEgreso = 
  | 'compra_activos'
  | 'mantenimiento'
  | 'gastos_legales'
  | 'comisiones'
  | 'reparaciones'
  | 'impuestos'
  | 'administracion'
  | 'seguros'
  | 'dividendos_pagados'
  | 'otros_egresos';

export type TipoUsuario = 
  | 'super_admin'
  | 'administrador_financiero'
  | 'operador'
  | 'inversionista'
  | 'solo_lectura';

export type NivelAlerta = 'verde' | 'amarillo' | 'rojo';

export type TipoAlerta = 
  | 'pago_proximo_vencer'
  | 'pago_vencido'
  | 'activo_proximo_dividendos'
  | 'falta_comprobante'
  | 'falta_documentacion'
  | 'dividendos_pendientes_pagar'
  | 'renta_no_recibida'
  | 'gasto_inusual'
  | 'bajo_rendimiento'
  | 'retraso_entrega'
  | 'diferencia_dividendo';

export type EstatusAlerta = 
  | 'pendiente'
  | 'en_revision'
  | 'resuelta'
  | 'ignorada';

// Interfaces principales
export interface Contacto {
  id: string;
  nombre: string;
  cargo: string;
  empresa: string;
  telefono: string;
  correo: string;
  whatsapp: string;
  notas: string;
  tipoContacto: TipoContacto;
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  categoria: string;
  activoId?: string;
  empresaId?: string;
  inversionistaId?: string;
  fechaCarga: string;
  usuarioCargo: string;
  estatus: string;
  vencimiento?: string;
  archivoUrl: string;
  googleDriveUrl?: string;
  descripcion?: string;
}

export interface CertificadoAccion {
  id: string;
  nombre: string;
  porcentajeAdquirido: number;
  valor: number;
}

export interface PagoPlanificado {
  id: string;
  numeroPago: number;
  fechaProgramada: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'parcial';
  fechaPago?: string;
  montoPagado?: number;
  comprobanteUrl?: string;
  comprobanteNombre?: string;
  notas?: string;
}

export interface PlanCompra {
  fechaInicio: string;
  fechaFin?: string;
  montoTotal: number;
  enganche?: number;
  numeroPagos: number;
  periodicidad: 'semanal' | 'quincenal' | 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'unico';
  pagos: PagoPlanificado[];
  notas?: string;
}

export interface EmpresaRelacionada {
  nombre: string;
  razonSocial: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  pais: string;
  telefono: string;
  email: string;
  paginaWeb: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  representanteLegal: string;
  representanteTelefono: string;
  representanteEmail: string;
  actaConstitutivaUrl: string;
  poderNotarialUrl: string;
  comprobanteDomicilioUrl: string;
  identificacionRepresentanteUrl: string;
  notas: string;
}

export interface Activo {
  id: string;
  nombre: string;
  tipoActivo: TipoActivo;
  empresaRelacionada: string;
  empresaInfo?: EmpresaRelacionada;
  razonSocial: string;
  rfc: string;
  direccionFiscal: string;
  datosLegales: string;
  descripcion: string;
  ubicacion: string;
  ubicacionDetalle?: {
    direccion: string;
    colonia: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
    latitud?: number;
    longitud?: number;
    referencias?: string;
  };
  responsableInterno: string;
  estado: EstadoActivo;
  valorTotal: number;
  montoInicial: number;
  montoPagado: number;
  montoPendiente: number;
  formaCompra: 'contado' | 'parcialidades';
  fechaCompra: string;
  fechaLimitePago?: string;
  fechaEstimadaEntrega?: string;
  fechaRealEntrega?: string;
  fechaEstimadaDividendos?: string;
  fechaRealDividendos?: string;
  rentabilidadMensualEsperada: number;
  rentabilidadAnualEsperada: number;
  porcentajeApreciacion: number;
  periodicidadDividendos: PeriodicidadDividendos;
  inflacionEstimada: number;
  notasInternas: string;
  contactos: Contacto[];
  documentos: Documento[];
  porcentajeAdquisicion: number;
  certificados?: CertificadoAccion[];
  planCompra?: PlanCompra;
  roi: number;
  payback: number;
  dividendosAcumulados: number;
  valorActualEstimado: number;
}

export interface Pago {
  id: string;
  activoId: string;
  activoNombre: string;
  tipoPago: TipoPago;
  fecha: string;
  monto: number;
  metodoPago: string;
  cuentaBancariaOrigen: string;
  destinatario: string;
  empresaReceptora: string;
  concepto: string;
  comprobanteUrl?: string;
  responsable: string;
  comentarios: string;
  estatus: EstatusPago;
}

export interface Dividendo {
  id: string;
  activoId: string;
  activoNombre: string;
  periodo: string;
  fechaRecepcion: string;
  montoEsperado: number;
  montoRecibido: number;
  diferencia: number;
  comentarios: string;
  comprobanteUrl?: string;
  estatus: EstatusDividendo;
  responsable: string;
}

export interface Inversionista {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rfc: string;
  direccion: string;
  cuentaBancaria: string;
  clabe: string;
  banco: string;
  porcentajeParticipacion: number;
  montoInvertido: number;
  activosRelacionados: string[];
  documentos: Documento[];
  estatus: 'activo' | 'inactivo';
  fechaAlta: string;
  notasInternas: string;
  dividendosEsperados: number;
  dividendosRecibidos: number;
  dividendosPagados: number;
  dividendosPendientes: number;
  roi: number;
  payback: number;
}

export type EstatusDistribucion = 'pagado' | 'pendiente' | 'parcial' | 'programado' | 'cancelado';
export type MetodoPagoDistribucion = 'transferencia' | 'cheque' | 'efectivo' | 'otro';

export interface Distribucion {
  id: string;
  inversionistaId: string;
  inversionistaNombre: string;
  activoId?: string;
  activoNombre?: string;
  periodo: string;
  fechaProgramada: string;
  fechaPago?: string;
  montoCalculado: number;
  montoPagado: number;
  porcentajeParticipacion: number;
  metodoPago: MetodoPagoDistribucion;
  cuentaDestino?: string;
  bancoDestino?: string;
  referencia?: string;
  comprobante?: string;
  estatus: EstatusDistribucion;
  comentarios?: string;
  creadoPor: string;
  fechaCreacion: string;
}

export interface MovimientoFinanciero {
  id: string;
  tipo: TipoMovimiento;
  categoria: CategoriaIngreso | CategoriaEgreso;
  subcategoria?: string;
  activoId?: string;
  activoNombre?: string;
  inversionistaId?: string;
  inversionistaNombre?: string;
  fecha: string;
  monto: number;
  cuentaBancaria: string;
  metodoPago: string;
  comprobanteUrl?: string;
  responsable: string;
  comentarios: string;
  estatus: string;
}

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  titulo: string;
  descripcion: string;
  activoId?: string;
  activoNombre?: string;
  fecha: string;
  estatus: EstatusAlerta;
  fechaResolucion?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  rol: TipoUsuario;
  permisos: Permisos;
  activo: boolean;
  ultimoAcceso?: string;
}

export interface Permisos {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  exportar: boolean;
  aprobar: boolean;
  subirDocumentos: boolean;
  registrarPagos: boolean;
  registrarIngresos: boolean;
  registrarEgresos: boolean;
  verInfoFinanciera: boolean;
  verReportes: boolean;
  administrarUsuarios: boolean;
  cambiarConfiguracion: boolean;
}

export interface RegistroBitacora {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  fecha: string;
  hora: string;
  modulo: string;
  accion: string;
  registroAfectado: string;
  valorAnterior?: string;
  valorNuevo?: string;
  ip?: string;
  comentarios?: string;
}

export interface ConfiguracionSistema {
  nombreSistema: string;
  logoUrl?: string;
  colorPrimario: string;
  colorSecundario: string;
  modoOscuro: boolean;
  moneda: string;
  formatoFecha: string;
  inflacionBase: number;
  tiposActivo: { id: string; nombre: string; apreciacion: number }[];
  estadosActivo: { id: string; nombre: string; color: string }[];
  categoriasIngreso: string[];
  categoriasEgreso: string[];
  documentosObligatorios: string[];
  cuentasBancarias: { id: string; nombre: string; banco: string; numero: string }[];
}

// KPIs Dashboard
export interface KPIsDashboard {
  valorTotalActivos: number;
  totalInvertido: number;
  totalPendientePagar: number;
  porcentajeGlobalAdquisicion: number;
  rentasMensualesEsperadas: number;
  rentasMensualesReales: number;
  diferenciaRentas: number;
  flujoNetoMensual: number;
  totalActivos: number;
  activosEnAnalisis: number;
  activosEnNegociacion: number;
  activosEnCompra: number;
  activosEnPago: number;
  activosEnEsperaOperacion: number;
  activosGenerandoRentas: number;
  activosVendidos: number;
  rendimientoPromedioMensual: number;
  rendimientoPromedioAnual: number;
  roiPromedio: number;
  paybackPromedio: number;
  ebitdaMensual: number;
  capitalPendienteRecuperacion: number;
  dividendosPagados: number;
  dividendosPorPagar: number;
}
