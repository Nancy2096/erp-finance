'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { distribuciones as mockDistribuciones } from './mock-data';

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
  metodoPago: string;
  cuentaDestino?: string;
  bancoDestino?: string;
  referencia?: string;
  comprobante?: string;
  estatus: 'pagado' | 'pendiente' | 'programado' | 'cancelado';
  comentarios?: string;
  creadoPor: string;
  fechaCreacion: string;
}

interface DistribucionesContextType {
  distribuciones: Distribucion[];
  addDistribucion: (distribucion: Omit<Distribucion, 'id'>) => void;
  updateDistribucion: (id: string, data: Partial<Distribucion>) => void;
  deleteDistribucion: (id: string) => void;
  getDistribucionById: (id: string) => Distribucion | undefined;
  getDistribucionesByInversionista: (inversionistaId: string) => Distribucion[];
  getDistribucionesByActivo: (activoId: string) => Distribucion[];
  getStats: () => {
    totalDistribuido: number;
    totalPendiente: number;
    distribucionesPagadas: number;
    distribucionesPendientes: number;
  };
  isLoaded: boolean;
}

const DistribucionesContext = createContext<DistribucionesContextType | undefined>(undefined);

const STORAGE_KEY = 'erp-distribuciones-data';

export function DistribucionesProvider({ children }: { children: ReactNode }) {
  const [distribuciones, setDistribuciones] = useState<Distribucion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDistribuciones(JSON.parse(stored));
      } catch {
        setDistribuciones(mockDistribuciones as Distribucion[]);
      }
    } else {
      setDistribuciones(mockDistribuciones as Distribucion[]);
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(distribuciones));
    }
  }, [distribuciones, isLoaded]);

  const addDistribucion = (distribucionData: Omit<Distribucion, 'id'>) => {
    const newDistribucion: Distribucion = {
      ...distribucionData,
      id: `dist-${Date.now()}`,
    };
    setDistribuciones((prev) => [newDistribucion, ...prev]);
  };

  const updateDistribucion = (id: string, data: Partial<Distribucion>) => {
    setDistribuciones((prev) =>
      prev.map((dist) => (dist.id === id ? { ...dist, ...data } : dist))
    );
  };

  const deleteDistribucion = (id: string) => {
    setDistribuciones((prev) => prev.filter((dist) => dist.id !== id));
  };

  const getDistribucionById = (id: string) => {
    return distribuciones.find((dist) => dist.id === id);
  };

  const getDistribucionesByInversionista = (inversionistaId: string) => {
    return distribuciones.filter((dist) => dist.inversionistaId === inversionistaId);
  };

  const getDistribucionesByActivo = (activoId: string) => {
    return distribuciones.filter((dist) => dist.activoId === activoId);
  };

  const getStats = () => {
    const pagadas = distribuciones.filter((d) => d.estatus === 'pagado');
    const pendientes = distribuciones.filter((d) => d.estatus === 'pendiente' || d.estatus === 'programado');
    
    return {
      totalDistribuido: pagadas.reduce((sum, d) => sum + d.montoPagado, 0),
      totalPendiente: pendientes.reduce((sum, d) => sum + d.montoCalculado, 0),
      distribucionesPagadas: pagadas.length,
      distribucionesPendientes: pendientes.length,
    };
  };

  return (
    <DistribucionesContext.Provider
      value={{
        distribuciones,
        addDistribucion,
        updateDistribucion,
        deleteDistribucion,
        getDistribucionById,
        getDistribucionesByInversionista,
        getDistribucionesByActivo,
        getStats,
        isLoaded,
      }}
    >
      {children}
    </DistribucionesContext.Provider>
  );
}

export function useDistribuciones() {
  const context = useContext(DistribucionesContext);
  if (context === undefined) {
    throw new Error('useDistribuciones debe usarse dentro de DistribucionesProvider');
  }
  return context;
}
