"use client"

import { useAuth, RolePermissions } from "@/lib/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: React.ReactNode
  module?: keyof RolePermissions
  requiredPermission?: "view" | "create" | "edit" | "delete"
}

export function ProtectedRoute({ 
  children, 
  module,
  requiredPermission = "view" 
}: ProtectedRouteProps) {
  const { currentUser, canAccess, canAccessRoute } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Dar tiempo a que se cargue el usuario
    const timer = setTimeout(() => setIsChecking(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (isChecking || !currentUser) {
    return null // O un loading spinner
  }

  // Verificar acceso por modulo especifico o por ruta
  const hasAccess = module 
    ? canAccess(module, requiredPermission)
    : canAccessRoute(pathname)

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a esta seccion del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Tu rol actual es: <span className="font-medium capitalize">
                {currentUser.role === 'admin' ? 'Administrador' : 
                 currentUser.role === 'manager' ? 'Gerente' :
                 currentUser.role === 'analyst' ? 'Analista' : 'Visor'}
              </span></p>
              <p className="mt-1">Contacta al administrador si necesitas acceso.</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => router.push('/')}
            >
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
