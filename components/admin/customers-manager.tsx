"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, Plus, Eye, Mail, Phone, ShoppingBag } from "lucide-react"
import { getAdminCustomers, saveAdminCustomer, type AdminCustomer } from "@/lib/admin-storage"

export function CustomersManager() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)

  useEffect(() => {
    setCustomers(getAdminCustomers())
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    totalOrders: 0,
    totalSpent: 0,
  })

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert("Por favor completa los campos requeridos")
      return
    }

    saveAdminCustomer({
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone || undefined,
      totalOrders: 0,
      totalSpent: 0,
    })

    setCustomers(getAdminCustomers())
    setIsAddDialogOpen(false)
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      totalOrders: 0,
      totalSpent: 0,
    })
  }

  const handleViewCustomer = (customer: AdminCustomer) => {
    setSelectedCustomer(customer)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000000) return { label: "VIP", variant: "default" as const }
    if (totalSpent >= 500000) return { label: "Premium", variant: "secondary" as const }
    return { label: "Regular", variant: "outline" as const }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Clientes
            </CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary">{customers.length} clientes totales</Badge>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: María García"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="ejemplo@correo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full">
                      Agregar Cliente
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay clientes que mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.totalSpent)
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{customer.totalOrders}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-accent">
                          ${customer.totalSpent.toLocaleString("es-CO")} COP
                        </TableCell>
                        <TableCell>
                          <Badge variant={tier.variant}>{tier.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(customer.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                  <div className="space-y-1 mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    {selectedCustomer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={getCustomerTier(selectedCustomer.totalSpent).variant}>
                  {getCustomerTier(selectedCustomer.totalSpent).label}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-muted-foreground">Pedidos Totales</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Total Gastado</p>
                      <p className="text-xl font-bold text-accent">
                        ${selectedCustomer.totalSpent.toLocaleString("es-CO")}
                      </p>
                      <p className="text-xs text-muted-foreground">COP</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Promedio por Pedido</p>
                      <p className="text-xl font-bold">
                        $
                        {selectedCustomer.totalOrders > 0
                          ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString(
                              "es-CO",
                            )
                          : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">COP</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente desde:</span>
                  <span className="font-medium">{formatDate(selectedCustomer.createdAt)}</span>
                </div>
                {selectedCustomer.lastOrderAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Último pedido:</span>
                    <span className="font-medium">{formatDate(selectedCustomer.lastOrderAt)}</span>
                  </div>
                )}
              </div>

              <Button onClick={() => setIsDetailDialogOpen(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
