"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { getAdminProducts, getAdminOrders } from "@/lib/admin-storage"
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react"

export function AnalyticsDashboard() {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; revenue: number }[]>([])
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([])
  const [monthlyData, setMonthlyData] = useState<{ name: string; ventas: number; ingresos: number }[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const products = getAdminProducts()
    const orders = getAdminOrders()

    // Datos por categoría
    const categoryMap = new Map<string, { count: number; revenue: number }>()
    products.forEach((product) => {
      const existing = categoryMap.get(product.category) || { count: 0, revenue: 0 }
      categoryMap.set(product.category, {
        count: existing.count + 1,
        revenue: existing.revenue,
      })
    })

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          const existing = categoryMap.get(product.category) || { count: 0, revenue: 0 }
          categoryMap.set(product.category, {
            count: existing.count,
            revenue: existing.revenue + item.price * item.quantity,
          })
        }
      })
    })

    const categoryChartData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      value: data.count,
      revenue: data.revenue,
    }))
    setCategoryData(categoryChartData)

    // Datos por estado de pedido
    const statusMap = new Map<string, number>()
    orders.forEach((order) => {
      const count = statusMap.get(order.status) || 0
      statusMap.set(order.status, count + 1)
    })

    const statusLabels: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }

    const statusChartData = Array.from(statusMap.entries()).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
    }))
    setStatusData(statusChartData)

    // Datos mensuales
    const monthlyMap = new Map<string, { ventas: number; ingresos: number }>()
    orders.forEach((order) => {
      const date = new Date(order.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const existing = monthlyMap.get(monthKey) || { ventas: 0, ingresos: 0 }
      monthlyMap.set(monthKey, {
        ventas: existing.ventas + 1,
        ingresos: existing.ingresos + order.total,
      })
    })

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const monthlyChartData = Array.from(monthlyMap.entries())
      .sort()
      .slice(-6)
      .map(([key, data]) => {
        const [year, month] = key.split("-")
        return {
          name: monthNames[Number.parseInt(month) - 1],
          ventas: data.ventas,
          ingresos: data.ingresos,
        }
      })
    setMonthlyData(monthlyChartData)
  }, [])

  const COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-sm">
          {value} productos
        </text>
        {payload.revenue > 0 && (
          <text
            x={cx}
            y={cy + 30}
            dy={8}
            textAnchor="middle"
            fill="hsl(var(--accent))"
            className="text-xs font-semibold"
          >
            ${payload.revenue.toLocaleString("es-CO")} COP
          </text>
        )}
        <Pie
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.ingresos, 0)
  const totalOrders = monthlyData.reduce((sum, month) => sum + month.ventas, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-accent">${totalRevenue.toLocaleString("es-CO")}</p>
                <p className="text-xs text-muted-foreground">COP (últimos 6 meses)</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Totales</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs text-muted-foreground">últimos 6 meses</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Promedio</p>
                <p className="text-2xl font-bold">${Math.round(avgOrderValue).toLocaleString("es-CO")}</p>
                <p className="text-xs text-muted-foreground">COP por pedido</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} productos</p>
                            {payload[0].payload.revenue > 0 && (
                              <p className="text-sm text-accent font-semibold">
                                ${payload[0].payload.revenue.toLocaleString("es-CO")} COP
                              </p>
                            )}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => (
                      <span className="text-sm">
                        {value} ({entry.payload.value})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Estado de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} pedidos</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ventas e Ingresos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No hay datos disponibles</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-2">{payload[0].payload.name}</p>
                          <p className="text-sm text-primary">Ventas: {payload[0].value}</p>
                          <p className="text-sm text-accent">
                            Ingresos: ${payload[1].value?.toLocaleString("es-CO")} COP
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="ventas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="ingresos" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
