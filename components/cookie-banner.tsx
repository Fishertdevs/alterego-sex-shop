"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const cookiesAccepted = localStorage.getItem("cookies-accepted")
    if (!cookiesAccepted) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookies-accepted", "true")
    setShowBanner(false)
  }

  const handleClose = () => {
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white shadow-lg border-t border-primary/20">
      <div className="container mx-auto max-w-5xl px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex-1 text-xs leading-relaxed text-gray-300 sm:text-sm">
            <span className="mr-1">🍪</span>
            Usamos cookies para mejorar tu experiencia y analizar el tráfico. Consulta nuestra{" "}
            <a href="/politicas-cookies" className="text-primary hover:underline">
              Política de Cookies
            </a>
            .
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Button onClick={handleAccept} size="sm" className="bg-primary hover:bg-primary/90">
              Aceptar
            </Button>
            <Button
              onClick={handleClose}
              size="sm"
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/10"
            >
              Cerrar
            </Button>
            <button
              onClick={handleClose}
              className="ml-1 text-gray-400 transition-colors hover:text-white"
              aria-label="Cerrar banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
