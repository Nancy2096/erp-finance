'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Plus, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from './app-sidebar';
import { alertas } from '@/lib/mock-data';
import { getAlertaColor } from '@/lib/format';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const [periodo, setPeriodo] = useState('mayo-2025');
  const alertasPendientes = alertas.filter((a) => a.estatus === 'pendiente');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar activos, inversionistas..."
          className="w-full pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Period Selector */}
      <Select value={periodo} onValueChange={setPeriodo}>
        <SelectTrigger className="w-[160px] bg-secondary/50 border-0">
          <SelectValue placeholder="Seleccionar periodo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mayo-2025">Mayo 2025</SelectItem>
          <SelectItem value="abril-2025">Abril 2025</SelectItem>
          <SelectItem value="marzo-2025">Marzo 2025</SelectItem>
          <SelectItem value="febrero-2025">Febrero 2025</SelectItem>
          <SelectItem value="enero-2025">Enero 2025</SelectItem>
          <SelectItem value="2024">Año 2024</SelectItem>
          <SelectItem value="2023">Año 2023</SelectItem>
        </SelectContent>
      </Select>

      {/* New Asset Button */}
      <Button asChild className="hidden sm:flex">
        <Link href="/activos/nuevo">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Activo
        </Link>
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {alertasPendientes.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
              >
                {alertasPendientes.length}
              </Badge>
            )}
            <span className="sr-only">Notificaciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Alertas pendientes</span>
            <Link href="/alertas" className="text-xs text-primary hover:underline">
              Ver todas
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {alertasPendientes.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No hay alertas pendientes
            </div>
          ) : (
            alertasPendientes.slice(0, 5).map((alerta) => (
              <DropdownMenuItem key={alerta.id} className="flex flex-col items-start gap-1 p-3">
                <div className="flex w-full items-start justify-between gap-2">
                  <span className="font-medium text-sm">{alerta.titulo}</span>
                  <Badge variant="outline" className={cn('text-[10px]', getAlertaColor(alerta.nivel))}>
                    {alerta.nivel === 'rojo' ? 'Crítico' : alerta.nivel === 'amarillo' ? 'Atención' : 'Info'}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {alerta.descripcion}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
