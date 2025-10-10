"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart, type Product } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { toggleFavorite, isFavorite } from "@/lib/favorites"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (user && !user.isAdmin) {
      setIsLiked(isFavorite(product.id, user.id))
    }
  }, [user, product.id])

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    addToCart(product)
    setIsAdding(false)
  }

  const handleToggleFavorite = () => {
    if (!user || user.isAdmin) {
      alert("Debes iniciar sesión como usuario para agregar favoritos")
      return
    }

    const newIsLiked = toggleFavorite(product, user.id)
    setIsLiked(newIsLiked)
  }

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
          {!product.inStock && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-fade-in-up">
              Agotado
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 transition-all duration-300 ${
              isLiked ? "text-accent scale-110" : "text-white hover:text-accent"
            } hover:scale-110 backdrop-blur-sm bg-black/20`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${isLiked ? "fill-current scale-110" : ""}`} />
          </Button>
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
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent">${product.price.toLocaleString("es-CO")} COP</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full transition-all duration-300 ${
            isAdding ? "bg-accent/70 animate-pulse" : "bg-accent hover:bg-accent/90 hover-glow"
          } text-accent-foreground disabled:opacity-50`}
        >
          <ShoppingCart
            className={`h-4 w-4 mr-2 transition-transform duration-300 ${isAdding ? "animate-spin" : ""}`}
          />
          {isAdding ? "Agregando..." : product.inStock ? "Agregar al Carrito" : "No Disponible"}
        </Button>
      </CardFooter>
    </Card>
  )
}
