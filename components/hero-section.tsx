"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent rounded-full animate-float opacity-60"></div>
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-accent rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-float opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-1 h-1 bg-accent rounded-full animate-float opacity-50"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="relative"></div>
          </div>

          <div className="stagger-animation">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 text-balance tracking-wide">
              ALTER
              <span className="inline-block" style={{ transform: "scaleX(-1)" }}>
                E
              </span>
              GO
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty font-serif">
              Somos la boutique erótica donde la elegancia se mezcla con la pasión, y el deseo se convierte en
              experiencias únicas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="hover-scale hover-glow group bg-accent hover:bg-accent/90 font-serif"
              >
                <Link href="/productos">
                  Explorar Colección
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
