"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
// @ts-ignore
import * as XLSX from "xlsx"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  ordersByStatus: Array<{ status: string; count: number }>
  topProducts: Array<{ name: string; sales: number }>
}

const COLORS = ["#FF6B9D", "#C147E9", "#4ECDC4", "#FFE66D", "#FF6B6B"]

export function DashboardStats() {
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueByMonth: [],
    ordersByStatus: [],
    topProducts: [],
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Cargar pedidos confirmados (solo estos cuentan para las gráficas)
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_status", "confirmed")

      if (ordersError) throw ordersError

      // Cargar productos
      const { data: products, error: productsError } = await supabase.from("products").select("*")

      if (productsError) throw productsError

      // Calcular estadísticas
      const totalRevenue =
        orders?.reduce((sum, order) => sum + (order.total_product_cost + order.shipping_cost), 0) || 0
      const totalOrders = orders?.length || 0
      const totalProducts = products?.length || 0

      // Obtener clientes únicos
      const uniqueCustomers = new Set(orders?.map((order) => order.customer_email || order.customer_phone))
      const totalCustomers = uniqueCustomers.size

      // Revenue por mes
      const revenueByMonth = calculateRevenueByMonth(orders || [])

      // Pedidos por estado
      const ordersByStatus = calculateOrdersByStatus(orders || [])

      // Top productos
      const topProducts = calculateTopProducts(orders || [])

      setData({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueByMonth,
        ordersByStatus,
        topProducts,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenueByMonth = (orders: any[]) => {
    const monthlyRevenue: Record<string, number> = {}

    orders.forEach((order) => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const revenue = order.total_product_cost + order.shipping_cost

      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0
      }
      monthlyRevenue[monthKey] += revenue
    })

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month: new Date(month + "-01").toLocaleDateString("es-CO", { month: "short", year: "numeric" }),
        revenue,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Últimos 6 meses
  }

  const calculateOrdersByStatus = (orders: any[]) => {
    const statusCount: Record<string, number> = {}

    orders.forEach((order) => {
      const status = order.delivery_status || "no"
      if (!statusCount[status]) {
        statusCount[status] = 0
      }
      statusCount[status]++
    })

    const statusLabels: Record<string, string> = {
      yes: "Entregado",
      no: "Pendiente",
      in_transit: "En tránsito",
      returned: "Devuelto",
    }

    return Object.entries(statusCount).map(([status, count]) => ({
      status: statusLabels[status] || status,
      count,
    }))
  }

  const calculateTopProducts = (orders: any[]) => {
    const productSales: Record<string, { name: string; sales: number }> = {}

    orders.forEach((order) => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          if (!productSales[product.id]) {
            productSales[product.id] = { name: product.name, sales: 0 }
          }
          productSales[product.id].sales += product.quantity
        })
      }
    })

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
  }

  const handleExportToExcel = () => {
    try {
      console.log("[v0] Starting dashboard export to Excel...")

      // Crear hojas de datos
      const summaryData = [
        { Métrica: "Ingresos Totales", Valor: `$${data.totalRevenue.toLocaleString("es-CO")} COP` },
        { Métrica: "Total Pedidos", Valor: data.totalOrders },
        { Métrica: "Total Productos", Valor: data.totalProducts },
        { Métrica: "Total Clientes", Valor: data.totalCustomers },
      ]

      const revenueData = data.revenueByMonth.map((item) => ({
        Mes: item.month,
        Ingresos: `$${item.revenue.toLocaleString("es-CO")} COP`,
      }))

      const statusData = data.ordersByStatus.map((item) => ({
        Estado: item.status,
        Cantidad: item.count,
      }))

      const productsData = data.topProducts.map((item) => ({
        Producto: item.name,
        Ventas: item.sales,
      }))

      // Crear workbook
      const workbook = XLSX.utils.book_new()

      // Agregar hojas
      const summarySheet = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Resumen")

      const revenueSheet = XLSX.utils.json_to_sheet(revenueData)
      XLSX.utils.book_append_sheet(workbook, revenueSheet, "Ingresos por Mes")

      const statusSheet = XLSX.utils.json_to_sheet(statusData)
      XLSX.utils.book_append_sheet(workbook, statusSheet, "Pedidos por Estado")

      const productsSheet = XLSX.utils.json_to_sheet(productsData)
      XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Productos")

      // Generar archivo
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `dashboard_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log("[v0] Dashboard export completed successfully")
    } catch (error) {
      console.error("[v0] Error exporting dashboard to Excel:", error)
      alert("Error al exportar a Excel. Por favor intenta de nuevo.")
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return <div className="text-center py-8">Cargando estadísticas...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de exportar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estadísticas del Dashboard</h2>
        <Button onClick={handleExportToExcel} variant="outline" className="flex items-center gap-2 bg-transparent">
          <FileDown className="h-4 w-4" />
          Exportar a Excel
        </Button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">De pedidos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Pedidos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">En catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Clientes únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#FF6B9D" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pedidos por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Estado de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top productos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 5 Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#C147E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
