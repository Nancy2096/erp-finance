"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, LogIn, Building2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCompany } from "@/lib/company-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoaded } = useAuth()
  const { settings: companySettings, isLoaded: companyLoaded } = useCompany()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  // Marcar como montado para evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirigir si ya esta autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Usar datos del contexto
  const logo = companySettings.logo || "/logo.png"
  const companyName = companySettings.name || "Capital 1D10"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.")
      return
    }
    
    setIsLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Error al iniciar sesión.")
    }
    
    setIsLoading(false)
  }

  // Mostrar loading mientras se monta o carga la configuracion
  if (!mounted || !companyLoaded || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {logo ? (
            <div className="relative w-24 h-24 mb-4 bg-white rounded-xl p-2 shadow-lg">
              <Image
                src={logo}
                alt="Logo de la empresa"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-white">{companyName}</h1>
          <p className="text-slate-400 mt-1">Sistema de Gestion Patrimonial</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">Iniciar Sesion</CardTitle>
            <CardDescription className="text-slate-400">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Correo Electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-slate-600 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                    Recordar sesion
                  </Label>
                </div>
                <Button type="button" variant="link" className="text-blue-400 p-0 h-auto text-sm">
                  Olvide mi contraseña
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Ingresar
                  </span>
                )}
              </Button>
            </form>
            
            {/* Info de credenciales para demo */}
            <div className="mt-6 p-3 rounded-lg bg-slate-700/30 border border-slate-600">
              <p className="text-xs text-slate-400 text-center mb-2">Credenciales de acceso:</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p><span className="text-slate-400">Admin:</span> enrique@agency4realestate.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
