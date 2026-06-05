'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCompany } from '@/lib/company-context';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  CreditCard,
  TrendingUp,
  Users,
  Wallet,
  FileBarChart,
  LineChart,
  Bell,
  UserCog,
  History,
  Settings,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  User,
  Camera,
  Eye,
  EyeOff,
  Key,
  Banknote,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';

const navigationItems = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Gestión de Activos',
    items: [
      { name: 'Activos', href: '/activos', icon: Building2 },
      { name: 'Nuevo Activo', href: '/activos/nuevo', icon: PlusCircle },
      { name: 'Compras y Pagos', href: '/pagos', icon: CreditCard },
      { name: 'Dividendos', href: '/dividendos', icon: TrendingUp },
    ],
  },
  {
    title: 'Finanzas',
    items: [
      { name: 'Inversionistas', href: '/inversionistas', icon: Users },
      { name: 'Distribuciones', href: '/distribuciones', icon: Banknote },
      { name: 'Finanzas Generales', href: '/finanzas', icon: Wallet },
      { name: 'Informes', href: '/informes', icon: FileBarChart },
      { name: 'Proyecciones', href: '/proyecciones', icon: LineChart },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Alertas', href: '/alertas', icon: Bell },
      { name: 'Usuarios', href: '/usuarios', icon: UserCog },
      { name: 'Bitácora', href: '/bitacora', icon: History },
      { name: 'Configuración', href: '/configuracion', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { settings } = useCompany();
  const { currentUser, canAccessRoute, logout, updateCurrentUser, updatePassword } = useAuth();

  // Estados para el dialog de editar perfil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Abrir dialog de perfil
  const openProfileDialog = () => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
      setProfileAvatar(currentUser.avatar);
      setProfilePassword('');
      setProfileNewPassword('');
      setProfileConfirmPassword('');
      setShowPassword(false);
      setPasswordError('');
      setIsProfileOpen(true);
    }
  };

  // Manejar cambio de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar cambios de perfil
  const handleSaveProfile = async () => {
    if (!profileName || !profileEmail) return;
    setPasswordError('');

    setIsSaving(true);
    
    // Si se quiere cambiar contraseña
    if (profileNewPassword) {
      if (!profilePassword) {
        setPasswordError('Ingresa tu contraseña actual');
        setIsSaving(false);
        return;
      }
      if (profileNewPassword !== profileConfirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        setIsSaving(false);
        return;
      }
      if (profileNewPassword.length < 8) {
        setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
        setIsSaving(false);
        return;
      }
      
      const result = await updatePassword(profilePassword, profileNewPassword);
      if (!result.success) {
        setPasswordError(result.error || 'Error al cambiar contraseña');
        setIsSaving(false);
        return;
      }
    }
    
    // Actualizar datos del perfil
    updateCurrentUser({
      name: profileName,
      email: profileEmail,
      avatar: profileAvatar,
    });
    
    setIsSaving(false);
    setIsProfileOpen(false);
  };

  // Filtrar items de navegacion segun permisos
  const filteredNavigation = navigationItems.map(section => ({
    ...section,
    items: section.items.filter(item => canAccessRoute(item.href))
  })).filter(section => section.items.length > 0);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        {settings.logo ? (
          <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-white">
            <Image
              src={settings.logo}
              alt="Logo de la empresa"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            1D
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{settings.name || '1D10'}</span>
          <span className="text-xs text-sidebar-muted">Gestion Patrimonial</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-6 px-3 py-4">
          {filteredNavigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
      </div>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-6 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Avatar className="h-8 w-8">
                {currentUser?.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser.name} />}
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {currentUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium">{currentUser?.name || 'Usuario'}</span>
                <span className="text-xs text-sidebar-muted capitalize">
                  {currentUser?.role === 'admin' ? 'Administrador' : 
                   currentUser?.role === 'manager' ? 'Gerente' :
                   currentUser?.role === 'analyst' ? 'Analista' : 'Visor'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={openProfileDialog}>
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Modo claro
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Modo oscuro
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de Editar Perfil */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mi Perfil</DialogTitle>
            <DialogDescription>
              Modifica tu informacion personal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {profileAvatar && <AvatarImage src={profileAvatar} />}
                  <AvatarFallback className="text-2xl">
                    {profileName.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">Haz clic en el icono para cambiar tu foto</p>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nombre</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="profile-email">Correo Electronico</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>

            {/* Cambiar Contrasena */}
            <div className="pt-2 border-t">
              <Label className="flex items-center gap-2 mb-3">
                <Key className="h-4 w-4" />
                Cambiar Contraseña
                <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña actual"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nueva contraseña (min. 8 caracteres)"
                    value={profileNewPassword}
                    onChange={(e) => setProfileNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar nueva contraseña"
                  value={profileConfirmPassword}
                  onChange={(e) => setProfileConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
                {profileNewPassword && profileConfirmPassword && profileNewPassword !== profileConfirmPassword && !passwordError && (
                  <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
                )}
                {profileNewPassword && profileNewPassword.length < 8 && profileNewPassword.length > 0 && (
                  <p className="text-sm text-amber-600">La contraseña debe tener al menos 8 caracteres</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={
                isSaving || 
                !profileName || 
                !profileEmail ||
                (profileNewPassword !== '' && (profileNewPassword !== profileConfirmPassword || profileNewPassword.length < 8))
              }
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
