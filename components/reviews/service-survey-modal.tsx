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

interface ServiceSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ServiceSurveyModal({ isOpen, onClose, onSuccess }: ServiceSurveyModalProps) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    service_rating: 0,
    delivery_rating: 0,
    comment: "",
  })
  const [hoveredServiceRating, setHoveredServiceRating] = useState(0)
  const [hoveredDeliveryRating, setHoveredDeliveryRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.service_rating === 0) {
      setError("Por favor califica nuestro servicio")
      setLoading(false)
      return
    }

    if (formData.delivery_rating === 0) {
      setError("Por favor califica la entrega")
      setLoading(false)
      return
    }

    try {
      // Insertar en tabla service_surveys
      const { error: insertError } = await supabase.from("service_surveys").insert([
        {
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          service_rating: formData.service_rating,
          delivery_rating: formData.delivery_rating,
          comment: formData.comment,
        },
      ])

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } catch (err) {
      console.error("Error submitting service survey:", err)
      setError("Error al enviar la encuesta. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ customer_name: "", customer_email: "", service_rating: 0, delivery_rating: 0, comment: "" })
    setHoveredServiceRating(0)
    setHoveredDeliveryRating(0)
    setError("")
    setSuccess(false)
    onClose()
  }

  const renderStars = (
    rating: number,
    hoveredRating: number,
    onRate: (rating: number) => void,
    onHover: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-foreground">Califica Nuestro Servicio</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-green-500">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">¡Gracias por tu opinión!</h3>
            <p className="text-muted-foreground font-serif">Tu feedback nos ayuda a mejorar cada día.</p>
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
              <Label className="font-serif">Califica nuestro servicio *</Label>
              {renderStars(
                formData.service_rating,
                hoveredServiceRating,
                (rating) => setFormData({ ...formData, service_rating: rating }),
                setHoveredServiceRating,
              )}
            </div>

            <div>
              <Label className="font-serif">Califica la entrega *</Label>
              {renderStars(
                formData.delivery_rating,
                hoveredDeliveryRating,
                (rating) => setFormData({ ...formData, delivery_rating: rating }),
                setHoveredDeliveryRating,
              )}
            </div>

            <div>
              <Label htmlFor="comment" className="font-serif">
                Comentarios adicionales (opcional)
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                placeholder="Cuéntanos sobre tu experiencia con nuestro servicio..."
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
                {loading ? "Enviando..." : "Enviar Encuesta"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
