"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { getAdminProducts, getAdminOrders, getAdminCustomers, getAdminStats } from "@/lib/admin-storage"

export function AdminStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    totalOrders: 0,
    ordersChange: 0,
  })

  useEffect(() => {
    const loadStats = () => {
      const products = getAdminProducts()
      const orders = getAdminOrders()
      const customers = getAdminCustomers()
      const statsData = getAdminStats()

      setStats({
        totalRevenue: statsData.totalRevenue,
        revenueChange: 12.5, // Crecimiento simulado
        totalProducts: products.length,
        productsChange: 8.2, // Crecimiento simulado
        totalCustomers: customers.length,
        customersChange: 15.3, // Crecimiento simulado
        totalOrders: orders.length,
        ordersChange: -2.4, // Crecimiento simulado
      })
    }

    loadStats()

    // Actualizar cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const statsConfig = [
    {
      title: "Ventas Totales",
      value: formatCurrency(stats.totalRevenue),
      change: `${stats.revenueChange > 0 ? "+" : ""}${stats.revenueChange.toFixed(1)}%`,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Productos",
      value: stats.totalProducts.toString(),
      change: `${stats.productsChange > 0 ? "+" : ""}${stats.productsChange.toFixed(1)}%`,
      trend: stats.productsChange >= 0 ? "up" : "down",
      icon: Package,
    },
    {
      title: "Clientes",
      value: stats.totalCustomers.toString(),
      change: `${stats.customersChange > 0 ? "+" : ""}${stats.customersChange.toFixed(1)}%`,
      trend: stats.customersChange >= 0 ? "up" : "down",
      icon: Users,
    },
    {
      title: "Pedidos",
      value: stats.totalOrders.toString(),
      change: `${stats.ordersChange > 0 ? "+" : ""}${stats.ordersChange.toFixed(1)}%`,
      trend: stats.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        null
      ))}
    </div>
  )
}
