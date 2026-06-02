'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { pagos, activos, alertas, movimientos } from '@/lib/mock-data';
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor, getAlertaColor, getEstatusPagoColor } from '@/lib/format';
import { cn } from '@/lib/utils';

export function TablaPagosPendientes() {
  const pagosPendientes = pagos.filter((p) => p.estatus === 'comprometido');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Próximos Pagos</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pagos" className="text-xs">
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {pagosPendientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No hay pagos pendientes</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Activo</TableHead>
                <TableHead className="text-xs">Fecha</TableHead>
                <TableHead className="text-xs text-right">Monto</TableHead>
                <TableHead className="text-xs text-right">Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagosPendientes.slice(0, 5).map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell className="text-sm font-medium max-w-[150px] truncate">
                    {pago.activoNombre}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(pago.fecha)}
                  </TableCell>
                  <TableCell className="text-sm text-right font-medium">
                    {formatCurrency(pago.monto)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={cn('text-[10px]', getEstatusPagoColor(pago.estatus))}>
                      <Clock className="mr-1 h-3 w-3" />
                      Programado
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function TablaActivosProximos() {
  const activosProximos = activos.filter(
    (a) => a.estado === 'en_pago' || a.estado === 'en_proceso_compra' || a.estado === 'en_espera_entrega'
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Activos en Proceso</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/activos" className="text-xs">
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {activosProximos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Todos los activos están operando</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Activo</TableHead>
                <TableHead className="text-xs">Estado</TableHead>
                <TableHead className="text-xs text-right">Avance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activosProximos.slice(0, 5).map((activo) => (
                <TableRow key={activo.id}>
                  <TableCell className="text-sm font-medium max-w-[150px] truncate">
                    <Link href={`/activos/${activo.id}`} className="hover:underline">
                      {activo.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-[10px]', getEstadoColor(activo.estado))}>
                      {getEstadoLabel(activo.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-2 w-16 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${activo.porcentajeAdquisicion}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {activo.porcentajeAdquisicion.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function TablaAlertasCriticas() {
  const alertasCriticas = alertas.filter((a) => a.estatus === 'pendiente' || a.estatus === 'en_revision');

  const getAlertIcon = (nivel: string) => {
    switch (nivel) {
      case 'rojo':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'amarillo':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Alertas Activas</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/alertas" className="text-xs">
            Ver todas <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {alertasCriticas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-500/50 mb-2" />
            <p className="text-sm text-muted-foreground">Sin alertas pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertasCriticas.slice(0, 5).map((alerta) => (
              <div
                key={alerta.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3',
                  getAlertaColor(alerta.nivel)
                )}
              >
                {getAlertIcon(alerta.nivel)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alerta.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {alerta.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TablaUltimosMovimientos() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Últimos Movimientos</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/finanzas" className="text-xs">
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Concepto</TableHead>
              <TableHead className="text-xs">Fecha</TableHead>
              <TableHead className="text-xs text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.slice(0, 5).map((mov) => (
              <TableRow key={mov.id}>
                <TableCell className="text-sm max-w-[150px] truncate">
                  <span className="font-medium">{mov.activoNombre || mov.inversionistaNombre || 'General'}</span>
                  <span className="block text-xs text-muted-foreground capitalize">
                    {mov.categoria.replace(/_/g, ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(mov.fecha)}
                </TableCell>
                <TableCell className={cn(
                  'text-sm text-right font-medium',
                  mov.tipo === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {mov.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(mov.monto)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
