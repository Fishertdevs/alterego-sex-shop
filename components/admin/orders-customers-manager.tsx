"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Search, Plus, Eye, Package, Phone, MapPin, CreditCard, Truck } from "lucide-react"
import { colombiaDepartments, shippingCompanies, paymentMethods, shippingTypes } from "@/lib/colombia-data"
import { createBrowserClient } from "@/lib/supabase/client"

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_department: string
  customer_municipality: string
  customer_email?: string
  products: Array<{ id: string; name: string; quantity: number; price: number }>
  total_product_cost: number
  payment_method: string
  payment_status: string
  shipping_type: string
  shipping_cost: number
  shipping_company?: string
  tracking_number?: string
  order_status: string
  delivered: boolean
  delivered_at?: string
  created_at: string
  updated_at: string
  notes?: string
}

export function OrdersCustomersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [municipalities, setMunicipalities] = useState<Array<{ name: string; code: string }>>([])

  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_department: "",
    customer_municipality: "",
    customer_email: "",
    total_product_cost: "",
    payment_method: "",
    shipping_type: "",
    shipping_cost: "",
    shipping_company: "",
    notes: "",
  })

  const supabase = createBrowserClient()

  const formatNumberInput = (value: string): string => {
    // Eliminar todo excepto números
    const numbers = value.replace(/\D/g, "")

    // Si está vacío, retornar cadena vacía
    if (!numbers) return ""

    // Formatear con separadores de miles (puntos)
    return Number.parseInt(numbers).toLocaleString("es-CO")
  }

  const parseFormattedNumber = (value: string): number => {
    if (!value) return 0
    return Number.parseInt(value.replace(/\D/g, "")) || 0
  }

  const handleNumberInput = (field: "total_product_cost" | "shipping_cost", value: string) => {
    const formatted = formatNumberInput(value)
    setNewOrder((prev) => ({ ...prev, [field]: formatted }))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    if (selectedDepartment) {
      const dept = colombiaDepartments.find((d) => d.name === selectedDepartment)
      setMunicipalities(dept?.municipalities || [])
    } else {
      setMunicipalities([])
    }
  }, [selectedDepartment])

  const loadOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading orders:", error)
      return
    }

    setOrders(data || [])
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddOrder = async () => {
    if (
      !newOrder.customer_name ||
      !newOrder.customer_phone ||
      !newOrder.customer_address ||
      !newOrder.customer_department ||
      !newOrder.customer_municipality ||
      !newOrder.payment_method ||
      !newOrder.shipping_type
    ) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        customer_address: newOrder.customer_address,
        customer_department: newOrder.customer_department,
        customer_municipality: newOrder.customer_municipality,
        customer_email: newOrder.customer_email,
        total_product_cost: parseFormattedNumber(newOrder.total_product_cost),
        payment_method: newOrder.payment_method,
        shipping_type: newOrder.shipping_type,
        shipping_cost: parseFormattedNumber(newOrder.shipping_cost),
        shipping_company: newOrder.shipping_company,
        notes: newOrder.notes,
        products: [],
        payment_status: "pending",
        order_status: "pending",
        delivered: false,
      },
    ])

    if (error) {
      console.error("Error creating order:", error)
      alert("Error al crear el pedido")
      return
    }

    await loadOrders()
    setIsAddDialogOpen(false)
    resetNewOrder()
  }

  const handleConfirmOrder = async (orderId: string, products: Array<{ id: string; quantity: number }>) => {
    console.log("[v0] Confirming order and updating stock:", orderId)

    try {
      // Actualizar el stock de cada producto
      for (const product of products) {
        const { data: currentProduct, error: fetchError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", product.id)
          .single()

        if (fetchError || !currentProduct) {
          console.error("[v0] Error fetching product:", fetchError)
          continue
        }

        const newStock = currentProduct.stock - product.quantity

        if (newStock < 0) {
          alert(`Stock insuficiente para el producto ${product.id}`)
          return false
        }

        const { error: updateError } = await supabase
          .from("products")
          .update({
            stock: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id)

        if (updateError) {
          console.error("[v0] Error updating stock:", updateError)
          return false
        }

        console.log("[v0] Stock updated for product:", product.id, "New stock:", newStock)
      }

      // Actualizar el estado del pedido a confirmado
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          order_status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (orderError) {
        console.error("[v0] Error updating order status:", orderError)
        return false
      }

      console.log("[v0] Order confirmed successfully")
      await loadOrders()
      return true
    } catch (error) {
      console.error("[v0] Error confirming order:", error)
      return false
    }
  }

  const handleUpdateDeliveryStatus = async (orderId: string, delivered: boolean) => {
    const { error } = await supabase
      .from("orders")
      .update({
        delivered,
        order_status: delivered ? "delivered" : "shipped",
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating delivery status:", error)
      return
    }

    await loadOrders()
    if (selectedOrder?.id === orderId) {
      const updated = orders.find((o) => o.id === orderId)
      if (updated) setSelectedOrder({ ...updated, delivered })
    }
  }

  const resetNewOrder = () => {
    setNewOrder({
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      customer_department: "",
      customer_municipality: "",
      customer_email: "",
      total_product_cost: "",
      payment_method: "",
      shipping_type: "",
      shipping_cost: "",
      shipping_company: "",
      notes: "",
    })
    setSelectedDepartment("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "pending":
        return "destructive"
      case "confirmed":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }
    return labels[status] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Pedidos y Clientes
            </CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary">{orders.length} pedidos totales</Badge>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Pedido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Pedido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Información del Cliente */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Información del Cliente
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer_name">Nombre Completo *</Label>
                          <Input
                            id="customer_name"
                            value={newOrder.customer_name}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, customer_name: e.target.value }))}
                            placeholder="Ej: María García"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer_phone">Teléfono *</Label>
                          <Input
                            id="customer_phone"
                            value={newOrder.customer_phone}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, customer_phone: e.target.value }))}
                            placeholder="+57 300 123 4567"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="customer_email">Email (Opcional)</Label>
                          <Input
                            id="customer_email"
                            type="email"
                            value={newOrder.customer_email}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, customer_email: e.target.value }))}
                            placeholder="ejemplo@correo.com"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="customer_address">Dirección *</Label>
                          <Input
                            id="customer_address"
                            value={newOrder.customer_address}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, customer_address: e.target.value }))}
                            placeholder="Calle 123 #45-67, Apto 101"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department">Departamento *</Label>
                          <Select
                            value={selectedDepartment}
                            onValueChange={(value) => {
                              setSelectedDepartment(value)
                              setNewOrder((prev) => ({
                                ...prev,
                                customer_department: value,
                                customer_municipality: "",
                              }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {colombiaDepartments.map((dept) => (
                                <SelectItem key={dept.code} value={dept.name}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="municipality">Municipio *</Label>
                          <Select
                            value={newOrder.customer_municipality}
                            onValueChange={(value) =>
                              setNewOrder((prev) => ({ ...prev, customer_municipality: value }))
                            }
                            disabled={!selectedDepartment}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar municipio" />
                            </SelectTrigger>
                            <SelectContent>
                              {municipalities.map((mun) => (
                                <SelectItem key={mun.code} value={mun.name}>
                                  {mun.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Información de Pago */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Información de Pago
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="payment_method">Método de Pago *</Label>
                          <Select
                            value={newOrder.payment_method}
                            onValueChange={(value) => setNewOrder((prev) => ({ ...prev, payment_method: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar método" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="total_product_cost">Costo del Producto *</Label>
                          <Input
                            id="total_product_cost"
                            type="text"
                            value={newOrder.total_product_cost}
                            onChange={(e) => handleNumberInput("total_product_cost", e.target.value)}
                            placeholder="Ej: 50.000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información de Envío */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Información de Envío
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping_type">Tipo de Envío *</Label>
                          <Select
                            value={newOrder.shipping_type}
                            onValueChange={(value) => setNewOrder((prev) => ({ ...prev, shipping_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="shipping_cost">Costo del Envío</Label>
                          <Input
                            id="shipping_cost"
                            type="text"
                            value={newOrder.shipping_cost}
                            onChange={(e) => handleNumberInput("shipping_cost", e.target.value)}
                            placeholder="Ej: 15.000"
                            disabled={newOrder.shipping_type === "gratis"}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="shipping_company">Transportadora</Label>
                          <Select
                            value={newOrder.shipping_company}
                            onValueChange={(value) => setNewOrder((prev) => ({ ...prev, shipping_company: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar transportadora" />
                            </SelectTrigger>
                            <SelectContent>
                              {shippingCompanies.map((company) => (
                                <SelectItem key={company.value} value={company.value}>
                                  {company.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Notas */}
                    <div>
                      <Label htmlFor="notes">Notas (Opcional)</Label>
                      <Textarea
                        id="notes"
                        value={newOrder.notes}
                        onChange={(e) => setNewOrder((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Información adicional sobre el pedido..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddOrder} className="flex-1">
                        Crear Pedido
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay pedidos que mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Entregado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.customer_name}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {order.customer_municipality}, {order.customer_department}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{order.customer_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.total_product_cost + order.shipping_cost)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {paymentMethods.find((m) => m.value === order.payment_method)?.label || order.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.order_status)}>{getStatusLabel(order.order_status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={order.delivered}
                          onCheckedChange={(checked) => handleUpdateDeliveryStatus(order.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Información del Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Nombre:</span> {selectedOrder.customer_name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Teléfono:</span> {selectedOrder.customer_phone}
                    </p>
                    {selectedOrder.customer_email && (
                      <p>
                        <span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}
                      </p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Dirección:</span> {selectedOrder.customer_address}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Ubicación:</span> {selectedOrder.customer_municipality},{" "}
                      {selectedOrder.customer_department}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Información del Pedido
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Fecha:</span> {formatDate(selectedOrder.created_at)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Estado:</span>{" "}
                      <Badge variant={getStatusColor(selectedOrder.order_status)}>
                        {getStatusLabel(selectedOrder.order_status)}
                      </Badge>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Método de pago:</span>{" "}
                      {paymentMethods.find((m) => m.value === selectedOrder.payment_method)?.label ||
                        selectedOrder.payment_method}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Tipo de envío:</span>{" "}
                      {shippingTypes.find((t) => t.value === selectedOrder.shipping_type)?.label ||
                        selectedOrder.shipping_type}
                    </p>
                    {selectedOrder.shipping_company && (
                      <p>
                        <span className="text-muted-foreground">Transportadora:</span>{" "}
                        {shippingCompanies.find((c) => c.value === selectedOrder.shipping_company)?.label ||
                          selectedOrder.shipping_company}
                      </p>
                    )}
                    {selectedOrder.tracking_number && (
                      <p>
                        <span className="text-muted-foreground">Guía:</span> {selectedOrder.tracking_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Resumen de Costos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo del producto:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.total_product_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo del envío:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-accent">
                      {formatCurrency(selectedOrder.total_product_cost + selectedOrder.shipping_cost)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notas</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 border-t pt-4">
                <Checkbox
                  id="delivered"
                  checked={selectedOrder.delivered}
                  onCheckedChange={(checked) => handleUpdateDeliveryStatus(selectedOrder.id, checked as boolean)}
                />
                <Label htmlFor="delivered" className="cursor-pointer">
                  Marcar como entregado
                </Label>
                {selectedOrder.delivered && selectedOrder.delivered_at && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    Entregado: {formatDate(selectedOrder.delivered_at)}
                  </span>
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
