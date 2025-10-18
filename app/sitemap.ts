import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://alterego-store.com.co"

  // Obtener productos de Supabase
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("id, updated_at").eq("active", true)

  // URLs estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quienes-somos`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politicas-privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politicas-cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/devolucion-reembolso`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  // URLs de categorías
  const categories = [
    "lenceria-disfraces",
    "juguetes-intimos",
    "lubricantes-cosmetica",
    "condones-proteccion",
    "juegos-accesorios",
    "energizantes-estimulantes",
  ]

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/productos/${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  // URLs de productos
  const productPages =
    products?.map((product) => ({
      url: `${baseUrl}/producto/${product.id}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || []

  return [...staticPages, ...categoryPages, ...productPages]
}
