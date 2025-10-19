"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { ProductManager } from "@/components/admin/product-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Package, BarChart3, ShoppingBag, Settings, Star, Bell } from "lucide-react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { StoreSettings } from "@/components/admin/store-settings"
import { getAdminOrders, getAdminProducts } from "@/lib/admin-storage"
import { OrdersCustomersManager } from "@/components/admin/orders-customers-manager"
import { ReviewsManager } from "@/components/admin/reviews-manager"
import { NotificationsPanel } from "@/components/admin/notifications-panel"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    console.log("[v0] Admin page - isLoading:", isLoading)
    console.log("[v0] Admin page - user:", user)

    // Verificar localStorage directamente como fallback
    const storedUser = localStorage.getItem("alterego-user")
    console.log("[v0] Admin page - localStorage user:", storedUser)

    if (!isLoading) {
      // Verificar tanto el contexto como localStorage
      const isAdminFromContext = user?.isAdmin === true
      const isAdminFromStorage = storedUser ? JSON.parse(storedUser).isAdmin === true : false

      console.log("[v0] Admin page - isAdminFromContext:", isAdminFromContext)
      console.log("[v0] Admin page - isAdminFromStorage:", isAdminFromStorage)

      if (!isAdminFromContext && !isAdminFromStorage) {
        console.log("[v0] Admin page - Not admin, redirecting to /admin/login")
        router.push("/admin/login")
      } else {
        console.log("[v0] Admin page - Admin verified, showing dashboard")
      }
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const loadRecentActivity = () => {
      const orders = getAdminOrders()
      const products = getAdminProducts()

      const activities = []

      // Últimos 3 pedidos
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2)

      recentOrders.forEach((order) => {
        const timeAgo = getTimeAgo(new Date(order.createdAt))
        activities.push({
          type: "order",
          title: `Nuevo pedido #${order.id.slice(0, 8)}`,
          description: timeAgo,
          value: `$${order.total.toLocaleString("es-CO")}`,
          valueColor: "text-accent",
        })
      })

      // Productos con stock bajo
      const lowStockProducts = products.filter((p) => p.stock < 5 && p.stock > 0).slice(0, 1)
      lowStockProducts.forEach((product) => {
        activities.push({
          type: "stock",
          title: "Stock bajo",
          description: product.name,
          value: `Stock: ${product.stock}`,
          valueColor: "text-orange-500",
        })
      })

      // Productos agotados
      const outOfStockProducts = products.filter((p) => p.stock === 0).slice(0, 1)
      outOfStockProducts.forEach((product) => {
        activities.push({
          type: "outofstock",
          title: "Producto agotado",
          description: product.name,
          value: "Stock: 0",
          valueColor: "text-destructive",
        })
      })

      setRecentActivity(activities.slice(0, 3))
    }

    loadRecentActivity()
    const interval = setInterval(loadRecentActivity, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "hace unos segundos"
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`
    return `hace ${Math.floor(seconds / 86400)} días`
  }

  if (isLoading) {
    console.log("[v0] Admin page - Loading...")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  const storedUser = localStorage.getItem("alterego-user")
  const isAdmin = user?.isAdmin || (storedUser ? JSON.parse(storedUser).isAdmin : false)

  console.log("[v0] Admin page - Final isAdmin check:", isAdmin)

  if (!isAdmin) {
    console.log("[v0] Admin page - Not admin, returning null")
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground tracking-normal leading-[4]">Panel de Administración</h1>
            </div>
            <p className="text-muted-foreground">Gestiona tu tienda ALTEREGO</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-muted">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Pedidos y Clientes
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Reseñas
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminStats />
              <DashboardStats />
            </TabsContent>

            <TabsContent value="products">
              <ProductManager />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersCustomersManager />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsManager />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsPanel />
            </TabsContent>

            <TabsContent value="analytics">
              <DashboardStats />
            </TabsContent>

            <TabsContent value="settings">
              <StoreSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
