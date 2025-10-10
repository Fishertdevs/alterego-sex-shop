"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"

// Category data structure
const categoriesData = {
  "juguetes-intimos": {
    title: "Juguetes Íntimos",
    description: "Productos de alta calidad para el placer personal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B3E3ADDF7-1CCF-4CE5-87C3-A24D873D02DD%7D-7oPo5gHYiriJl4VW95u0xlWUbqJSly.png",
    subcategories: [
      "Dildos y Vibradores",
      "Balas y Huevos vibradores",
      "Anillos vibradores y Cockrings",
      "Plugs y Estimulación anal",
      "Masturbadores y Máquinas sexuales",
    ],
  },
  "lenceria-disfraces": {
    title: "Lencería y Disfraces",
    description: "Piezas exclusivas que realzan tu sensualidad",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B04FB5839-619B-416B-A582-FC1F21C4A92F%7D-2NwgwXQKMKCyDcyurEcoerdohJT6sa.png",
    subcategories: [
      "Conjuntos y Bodys",
      "Tangas y Panties",
      "Babydolls y Camisones",
      "Disfraces eróticos",
      "Accesorios sensuales",
    ],
  },
  "lubricantes-cosmetica": {
    title: "Lubricantes y Cosmética Íntima",
    description: "Productos para el cuidado y bienestar personal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BD36C759D-5C51-4774-A2C1-8975EDDB92E9%7D-Yo0scvHl5Mi9W8yIv5cUOB2rHoGt0s.png",
    subcategories: [
      "Lubricantes clásicos y híbridos",
      "Lubricantes con sabor y efecto",
      "Lubricantes y geles anales",
      "Cremas y geles estimulantes",
      "Higiene y cuidado íntimo",
    ],
  },
  "juegos-accesorios": {
    title: "Juegos y Accesorios",
    description: "Complementos para una experiencia completa",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BA98C0734-C5DA-4FA0-A77C-8AD1209D1B44%7D-3rn4tyUJdHEnEjVJy7H9aC3A99Ye6y.png",
    subcategories: [
      "Juegos de mesa eróticos",
      "Cartas y barajas sensuales",
      "Dados eróticos",
      "Llaveros y artículos divertidos",
      "Kits y sets de juego",
    ],
  },
  "energizantes-estimulantes": {
    title: "Energizantes y Estimulantes",
    description: "Suplementos y productos para potenciar tu energía",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B6EA7D111-3268-49AE-BC3C-D2F6B526D46E%7D-jhw7Pm1x6gEn43kd8VXQdFjWDOD3Sf.png",
    subcategories: [
      "Cápsulas y pastillas",
      "Energizantes líquidos",
      "Gummies y suplementos",
      "Afrodisíacos",
      "Kits energizantes",
    ],
  },
  "condones-proteccion": {
    title: "Condones y Protección",
    description: "Protección segura y placentera para tus encuentros",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B41C82DCE-715C-4D51-A633-E779F0301DBC%7D-OoWXwrWL3iy6wivD23Q2YkMKtnYREM.png",
    subcategories: [
      "Condones clásicos",
      "Condones de sabores y colores",
      "Condones con texturas y efectos",
      "Condones femeninos",
      "Condones premium",
    ],
  },
}

// Mock products data - replace with real data later
const mockProducts = [
  {
    id: 1,
    name: "Producto Ejemplo 1",
    price: 29.99,
    image: "/producto-intimo-elegante.jpg",
    subcategory: "Dildos y Vibradores",
  },
  {
    id: 2,
    name: "Producto Ejemplo 2",
    price: 39.99,
    image: "/producto-intimo-moderno.jpg",
    subcategory: "Dildos y Vibradores",
  },
  {
    id: 3,
    name: "Producto Ejemplo 3",
    price: 24.99,
    image: "/producto-intimo-premium.jpg",
    subcategory: "Balas y Huevos vibradores",
  },
  {
    id: 4,
    name: "Producto Ejemplo 4",
    price: 49.99,
    image: "/producto-intimo-lujo.jpg",
    subcategory: "Balas y Huevos vibradores",
  },
]

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  const categoryData = categoriesData[params.categoria as keyof typeof categoriesData]

  if (!categoryData) {
    notFound()
  }

  const [selectedSubcategory, setSelectedSubcategory] = useState(categoryData.subcategories[0])

  // Filter products by selected subcategory
  const filteredProducts = mockProducts.filter((product) => product.subcategory === selectedSubcategory)

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link href="/productos" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>

          {/* Category header */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <div className="relative h-64 bg-muted/20 rounded-lg overflow-hidden">
                  <img
                    src={categoryData.image || "/placeholder.svg"}
                    alt={categoryData.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                  {categoryData.title}
                </h1>
                <p className="text-xl text-muted-foreground text-pretty">{categoryData.description}</p>
              </div>
            </div>
          </div>

          {/* Horizontal tabs for subcategories */}
          <div className="mb-8 border-b border-border">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categoryData.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => setSelectedSubcategory(subcategory)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all ${
                    selectedSubcategory === subcategory
                      ? "bg-accent text-accent-foreground border-b-2 border-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {selectedSubcategory}
              <span className="text-muted-foreground text-lg ml-2">({filteredProducts.length} productos)</span>
            </h2>

            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  null
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No hay productos disponibles en esta subcategoría por el momento.
                </p>
                <p className="text-muted-foreground text-sm mt-2">Pronto agregaremos nuevos productos.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
