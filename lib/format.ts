// Utilidades de formateo para la aplicación 1D10

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  // Usar UTC para evitar diferencias de hydration entre servidor y cliente
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  // Usar UTC para evitar diferencias de hydration entre servidor y cliente
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

export function formatMonths(months: number): string {
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
    return `${years}a ${remainingMonths}m`;
  }
  return `${months} ${months === 1 ? 'mes' : 'meses'}`;
}

export function getEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    en_analisis: 'En análisis',
    en_negociacion: 'En negociación',
    en_proceso_compra: 'En proceso de compra',
    en_pago: 'En pago',
    en_espera_entrega: 'En espera de entrega',
    en_espera_operacion: 'En espera de operación',
    generando_rentas: 'Generando rentas',
    vendido: 'Vendido',
    liquidado: 'Liquidado',
    cancelado: 'Cancelado',
  };
  return labels[estado] || estado;
}

export function getEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    en_analisis: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    en_negociacion: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    en_proceso_compra: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    en_pago: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    en_espera_entrega: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    en_espera_operacion: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    generando_rentas: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    vendido: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
    liquidado: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
    cancelado: 'bg-red-500/15 text-red-600 dark:text-red-400',
  };
  return colors[estado] || 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
}

export function getTipoActivoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    inmueble_completo: 'Inmueble completo',
    pool_rentas: 'Pool de rentas',
    participacion_parcial: 'Participación parcial',
    camion_renta: 'Camión en renta',
    terreno: 'Terreno',
    local_comercial: 'Local comercial',
    otro: 'Otro',
  };
  return labels[tipo] || tipo;
}

export function getAlertaColor(nivel: string): string {
  const colors: Record<string, string> = {
    verde: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    amarillo: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    rojo: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  };
  return colors[nivel] || 'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30';
}

export function getAlertaIcon(nivel: string): 'check' | 'warning' | 'error' {
  const icons: Record<string, 'check' | 'warning' | 'error'> = {
    verde: 'check',
    amarillo: 'warning',
    rojo: 'error',
  };
  return icons[nivel] || 'warning';
}

export function getEstatusPagoColor(estatus: string): string {
  const colors: Record<string, string> = {
    comprometido: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    realizado: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    cancelado: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
    vencido: 'bg-red-500/15 text-red-600 dark:text-red-400',
  };
  return colors[estatus] || 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
}

export function getEstatusDividendoColor(estatus: string): string {
  const colors: Record<string, string> = {
    recibido: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    pendiente: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    parcial: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    no_recibido: 'bg-red-500/15 text-red-600 dark:text-red-400',
  };
  return colors[estatus] || 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
}

export function getRolLabel(rol: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    administrador_financiero: 'Admin. Financiero',
    operador: 'Operador',
    inversionista: 'Inversionista',
    solo_lectura: 'Solo lectura',
  };
  return labels[rol] || rol;
}

export function getRolColor(rol: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    administrador_financiero: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    operador: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    inversionista: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    solo_lectura: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  };
  return colors[rol] || 'bg-gray-500/15 text-gray-600 dark:text-gray-400';
}

export function formatRelativeTime(dateString: string): string {
  // Para evitar problemas de hydration, simplemente mostramos la fecha
  // La version relativa causaba diferencias entre servidor y cliente
  return formatDate(dateString);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
