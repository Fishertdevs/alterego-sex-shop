"use client"

import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ProductosPage() {
  const categoryCards = [
    {
      title: "Juguetes Íntimos",
      slug: "juguetes-intimos",
      description: "Productos de alta calidad para el placer personal",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B7008DE1E-75EA-4173-9081-5F57D6F769CA%7D-7zIeRSAWj18gR2rUMKN17XMRe04Y2w.png",
      badge: "Más Popular",
      products: 50,
      subcategories: [
        "Dildos y Vibradores",
        "Balas y Huevos vibradores",
        "Anillos vibradores y Cockrings",
        "Plugs y Estimulación anal",
        "Masturbadores y Máquinas sexuales",
      ],
    },
    {
      title: "Lencería y Disfraces",
      slug: "lenceria-disfraces",
      description: "Piezas exclusivas que realzan tu sensualidad",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B04FB5839-619B-416B-A582-FC1F21C4A92F%7D-2NwgwXQKMKCyDcyurEcoerdohJT6sa.png",
      badge: "Nuevo",
      products: 50,
      subcategories: [
        "Conjuntos y Bodys",
        "Tangas y Panties",
        "Babydolls y Camisones",
        "Disfraces eróticos",
        "Accesorios sensuales",
      ],
    },
    {
      title: "Lubricantes y Cosmética Íntima",
      slug: "lubricantes-cosmetica",
      description: "Productos para el cuidado y bienestar personal",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BD36C759D-5C51-4774-A2C1-8975EDDB92E9%7D-Yo0scvHl5Mi9W8yIv5cUOB2rHoGt0s.png",
      badge: "Recomendado",
      products: 50,
      subcategories: [
        "Lubricantes clásicos y híbridos",
        "Lubricantes con sabor y efecto",
        "Lubricantes y geles anales",
        "Cremas y geles estimulantes",
        "Higiene y cuidado íntimo",
      ],
    },
    {
      title: "Juegos y Accesorios",
      slug: "juegos-accesorios",
      description: "Complementos para una experiencia completa",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BA98C0734-C5DA-4FA0-A77C-8AD1209D1B44%7D-3rn4tyUJdHEnEjVJy7H9aC3A99Ye6y.png",
      badge: "Exclusivo",
      products: 50,
      subcategories: [
        "Juegos de mesa eróticos",
        "Cartas y barajas sensuales",
        "Dados eróticos",
        "Llaveros y artículos divertidos",
        "Kits y sets de juego",
      ],
    },
    {
      title: "Energizantes y Estimulantes",
      slug: "energizantes-estimulantes",
      description: "Suplementos y productos para potenciar tu energía",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B6EA7D111-3268-49AE-BC3C-D2F6B526D46E%7D-jhw7Pm1x6gEn43kd8VXQdFjWDOD3Sf.png",
      badge: "Potente",
      products: 50,
      subcategories: [
        "Cápsulas y pastillas",
        "Energizantes líquidos",
        "Gummies y suplementos",
        "Afrodisíacos",
        "Kits energizantes",
      ],
    },
    {
      title: "Condones y Protección",
      slug: "condones-proteccion",
      description: "Protección segura y placentera para tus encuentros",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7B41C82DCE-715C-4D51-A633-E779F0301DBC%7D-OoWXwrWL3iy6wivD23Q2YkMKtnYREM.png",
      badge: "Esencial",
      products: 50,
      subcategories: [
        "Condones clásicos",
        "Condones de sabores y colores",
        "Condones con texturas y efectos",
        "Condones femeninos",
        "Condones premium",
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-6 text-balance md:text-8xl">
              Nuestros <span className="text-accent">Productos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Descubre nuestra cuidada selección de productos íntimos de las mejores marcas, diseñados para brindarte
              experiencias únicas y placenteras.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {categoryCards.map((category, index) => (
              <Card
                key={index}
                className="hover-scale animate-fade-in-up border-border/50 hover:border-accent/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-64 bg-muted/20">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{category.badge}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{category.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{category.products} productos</span>
                    <Link href={`/productos/${category.slug}`}>
                      <Button variant="outline" size="sm" className="hover-scale bg-transparent">
                        Ver Más <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
