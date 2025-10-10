"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Package, CreditCard, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { ShippingForm, type ShippingData } from "@/components/checkout/shipping-form"
import { PaymentMethod, type PaymentData } from "@/components/checkout/payment-method"
import { saveOrder } from "@/lib/orders"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<ShippingData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    if (items.length === 0 && !isLoading) {
      router.push("/productos")
    }
  }, [user, isLoading, items, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!user || items.length === 0) {
    return null
  }

  const steps = [
    { number: 1, title: "Resumen", icon: ShoppingBag },
    { number: 2, title: "Envío", icon: Package },
    { number: 3, title: "Pago", icon: CreditCard },
    { number: 4, title: "Confirmación", icon: CheckCircle2 },
  ]

  const subtotal = total
  const envio = 15000
  const totalFinal = subtotal + envio

  const handleShippingContinue = (data: ShippingData) => {
    setShippingData(data)
    setCurrentStep(3)
  }

  const handlePaymentContinue = async (data: PaymentData) => {
    setPaymentData(data)
    setIsProcessing(true)

    try {
      // Crear orden
      const orderResponse = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items,
          shippingData,
          total: totalFinal,
        }),
      })

      const orderResult = await orderResponse.json()

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Error al crear la orden")
      }

      const newOrderId = orderResult.orderId
      setOrderId(newOrderId)

      // Procesar pago según el método seleccionado
      let paymentResponse
      if (data.method === "card") {
        paymentResponse = await fetch("/api/payment/card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrderId,
            cardData: data.cardData,
          }),
        })
      } else {
        paymentResponse = await fetch("/api/payment/pse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrderId,
            pseData: data.pseData,
          }),
        })
      }

      const paymentResult = await paymentResponse.json()

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Error al procesar el pago")
      }

      const completeOrder = {
        ...orderResult.order,
        transactionId: paymentResult.transactionId,
        paymentMethod: data.method === "card" ? "Tarjeta de Crédito" : "PSE",
        status: "processing" as const,
        updatedAt: new Date().toISOString(),
      }
      saveOrder(completeOrder)

      // Limpiar carrito y redirigir a confirmación
      clearCart()
      router.push(
        `/order-confirmation?orderId=${newOrderId}&transactionId=${paymentResult.transactionId}&method=${data.method}`,
      )
    } catch (error) {
      console.error("[v0] Error en el proceso de pago:", error)
      alert(error instanceof Error ? error.message : "Error al procesar el pago. Por favor, intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToResumen = () => {
    setCurrentStep(1)
  }

  const handleBackToShipping = () => {
    setCurrentStep(2)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="bg-card border-border p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
              <p className="text-lg font-semibold text-foreground">Procesando tu pago...</p>
              <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
            </div>
          </Card>
        </div>
      )}

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep >= step.number
                          ? "bg-accent border-accent text-accent-foreground"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${
                        currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        currentStep > step.number ? "bg-accent" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Resumen de tu Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              ${(item.price * item.quantity).toLocaleString("es-CO")} COP
                            </p>
                            <p className="text-sm text-muted-foreground">${item.price.toLocaleString("es-CO")} c/u</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Continuar a Envío
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && <ShippingForm onContinue={handleShippingContinue} onBack={handleBackToResumen} />}

              {currentStep === 3 && <PaymentMethod onContinue={handlePaymentContinue} onBack={handleBackToShipping} />}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-foreground">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({items.length} productos)</span>
                      <span className="text-foreground font-medium">${subtotal.toLocaleString("es-CO")} COP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-foreground font-medium">${envio.toLocaleString("es-CO")} COP</span>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-accent">${totalFinal.toLocaleString("es-CO")} COP</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Badge
                      variant="secondary"
                      className="w-full justify-center py-2 bg-accent/10 text-accent border-accent/20"
                    >
                      Envío discreto garantizado
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="w-full justify-center py-2 bg-accent/10 text-accent border-accent/20"
                    >
                      Pago 100% seguro
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
