"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Package,
  CreditCard,
  RotateCcw,
  Heart,
  MapPin,
  ShoppingBag,
  Calendar,
  BarChart3,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Phone,
  Mail,
} from "lucide-react"
import { getOrdersByUserId, type Order } from "@/lib/orders"
import { getFavorites, removeFavorite, type FavoriteProduct } from "@/lib/favorites"
import {
  getPaymentHistory,
  getSavedPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
  type PaymentTransaction,
  type SavedPaymentMethod,
} from "@/lib/payments"
import { getReturnsByUserId, getEligibleOrdersForReturn, type ReturnRequest } from "@/lib/returns"
import { ReturnRequestDialog } from "@/components/returns/return-request-dialog"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { AddPaymentMethodDialog } from "@/components/dashboard/add-payment-method-dialog"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

export default function UserDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([])
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [eligibleOrders, setEligibleOrders] = useState<Order[]>([])
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false)

  const loadUserData = () => {
    if (user && !user.isAdmin) {
      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)

      const userFavorites = getFavorites(user.id)
      setFavorites(userFavorites)

      const userPaymentMethods = getSavedPaymentMethods(user.id)
      setPaymentMethods(userPaymentMethods)

      const userPaymentHistory = getPaymentHistory(user.id)
      setPaymentHistory(userPaymentHistory)

      const userReturns = getReturnsByUserId(user.id)
      setReturns(userReturns)

      const eligible = getEligibleOrdersForReturn(user.id)
      setEligibleOrders(eligible)
    }
  }

  useEffect(() => {
    if (!isLoading && (!user || user.isAdmin)) {
      router.push("/")
      return
    }

    loadUserData()
  }, [user, isLoading, router])

  const handleRemoveFavorite = (productId: string) => {
    if (!user) return
    removeFavorite(productId, user.id)
    setFavorites(getFavorites(user.id))
  }

  const handleAddFavoriteToCart = (favorite: FavoriteProduct) => {
    addToCart({
      id: favorite.id,
      name: favorite.name,
      price: favorite.price,
      image: favorite.image,
      category: favorite.category,
      description: favorite.description,
      inStock: true,
    })
  }

  const handleRemovePaymentMethod = (methodId: string) => {
    if (!user) return
    removePaymentMethod(methodId, user.id)
    setPaymentMethods(getSavedPaymentMethods(user.id))
  }

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    if (!user) return
    setDefaultPaymentMethod(methodId, user.id)
    setPaymentMethods(getSavedPaymentMethods(user.id))
  }

  const handleRequestReturn = (order: Order) => {
    setSelectedOrderForReturn(order)
    setReturnDialogOpen(true)
  }

  const handleReturnSuccess = () => {
    loadUserData()
  }

  const handlePaymentMethodSuccess = () => {
    loadUserData()
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPaymentStatusIcon = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "refunded":
        return <RotateCcw className="h-5 w-5 text-blue-600" />
    }
  }

  const getPaymentStatusText = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      case "refunded":
        return "Reembolsado"
    }
  }

  const getPaymentStatusColor = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "refunded":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    }
  }

  const getReturnStatusIcon = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />
    }
  }

  const getReturnStatusText = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "approved":
        return "Aprobada"
      case "rejected":
        return "Rechazada"
      case "completed":
        return "Completada"
    }
  }

  const getReturnStatusColor = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    }
  }

  const UserStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Pedidos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{orders.length}</div>
          <p className="text-xs text-muted-foreground">
            {orders.length === 0 ? "Aún no tienes pedidos" : "Pedidos realizados"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Gastado</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString("es-CO")} COP
          </div>
          <p className="text-xs text-muted-foreground">En todos tus pedidos</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Favoritos</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{favorites.length}</div>
          <p className="text-xs text-muted-foreground">Productos guardados</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Devoluciones</CardTitle>
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{returns.length}</div>
          <p className="text-xs text-muted-foreground">Solicitudes realizadas</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
                <p className="text-muted-foreground">Bienvenido de vuelta, {user?.name}</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-muted">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pagos
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="returns" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Devoluciones
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <UserStats />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pedidos Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Aún no tienes pedidos</p>
                        <Button asChild variant="outline" className="mt-4 bg-transparent">
                          <Link href="/productos">Explorar Productos</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">Pedido #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              <p className="text-sm font-semibold mt-1">${order.total.toLocaleString("es-CO")} COP</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">Pedido procesado</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(orders[0].createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-accent font-semibold">{orders[0].id}</span>
                        </div>
                      )}
                      {favorites.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">Producto agregado a favoritos</p>
                            <p className="text-sm text-muted-foreground">{favorites[0].name}</p>
                          </div>
                          <span className="text-pink-500 font-semibold">♥</span>
                        </div>
                      )}
                      {returns.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">Solicitud de devolución</p>
                            <p className="text-sm text-muted-foreground">{getReturnStatusText(returns[0].status)}</p>
                          </div>
                          <span className="text-blue-500 font-semibold">{returns[0].id}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Historial de Pedidos</CardTitle>
                  <CardDescription>Todos tus pedidos y su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No tienes pedidos aún</p>
                      <p className="text-muted-foreground mb-6">
                        Explora nuestros productos y realiza tu primera compra
                      </p>
                      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/productos">Explorar Productos</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">Pedido #{order.id}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(order.createdAt).toLocaleDateString("es-CO", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              <p className="text-lg font-bold text-foreground mt-1">
                                ${order.total.toLocaleString("es-CO")} COP
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {item.quantity}x {item.name} - ${item.price.toLocaleString("es-CO")} COP
                              </p>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                            {order.status === "delivered" && (
                              <Button variant="outline" size="sm">
                                Reordenar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Historial de Transacciones</CardTitle>
                  <CardDescription>Todas tus transacciones y pagos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No tienes transacciones aún</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentHistory.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="border border-border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {getPaymentStatusIcon(transaction.status)}
                            <div>
                              <p className="font-medium text-foreground">
                                Pago #{transaction.transactionId.substring(0, 12)}...
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Pedido #{transaction.orderId} • {transaction.paymentMethod}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString("es-CO", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPaymentStatusColor(transaction.status)}>
                              {getPaymentStatusText(transaction.status)}
                            </Badge>
                            <p className="text-lg font-bold text-foreground mt-1">
                              ${transaction.amount.toLocaleString("es-CO")} COP
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Métodos de Pago Guardados</CardTitle>
                  <CardDescription>Gestiona tus métodos de pago guardados</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No tienes métodos de pago guardados</p>
                      <Button
                        onClick={() => setAddPaymentMethodOpen(true)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Agregar Método de Pago
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="border border-border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                              {method.type === "card" ? (
                                <>
                                  <p className="font-medium text-foreground">
                                    {method.brand} •••• {method.last4}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Tarjeta de crédito</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium text-foreground">PSE - {method.bankName}</p>
                                  <p className="text-sm text-muted-foreground">Débito bancario</p>
                                </>
                              )}
                              {method.isDefault && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  Predeterminado
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Predeterminar
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={() => setAddPaymentMethodOpen(true)}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Agregar Método de Pago
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="returns" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Mis Devoluciones</CardTitle>
                  <CardDescription>Solicitudes de devolución y su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {returns.length === 0 ? (
                    <div className="text-center py-8">
                      <RotateCcw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No tienes devoluciones</p>
                      <p className="text-muted-foreground mb-6">
                        {eligibleOrders.length > 0
                          ? "Puedes solicitar una devolución para tus pedidos entregados"
                          : "Solo puedes devolver pedidos que ya han sido entregados"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {returns.map((returnRequest) => (
                        <div key={returnRequest.id} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getReturnStatusIcon(returnRequest.status)}
                              <div>
                                <p className="font-medium text-foreground">Devolución #{returnRequest.id}</p>
                                <p className="text-sm text-muted-foreground">Pedido #{returnRequest.orderId}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(returnRequest.createdAt).toLocaleDateString("es-CO", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getReturnStatusColor(returnRequest.status)}>
                                {getReturnStatusText(returnRequest.status)}
                              </Badge>
                              <p className="text-lg font-bold text-foreground mt-1">
                                ${returnRequest.refundAmount.toLocaleString("es-CO")} COP
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">Productos:</p>
                            {returnRequest.items.map((item, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {item.quantity}x {item.productName}
                              </p>
                            ))}
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium text-foreground mb-1">Motivo:</p>
                            <p className="text-sm text-muted-foreground">{returnRequest.description}</p>
                          </div>

                          {returnRequest.trackingNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Número de seguimiento: {returnRequest.trackingNumber}
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                            {returnRequest.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                Cancelar Solicitud
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {eligibleOrders.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Pedidos Elegibles para Devolución</CardTitle>
                    <CardDescription>Pedidos entregados que puedes devolver</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {eligibleOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">Pedido #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} producto{order.items.length > 1 ? "s" : ""} •{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-semibold text-foreground mt-1">
                              ${order.total.toLocaleString("es-CO")} COP
                            </p>
                          </div>
                          <Button
                            onClick={() => handleRequestReturn(order)}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            Solicitar Devolución
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Mis Favoritos</CardTitle>
                  <CardDescription>Productos que has guardado para más tarde</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No tienes favoritos aún</p>
                      <p className="text-muted-foreground mb-6">Explora nuestros productos y guarda tus favoritos</p>
                      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/productos">Explorar Productos</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((product) => (
                        <div key={product.id} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="relative h-32 w-full">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-lg font-bold text-accent">
                              ${product.price.toLocaleString("es-CO")} COP
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                              onClick={() => handleAddFavoriteToCart(product)}
                            >
                              Agregar al Carrito
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFavorite(product.id)}
                              className="bg-transparent"
                            >
                              <Heart className="h-4 w-4 fill-current text-accent" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Información Personal</CardTitle>
                  <CardDescription>Tu información de perfil y configuración</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                      <p className="text-foreground font-medium">{user?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-foreground font-medium">{user?.email}</p>
                      </div>
                    </div>
                    {user?.phone && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-foreground font-medium">{user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {user?.address ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Dirección de Envío</label>
                      <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-foreground font-medium">{user.address.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.address.city}, {user.address.state}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.address.zipCode}, {user.address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Dirección de envío no configurada</span>
                    </div>
                  )}

                  <Button
                    onClick={() => setEditProfileOpen(true)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedOrderForReturn && (
        <ReturnRequestDialog
          order={selectedOrderForReturn}
          userId={user!.id}
          open={returnDialogOpen}
          onOpenChange={setReturnDialogOpen}
          onSuccess={handleReturnSuccess}
        />
      )}

      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />

      {addPaymentMethodOpen && (
        <AddPaymentMethodDialog
          isOpen={addPaymentMethodOpen}
          onClose={() => setAddPaymentMethodOpen(false)}
          onSuccess={handlePaymentMethodSuccess}
        />
      )}
    </main>
  )
}
