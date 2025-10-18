"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserClient } from "@/lib/supabase/client"
import { Copy, ExternalLink, Star } from "lucide-react"
import { toast } from "sonner"

interface PostSaleSurvey {
  id: string
  customer_name: string
  delivery_rating: number
  comment: string
  product_image: string
  created_at: string
  token: string
}

export function PostSaleSurveysManager() {
  const [surveys, setSurveys] = useState<PostSaleSurvey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newToken, setNewToken] = useState("")
  const supabase = createBrowserClient()

  const getBaseUrl = () => {
    if (typeof window === "undefined") {
      return ""
    }

    const origin = window.location.origin
    const hostname = window.location.hostname

    // Si estamos en desarrollo o preview, siempre usar el origin actual
    if (
      hostname === "localhost" ||
      hostname.includes("vusercontent.net") ||
      hostname.includes("preview-") ||
      hostname.includes("vercel.app")
    ) {
      console.log("[v0] Usando URL de desarrollo/preview:", origin)
      return origin
    }

    // Si estamos en un dominio personalizado de producción, usar la variable de entorno si está configurada
    const nextAuthUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL
    if (nextAuthUrl && !nextAuthUrl.includes("vusercontent.net")) {
      console.log("[v0] Usando URL de producción desde variable de entorno:", nextAuthUrl)
      return nextAuthUrl
    }

    // Fallback: usar el origin actual
    console.log("[v0] Usando URL actual como fallback:", origin)
    return origin
  }

  useEffect(() => {
    loadSurveys()
  }, [])

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from("post_sale_surveys")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSurveys(data || [])
    } catch (err) {
      console.error("Error loading post-sale surveys:", err)
      toast.error("Error al cargar las encuestas")
    } finally {
      setLoading(false)
    }
  }

  const generateToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setNewToken(token)
  }

  const copyToClipboard = (token: string) => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/encuesta-posventa/${token}`
    console.log("[v0] Copiando URL al portapapeles:", url)
    navigator.clipboard.writeText(url)
    toast.success("URL copiada al portapapeles")
  }

  const openSurveyUrl = (token: string) => {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/encuesta-posventa/${token}`
    console.log("[v0] Abriendo URL de encuesta:", url)
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-serif">Encuestas Pos Venta</h2>
          <p className="text-muted-foreground font-serif">Gestiona las encuestas de entrega enviadas a clientes</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="font-serif">
          Generar Nueva Encuesta
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <p className="text-center text-muted-foreground font-serif">Cargando encuestas...</p>
        ) : surveys.length === 0 ? (
          <p className="text-center text-muted-foreground font-serif">No hay encuestas pos venta registradas</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-serif">Cliente</TableHead>
                <TableHead className="font-serif">Calificación</TableHead>
                <TableHead className="font-serif">Comentario</TableHead>
                <TableHead className="font-serif">Fecha</TableHead>
                <TableHead className="font-serif">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-serif">{survey.customer_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: survey.delivery_rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-serif max-w-xs truncate">{survey.comment || "-"}</TableCell>
                  <TableCell className="font-serif">{new Date(survey.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(survey.token)}
                        className="font-serif"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSurveyUrl(survey.token)}
                        className="font-serif"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Generar Nueva Encuesta Pos Venta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-serif">Token de Encuesta</Label>
              <div className="flex gap-2 mt-2">
                <Input value={newToken} readOnly className="font-mono" />
                <Button onClick={generateToken} className="font-serif">
                  Generar
                </Button>
              </div>
            </div>
            {newToken && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-serif mb-2">URL de la encuesta:</p>
                <p className="text-xs font-mono break-all mb-3">{`${getBaseUrl()}/encuesta-posventa/${newToken}`}</p>
                <Button onClick={() => copyToClipboard(newToken)} className="w-full font-serif">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar URL
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
