"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { 
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  UserPlus,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  XCircle,
  Crown,
  Briefcase,
  BarChart3,
  Clock
} from "lucide-react"
import { useUsers } from "@/lib/users-context"
import { formatDate, formatRelativeTime } from "@/lib/format"

const roles = [
  { id: "admin", name: "Administrador", icon: ShieldAlert, color: "text-red-500", description: "Acceso total al sistema" },
  { id: "manager", name: "Gerente", icon: ShieldCheck, color: "text-amber-500", description: "Gestión de activos y finanzas" },
  { id: "analyst", name: "Analista", icon: Shield, color: "text-blue-500", description: "Visualización y reportes" },
  { id: "viewer", name: "Visor", icon: Shield, color: "text-muted-foreground", description: "Solo lectura" },
]

const getRoleBadge = (role: string) => {
  const roleConfig = roles.find(r => r.id === role)
  if (!roleConfig) return <Badge variant="outline">{role}</Badge>
  
  return (
    <Badge variant="outline" className={roleConfig.color}>
      <roleConfig.icon className="mr-1 h-3 w-3" />
      {roleConfig.name}
    </Badge>
  )
}

export default function UsuariosPage() {
  // Usar el contexto de usuarios para sincronizar con todo el sistema
  const { users, addUser, updateUser, deleteUser } = useUsers()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)
  
  // Estados para modales de acciones
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // Estados para formulario de edicion
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editStatus, setEditStatus] = useState(true)
  const [editPassword, setEditPassword] = useState("")
  const [editConfirmPassword, setEditConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Estado para email
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  
  // Estados para nuevo usuario
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newDepartment, setNewDepartment] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [sendInvite, setSendInvite] = useState(true)
  
  // Funciones para abrir modales
  const handleEdit = (user: typeof users[0]) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditStatus(user.status === "active")
    setEditPassword("")
    setEditConfirmPassword("")
    setShowPassword(false)
    setIsEditOpen(true)
  }
  
  const handleResetPassword = (user: typeof users[0]) => {
    setSelectedUser(user)
    setIsResetPasswordOpen(true)
  }
  
  const handleSendEmail = (user: typeof users[0]) => {
    setSelectedUser(user)
    setEmailSubject("")
    setEmailMessage("")
    setIsSendEmailOpen(true)
  }
  
  const handleDelete = (user: typeof users[0]) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }
  
  // Acciones que actualizan el estado usando el contexto
  const confirmEdit = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, {
        name: editName,
        email: editEmail,
        role: editRole,
        status: editStatus ? "active" : "inactive"
      })
    }
    setIsEditOpen(false)
  }
  
  const confirmResetPassword = () => {
    setIsResetPasswordOpen(false)
  }
  
  const confirmSendEmail = () => {
    setIsSendEmailOpen(false)
  }
  
  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
    }
    setIsDeleteOpen(false)
  }
  
  const handleCreateUser = () => {
    if (!newName || !newEmail || !newRole) return
    
    addUser({
      name: newName,
      email: newEmail,
      avatar: "",
      role: newRole,
      status: "active",
      lastAccess: new Date().toISOString(),
    })
    
    // Limpiar formulario
    setNewName("")
    setNewEmail("")
    setNewRole("")
    setNewDepartment("")
    setNewPhone("")
    setSendInvite(true)
    setIsNewUserOpen(false)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const activeUsers = users.filter(u => u.status === "active").length
  const adminUsers = users.filter(u => u.role === "admin").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
            <p className="text-muted-foreground">
              Gestión de usuarios y permisos del sistema
            </p>
          </div>
          <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del nuevo usuario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input 
                      placeholder="Nombre completo" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      placeholder="correo@empresa.com" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex items-center gap-2">
                              <role.icon className={`h-4 w-4 ${role.color}`} />
                              {role.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Departamento</Label>
                    <Select value={newDepartment} onValueChange={setNewDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finanzas</SelectItem>
                        <SelectItem value="operations">Operaciones</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="admin">Administracion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefono (opcional)</Label>
                  <Input 
                    placeholder="+52 55 1234 5678" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Enviar invitacion por email</p>
                    <p className="text-xs text-muted-foreground">
                      El usuario recibira un email para configurar su contrasena
                    </p>
                  </div>
                  <Switch checked={sendInvite} onCheckedChange={setSendInvite} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} disabled={!newName || !newEmail || !newRole}>
                  Crear Usuario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                registrados en el sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                usuarios activos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                con acceso total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Último Acceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hace 5m</div>
              <p className="text-xs text-muted-foreground">
                último inicio de sesión
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Roles Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          {roles.map(role => {
            const count = users.filter(u => u.role === role.id).length
            return (
              <Card key={role.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${role.color}`}>
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground">{count} usuarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>
                  {filteredUsers.length} usuarios encontrados
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[250px]"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? (
                          <><CheckCircle2 className="mr-1 h-3 w-3" /> Activo</>
                        ) : (
                          <><XCircle className="mr-1 h-3 w-3" /> Inactivo</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(user.lastLogin)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                            <Key className="mr-2 h-4 w-4" />
                            Restablecer Contrasena
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog Editar Usuario */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica los datos del usuario {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>
                    {selectedUser?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select value={editRole} onValueChange={setEditRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <role.icon className={`h-4 w-4 ${role.color}`} />
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch 
                      checked={editStatus}
                      onCheckedChange={setEditStatus}
                    />
                    <span className={editStatus ? "text-emerald-600" : "text-muted-foreground"}>
                      {editStatus ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Seccion de Contrasena */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Key className="h-4 w-4" />
                  Cambiar Contrasena
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Nueva Contrasena</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirmar Contrasena</Label>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={editConfirmPassword}
                      onChange={(e) => setEditConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                {editPassword && editConfirmPassword && editPassword !== editConfirmPassword && (
                  <p className="text-sm text-destructive mt-2">Las contrasenas no coinciden</p>
                )}
                {editPassword && editPassword.length < 6 && (
                  <p className="text-sm text-amber-600 mt-2">La contrasena debe tener al menos 6 caracteres</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={confirmEdit}
                disabled={editPassword !== "" && (editPassword !== editConfirmPassword || editPassword.length < 6)}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Restablecer Contrasena */}
        <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Restablecer Contrasena</DialogTitle>
              <DialogDescription>
                Se enviara un enlace de restablecimiento al correo del usuario
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>
                    {selectedUser?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                <div className="flex gap-2">
                  <Key className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-600">El usuario recibira un email</p>
                    <p className="text-muted-foreground">
                      Con un enlace seguro para crear una nueva contrasena. El enlace expirara en 24 horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmResetPassword}>
                <Key className="mr-2 h-4 w-4" />
                Enviar Enlace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Enviar Email */}
        <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enviar Email</DialogTitle>
              <DialogDescription>
                Enviar un mensaje a {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Para: <span className="font-medium text-foreground">{selectedUser?.email}</span>
              </div>
              <div className="space-y-2">
                <Label>Asunto</Label>
                <Input 
                  placeholder="Asunto del mensaje"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mensaje</Label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Escribe tu mensaje aqui..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSendEmailOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmSendEmail} disabled={!emailSubject || !emailMessage}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Eliminar Usuario */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Eliminar Usuario</DialogTitle>
              <DialogDescription>
                Esta accion no se puede deshacer
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser?.avatar} />
                  <AvatarFallback>
                    {selectedUser?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                <div className="flex gap-2">
                  <Trash2 className="h-5 w-5 text-destructive shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Advertencia</p>
                    <p className="text-muted-foreground">
                      Se eliminara permanentemente este usuario y todo su historial de actividad del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
