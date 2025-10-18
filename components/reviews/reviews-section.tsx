"use client"

import { useState, useEffect } from "react"
import { Star, Quote, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ReviewFormModal } from "./review-form-modal"
import { createBrowserClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
  product_id?: string
  approved?: boolean
  review_type?: "pre_sale" | "post_sale"
  images?: string[]
  product_name?: string
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    if (selectedRating === null) {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === selectedRating))
    }
  }, [selectedRating, reviews])

  const loadReviews = async () => {
    try {
      console.log("[v0] Loading reviews from Supabase...")

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          products (
            name
          )
        `)
        .eq("approved", true)
        .order("created_at", { ascending: false })

      console.log("[v0] Reviews query result:", { data, error })
      console.log("[v0] Number of reviews loaded:", data?.length || 0)

      if (error) {
        console.error("[v0] Error loading reviews:", error)
        throw error
      }

      const reviewsWithProductName = (data || []).map((review: any) => ({
        ...review,
        product_name: review.products?.name,
      }))

      setReviews(reviewsWithProductName)
      setFilteredReviews(reviewsWithProductName)
    } catch (error) {
      console.error("[v0] Error in loadReviews:", error)
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

  const scrollReviews = (direction: "left" | "right") => {
    const container = document.getElementById("reviews-container")
    if (container) {
      const scrollAmount = 400
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-serif mb-6">
              Experiencias reales de clientes satisfechos con nuestros productos
            </p>

            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif mb-6"
            >
              Dejar una Reseña
            </Button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-6 font-serif">
                Sé el primero en compartir tu experiencia con nuestros productos
              </p>
            </div>
          ) : (
            <div className="border-2 border-border rounded-lg bg-background/50 p-6">
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-serif">Filtrar por:</span>
                <Button
                  variant={selectedRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                  className="font-serif"
                >
                  Todas
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRating(rating)}
                    className="flex items-center gap-1 font-serif"
                  >
                    {rating}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </Button>
                ))}
              </div>

              <div className="relative">
                {/* Botón de scroll izquierda */}
                <button
                  onClick={() => scrollReviews("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-2 shadow-lg transition-all"
                  aria-label="Scroll izquierda"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Botón de scroll derecha */}
                <button
                  onClick={() => scrollReviews("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-2 shadow-lg transition-all"
                  aria-label="Scroll derecha"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {filteredReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground font-serif">
                      No hay reseñas con {selectedRating} {selectedRating === 1 ? "estrella" : "estrellas"}
                    </p>
                  </div>
                ) : (
                  <div
                    id="reviews-container"
                    className="overflow-x-auto pb-4 px-12 scrollbar-thin scrollbar-thumb-accent scrollbar-track-muted"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "hsl(var(--accent)) hsl(var(--muted))",
                    }}
                  >
                    <div className="flex gap-6" style={{ minWidth: "max-content" }}>
                      {filteredReviews.map((review) => (
                        <Card
                          key={review.id}
                          className="p-6 bg-background border-border hover:shadow-lg transition-shadow flex-shrink-0"
                          style={{ width: "350px" }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-foreground font-serif">{review.customer_name}</h3>
                              <p className="text-sm text-muted-foreground">{formatDate(review.created_at)}</p>
                              {review.review_type === "post_sale" && review.product_name && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  Producto: {review.product_name}
                                </Badge>
                              )}
                              {review.review_type === "pre_sale" && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  Servicio
                                </Badge>
                              )}
                            </div>
                            {renderStars(review.rating)}
                          </div>

                          {review.images && review.images.length > 0 && (
                            <div className="mb-4 grid grid-cols-3 gap-2">
                              {review.images.slice(0, 3).map((imageUrl, index) => (
                                <div key={index} className="relative aspect-square">
                                  <Image
                                    src={imageUrl || "/placeholder.svg"}
                                    alt={`Imagen ${index + 1}`}
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <Quote className="h-8 w-8 text-accent/20 mb-2" />
                          <p className="text-muted-foreground italic font-serif">{review.comment}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
