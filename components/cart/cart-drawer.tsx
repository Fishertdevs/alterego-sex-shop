"use client"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Instagram } from "lucide-react"
import Image from "next/image"
import { createBrowserClient } from "@/lib/supabase/client"
import { useStoreSettings } from "@/hooks/use-store-settings"
import { ReviewFormModal } from "@/components/reviews/review-form-modal"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const { settings } = useStoreSettings()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)
  const [saleChannel, setSaleChannel] = useState<"whatsapp" | "instagram">("whatsapp")
  const [purchaseTotal, setPurchaseTotal] = useState(0)
  const supabase = createBrowserClient()

  const generateWhatsAppMessage = () => {
    let message = "¡Hola! 👋 Bienvenido a *ALTEREGO*\n\n"
    message += "Estoy interesado en comprar los siguientes productos:\n\n"

    let subtotalSinDescuento = 0
    let descuentoTotal = 0

    items.forEach((item, index) => {
      const precioUnitario = item.price
      const precioOriginal = item.original_price || item.price
      const descuento = item.discount || 0
      const subtotal = precioUnitario * item.quantity
      const subtotalOriginal = precioOriginal * item.quantity

      message += `🛍️ *${item.name}*\n`
      message += `   • Cantidad: ${item.quantity}\n`

      if (descuento > 0) {
        message += `   • Precio unitario: $${precioUnitario.toLocaleString("es-CO")} COP\n`
        message += `   • Descuento: ${descuento}%\n`
        message += `   • Precio original: $${precioOriginal.toLocaleString("es-CO")} COP\n`
        descuentoTotal += subtotalOriginal - subtotal
      } else {
        message += `   • Precio unitario: $${precioUnitario.toLocaleString("es-CO")} COP\n`
      }

      message += `   • Subtotal: $${subtotal.toLocaleString("es-CO")} COP\n`

      if (index < items.length - 1) {
        message += "\n"
      }

      subtotalSinDescuento += subtotalOriginal
    })

    message += "\n━━━━━━━━━━━━━━━━━━━━\n\n"

    if (descuentoTotal > 0) {
      message += `💰 *Subtotal:* $${subtotalSinDescuento.toLocaleString("es-CO")} COP\n`
      message += `💸 *Descuento total:* -$${descuentoTotal.toLocaleString("es-CO")} COP\n`
      message += `💵 *Total a pagar:* $${total.toLocaleString("es-CO")} COP\n\n`
    } else {
      message += `💵 *Total a pagar:* $${total.toLocaleString("es-CO")} COP\n\n`
    }

    message += "¿Están disponibles estos productos? 🙏"

    return encodeURIComponent(message)
  }

  const handleCheckout = async (channel: "whatsapp" | "instagram") => {
    setSaleChannel(channel)
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
          notes: `Orden iniciada por ${channel === "whatsapp" ? "WhatsApp" : "Instagram"}. Información del cliente pendiente.`,
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
        message: `Se ha iniciado una venta por ${channel === "whatsapp" ? "WhatsApp" : "Instagram"} por un total de $${total.toLocaleString("es-CO")} COP`,
        related_id: order.id,
      })

      console.log("[v0] Order process completed successfully")

      clearCart()

      if (channel === "whatsapp") {
        const whatsappNumber = settings?.store_phone || "573168192054"
        const cleanNumber = whatsappNumber.replace(/[\s\-()+ ]/g, "")
        const message = generateWhatsAppMessage()
        console.log("[v0] Redirecting to WhatsApp:", cleanNumber)
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank")
      } else {
        const instagramUrl = settings?.instagram_url || "https://www.instagram.com/alterego"
        console.log("[v0] Redirecting to Instagram:", instagramUrl)
        window.open(instagramUrl, "_blank")
      }

      onClose()
      setShowSuccessModal(true)
    } catch (error) {
      console.error("[v0] Error in checkout process:", error)
      alert("Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.")
      return
    }
  }

  const handleConfirmPurchase = () => {
    setShowSuccessModal(false)
    setTimeout(() => {
      setShowReviewPrompt(true)
    }, 300)
  }

  const handleOpenReviewForm = () => {
    setShowReviewPrompt(false)
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
                      onClick={() => handleCheckout("whatsapp")}
                      className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-serif"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Finalizar por WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleCheckout("instagram")}
                      className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-serif"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Finalizar por Instagram
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

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-serif text-2xl">¡Gracias por tu compra!</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="text-base">
                Hemos recibido tu solicitud de compra. Nos comunicaremos contigo próximamente para confirmar los
                detalles.
              </div>
              <div className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="font-bold text-accent text-lg">${purchaseTotal.toLocaleString("es-CO")} COP</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={handleConfirmPurchase} className="w-full font-serif">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ReviewFormModal
        isOpen={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
        onSuccess={() => {
          setShowReviewPrompt(false)
        }}
      />
    </>
  )
}
