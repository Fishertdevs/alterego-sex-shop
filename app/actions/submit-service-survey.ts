"use server"

import { createClient } from "@supabase/supabase-js"

interface ServiceSurveyData {
  customer_name: string
  service_rating: number
  comment?: string
}

export async function submitServiceSurvey(surveyData: ServiceSurveyData) {
  try {
    console.log("[v0] Server Action - Recibiendo encuesta:", surveyData)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabase
      .from("service_surveys")
      .insert([
        {
          customer_name: surveyData.customer_name,
          service_rating: surveyData.service_rating,
          delivery_rating: null, // Valor explícito null hasta que se ejecute el script SQL
          comment: surveyData.comment || null,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Server Action - Error de Supabase:", error)
      throw new Error(`Error al guardar la encuesta: ${error.message}`)
    }

    console.log("[v0] Server Action - Encuesta guardada exitosamente:", data)

    return {
      success: true,
      data: data[0],
    }
  } catch (error: any) {
    console.error("[v0] Server Action - Error:", error)
    return {
      success: false,
      error: error.message || "Error al enviar la encuesta",
    }
  }
}
