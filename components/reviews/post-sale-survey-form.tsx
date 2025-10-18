"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import Image from "next/image"

interface PostSaleSurveyFormProps {
  token: string
  productImage?: string
  productName?: string
  orderId?: string
  productId?: string
  onSuccess: () => void
}

export function PostSaleSurveyForm({
  token,
  productImage,
  productName,
  orderId,
  productId,
  onSuccess,
}: PostSaleSurveyFormProps) {
  const [formData, setFormData] = useState({
    customer_name: "",
    delivery_rating: 0,
    comment: "",
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Iniciando envío de encuesta pos venta")
    console.log("[v0] Token:", token)
    console.log("[v0] Datos del formulario:", formData)

    if (formData.delivery_rating === 0) {
      setError("Por favor califica la entrega")
      setLoading(false)
      return
    }

    if (!formData.customer_name.trim()) {
      setError("Por favor ingresa tu nombre")
      setLoading(false)
      return
    }

    try {
      const surveyData = {
        customer_name: formData.customer_name.trim(),
        delivery_rating: formData.delivery_rating,
        comment: formData.comment.trim() || null,
        product_image: productImage || null,
        order_id: orderId || null,
        product_id: productId || null,
        token: token,
      }

      console.log("[v0] Datos a insertar:", surveyData)

      const { data, error: insertError } = await supabase.from("post_sale_surveys").insert([surveyData]).select()

      if (insertError) {
        console.error("[v0] Error de Supabase:", insertError)
        throw insertError
      }

      console.log("[v0] Encuesta enviada exitosamente:", data)
      onSuccess()
    } catch (err: any) {
      console.error("[v0] Error al enviar encuesta:", err)

      if (err.code === "23505") {
        setError("Esta encuesta ya ha sido completada anteriormente")
      } else if (err.code === "42501") {
        setError("No tienes permisos para enviar esta encuesta. Por favor contacta al administrador.")
      } else if (err.message?.includes("JWT")) {
        setError("Error de autenticación. Por favor recarga la página e intenta nuevamente.")
      } else {
        setError(`Error al enviar la encuesta: ${err.message || "Por favor intenta de nuevo"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, delivery_rating: star })}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-10 w-10 ${
                star <= (hoveredRating || formData.delivery_rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg border border-border shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-serif text-center">Califica Nuestro Servicio</h2>

      {productImage && (
        <div className="mb-6 flex justify-center">
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={productName || "Producto"}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {productName && <p className="text-center text-muted-foreground mb-6 font-serif">{productName}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="font-serif text-base">
            Nombre *
          </Label>
          <Input
            id="name"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            required
            className="bg-background border-border font-serif mt-2"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <Label className="font-serif text-base">Califica nuestro servicio *</Label>
          {renderStars()}
        </div>

        <div>
          <Label htmlFor="comment" className="font-serif text-base">
            Comentarios adicionales (opcional)
          </Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            placeholder="Cuéntanos sobre tu experiencia..."
            className="bg-background border-border font-serif mt-2"
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive font-serif">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 font-serif">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
          >
            {loading ? "Enviando..." : "Enviar Encuesta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
