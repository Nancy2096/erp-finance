"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Version de datos
const DATA_VERSION = "v1"

export interface CuentaBancaria {
  id: string
  banco: string
  tipoCuenta: string
  numeroCuenta: string
  clabe: string
  saldo: number
  moneda: string
  color: string
}

export interface MovimientoBancario {
  id: string
  fecha: string
  tipo: 'entrada' | 'salida'
  categoria: 'renta' | 'mantenimiento' | 'distribucion' | 'impuestos' | 'transferencia' | 'otro'
  concepto: string
  monto: number
  cuentaId: string
  referencia: string
  saldoResultante: number
  distribucionId?: string // Referencia a la distribución si aplica
}

// Datos iniciales
const cuentasBancariasIniciales: CuentaBancaria[] = [
  {
    id: 'cuenta-1',
    banco: 'BBVA',
    tipoCuenta: 'Cuenta Corriente',
    numeroCuenta: '****4521',
    clabe: '012180001234567890',
    saldo: 2850000,
    moneda: 'MXN',
    color: '#0d47a1',
  },
  {
    id: 'cuenta-2',
    banco: 'Banorte',
    tipoCuenta: 'Cuenta de Inversión',
    numeroCuenta: '****7832',
    clabe: '072180009876543210',
    saldo: 1250000,
    moneda: 'MXN',
    color: '#c62828',
  },
  {
    id: 'cuenta-3',
    banco: 'Santander',
    tipoCuenta: 'Cuenta Empresarial',
    numeroCuenta: '****2156',
    clabe: '014180005555666677',
    saldo: 890000,
    moneda: 'MXN',
    color: '#e53935',
  },
]

const movimientosIniciales: MovimientoBancario[] = [
  {
    id: 'mov-1',
    fecha: '2024-01-15',
    tipo: 'entrada',
    categoria: 'renta',
    concepto: 'Renta Pool Corporativo Monterrey - Enero',
    monto: 120000,
    cuentaId: 'cuenta-1',
    referencia: 'REF-2024-001',
    saldoResultante: 2850000,
  },
  {
    id: 'mov-2',
    fecha: '2024-01-14',
    tipo: 'salida',
    categoria: 'mantenimiento',
    concepto: 'Pago mantenimiento edificio',
    monto: 45000,
    cuentaId: 'cuenta-1',
    referencia: 'REF-2024-002',
    saldoResultante: 2730000,
  },
  {
    id: 'mov-3',
    fecha: '2024-01-13',
    tipo: 'entrada',
    categoria: 'renta',
    concepto: 'Renta Depto Roma Norte - Enero',
    monto: 35000,
    cuentaId: 'cuenta-2',
    referencia: 'REF-2024-003',
    saldoResultante: 1250000,
  },
  {
    id: 'mov-4',
    fecha: '2024-01-12',
    tipo: 'salida',
    categoria: 'distribucion',
    concepto: 'Distribución a inversionista - Carlos Rodríguez',
    monto: 85000,
    cuentaId: 'cuenta-1',
    referencia: 'DIST-2024-001',
    saldoResultante: 2775000,
  },
  {
    id: 'mov-5',
    fecha: '2024-01-11',
    tipo: 'entrada',
    categoria: 'renta',
    concepto: 'Renta Camión Refrigerado - Enero',
    monto: 55000,
    cuentaId: 'cuenta-3',
    referencia: 'REF-2024-004',
    saldoResultante: 890000,
  },
  {
    id: 'mov-6',
    fecha: '2024-01-10',
    tipo: 'salida',
    categoria: 'impuestos',
    concepto: 'Pago de impuestos prediales',
    monto: 28000,
    cuentaId: 'cuenta-2',
    referencia: 'REF-2024-005',
    saldoResultante: 1215000,
  },
  {
    id: 'mov-7',
    fecha: '2024-01-09',
    tipo: 'salida',
    categoria: 'distribucion',
    concepto: 'Distribución a inversionista - María González',
    monto: 62000,
    cuentaId: 'cuenta-1',
    referencia: 'DIST-2024-002',
    saldoResultante: 2860000,
  },
  {
    id: 'mov-8',
    fecha: '2024-01-08',
    tipo: 'entrada',
    categoria: 'transferencia',
    concepto: 'Transferencia entre cuentas',
    monto: 200000,
    cuentaId: 'cuenta-3',
    referencia: 'TRANSF-001',
    saldoResultante: 835000,
  },
]

interface BancosContextType {
  cuentas: CuentaBancaria[]
  movimientos: MovimientoBancario[]
  isLoaded: boolean
  // Cuentas CRUD
  getCuentaById: (id: string) => CuentaBancaria | undefined
  addCuenta: (cuenta: Omit<CuentaBancaria, 'id'>) => void
  updateCuenta: (id: string, data: Partial<CuentaBancaria>) => void
  deleteCuenta: (id: string) => void
  updateSaldoCuenta: (id: string, nuevoSaldo: number) => void
  // Movimientos
  addMovimiento: (movimiento: Omit<MovimientoBancario, 'id' | 'saldoResultante'>) => void
  deleteMovimiento: (id: string) => void
  getMovimientosByCategoria: (categoria: MovimientoBancario['categoria']) => MovimientoBancario[]
  getSaldoTotal: () => number
  // Para distribuciones
  registrarDistribucion: (distribucionId: string, inversionistaNombre: string, monto: number, cuentaId?: string) => void
  eliminarMovimientoDistribucion: (distribucionId: string) => void
}

const BancosContext = createContext<BancosContextType | undefined>(undefined)

export function BancosProvider({ children }: { children: ReactNode }) {
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>(cuentasBancariasIniciales)
  const [movimientos, setMovimientos] = useState<MovimientoBancario[]>(movimientosIniciales)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar datos al iniciar
  useEffect(() => {
    const savedVersion = localStorage.getItem("1d10-bancos-version")
    if (savedVersion !== DATA_VERSION) {
      localStorage.removeItem("1d10-cuentas-bancarias")
      localStorage.removeItem("1d10-movimientos-bancarios")
      localStorage.setItem("1d10-bancos-version", DATA_VERSION)
    }
    
    // Cargar cuentas
    const savedCuentas = localStorage.getItem("1d10-cuentas-bancarias")
    if (savedCuentas) {
      try {
        const parsed = JSON.parse(savedCuentas)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCuentas(parsed)
        }
      } catch {
        setCuentas(cuentasBancariasIniciales)
      }
    } else {
      localStorage.setItem("1d10-cuentas-bancarias", JSON.stringify(cuentasBancariasIniciales))
    }

    // Cargar movimientos
    const savedMovimientos = localStorage.getItem("1d10-movimientos-bancarios")
    if (savedMovimientos) {
      try {
        const parsed = JSON.parse(savedMovimientos)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMovimientos(parsed)
        }
      } catch {
        setMovimientos(movimientosIniciales)
      }
    } else {
      localStorage.setItem("1d10-movimientos-bancarios", JSON.stringify(movimientosIniciales))
    }

    setIsLoaded(true)
  }, [])

  // Guardar cuentas en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("1d10-cuentas-bancarias", JSON.stringify(cuentas))
      window.dispatchEvent(new CustomEvent("cuentas-updated", { detail: cuentas }))
    }
  }, [cuentas, isLoaded])

  // Guardar movimientos en localStorage cuando cambien
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("1d10-movimientos-bancarios", JSON.stringify(movimientos))
      window.dispatchEvent(new CustomEvent("movimientos-updated", { detail: movimientos }))
    }
  }, [movimientos, isLoaded])

  const getCuentaById = (id: string) => cuentas.find(c => c.id === id)

  const addCuenta = (cuentaData: Omit<CuentaBancaria, 'id'>) => {
    const nuevaCuenta: CuentaBancaria = {
      ...cuentaData,
      id: `cuenta-${Date.now()}`,
    }
    setCuentas(prev => [...prev, nuevaCuenta])
  }

  const updateCuenta = (id: string, data: Partial<CuentaBancaria>) => {
    setCuentas(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const deleteCuenta = (id: string) => {
    // Eliminar todos los movimientos asociados a esta cuenta
    setMovimientos(prev => prev.filter(m => m.cuentaId !== id))
    // Eliminar la cuenta
    setCuentas(prev => prev.filter(c => c.id !== id))
  }

  const updateSaldoCuenta = (id: string, nuevoSaldo: number) => {
    setCuentas(prev => prev.map(c => c.id === id ? { ...c, saldo: nuevoSaldo } : c))
  }

  const getSaldoTotal = () => cuentas.reduce((sum, c) => sum + c.saldo, 0)

  const addMovimiento = (movimientoData: Omit<MovimientoBancario, 'id' | 'saldoResultante'>) => {
    const cuenta = getCuentaById(movimientoData.cuentaId)
    if (!cuenta) return

    const nuevoSaldo = movimientoData.tipo === 'entrada' 
      ? cuenta.saldo + movimientoData.monto 
      : cuenta.saldo - movimientoData.monto

    const nuevoMovimiento: MovimientoBancario = {
      ...movimientoData,
      id: `mov-${Date.now()}`,
      saldoResultante: nuevoSaldo,
    }

    setMovimientos(prev => [nuevoMovimiento, ...prev])
    updateSaldoCuenta(movimientoData.cuentaId, nuevoSaldo)
  }

  const deleteMovimiento = (id: string) => {
    const movimiento = movimientos.find(m => m.id === id)
    if (!movimiento) return

    const cuenta = getCuentaById(movimiento.cuentaId)
    if (cuenta) {
      // Revertir el saldo
      const saldoRevertido = movimiento.tipo === 'entrada'
        ? cuenta.saldo - movimiento.monto
        : cuenta.saldo + movimiento.monto
      updateSaldoCuenta(movimiento.cuentaId, saldoRevertido)
    }

    setMovimientos(prev => prev.filter(m => m.id !== id))
  }

  const getMovimientosByCategoria = (categoria: MovimientoBancario['categoria']) => {
    return movimientos.filter(m => m.categoria === categoria)
  }

  // Función especial para registrar distribuciones como egresos
  const registrarDistribucion = (
    distribucionId: string, 
    inversionistaNombre: string, 
    monto: number, 
    cuentaId?: string
  ) => {
    // Usar cuenta-1 (BBVA) por defecto si no se especifica
    const cuentaDestino = cuentaId || 'cuenta-1'
    
    addMovimiento({
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'salida',
      categoria: 'distribucion',
      concepto: `Distribución a inversionista - ${inversionistaNombre}`,
      monto,
      cuentaId: cuentaDestino,
      referencia: `DIST-${distribucionId}`,
      distribucionId,
    })
  }

  // Función para eliminar movimiento de distribución cuando se elimina la distribución
  const eliminarMovimientoDistribucion = (distribucionId: string) => {
    const movimiento = movimientos.find(m => m.distribucionId === distribucionId)
    if (movimiento) {
      deleteMovimiento(movimiento.id)
    }
  }

  return (
    <BancosContext.Provider value={{
      cuentas,
      movimientos,
      isLoaded,
      getCuentaById,
      addCuenta,
      updateCuenta,
      deleteCuenta,
      updateSaldoCuenta,
      addMovimiento,
      deleteMovimiento,
      getMovimientosByCategoria,
      getSaldoTotal,
      registrarDistribucion,
      eliminarMovimientoDistribucion,
    }}>
      {children}
    </BancosContext.Provider>
  )
}

export function useBancos() {
  const context = useContext(BancosContext)
  if (!context) {
    throw new Error("useBancos must be used within a BancosProvider")
  }
  return context
}
