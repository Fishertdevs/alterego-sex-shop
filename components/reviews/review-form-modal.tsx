"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ReviewFormModal({ isOpen, onClose, onSuccess }: ReviewFormModalProps) {
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
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          rating: formData.rating,
          comment: formData.comment,
          approved: false, // Requiere aprobación del admin
        },
      ])

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
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
          <DialogTitle className="font-serif text-foreground">Deja tu Reseña</DialogTitle>
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
              <Label className="font-serif">Calificación *</Label>
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
                        star <= (hoveredRating || formData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment" className="font-serif">
                Tu Experiencia *
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
                rows={4}
                placeholder="Cuéntanos sobre tu experiencia con nuestros productos..."
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
        )}
      </DialogContent>
    </Dialog>
  )
}
