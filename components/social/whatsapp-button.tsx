"use client"

import type React from "react"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStoreSettings } from "@/hooks/use-store-settings"

export function WhatsAppButton() {
  const { settings } = useStoreSettings()

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const rawNumber = settings?.store_phone || "+57 3133462402"
    const phoneNumber = rawNumber.replace(/[\s\-()+ ]/g, "")

    console.log("[v0] WhatsApp Button - Click event triggered")
    console.log("[v0] WhatsApp Button - Raw number:", rawNumber)
    console.log("[v0] WhatsApp Button - Cleaned number:", phoneNumber)

    const message = "Hola Alterego, quiero más información de los productos de la tienda"
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    console.log("[v0] WhatsApp Button - Opening URL:", url)

    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
      size="icon"
      type="button"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Contactar por WhatsApp</span>
    </Button>
  )
}
