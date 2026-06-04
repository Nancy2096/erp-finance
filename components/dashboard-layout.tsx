'use client';

import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';
import { AppSidebar } from './app-sidebar';
import { ProtectedRoute } from './protected-route';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { alertas } from '@/lib/mock-data';
import { getAlertaColor } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const alertasPendientes = alertas.filter((a) => a.estatus === 'pendiente');

  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile, visible on lg and up */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background shadow-md">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Floating Notifications Button */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-background shadow-md">
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
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 pt-16 lg:p-6 lg:pt-6">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
