"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { getProductById, type SupabaseProduct } from "@/lib/supabase-storage"
import { notFound } from "next/navigation"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<SupabaseProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      const productData = await getProductById(params.id)
      if (!productData) {
        notFound()
      }
      setProduct(productData)
      setLoading(false)
    }
    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    notFound()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

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
      alert("Este producto no está disponible en este momento.")
      return
    }

    if (quantity > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles`)
      return
    }

    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.svg",
      category: product.category,
      description: product.description,
      stock: product.stock,
      featured: product.featured,
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct)
    }

    setIsAdding(false)
    setQuantity(1)
  }

  const totalPrice = product.price * quantity
  const categoryLabels: Record<string, string> = {
    "juguetes-intimos": "Juguetes Íntimos",
    "lenceria-disfraces": "Lencería y Disfraces",
    "lubricantes-cosmetica": "Lubricantes y Cosmética Íntima",
    "juegos-accesorios": "Juegos y Accesorios",
    "energizantes-estimulantes": "Energizantes y Estimulantes",
    "condones-proteccion": "Condones y Protección",
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/productos/${product.category}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a {categoryLabels[product.category] || product.category}
          </Link>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                {product.images.length > 0 ? (
                  <>
                    <Image
                      src={product.images[currentImageIndex] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <Badge className="absolute top-4 right-4" variant="secondary">
                          {currentImageIndex + 1}/{product.images.length}
                        </Badge>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Sin imágenes</div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                          index === currentImageIndex
                            ? "border-accent scale-105"
                            : "border-transparent hover:border-accent/50"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Vista ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{categoryLabels[product.category] || product.category}</Badge>
                  {product.subcategory && <Badge variant="outline">{product.subcategory}</Badge>}
                  {product.featured && <Badge className="bg-accent text-accent-foreground">⭐ Destacado</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
                <div className="space-y-2">
                  {product.discount && product.original_price ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.original_price.toLocaleString("es-CO")} COP
                        </span>
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      </div>
                      <div className="text-4xl font-bold text-accent">${product.price.toLocaleString("es-CO")} COP</div>
                      <p className="text-sm text-muted-foreground">
                        Ahorras: ${(product.original_price - product.price).toLocaleString("es-CO")} COP
                      </p>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-accent">${product.price.toLocaleString("es-CO")} COP</div>
                  )}
                </div>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Disponibilidad:</span>
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                    </Badge>
                  </div>
                  {product.stock > 0 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cantidad:</label>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={incrementQuantity}
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {quantity > 1 && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm font-medium">Total:</span>
                          <span className="text-xl font-bold text-accent">
                            ${totalPrice.toLocaleString("es-CO")} COP
                          </span>
                        </div>
                      )}
                      <Button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        size="lg"
                      >
                        <ShoppingCart className={`h-5 w-5 mr-2 ${isAdding ? "animate-spin" : ""}`} />
                        {isAdding ? "Agregando..." : "Agregar al Carrito"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
