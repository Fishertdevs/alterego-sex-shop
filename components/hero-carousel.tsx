"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { getFeaturedProducts, convertSupabaseToProduct } from "@/lib/supabase-storage"

type Slide = {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  discount?: number
  image: string
  category: string
}

const AUTO_PLAY_MS = 5000

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
      // Ofertas primero para destacar promociones
      converted.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
      if (active) {
        setSlides(converted)
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
      setCurrent((prev) => {
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
    return (
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-border bg-muted/40 animate-pulse" />
    )
  }

  if (slides.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-border shadow-2xl group"
      role="region"
      aria-label="Promociones y ofertas"
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link
            key={slide.id}
            href="/productos"
            className="relative flex-none w-full h-48 md:h-64 lg:h-72"
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.name}
              className="absolute inset-0 h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />

            <div className="relative z-10 flex h-full flex-col justify-center gap-2 md:gap-3 px-6 md:px-12 max-w-xl">
              {slide.discount ? (
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs md:text-sm font-semibold text-accent-foreground">
                  {`-${slide.discount}% OFF`}
                </span>
              ) : (
                <span className="w-fit rounded-full border border-accent/60 px-3 py-1 text-xs md:text-sm font-medium text-accent">
                  Destacado
                </span>
              )}

              <h3 className="font-serif text-2xl md:text-4xl font-bold text-foreground text-balance leading-tight">
                {slide.name}
              </h3>

              <p className="hidden md:block text-sm text-muted-foreground line-clamp-2 text-pretty">
                {slide.description}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  {`$${slide.price.toLocaleString("es-CO")}`}
                </span>
                {slide.original_price && slide.original_price > slide.price ? (
                  <span className="text-sm md:text-base text-muted-foreground line-through">
                    {`$${slide.original_price.toLocaleString("es-CO")}`}
                  </span>
                ) : null}
              </div>

              <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors group-hover:bg-accent/90">
                Ver producto
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a la promoción ${index + 1}`}
                aria-current={index === current}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-accent" : "w-2 bg-foreground/40 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
