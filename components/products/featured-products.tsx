"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { getFeaturedProducts, convertSupabaseToProduct } from "@/lib/supabase-storage"
import type { Product } from "@/contexts/cart-context"

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true)
      const products = await getFeaturedProducts()
      const convertedProducts = products.map(convertSupabaseToProduct)
      setFeaturedProducts(convertedProducts)
      setLoading(false)
    }

    loadFeaturedProducts()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-in-left">
            <h2 className="text-3xl font-bold text-foreground mb-4">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada pieza de nuestra colección premium está diseñada para llevar tu intimidad a otro nivel
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-in-left">
            <h2 className="text-3xl font-bold text-foreground mb-4">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada pieza de nuestra colección premium está diseñada para llevar tu intimidad a otro nivel
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">Aún no hay productos destacados, estamos trabajando en ello</p>
            <Link
              href="/productos"
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition-all duration-300 hover-scale hover-glow"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-in-left">
          <h2 className="text-3xl font-bold text-foreground mb-4">Productos Destacados</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada pieza de nuestra colección premium está diseñada para llevar tu intimidad a otro nivel
          </p>
        </div>

        <div className="relative group">
          {/* Botón de navegación izquierda */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Contenedor del carrusel */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-6 px-2">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex-none w-80 animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Botón de navegación derecha */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <Link
            href="/productos"
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition-all duration-300 hover-scale hover-glow"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
