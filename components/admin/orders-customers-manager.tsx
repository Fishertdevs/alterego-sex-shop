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
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import {
  Users,
  Search,
  Plus,
  Eye,
  Package,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Trash2,
  Edit,
  Save,
  X,
  FileDown,
} from "lucide-react"
import { colombiaDepartments, shippingCompanies, paymentMethods, shippingTypes } from "@/lib/colombia-data"
import { colombiaBanks } from "@/lib/colombia-banks"
import { createBrowserClient } from "@/lib/supabase/client"
// @ts-ignore
import * as XLSX from "xlsx"

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_department: string
  customer_municipality: string
  customer_email?: string
  products: Array<{ id: string; name: string; quantity: number; price: number; product_id?: string }> // Added product_id to the interface
  total_product_cost: number
  payment_method: string
  payment_status: string
  shipping_type: string
  shipping_cost: number
  shipping_company?: string
  shipping_carrier?: string // Added shipping_carrier field
  shipping_notes?: string // Added shipping_notes field
  tracking_number?: string
  order_status: string
  delivered: boolean
  delivery_status?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  notes?: string
  bank?: string // Added bank field to the interface
  account_type?: string // Added account_type field
  account_number?: string // Added account_number field
}

const deliveryStatusOptions = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
  { value: "returned", label: "Devuelto" },
  { value: "in_transit", label: "En tránsito" },
]

export function OrdersCustomersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [municipalities, setMunicipalities] = useState<Array<{ name: string; code: string }>>([])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  // </CHANGE>

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<
    Partial<Order & { bank?: string; account_type?: string; account_number?: string }>
  >({}) // Include bank, account_type, and account_number in editingOrder type
  const [editingDepartment, setEditingDepartment] = useState("")
  const [editingMunicipalities, setEditingMunicipalities] = useState<Array<{ name: string; code: string }>>([])

  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_department: "",
    customer_municipality: "",
    customer_email: "",
    total_product_cost: "",
    payment_method: "",
    bank: "",
    account_type: "", // Added account_type field
    account_number: "", // Added account_number field
    shipping_type: "",
    shipping_cost: "",
    shipping_company: "",
    shipping_carrier: "",
    shipping_notes: "",
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

  // useEffect para editar departamentos y municipios
  useEffect(() => {
    if (editingDepartment) {
      const dept = colombiaDepartments.find((d) => d.name === editingDepartment)
      setEditingMunicipalities(dept?.municipalities || [])
    } else {
      setEditingMunicipalities([])
    }
  }, [editingDepartment])

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

    if ((newOrder.payment_method === "tarjeta" || newOrder.payment_method === "banco") && !newOrder.bank) {
      alert("Por favor selecciona el banco")
      return
    }

    if (newOrder.payment_method === "tarjeta" || newOrder.payment_method === "banco") {
      if (!newOrder.account_type) {
        alert("Por favor selecciona el tipo de cuenta (Corriente o Ahorros)")
        return
      }
      if (!newOrder.account_number) {
        alert("Por favor ingresa el número de cuenta")
        return
      }
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
        bank: newOrder.bank || null,
        account_type: newOrder.account_type || null, // Added account_type to insert
        account_number: newOrder.account_number || null, // Added account_number to insert
        shipping_type: newOrder.shipping_type,
        shipping_cost: parseFormattedNumber(newOrder.shipping_cost),
        shipping_company: newOrder.shipping_company,
        shipping_carrier: newOrder.shipping_carrier,
        shipping_notes: newOrder.shipping_notes,
        notes: newOrder.notes,
        products: [],
        payment_status: "pending",
        order_status: "pending",
        delivered: false,
        delivery_status: "no", // Initialize delivery_status
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

  const handleUpdateDeliveryStatus = async (orderId: string, deliveryStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        delivery_status: deliveryStatus,
        delivered: deliveryStatus === "yes",
        delivered_at: deliveryStatus === "yes" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating delivery status:", error)
      return
    }

    await loadOrders()
    if (selectedOrder?.id === orderId) {
      const updated = orders.find((o) => o.id === orderId)
      if (updated) setSelectedOrder({ ...updated, delivery_status: deliveryStatus })
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId)
    setDeleteDialogOpen(true)
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) return

    const { error } = await supabase.from("orders").delete().in("id", selectedOrders)

    if (error) {
      console.error("Error deleting orders:", error)
      alert("Error al eliminar los pedidos")
      return
    }

    await loadOrders()
    setSelectedOrders([])
    setBulkDeleteDialogOpen(false)
  }
  // </CHANGE>

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return

    const { error } = await supabase.from("orders").delete().eq("id", orderToDelete)

    if (error) {
      console.error("Error deleting order:", error)
      alert("Error al eliminar el pedido")
      return
    }

    await loadOrders()
    if (selectedOrder?.id === orderToDelete) {
      setIsDetailDialogOpen(false)
      setSelectedOrder(null)
    }

    setDeleteDialogOpen(false)
    setOrderToDelete(null)
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
      bank: "",
      account_type: "", // Reset account_type
      account_number: "", // Reset account_number
      shipping_type: "",
      shipping_cost: "",
      shipping_company: "",
      shipping_carrier: "",
      shipping_notes: "",
      notes: "",
    })
    setSelectedDepartment("")
  }

  const handleStartEdit = (order: Order) => {
    setEditingOrderId(order.id)
    setEditingOrder({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      customer_department: order.customer_department,
      customer_municipality: order.customer_municipality,
      payment_method: order.payment_method,
      bank: (order as any).bank || "",
      account_type: (order as any).account_type || "", // Added account_type to editing state
      account_number: (order as any).account_number || "", // Added account_number to editing state
      order_status: order.order_status,
      delivery_status: order.delivery_status || "no",
      shipping_type: order.shipping_type, // Added shipping fields to editing state
      shipping_cost: order.shipping_cost,
      shipping_carrier: order.shipping_carrier || "",
      shipping_notes: order.shipping_notes || "",
    })
    setEditingDepartment(order.customer_department)
  }

  const handleSaveEdit = async () => {
    if (!editingOrderId) return

    if ((editingOrder.payment_method === "tarjeta" || editingOrder.payment_method === "banco") && !editingOrder.bank) {
      alert("Por favor selecciona el banco")
      return
    }

    if (editingOrder.payment_method === "tarjeta" || editingOrder.payment_method === "banco") {
      if (!editingOrder.account_type) {
        alert("Por favor selecciona el tipo de cuenta (Corriente o Ahorros)")
        return
      }
      if (!editingOrder.account_number) {
        alert("Por favor ingresa el número de cuenta")
        return
      }
    }

    const updateData: any = {
      customer_name: editingOrder.customer_name,
      customer_phone: editingOrder.customer_phone,
      customer_address: editingOrder.customer_address,
      customer_department: editingOrder.customer_department,
      customer_municipality: editingOrder.customer_municipality,
      payment_method: editingOrder.payment_method,
      bank: editingOrder.bank && editingOrder.bank.trim() !== "" ? editingOrder.bank : null,
      account_type:
        editingOrder.account_type && editingOrder.account_type.trim() !== "" ? editingOrder.account_type : null,
      account_number:
        editingOrder.account_number && editingOrder.account_number.trim() !== "" ? editingOrder.account_number : null,
      order_status: editingOrder.order_status,
      delivery_status: editingOrder.delivery_status,
      delivered: editingOrder.delivery_status === "yes",
      shipping_type: editingOrder.shipping_type,
      shipping_cost: editingOrder.shipping_cost,
      shipping_carrier:
        editingOrder.shipping_carrier && editingOrder.shipping_carrier.trim() !== ""
          ? editingOrder.shipping_carrier
          : null,
      shipping_notes:
        editingOrder.shipping_notes && editingOrder.shipping_notes.trim() !== "" ? editingOrder.shipping_notes : null,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Updating order with data:", updateData)

    const { error } = await supabase.from("orders").update(updateData).eq("id", editingOrderId)

    if (error) {
      console.error("Error updating order:", error)
      alert(`Error al actualizar el pedido: ${error.message}`)
      return
    }

    await loadOrders()
    setEditingOrderId(null)
    setEditingOrder({})
    setEditingDepartment("")
  }

  const handleCancelEdit = () => {
    setEditingOrderId(null)
    setEditingOrder({})
    setEditingDepartment("")
  }

  const handleExportToExcel = () => {
    try {
      console.log("[v0] Starting Excel export...")

      const exportData = filteredOrders.map((order) => ({
        Cliente: order.customer_name,
        Teléfono: order.customer_phone,
        Dirección: order.customer_address,
        Municipio: order.customer_municipality,
        Departamento: order.customer_department,
        "Costo Producto": order.total_product_cost,
        "Costo Envío": order.shipping_cost,
        Total: order.total_product_cost + order.shipping_cost,
        "Método de Pago": paymentMethods.find((m) => m.value === order.payment_method)?.label || order.payment_method,
        Banco: (order as any).bank
          ? colombiaBanks.find((b) => b.value === (order as any).bank)?.label || (order as any).bank
          : "N/A",
        Estado: getStatusLabel(order.order_status),
        Entregado:
          deliveryStatusOptions.find((s) => s.value === order.delivery_status)?.label ||
          (order.delivered ? "Sí" : "No"),
        "Fecha de Creación": formatDate(order.created_at),
        "Fecha de Entrega": order.delivered_at ? formatDate(order.delivered_at) : "N/A",
        "Tipo de Envío": shippingTypes.find((t) => t.value === order.shipping_type)?.label || order.shipping_type, // Added shipping type to export
        Transportadora: order.shipping_carrier
          ? shippingCompanies.find((c) => c.value === order.shipping_carrier)?.label || order.shipping_carrier
          : "N/A", // Added shipping carrier to export
        "Notas Envío": order.shipping_notes || "N/A", // Added shipping notes to export
      }))

      console.log("[v0] Export data prepared:", exportData.length, "rows")

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos")

      console.log("[v0] Workbook created")

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      console.log("[v0] Excel buffer generated")

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `pedidos_${new Date().toISOString().split("T")[0]}.xlsx`

      console.log("[v0] Download link created")

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log("[v0] Excel export completed successfully")
    } catch (error) {
      console.error("[v0] Error exporting to Excel:", error)
      alert("Error al exportar a Excel. Por favor intenta de nuevo.")
    }
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (newStatus === "confirmed") {
      const order = orders.find((o) => o.id === orderId)

      if (!order) {
        alert("Error: No se encontró el pedido")
        return
      }

      // Validate all required fields are filled
      const missingFields: string[] = []

      if (!order.customer_name) missingFields.push("Nombre del cliente")
      if (!order.customer_phone) missingFields.push("Teléfono")
      if (!order.customer_address) missingFields.push("Dirección")
      if (!order.customer_department) missingFields.push("Departamento")
      if (!order.customer_municipality) missingFields.push("Municipio")
      if (!order.payment_method) missingFields.push("Método de pago")
      if (!order.shipping_type) missingFields.push("Tipo de envío")

      // Validate bank fields if payment method requires it
      if (order.payment_method === "tarjeta" || order.payment_method === "banco") {
        if (!(order as any).bank) missingFields.push("Banco")
        if (!(order as any).account_type) missingFields.push("Tipo de cuenta")
        if (!(order as any).account_number) missingFields.push("Número de cuenta")
      }

      if (missingFields.length > 0) {
        alert(
          `⚠️ No se puede confirmar el pedido. Los siguientes campos están vacíos:\n\n${missingFields.join("\n")}\n\nPor favor completa todos los campos antes de confirmar.`,
        )
        return
      }

      console.log("[v0] ===== INICIO ACTUALIZACIÓN DE ESTADO =====")
      console.log("[v0] Order ID:", orderId)
      console.log("[v0] New status:", newStatus)
      console.log("[v0] Order found:", order ? "YES" : "NO")
      console.log("[v0] Order products:", order?.products)
      console.log("[v0] Products length:", order?.products?.length || 0)

      if (order && order.products && order.products.length > 0) {
        console.log("[v0] Order confirmed, updating stock for", order.products.length, "products")

        for (const product of order.products) {
          const productId = (product as any).product_id || product.id
          const quantity = product.quantity

          console.log("[v0] Processing product:")
          console.log("[v0]   - Product ID:", productId)
          console.log("[v0]   - Product name:", product.name)
          console.log("[v0]   - Quantity:", quantity)
          console.log("[v0]   - Full product object:", JSON.stringify(product))

          if (!productId) {
            console.error("[v0] ERROR: Product ID is missing!")
            console.error("[v0] Product object:", JSON.stringify(product))
            alert(
              `Error: No se encontró el ID del producto "${product.name}". Por favor verifica que el producto tenga un product_id válido.`,
            )
            return
          }

          const { data: currentProduct, error: fetchError } = await supabase
            .from("products")
            .select("stock, name, category, subcategory")
            .eq("id", productId)
            .single()

          if (fetchError || !currentProduct) {
            console.error("[v0] Error fetching product:", fetchError)
            alert(
              `Error al obtener información del producto ${product.name}. Verifica que el producto exista en la base de datos.`,
            )
            return
          }

          console.log("[v0] Current product info:")
          console.log("[v0]   - Name:", currentProduct.name)
          console.log("[v0]   - Category:", currentProduct.category)
          console.log("[v0]   - Subcategory:", currentProduct.subcategory)
          console.log("[v0]   - Current stock:", currentProduct.stock)

          const newStock = currentProduct.stock - quantity

          if (newStock < 0) {
            console.error("[v0] Insufficient stock for product:", currentProduct.name)
            alert(
              `Stock insuficiente para el producto "${currentProduct.name}". Stock actual: ${currentProduct.stock}, Cantidad solicitada: ${quantity}`,
            )
            return
          }

          console.log("[v0] Updating stock:")
          console.log("[v0]   - Previous stock:", currentProduct.stock)
          console.log("[v0]   - Quantity to subtract:", quantity)
          console.log("[v0]   - New stock:", newStock)

          const { error: updateError } = await supabase
            .from("products")
            .update({
              stock: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq("id", productId)

          if (updateError) {
            console.error("[v0] Error updating stock:", updateError)
            alert(`Error al actualizar el stock del producto "${currentProduct.name}"`)
            return
          }

          console.log("[v0] ✅ Stock updated successfully for", currentProduct.name)
          console.log("[v0]   - Previous:", currentProduct.stock, "→ New:", newStock)
        }

        console.log("[v0] ✅ All products stock updated successfully")
      } else {
        console.log("[v0] ⚠️ Order has no products, skipping stock update")
        if (order) {
          console.log("[v0] Order data:", JSON.stringify(order, null, 2))
        }
      }
    }

    // Actualizar el estado del pedido
    console.log("[v0] Updating order status in database...")
    const { error } = await supabase
      .from("orders")
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("[v0] Error updating order status:", error)
      alert("Error al actualizar el estado del pedido")
      return
    }

    console.log("[v0] ✅ Order status updated successfully to:", newStatus)
    console.log("[v0] ===== FIN ACTUALIZACIÓN DE ESTADO =====")
    await loadOrders()
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
              {selectedOrders.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar seleccionados ({selectedOrders.length})
                </Button>
              )}
              {/* </CHANGE> */}
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                className="flex items-center gap-2 bg-transparent"
              >
                <FileDown className="h-4 w-4" />
                Exportar a Excel
              </Button>
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
                            onValueChange={(value) =>
                              setNewOrder((prev) => ({
                                ...prev,
                                payment_method: value,
                                bank: "",
                                account_type: "",
                                account_number: "",
                              }))
                            } // Reset bank, account_type and account_number when payment method changes
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
                        {(newOrder.payment_method === "tarjeta" || newOrder.payment_method === "banco") && (
                          <div>
                            <Label htmlFor="bank">Banco *</Label>
                            <Select
                              value={newOrder.bank}
                              onValueChange={(value) => setNewOrder((prev) => ({ ...prev, bank: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar banco" />
                              </SelectTrigger>
                              <SelectContent>
                                {colombiaBanks.map((bank) => (
                                  <SelectItem key={bank.value} value={bank.value}>
                                    {bank.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {(newOrder.payment_method === "tarjeta" || newOrder.payment_method === "banco") &&
                          newOrder.bank && (
                            <>
                              <div>
                                <Label htmlFor="account_type">Tipo de Cuenta *</Label>
                                <Select
                                  value={newOrder.account_type}
                                  onValueChange={(value) => setNewOrder((prev) => ({ ...prev, account_type: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="corriente">Cuenta Corriente</SelectItem>
                                    <SelectItem value="ahorros">Cuenta de Ahorros</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="account_number">Número de Cuenta *</Label>
                                <Input
                                  id="account_number"
                                  value={newOrder.account_number}
                                  onChange={(e) => setNewOrder((prev) => ({ ...prev, account_number: e.target.value }))}
                                  placeholder="Ej: 1234567890"
                                />
                              </div>
                            </>
                          )}
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
                        {/* Added shipping carrier and notes fields */}
                        <div className="col-span-2">
                          <Label htmlFor="shipping_carrier">Transportadora (Carrier)</Label>
                          <Input
                            id="shipping_carrier"
                            value={newOrder.shipping_carrier}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, shipping_carrier: e.target.value }))}
                            placeholder="Ej: Servientrega, Interrapidísimo"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="shipping_notes">Notas de Envío</Label>
                          <Textarea
                            id="shipping_notes"
                            value={newOrder.shipping_notes}
                            onChange={(e) => setNewOrder((prev) => ({ ...prev, shipping_notes: e.target.value }))}
                            placeholder="Instrucciones especiales para el envío..."
                            rows={2}
                          />
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
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    {/* </CHANGE> */}
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Envío</TableHead> {/* Added Envío column */}
                    <TableHead>Estado</TableHead>
                    <TableHead>Entregado</TableHead>
                    <TableHead>Acciones</TableHead>
                    <TableHead>Eliminar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const isEditing = editingOrderId === order.id

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                            className="h-4 w-4 rounded border-gray-300"
                            disabled={isEditing}
                          />
                        </TableCell>
                        {/* </CHANGE> */}
                        <TableCell className="font-medium">
                          {isEditing ? (
                            <Input
                              value={editingOrder.customer_name || ""}
                              onChange={(e) => setEditingOrder((prev) => ({ ...prev, customer_name: e.target.value }))}
                              className="w-full"
                              placeholder="Nombre del cliente"
                            />
                          ) : (
                            order.customer_name
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {isEditing ? (
                            <div className="space-y-2 min-w-[200px]">
                              <Input
                                value={editingOrder.customer_address || ""}
                                onChange={(e) =>
                                  setEditingOrder((prev) => ({ ...prev, customer_address: e.target.value }))
                                }
                                placeholder="Dirección"
                                className="text-xs"
                              />
                              <Select
                                value={editingDepartment}
                                onValueChange={(value) => {
                                  setEditingDepartment(value)
                                  setEditingOrder((prev) => ({
                                    ...prev,
                                    customer_department: value,
                                    customer_municipality: "",
                                  }))
                                }}
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue placeholder="Departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                  {colombiaDepartments.map((dept) => (
                                    <SelectItem key={dept.code} value={dept.name}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={editingOrder.customer_municipality || ""}
                                onValueChange={(value) =>
                                  setEditingOrder((prev) => ({ ...prev, customer_municipality: value }))
                                }
                                disabled={!editingDepartment}
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue placeholder="Municipio" />
                                </SelectTrigger>
                                <SelectContent>
                                  {editingMunicipalities.map((mun) => (
                                    <SelectItem key={mun.code} value={mun.name}>
                                      {mun.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {order.customer_municipality}, {order.customer_department}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">+57</span>
                              <Input
                                value={editingOrder.customer_phone?.replace("+57", "").trim() || ""}
                                onChange={(e) => {
                                  const phone = e.target.value.replace(/\D/g, "")
                                  setEditingOrder((prev) => ({ ...prev, customer_phone: `+57 ${phone}` }))
                                }}
                                placeholder="300 123 4567"
                                className="w-full text-xs"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{order.customer_phone}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.total_product_cost + order.shipping_cost)}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="space-y-2 min-w-[150px]">
                              <Select
                                value={editingOrder.payment_method || ""}
                                onValueChange={(value) =>
                                  setEditingOrder((prev) => ({
                                    ...prev,
                                    payment_method: value,
                                    bank: "",
                                    account_type: "",
                                    account_number: "",
                                  }))
                                }
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                      {method.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {(editingOrder.payment_method === "tarjeta" ||
                                editingOrder.payment_method === "banco") && (
                                <>
                                  <Select
                                    value={editingOrder.bank || ""}
                                    onValueChange={(value) => setEditingOrder((prev) => ({ ...prev, bank: value }))}
                                  >
                                    <SelectTrigger className="text-xs">
                                      <SelectValue placeholder="Seleccionar banco" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {colombiaBanks.map((bank) => (
                                        <SelectItem key={bank.value} value={bank.value}>
                                          {bank.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {editingOrder.bank && (
                                    <>
                                      <Select
                                        value={editingOrder.account_type || ""}
                                        onValueChange={(value) =>
                                          setEditingOrder((prev) => ({ ...prev, account_type: value }))
                                        }
                                      >
                                        <SelectTrigger className="text-xs">
                                          <SelectValue placeholder="Tipo de cuenta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="corriente">Corriente</SelectItem>
                                          <SelectItem value="ahorros">Ahorros</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Input
                                        value={editingOrder.account_number || ""}
                                        onChange={(e) =>
                                          setEditingOrder((prev) => ({ ...prev, account_number: e.target.value }))
                                        }
                                        placeholder="Número de cuenta"
                                        className="text-xs"
                                      />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {paymentMethods.find((m) => m.value === order.payment_method)?.label ||
                                  order.payment_method}
                              </Badge>
                              {(order as any).bank && (
                                <div className="text-xs text-muted-foreground">
                                  {colombiaBanks.find((b) => b.value === (order as any).bank)?.label ||
                                    (order as any).bank}
                                </div>
                              )}
                              {(order as any).account_type && (
                                <div className="text-xs text-muted-foreground">
                                  {(order as any).account_type === "corriente" ? "Cta. Corriente" : "Cta. Ahorros"}
                                </div>
                              )}
                              {(order as any).account_number && (
                                <div className="text-xs text-muted-foreground font-mono">
                                  {(order as any).account_number}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="space-y-2 min-w-[180px]">
                              <Select
                                value={editingOrder.shipping_type || ""}
                                onValueChange={(value) =>
                                  setEditingOrder((prev) => ({ ...prev, shipping_type: value }))
                                }
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue placeholder="Tipo de envío" />
                                </SelectTrigger>
                                <SelectContent>
                                  {shippingTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="text"
                                value={
                                  editingOrder.shipping_cost
                                    ? formatNumberInput(editingOrder.shipping_cost.toString())
                                    : ""
                                }
                                onChange={(e) => {
                                  const formatted = formatNumberInput(e.target.value)
                                  setEditingOrder((prev) => ({
                                    ...prev,
                                    shipping_cost: parseFormattedNumber(formatted),
                                  }))
                                }}
                                placeholder="Costo"
                                className="text-xs"
                              />
                              <Select
                                value={editingOrder.shipping_carrier || ""}
                                onValueChange={(value) =>
                                  setEditingOrder((prev) => ({ ...prev, shipping_carrier: value }))
                                }
                              >
                                <SelectTrigger className="text-xs">
                                  <SelectValue placeholder="Transportadora" />
                                </SelectTrigger>
                                <SelectContent>
                                  {shippingCompanies.map((company) => (
                                    <SelectItem key={company.value} value={company.value}>
                                      {company.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Textarea
                                value={editingOrder.shipping_notes || ""}
                                onChange={(e) =>
                                  setEditingOrder((prev) => ({ ...prev, shipping_notes: e.target.value }))
                                }
                                placeholder="Notas (opcional)"
                                className="text-xs h-16"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  {shippingTypes.find((t) => t.value === order.shipping_type)?.label ||
                                    order.shipping_type}
                                </span>
                              </div>
                              <div className="text-muted-foreground">{formatCurrency(order.shipping_cost)}</div>
                              {order.shipping_carrier && (
                                <div className="text-muted-foreground">
                                  {shippingCompanies.find((c) => c.value === order.shipping_carrier)?.label ||
                                    order.shipping_carrier}
                                </div>
                              )}
                              {order.shipping_notes && (
                                <div className="text-muted-foreground italic truncate max-w-[150px]">
                                  {order.shipping_notes}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Select
                              value={editingOrder.order_status || ""}
                              onValueChange={(value) => setEditingOrder((prev) => ({ ...prev, order_status: value }))}
                            >
                              <SelectTrigger className="text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="cancelled">Descartado</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select
                              value={order.order_status}
                              onValueChange={(value) => handleUpdateStatus(order.id, value)}
                            >
                              <SelectTrigger className="text-xs w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="cancelled">Descartado</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Select
                              value={editingOrder.delivery_status || "no"}
                              onValueChange={(value) =>
                                setEditingOrder((prev) => ({ ...prev, delivery_status: value }))
                              }
                            >
                              <SelectTrigger className="text-xs w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {deliveryStatusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select
                              value={order.delivery_status || "no"}
                              onValueChange={(value) => handleUpdateDeliveryStatus(order.id, value)}
                            >
                              <SelectTrigger className="text-xs w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {deliveryStatusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveEdit}
                                className="h-8 w-8 p-0 bg-transparent"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStartEdit(order)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setIsDetailDialogOpen(true)
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={isEditing}
                          >
                            <Trash2 className="h-4 w-4" />
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
                    {/* <p>
                      <span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}
                    </p> */}
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
                    {(selectedOrder as any).bank && (
                      <p>
                        <span className="text-muted-foreground">Banco:</span>{" "}
                        {colombiaBanks.find((b) => b.value === (selectedOrder as any).bank)?.label ||
                          (selectedOrder as any).bank}
                      </p>
                    )}
                    {(selectedOrder as any).account_type && (
                      <p>
                        <span className="text-muted-foreground">Tipo de cuenta:</span>{" "}
                        {(selectedOrder as any).account_type === "corriente" ? "Cuenta Corriente" : "Cuenta de Ahorros"}
                      </p>
                    )}
                    {(selectedOrder as any).account_number && (
                      <p>
                        <span className="text-muted-foreground">Número de cuenta:</span>{" "}
                        {(selectedOrder as any).account_number}
                      </p>
                    )}
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
                    {/* Added shipping carrier and notes to details */}
                    {selectedOrder.shipping_carrier && (
                      <p>
                        <span className="text-muted-foreground">Transportadora (Carrier):</span>{" "}
                        {selectedOrder.shipping_carrier}
                      </p>
                    )}
                    {selectedOrder.shipping_notes && (
                      <p>
                        <span className="text-muted-foreground">Notas de Envío:</span> {selectedOrder.shipping_notes}
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

              <div className="flex items-center gap-4 border-t pt-4">
                <Label htmlFor="delivery-status" className="text-sm font-medium">
                  Estado de entrega:
                </Label>
                <Select
                  value={selectedOrder.delivery_status || "no"}
                  onValueChange={(value) => handleUpdateDeliveryStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOrder.delivered && selectedOrder.delivered_at && (
                  <span className="text-sm text-muted-foreground ml-auto">
                    Entregado: {formatDate(selectedOrder.delivered_at)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsDetailDialogOpen(false)} className="flex-1">
                  Cerrar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar Pedido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteOrder}
        title="¿Eliminar este pedido?"
        description="Esta acción no se puede deshacer. El pedido será eliminado permanentemente de la base de datos."
      />

      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        title={`¿Eliminar ${selectedOrders.length} pedido${selectedOrders.length > 1 ? "s" : ""}?`}
        description={`Esta acción no se puede deshacer. ${selectedOrders.length} pedido${selectedOrders.length > 1 ? "s serán eliminados" : " será eliminado"} permanentemente de la base de datos.`}
      />
      {/* </CHANGE> */}
    </>
  )
}
