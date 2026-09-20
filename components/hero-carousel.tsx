"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { getFeaturedProducts, convertSupabaseToProduct } from "@/lib/supabase-storage"

type ProductSlide = {
  kind: "product"
  id: string
  eyebrow: string
  name: string
  description: string
  price: number
  original_price?: number
  discount?: number
  image: string
  href: string
}

type PromoSlide = {
  kind: "promo"
  id: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  href: string
}

type Slide = ProductSlide | PromoSlide

const AUTO_PLAY_MS = 6000
const MAX_SLIDES = 5

function buildSlides(products: ReturnType<typeof convertSupabaseToProduct>[]): Slide[] {
  if (products.length === 0) return []

  const offers = [...products]
    .filter((p) => (p.discount ?? 0) > 0)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))

  const top = products[0]
  const usedIds = new Set<string>()
  const slides: Slide[] = []

  // 1. Producto top
  slides.push({
    kind: "product",
    id: `top-${top.id}`,
    eyebrow: "Lo más deseado",
    name: top.name,
    description: top.description,
    price: top.price,
    original_price: top.original_price,
    discount: top.discount,
    image: top.image,
    href: "/productos",
  })
  usedIds.add(top.id)

  // 2. Slide promocional de ofertas
  slides.push({
    kind: "promo",
    id: "promo-ofertas",
    eyebrow: "Ofertas",
    title: "Conoce nuestras ofertas",
    subtitle: "Descuentos exclusivos, seleccionados para despertar tus sentidos.",
    cta: "Ver ofertas",
    href: "/productos",
  })

  // 3-4. Mejores ofertas en producto
  for (const offer of offers) {
    if (slides.length >= MAX_SLIDES - 1) break
    if (usedIds.has(offer.id)) continue
    slides.push({
      kind: "product",
      id: `offer-${offer.id}`,
      eyebrow: offer.discount ? `-${offer.discount}% OFF` : "Oferta",
      name: offer.name,
      description: offer.description,
      price: offer.price,
      original_price: offer.original_price,
      discount: offer.discount,
      image: offer.image,
      href: "/productos",
    })
    usedIds.add(offer.id)
  }

  // 5. Cierre de marca
  slides.push({
    kind: "promo",
    id: "promo-coleccion",
    eyebrow: "Colección Premium",
    title: "Elegancia & placer",
    subtitle: "Explora la colección donde la sofisticación se encuentra con el deseo.",
    cta: "Explorar colección",
    href: "/productos",
  })

  return slides.slice(0, MAX_SLIDES)
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      const products = await getFeaturedProducts()
      const converted = products.map(convertSupabaseToProduct)
      if (active) {
        setSlides(buildSlides(converted))
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setCurrent(() => {
        if (slides.length === 0) return 0
        return (index + slides.length) % slides.length
      })
    },
    [slides.length],
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, AUTO_PLAY_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slides.length])

  if (loading) {
    return <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] bg-muted/40 animate-pulse" />
  }

  if (slides.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden group"
      role="region"
      aria-label="Promociones y ofertas"
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative flex-none w-full h-[380px] sm:h-[440px] md:h-[500px]">
            {slide.kind === "product" ? (
              <>
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                <div className="relative z-10 flex h-full items-center">
                  <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
                    <div className="max-w-lg space-y-4">
                      <span
                        className={
                          slide.discount
                            ? "inline-block w-fit rounded-full bg-accent px-4 py-1.5 text-xs md:text-sm font-semibold tracking-wide text-accent-foreground"
                            : "inline-block w-fit rounded-full border border-accent/60 px-4 py-1.5 text-xs md:text-sm font-medium tracking-widest uppercase text-accent"
                        }
                      >
                        {slide.eyebrow}
                      </span>

                      <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
                        {slide.name}
                      </h3>

                      <p className="hidden sm:block max-w-md text-sm md:text-base text-muted-foreground line-clamp-2 text-pretty">
                        {slide.description}
                      </p>

                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl md:text-3xl font-bold text-foreground">
                          {`$${slide.price.toLocaleString("es-CO")}`}
                        </span>
                        {slide.original_price && slide.original_price > slide.price ? (
                          <span className="text-base md:text-lg text-muted-foreground line-through">
                            {`$${slide.original_price.toLocaleString("es-CO")}`}
                          </span>
                        ) : null}
                      </div>

                      <Link
                        href={slide.href}
                        className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm md:text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                      >
                        Ver producto
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-background to-background" />
                <div className="relative z-10 flex h-full items-center">
                  <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
                    <div className="max-w-xl space-y-4">
                      <span className="inline-block w-fit rounded-full border border-accent/60 px-4 py-1.5 text-xs md:text-sm font-medium tracking-widest uppercase text-accent">
                        {slide.eyebrow}
                      </span>

                      <h3 className="font-serif text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
                        {slide.title}
                      </h3>

                      <p className="max-w-md text-base md:text-lg text-muted-foreground text-pretty">
                        {slide.subtitle}
                      </p>

                      <Link
                        href={slide.href}
                        className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm md:text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                      >
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a la promoción ${index + 1}`}
                aria-current={index === current}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-8 bg-accent" : "w-2 bg-foreground/40 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
