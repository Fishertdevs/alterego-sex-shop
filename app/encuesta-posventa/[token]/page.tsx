"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PostSaleSurveyForm } from "@/components/reviews/post-sale-survey-form"
import { createBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function PostSaleSurveyPage() {
  const params = useParams()
  const token = params.token as string
  const [surveyData, setSurveyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (token) {
      loadSurveyData()
    }
  }, [token])

  const loadSurveyData = async () => {
    try {
      // Verificar si el token ya fue usado
      const { data: existingSurvey, error: checkError } = await supabase
        .from("post_sale_surveys")
        .select("*")
        .eq("token", token)
        .single()

      if (existingSurvey) {
        setError("Esta encuesta ya ha sido completada")
        setLoading(false)
        return
      }

      // Si no existe, el token es válido y se puede usar
      setSurveyData({ token })
      setLoading(false)
    } catch (err) {
      console.error("Error loading survey data:", err)
      setError("Error al cargar la encuesta")
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setSuccess(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground font-serif">Cargando encuesta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mb-4 text-destructive">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 font-serif">Encuesta no disponible</h2>
          <p className="text-muted-foreground font-serif">{error}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mb-4 text-green-500">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2 font-serif">¡Gracias por tu opinión!</h2>
          <p className="text-muted-foreground font-serif">
            Tu feedback sobre la entrega nos ayuda a mejorar nuestro servicio cada día.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <PostSaleSurveyForm token={token} onSuccess={handleSuccess} />
    </div>
  )
}
