"use client"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import Image from "next/image"
import { createBrowserClient } from "@/lib/supabase/client"
import { useStoreSettings } from "@/hooks/use-store-settings"
import { ServiceSurveyModal } from "@/components/reviews/service-survey-modal"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const { settings } = useStoreSettings()
  const [showServiceSurvey, setShowServiceSurvey] = useState(false)
  const [purchaseTotal, setPurchaseTotal] = useState(0)
  const supabase = createBrowserClient()

  const generateWhatsAppMessage = () => {
    let message = "¡Hola! Te saluda el equipo de *ALTERƎGO*\n\n"
    message += "Hemos recibido tu solicitud con los siguientes productos:\n\n"

    items.forEach((item, index) => {
      const subtotal = item.price * item.quantity
      const productUrl = `https://www.alterego-store.com.co/productos/${item.category}?producto=${item.id}`

      message += `${index + 1}. *${item.name}*\n`
      message += `   Cantidad: ${item.quantity} ${item.quantity === 1 ? "unidad" : "unidades"}\n`
      message += `   Precio unitario: $${item.price.toLocaleString("es-CO")} COP\n`
      message += `   Subtotal: $${subtotal.toLocaleString("es-CO")} COP\n`
      message += `   Ver producto: ${productUrl}\n\n`
    })

    message += "━━━━━━━━━━━━━━━━━━━━\n\n"
    message += "*Resumen del pedido:*\n"
    message += `Total a pagar: *$${total.toLocaleString("es-CO")} COP*\n`
    message += `Envíos nacionales por Coordinadora.\n\n`
    message += "Si prefieres otra transportadora, indícalo en este chat y ajustaremos tu envío.\n\n"
    message += "*Métodos de pago disponibles:* Nequi, Daviplata, PSE y Tarjeta.\n\n"
    message += "Gracias por elegir *ALTERƎGO*, donde el placer comienza con la imaginación."

    return encodeURIComponent(message)
  }

  const handleCheckout = async () => {
    setPurchaseTotal(total)

    try {
      console.log("[v0] Creating order without updating stock")

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          products: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            original_price: item.original_price || item.price,
          })),
          total_product_cost: total,
          order_status: "pending",
          payment_status: "pending",
          payment_method: "nequi",
          shipping_type: "contraentrega",
          customer_name: "Cliente Pendiente",
          customer_email: "pendiente@alterego.com",
          customer_phone: "Por confirmar",
          customer_address: "Por confirmar",
          customer_department: "Por confirmar",
          customer_municipality: "Por confirmar",
          shipping_cost: 0,
          delivered: false,
          notes: "Orden iniciada por WhatsApp. Información del cliente pendiente.",
        })
        .select()
        .single()

      if (error) {
        console.error("[v0] Error creating order:", error.message)
        throw error
      }

      console.log("[v0] Order created successfully:", order.id)

      await supabase.from("notifications").insert({
        type: "new_sale",
        title: "Nueva Venta Pendiente",
        message: `Se ha iniciado una venta por WhatsApp por un total de $${total.toLocaleString("es-CO")} COP`,
        related_id: order.id,
      })

      console.log("[v0] Order process completed successfully")

      clearCart()

      const whatsappNumber = settings?.store_phone || "+57 3133462402"
      const cleanNumber = whatsappNumber.replace(/[\s\-()+ ]/g, "")
      const message = generateWhatsAppMessage()

      console.log("[v0] Cart - Raw WhatsApp number:", whatsappNumber)
      console.log("[v0] Cart - Cleaned WhatsApp number:", cleanNumber)
      console.log("[v0] Cart - WhatsApp URL:", `https://wa.me/${cleanNumber}?text=${message}`)

      window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank", "noopener,noreferrer")

      onClose()
      setTimeout(() => {
        setShowServiceSurvey(true)
      }, 500)
    } catch (error) {
      console.error("[v0] Error in checkout process:", error)
      alert("Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.")
      return
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg bg-background border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-foreground font-serif">
              <ShoppingBag className="h-5 w-5" />
              Carrito de Compras
              {items.length > 0 && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {items.length}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-serif">Tu carrito está vacío</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate font-serif">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">${item.price.toLocaleString("es-CO")} COP</p>
                          <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground font-serif">Total:</span>
                    <span className="text-lg font-bold text-accent">${total.toLocaleString("es-CO")} COP</span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-black hover:bg-black/90 text-white border border-[#D4AF37] font-serif"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Finalizar por WhatsApp
                    </Button>
                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent font-serif">
                      Vaciar Carrito
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <ServiceSurveyModal
        isOpen={showServiceSurvey}
        onClose={() => setShowServiceSurvey(false)}
        onSuccess={() => {
          setShowServiceSurvey(false)
        }}
      />
    </>
  )
}
