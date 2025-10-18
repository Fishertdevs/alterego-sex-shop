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

    if (formData.delivery_rating === 0) {
      setError("Por favor califica la entrega")
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from("post_sale_surveys").insert([
        {
          customer_name: formData.customer_name,
          delivery_rating: formData.delivery_rating,
          comment: formData.comment,
          product_image: productImage,
          order_id: orderId,
          product_id: productId,
          token: token,
        },
      ])

      if (insertError) throw insertError

      onSuccess()
    } catch (err) {
      console.error("Error submitting post-sale survey:", err)
      setError("Error al enviar la encuesta. Por favor intenta de nuevo.")
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
    <div className="max-w-2xl mx-auto p-6 bg-background rounded-lg border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-serif text-center">Encuesta Pos Venta</h2>

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
          <Label htmlFor="name" className="font-serif text-lg">
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
          <Label className="font-serif text-lg">Califica la entrega *</Label>
          {renderStars()}
        </div>

        <div>
          <Label htmlFor="comment" className="font-serif text-lg">
            Comentarios
          </Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={5}
            placeholder="Cuéntanos sobre tu experiencia con la entrega del producto..."
            className="bg-background border-border font-serif mt-2"
          />
        </div>

        {error && <p className="text-sm text-destructive font-serif">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
        >
          {loading ? "Enviando..." : "Enviar Encuesta"}
        </Button>
      </form>
    </div>
  )
}
