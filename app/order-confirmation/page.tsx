"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, MapPin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getOrderById, type Order } from "@/lib/orders"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("orderId")
    const transactionId = searchParams.get("transactionId")

    if (!orderId || !transactionId) {
      router.push("/")
      return
    }

    setTimeout(() => {
      const order = getOrderById(orderId)
      if (order) {
        setOrderDetails(order)
      }
      setLoading(false)
    }, 1000)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando detalles de tu orden...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return null
  }

  const subtotal = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = orderDetails.total - subtotal

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground">
            Tu orden ha sido procesada correctamente. Recibirás un correo de confirmación pronto.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resumen de la Orden
            </CardTitle>
            <CardDescription>Orden #{orderDetails.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Estado</p>
                <p className="font-medium text-green-600 dark:text-green-400">Aprobado</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Fecha</p>
                <p className="font-medium text-foreground">
                  {new Date(orderDetails.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Método de Pago</p>
                <p className="font-medium text-foreground">{orderDetails.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">ID de Transacción</p>
                <p className="font-medium text-foreground">{orderDetails.transactionId}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-foreground mb-3">Productos</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ${(item.price * item.quantity).toLocaleString("es-CO")} COP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">${shipping.toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-accent">${orderDetails.total.toLocaleString("es-CO")} COP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{orderDetails.shippingData.name}</p>
              <p className="text-muted-foreground">{orderDetails.shippingData.email}</p>
              <p className="text-muted-foreground">{orderDetails.shippingData.phone}</p>
              <p className="text-muted-foreground">{orderDetails.shippingData.address}</p>
              <p className="text-muted-foreground">
                {orderDetails.shippingData.city}, {orderDetails.shippingData.department}
              </p>
              <p className="text-muted-foreground">Código Postal: {orderDetails.shippingData.postalCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 border-border bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>Recibirás un correo de confirmación con los detalles de tu orden</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>Tu pedido será procesado y enviado en las próximas 24-48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>Recibirás un número de seguimiento cuando tu pedido sea despachado</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                <span>Puedes revisar el estado de tu orden en tu panel de usuario</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard">Ver Mis Órdenes</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/productos">Seguir Comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
