"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductPreviewProps {
  name: string
  price: string
  originalPrice?: string
  discount?: string
  category: string
  subcategory?: string
  description: string
  stock: string
  images: string[]
  featured: boolean
}

export function ProductPreview({
  name,
  price,
  originalPrice,
  discount,
  category,
  subcategory,
  description,
  stock,
  images,
  featured,
}: ProductPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const parseFormattedNumber = (value: string): number => {
    const numbers = value.replace(/\D/g, "")
    return numbers ? Number.parseInt(numbers) : 0
  }

  const priceNum = parseFormattedNumber(price)
  const stockNum = parseFormattedNumber(stock)
  const discountNum = discount ? Number.parseFloat(discount) : 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const categoryLabels: Record<string, string> = {
    "juguetes-intimos": "Juguetes Íntimos",
    "lenceria-disfraces": "Lencería y Disfraces",
    "lubricantes-cosmetica": "Lubricantes y Cosmética Íntima",
    "juegos-accesorios": "Juegos y Accesorios",
    "energizantes-estimulantes": "Energizantes y Estimulantes",
    "condones-proteccion": "Condones y Protección",
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Vista Previa del Producto</h3>
            {featured && <Badge className="bg-accent text-accent-foreground">⭐ Destacado</Badge>}
          </div>

          {/* Image Carousel */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={name || "Producto"}
                  fill
                  className="object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === currentImageIndex ? "bg-accent w-4" : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {currentImageIndex + 1}/{images.length}
                    </Badge>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Sin imágenes</div>
            )}
          </div>

          {/* Thumbnail Scroll */}
          {images.length > 1 && (
            <div className="relative group">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-accent scale-105"
                        : "border-transparent hover:border-accent/50"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-3 pt-2">
            <div>
              <h4 className="font-semibold text-foreground text-lg">{name || "Nombre del producto"}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[category] || category}
                  </Badge>
                )}
                {subcategory && (
                  <Badge variant="outline" className="text-xs">
                    {subcategory}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              {discountNum > 0 && originalPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      ${parseFormattedNumber(originalPrice).toLocaleString("es-CO")} COP
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{discountNum}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    ${(parseFormattedNumber(originalPrice) * (1 - discountNum / 100)).toLocaleString("es-CO")} COP
                  </div>
                </>
              ) : (
                <div className="text-2xl font-bold text-accent">
                  ${priceNum > 0 ? priceNum.toLocaleString("es-CO") : "0"} COP
                </div>
              )}
            </div>

            <div>
              <Badge variant={stockNum > 10 ? "default" : stockNum > 0 ? "secondary" : "destructive"}>
                {stockNum > 0 ? `Stock: ${stockNum}` : "Sin stock"}
              </Badge>
            </div>

            {description && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
