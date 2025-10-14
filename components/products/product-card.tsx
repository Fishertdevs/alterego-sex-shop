"use client"
import Image from "next/image"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useCart, type Product } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    if (value >= 1 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      alert("Este producto no está disponible en este momento. Pronto tendremos más unidades.")
      return
    }

    if (quantity > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles de este producto`)
      return
    }

    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    setIsAdding(false)
    setQuantity(1)
  }

  const totalPrice = product.price * quantity

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 hover-scale bg-card border-border hover:border-accent/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.stock <= 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-fade-in-up">
              Agotado
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs animate-slide-in-right">
              {product.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-accent">${product.price.toLocaleString("es-CO")} COP</span>
              {quantity > 1 && (
                <div className="text-xs text-muted-foreground">Total: ${totalPrice.toLocaleString("es-CO")} COP</div>
              )}
            </div>
            <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
              {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
            </Badge>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="h-8 w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground">Cantidad</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAdding}
          className={`w-full transition-all duration-300 ${
            isAdding ? "bg-accent/70 animate-pulse" : "bg-accent hover:bg-accent/90 hover-glow"
          } text-accent-foreground disabled:opacity-50`}
        >
          <ShoppingCart
            className={`h-4 w-4 mr-2 transition-transform duration-300 ${isAdding ? "animate-spin" : ""}`}
          />
          {isAdding ? "Agregando..." : product.stock > 0 ? "Agregar al Carrito" : "Pronto tendremos más"}
        </Button>
      </CardFooter>
    </Card>
  )
}
