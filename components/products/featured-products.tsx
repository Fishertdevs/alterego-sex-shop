"use client"

import Link from "next/link"

import { ProductCard } from "./product-card"
import { featuredProducts } from "@/data/products"

export function FeaturedProducts() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
    </section>
  )
}
