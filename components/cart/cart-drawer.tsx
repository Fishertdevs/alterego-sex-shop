"use client"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, Instagram, Star } from "lucide-react"
import Image from "next/image"
import { createBrowserClient } from "@/lib/supabase/client"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)
  const [saleChannel, setSaleChannel] = useState<"whatsapp" | "instagram">("whatsapp")
  const supabase = createBrowserClient()

  const generateWhatsAppMessage = () => {
    const message = `¡Hola! Me interesan los siguientes productos de ALTEREGO:\n\n${items
      .map(
        (item) => `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString("es-CO")} COP`,
      )
      .join("\n")}\n\n*Total: $${total.toLocaleString("es-CO")} COP*\n\n¿Podrían ayudarme con la compra?`

    return encodeURIComponent(message)
  }

  const handleCheckout = async (channel: "whatsapp" | "instagram") => {
    setSaleChannel(channel)

    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
          status: "pending",
          sale_channel: channel,
        })
        .select()
        .single()

      if (error) throw error

      // Crear notificación de nueva venta
      await supabase.from("notifications").insert({
        type: "new_sale",
        title: "Nueva Venta Pendiente",
        message: `Se ha iniciado una venta por ${channel === "whatsapp" ? "WhatsApp" : "Instagram"} por un total de $${total.toLocaleString("es-CO")} COP`,
        related_id: order.id,
      })
    } catch (error) {
      console.error("Error creating order:", error)
    }

    // Redirigir a WhatsApp o Instagram
    if (channel === "whatsapp") {
      const whatsappNumber = "573001234567" // TODO: Obtener de configuración
      const message = generateWhatsAppMessage()
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
    } else {
      window.open("https://www.instagram.com/direct/t/alterego", "_blank")
    }

    onClose()
    setShowSuccessModal(true)
    clearCart()
  }

  const handleConfirmPurchase = () => {
    setShowSuccessModal(false)
    setTimeout(() => {
      setShowReviewPrompt(true)
    }, 500)
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
              <p className="text-base">
                Hemos recibido tu solicitud de compra. Nos comunicaremos contigo próximamente para confirmar los
                detalles.
              </p>
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-accent">${total.toLocaleString("es-CO")} COP</span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={handleConfirmPurchase} className="w-full font-serif">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewPrompt} onOpenChange={setShowReviewPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-serif text-xl">¿Ya recibiste tu pedido?</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="h-8 w-8 text-accent" />
                </div>
              </div>
              <p className="text-base">
                Nos encantaría conocer tu experiencia. ¿Podrías calificar nuestro servicio y producto?
              </p>
              <p className="text-sm text-muted-foreground">
                Tu opinión nos ayuda a mejorar y a que más personas conozcan nuestros productos.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => setShowReviewPrompt(false)} className="w-full font-serif">
              Dejar Reseña
            </Button>
            <Button variant="outline" onClick={() => setShowReviewPrompt(false)} className="w-full font-serif">
              Más Tarde
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
