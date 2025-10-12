"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ReviewFormModal } from "./review-form-modal"
import { createBrowserClient } from "@/lib/supabase/client"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
  product_id?: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground font-serif">Cargando reseñas...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-serif">
              Experiencias reales de clientes satisfechos con nuestros productos
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-6 font-serif">
                Sé el primero en compartir tu experiencia con nuestros productos
              </p>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
              >
                Dejar una Reseña
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6 bg-background border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground font-serif">{review.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(review.created_at)}</p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <Quote className="h-8 w-8 text-accent/20 mb-2" />
                    <p className="text-muted-foreground italic font-serif">{review.comment}</p>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={() => setShowReviewForm(true)} variant="outline" className="bg-transparent font-serif">
                  Dejar una Reseña
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <ReviewFormModal
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSuccess={() => {
          setShowReviewForm(false)
          loadReviews()
        }}
      />
    </>
  )
}
