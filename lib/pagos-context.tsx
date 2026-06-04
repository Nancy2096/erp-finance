'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pagos as mockPagos } from './mock-data';

export interface Pago {
  id: string;
  activoId: string;
  activoNombre: string;
  tipoPago: string;
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
  estatus: 'completado' | 'pendiente' | 'cancelado' | 'programado';
}

interface PagosContextType {
  pagos: Pago[];
  addPago: (pago: Omit<Pago, 'id'>) => void;
  updatePago: (id: string, data: Partial<Pago>) => void;
  deletePago: (id: string) => void;
  getPagoById: (id: string) => Pago | undefined;
  getPagosByActivo: (activoId: string) => Pago[];
  getStats: () => {
    totalPagado: number;
    totalPendiente: number;
    pagosCompletados: number;
    pagosPendientes: number;
  };
  isLoaded: boolean;
}

const PagosContext = createContext<PagosContextType | undefined>(undefined);

const STORAGE_KEY = 'erp-pagos-data';

export function PagosProvider({ children }: { children: ReactNode }) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPagos(JSON.parse(stored));
      } catch {
        setPagos(mockPagos as Pago[]);
      }
    } else {
      setPagos(mockPagos as Pago[]);
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pagos));
    }
  }, [pagos, isLoaded]);

  const addPago = (pagoData: Omit<Pago, 'id'>) => {
    const newPago: Pago = {
      ...pagoData,
      id: `pago-${Date.now()}`,
    };
    setPagos((prev) => [newPago, ...prev]);
  };

  const updatePago = (id: string, data: Partial<Pago>) => {
    setPagos((prev) =>
      prev.map((pago) => (pago.id === id ? { ...pago, ...data } : pago))
    );
  };

  const deletePago = (id: string) => {
    setPagos((prev) => prev.filter((pago) => pago.id !== id));
  };

  const getPagoById = (id: string) => {
    return pagos.find((pago) => pago.id === id);
  };

  const getPagosByActivo = (activoId: string) => {
    return pagos.filter((pago) => pago.activoId === activoId);
  };

  const getStats = () => {
    const completados = pagos.filter((p) => p.estatus === 'completado');
    const pendientes = pagos.filter((p) => p.estatus === 'pendiente' || p.estatus === 'programado');
    
    return {
      totalPagado: completados.reduce((sum, p) => sum + p.monto, 0),
      totalPendiente: pendientes.reduce((sum, p) => sum + p.monto, 0),
      pagosCompletados: completados.length,
      pagosPendientes: pendientes.length,
    };
  };

  return (
    <PagosContext.Provider
      value={{
        pagos,
        addPago,
        updatePago,
        deletePago,
        getPagoById,
        getPagosByActivo,
        getStats,
        isLoaded,
      }}
    >
      {children}
    </PagosContext.Provider>
  );
}

export function usePagos() {
  const context = useContext(PagosContext);
  if (context === undefined) {
    throw new Error('usePagos debe usarse dentro de PagosProvider');
  }
  return context;
}
