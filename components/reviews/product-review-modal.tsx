"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import Image from "next/image"

interface ProductReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  orderId?: string
}

export function ProductReviewModal({ isOpen, onClose, productId, orderId }: ProductReviewModalProps) {
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    rating: 0,
    comment: "",
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (productId && isOpen) {
      loadProduct()
    }
  }, [productId, isOpen])

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

      if (error) throw error
      setProduct(data)
    } catch (err) {
      console.error("Error loading product:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.rating === 0) {
      setError("Por favor selecciona una calificación")
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase.from("reviews").insert([
        {
          product_id: productId,
          order_id: orderId,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          rating: formData.rating,
          comment: formData.comment,
          verified_purchase: !!orderId,
          approved: false,
        },
      ])

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      console.error("Error submitting review:", err)
      setError("Error al enviar la reseña. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ customer_name: "", customer_email: "", rating: 0, comment: "" })
    setHoveredRating(0)
    setError("")
    setSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-foreground">Califica este Producto</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-green-500">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">¡Gracias por tu reseña!</h3>
            <p className="text-muted-foreground font-serif">Tu opinión será revisada y publicada pronto.</p>
          </div>
        ) : (
          <>
            {product && (
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg mb-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-serif">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price.toLocaleString("es-CO")} COP</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-serif">
                  Nombre *
                </Label>
                <Input
                  id="name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                  className="bg-background border-border font-serif"
                />
              </div>

              <div>
                <Label htmlFor="email" className="font-serif">
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="bg-background border-border font-serif"
                />
              </div>

              <div>
                <Label className="font-serif">Calificación del producto *</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || formData.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comment" className="font-serif">
                  Tu opinión sobre el producto *
                </Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={4}
                  placeholder="Cuéntanos qué te pareció este producto..."
                  className="bg-background border-border font-serif"
                />
              </div>

              {error && <p className="text-sm text-destructive font-serif">{error}</p>}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 font-serif bg-transparent"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                >
                  {loading ? "Enviando..." : "Enviar Reseña"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
