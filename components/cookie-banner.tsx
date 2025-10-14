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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white p-6 shadow-lg border-t border-primary/20">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">🍪 Uso de Cookies</h3>
            <p className="text-sm text-gray-300 mb-4">
              Utilizamos cookies para mejorar tu experiencia de navegación, personalizar contenido y analizar nuestro
              tráfico. Al hacer clic en "Aceptar", aceptas el uso de cookies según nuestra{" "}
              <a href="/politicas-cookies" className="text-primary hover:underline">
                Política de Cookies
              </a>
              .
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAccept} className="bg-primary hover:bg-primary/90">
                Aceptar
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                Cerrar
              </Button>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
