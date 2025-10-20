"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Star, Trash2, Check, X, AlertTriangle, MessageSquare } from "lucide-react"
import { getReviews, updateReviewStatus } from "@/lib/supabase-storage"
import type { SupabaseReview } from "@/lib/supabase-storage"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { createBrowserClient } from "@/lib/supabase/client" // Assuming this is the import for createBrowserClient

type ReviewWithProduct = SupabaseReview & {
  product_name?: string
  review_type?: "pre_sale" | "post_sale"
  images?: string[]
  source?: "reviews" | "service_surveys"
}

interface ServiceSurvey {
  id: string
  customer_name: string
  customer_email?: string
  service_rating: number
  comment?: string
  created_at: string
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([])
  const [filteredReviews, setFilteredReviews] = useState<ReviewWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "offensive">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  useEffect(() => {
    loadReviews()

    const supabase = createBrowserClient()
    const channel = supabase
      .channel("admin_service_surveys_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_surveys",
        },
        () => {
          console.log("[v0] Service survey changed in admin, reloading...")
          loadReviews()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    filterReviews()
  }, [filter, reviews])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient()

      const [reviewsResult, surveysResult] = await Promise.all([
        getReviews(),
        supabase.from("service_surveys").select("*").order("created_at", { ascending: false }),
      ])

      console.log("[v0] Admin - Reviews loaded:", reviewsResult.length)
      console.log("[v0] Admin - Service surveys loaded:", surveysResult.data?.length || 0)

      const productReviews: ReviewWithProduct[] = reviewsResult.map((review) => ({
        ...review,
        source: "reviews" as const,
      }))

      const surveysAsReviews: ReviewWithProduct[] = (surveysResult.data || []).map((survey: ServiceSurvey) => ({
        id: survey.id,
        customer_name: survey.customer_name,
        customer_email: survey.customer_email,
        rating: survey.service_rating,
        comment: survey.comment || "",
        created_at: survey.created_at,
        updated_at: survey.created_at,
        review_type: "pre_sale" as const,
        approved: true,
        verified_purchase: false,
        is_offensive: false,
        source: "service_surveys" as const,
      }))

      const allReviews = [...productReviews, ...surveysAsReviews].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      console.log("[v0] Admin - Total reviews:", allReviews.length)

      setReviews(allReviews)
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = reviews

    switch (filter) {
      case "pending":
        filtered = reviews.filter((r) => !r.approved && !r.is_offensive)
        break
      case "approved":
        filtered = reviews.filter((r) => r.approved && !r.is_offensive)
        break
      case "offensive":
        filtered = reviews.filter((r) => r.is_offensive)
        break
      default:
        filtered = reviews
    }

    setFilteredReviews(filtered)
  }

  const handleDelete = async () => {
    if (!selectedReviewId) return

    const reviewToDelete = reviews.find((r) => r.id === selectedReviewId)
    if (!reviewToDelete) {
      console.error("[v0] Review not found:", selectedReviewId)
      alert("No se encontró la reseña a eliminar")
      return
    }

    console.log("[v0] Deleting single review:", selectedReviewId, "from table:", reviewToDelete.source)

    const supabase = createBrowserClient()

    try {
      if (reviewToDelete.source === "service_surveys") {
        const { error } = await supabase.from("service_surveys").delete().eq("id", selectedReviewId)
        if (error) {
          console.error("[v0] Error deleting from service_surveys:", error)
          alert(`Error al eliminar la reseña: ${error.message}`)
          return
        }
      } else {
        const { error } = await supabase.from("reviews").delete().eq("id", selectedReviewId)
        if (error) {
          console.error("[v0] Error deleting from reviews:", error)
          alert(`Error al eliminar la reseña: ${error.message}`)
          return
        }
      }

      console.log("[v0] Review deleted successfully, reloading...")
      await loadReviews()
      setDeleteDialogOpen(false)
      setSelectedReviewId(null)
    } catch (error) {
      console.error("[v0] Exception deleting review:", error)
      alert("Error inesperado al eliminar la reseña")
    }
  }

  const handleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([])
    } else {
      setSelectedReviews(filteredReviews.map((review) => review.id))
    }
  }

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return

    console.log("[v0] Bulk deleting reviews:", selectedReviews.length)

    const supabase = createBrowserClient()

    const reviewsToDelete = reviews.filter((r) => selectedReviews.includes(r.id))
    const productReviewIds = reviewsToDelete.filter((r) => r.source === "reviews").map((r) => r.id)
    const serviceSurveyIds = reviewsToDelete.filter((r) => r.source === "service_surveys").map((r) => r.id)

    console.log("[v0] Product reviews to delete:", productReviewIds.length)
    console.log("[v0] Service surveys to delete:", serviceSurveyIds.length)

    const deletePromises = []

    if (productReviewIds.length > 0) {
      deletePromises.push(supabase.from("reviews").delete().in("id", productReviewIds))
    }

    if (serviceSurveyIds.length > 0) {
      deletePromises.push(supabase.from("service_surveys").delete().in("id", serviceSurveyIds))
    }

    const results = await Promise.all(deletePromises)

    const hasError = results.some((result) => result.error)
    if (hasError) {
      console.error("[v0] Error deleting reviews:", results)
      alert("Error al eliminar algunas reseñas")
      return
    }

    console.log("[v0] All reviews deleted successfully")
    await loadReviews()
    setSelectedReviews([])
    setBulkDeleteDialogOpen(false)
  }

  const handleApprove = async (reviewId: string) => {
    const success = await updateReviewStatus(reviewId, true, false)
    if (success) {
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, approved: true, is_offensive: false } : r)))
    } else {
      alert("Error al aprobar la reseña")
    }
  }

  const handleReject = async (reviewId: string) => {
    const success = await updateReviewStatus(reviewId, false, false)
    if (success) {
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, approved: false, is_offensive: false } : r)))
    } else {
      alert("Error al rechazar la reseña")
    }
  }

  const handleMarkOffensive = async (reviewId: string, isOffensive: boolean) => {
    const success = await updateReviewStatus(reviewId, false, isOffensive)
    if (success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, is_offensive: isOffensive, approved: false } : r)),
      )
    } else {
      alert("Error al marcar la reseña")
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (review: ReviewWithProduct) => {
    if (review.is_offensive) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Ofensivo
        </Badge>
      )
    }
    if (review.approved) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Aprobado
        </Badge>
      )
    }
    return <Badge variant="secondary">Pendiente</Badge>
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => !r.approved && !r.is_offensive).length,
    approved: reviews.filter((r) => r.approved).length,
    offensive: reviews.filter((r) => r.is_offensive).length,
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando reseñas...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprobadas</p>
                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ofensivas</p>
                <p className="text-2xl font-bold text-destructive">{stats.offensive}</p>
              </div>
              <X className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Gestión de Reseñas
            </CardTitle>
            <div className="flex gap-2 items-center">
              {selectedReviews.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar seleccionadas ({selectedReviews.length})
                </Button>
              )}
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas ({stats.total})</SelectItem>
                  <SelectItem value="pending">Pendientes ({stats.pending})</SelectItem>
                  <SelectItem value="approved">Aprobadas ({stats.approved})</SelectItem>
                  <SelectItem value="offensive">Ofensivas ({stats.offensive})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay reseñas para mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo/Producto</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Comentario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review.id)}
                          onChange={() => handleSelectReview(review.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.customer_name}</p>
                          {review.customer_email && (
                            <p className="text-xs text-muted-foreground">{review.customer_email}</p>
                          )}
                          {review.verified_purchase && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Compra verificada
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {review.review_type === "pre_sale" ? (
                            <Badge variant="secondary" className="text-xs">
                              Pre-venta (Servicio)
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-xs bg-accent">
                              Post-venta (Producto)
                            </Badge>
                          )}
                          {review.product_name && <p className="text-sm">{review.product_name}</p>}
                          {review.images && review.images.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              📷 {review.images.length} {review.images.length === 1 ? "imagen" : "imágenes"}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{review.comment}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(review)}</TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {!review.approved && !review.is_offensive && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(review.id)}
                              title="Aprobar"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {review.approved && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(review.id)}
                              title="Rechazar"
                            >
                              <X className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkOffensive(review.id, !review.is_offensive)}
                            title={review.is_offensive ? "Marcar como no ofensivo" : "Marcar como ofensivo"}
                          >
                            <AlertTriangle
                              className={`h-4 w-4 ${review.is_offensive ? "text-destructive" : "text-muted-foreground"}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedReviewId(review.id)
                              setDeleteDialogOpen(true)
                            }}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La reseña será eliminada permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar {selectedReviews.length} reseña{selectedReviews.length > 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. {selectedReviews.length} reseña
              {selectedReviews.length > 1 ? "s serán eliminadas" : " será eliminada"} permanentemente de la base de
              datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
