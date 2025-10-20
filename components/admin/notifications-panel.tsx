"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Package,
  Check,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
  PackageX,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type NotificationType =
  | "low_stock"
  | "sale_pending"
  | "sale_confirmed"
  | "sale_discarded"
  | "order_completed"
  | "order_pending"
  | "order_discarded"
  | "delivery_yes"
  | "delivery_no"
  | "delivery_returned"
  | "delivery_in_transit"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  related_id?: string
  is_read: boolean
  created_at: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const supabase = createBrowserClient()

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100)

        if (error) throw error
        setNotifications(data || [])
      } catch (error) {
        console.error("Error loading notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()

    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from("notifications").delete().eq("id", id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("is_read", false)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />
      case "sale_pending":
      case "order_pending":
        return <Clock className="h-4 w-4" />
      case "sale_confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "sale_discarded":
      case "order_discarded":
        return <XCircle className="h-4 w-4" />
      case "order_completed":
        return <PackageCheck className="h-4 w-4" />
      case "delivery_yes":
        return <CheckCircle className="h-4 w-4" />
      case "delivery_no":
        return <PackageX className="h-4 w-4" />
      case "delivery_returned":
        return <Package className="h-4 w-4" />
      case "delivery_in_transit":
        return <Truck className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "low_stock":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "sale_pending":
      case "order_pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "sale_confirmed":
      case "delivery_yes":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "sale_discarded":
      case "order_discarded":
      case "delivery_no":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "order_completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "delivery_returned":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "delivery_in_transit":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case "low_stock":
        return "Stock Bajo"
      case "sale_pending":
        return "Venta Pendiente"
      case "sale_confirmed":
        return "Venta Confirmada"
      case "sale_discarded":
        return "Venta Descartada"
      case "order_completed":
        return "Pedido Completado"
      case "order_pending":
        return "Pedido Pendiente"
      case "order_discarded":
        return "Pedido Descartado"
      case "delivery_yes":
        return "Entregado"
      case "delivery_no":
        return "No Entregado"
      case "delivery_returned":
        return "Devuelto"
      case "delivery_in_transit":
        return "En Tránsito"
      default:
        return "Notificación"
    }
  }

  const filterNotifications = (category: string) => {
    if (category === "all") return notifications

    const categoryMap: Record<string, NotificationType[]> = {
      stock: ["low_stock"],
      sales: ["sale_pending", "sale_confirmed", "sale_discarded"],
      orders: ["order_pending", "order_completed", "order_discarded"],
      delivery: ["delivery_yes", "delivery_no", "delivery_returned", "delivery_in_transit"],
    }

    return notifications.filter((n) => categoryMap[category]?.includes(n.type))
  }

  const filteredNotifications = filterNotifications(activeTab)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getCategoryCount = (category: string) => {
    return filterNotifications(category).filter((n) => !n.is_read).length
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando notificaciones...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              Todas
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="stock" className="text-xs">
              Stock
              {getCategoryCount("stock") > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getCategoryCount("stock")}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-xs">
              Ventas
              {getCategoryCount("sales") > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getCategoryCount("sales")}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">
              Pedidos
              {getCategoryCount("orders") > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getCategoryCount("orders")}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-xs">
              Entregas
              {getCategoryCount("delivery") > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getCategoryCount("delivery")}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay notificaciones en esta categoría</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.is_read ? "bg-muted/30" : "bg-background"
                    } transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                                title="Marcar como leída"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                              title="Eliminar notificación"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
