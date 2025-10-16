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
import { getReviews, deleteReview, updateReviewStatus } from "@/lib/supabase-storage"
import type { SupabaseReview } from "@/lib/supabase-storage"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type ReviewWithProduct = SupabaseReview & { product_name?: string }

export function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([])
  const [filteredReviews, setFilteredReviews] = useState<ReviewWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "offensive">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [filter, reviews])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getReviews()
      setReviews(data)
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

    const success = await deleteReview(selectedReviewId)
    if (success) {
      setReviews((prev) => prev.filter((r) => r.id !== selectedReviewId))
      setDeleteDialogOpen(false)
      setSelectedReviewId(null)
    } else {
      alert("Error al eliminar la reseña")
    }
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
      {/* Estadísticas */}
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

      {/* Tabla de reseñas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Gestión de Reseñas
            </CardTitle>
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Producto</TableHead>
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
                        <p className="text-sm">{review.product_name || "Sin producto"}</p>
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

      {/* Diálogo de confirmación de eliminación */}
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
    </div>
  )
}
