"use client"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { LoginModal } from "@/components/auth/login-modal"
import { useRouter } from "next/navigation"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    onClose()
    router.push("/checkout")
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    onClose()
    setTimeout(() => {
      router.push("/checkout")
    }, 300)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg bg-background border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-foreground">
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
                  <p className="text-muted-foreground">Tu carrito está vacío</p>
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
                          <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
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
                    <span className="text-lg font-semibold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-accent">${total.toLocaleString("es-CO")} COP</span>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {user ? "Proceder al Pago" : "Iniciar Sesión para Pagar"}
                    </Button>
                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                      Vaciar Carrito
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
