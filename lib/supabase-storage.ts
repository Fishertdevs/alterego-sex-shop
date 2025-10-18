import { createBrowserClient } from "@supabase/ssr"
import type { AdminProduct } from "./admin-storage"

export interface SupabaseProduct {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  discount?: number
  category: string
  subcategory?: string
  stock: number
  images: string[]
  videos: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

function getSupabaseClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function convertSupabaseToAdmin(product: SupabaseProduct): AdminProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    discount: product.discount,
    category: product.category,
    subcategory: product.subcategory,
    stock: product.stock,
    images: product.images,
    videos: product.videos,
    featured: product.featured,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }
}

export async function getFeaturedProducts(): Promise<SupabaseProduct[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching featured products:", error)
    return []
  }

  return data || []
}

export function convertSupabaseToProduct(product: SupabaseProduct): {
  id: string
  name: string
  price: number
  original_price?: number
  discount?: number
  image: string
  category: string
  description: string
  stock: number
  featured?: boolean
} {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    original_price: product.original_price,
    discount: product.discount,
    image: product.images[0] || "/placeholder.svg",
    category: product.category,
    description: product.description,
    stock: product.stock,
    featured: product.featured,
  }
}

export async function getProducts(): Promise<SupabaseProduct[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<SupabaseProduct | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  return data
}

export async function createProduct(
  product: Omit<SupabaseProduct, "id" | "created_at" | "updated_at">,
): Promise<SupabaseProduct | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    return null
  }

  return data
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<SupabaseProduct, "id" | "created_at">>,
): Promise<SupabaseProduct | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating product:", error)
    return null
  }

  return data
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    return false
  }

  return true
}

export async function updateProductStock(id: string, quantity: number): Promise<boolean> {
  const supabase = getSupabaseClient()

  // Obtener el stock actual
  const { data: product, error: fetchError } = await supabase.from("products").select("stock").eq("id", id).single()

  if (fetchError || !product) {
    console.error("[v0] Error fetching product stock:", fetchError)
    return false
  }

  // Calcular el nuevo stock
  const newStock = product.stock - quantity

  if (newStock < 0) {
    console.error("[v0] Insufficient stock")
    return false
  }

  // Actualizar el stock
  const { error: updateError } = await supabase
    .from("products")
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (updateError) {
    console.error("[v0] Error updating stock:", updateError)
    return false
  }

  return true
}

export interface SupabaseReview {
  id: string
  product_id?: string
  order_id?: string
  customer_name: string
  customer_email?: string
  rating: number
  comment: string
  delivery_rating?: number
  delivery_comment?: string
  verified_purchase: boolean
  approved: boolean
  is_offensive?: boolean
  review_type?: "pre_sale" | "post_sale"
  images?: string[]
  created_at: string
  updated_at: string
}

export async function getReviews(): Promise<(SupabaseReview & { product_name?: string })[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      products (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching reviews:", error)
    return []
  }

  return (data || []).map((review: any) => ({
    ...review,
    product_name: review.products?.name,
  }))
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

  if (error) {
    console.error("[v0] Error deleting review:", error)
    return false
  }

  return true
}

export async function updateReviewStatus(
  reviewId: string,
  approved?: boolean,
  isOffensive?: boolean,
): Promise<boolean> {
  const supabase = getSupabaseClient()

  const updates: any = { updated_at: new Date().toISOString() }
  if (approved !== undefined) updates.approved = approved
  if (isOffensive !== undefined) updates.is_offensive = isOffensive

  const { error } = await supabase.from("reviews").update(updates).eq("id", reviewId)

  if (error) {
    console.error("[v0] Error updating review status:", error)
    return false
  }

  return true
}

export interface ServiceSurvey {
  id: string
  customer_name: string
  customer_email?: string
  service_rating: number
  delivery_rating: number
  comment?: string
  created_at: string
}

export interface SurveyToken {
  id: string
  token: string
  order_id: string
  product_id: string
  customer_email?: string
  used: boolean
  created_at: string
  expires_at: string
}

export async function getServiceSurveys(): Promise<ServiceSurvey[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("service_surveys").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching service surveys:", error)
    return []
  }

  return data || []
}

export async function createSurveyToken(
  orderId: string,
  productId: string,
  customerEmail?: string,
): Promise<string | null> {
  const supabase = getSupabaseClient()

  // Generar token único usando la función de la base de datos
  const { data: tokenData, error: tokenError } = await supabase.rpc("generate_survey_token")

  if (tokenError || !tokenData) {
    console.error("[v0] Error generating survey token:", tokenError)
    return null
  }

  const token = tokenData as string

  // Insertar el token en la tabla
  const { error: insertError } = await supabase.from("survey_tokens").insert([
    {
      token,
      order_id: orderId,
      product_id: productId,
      customer_email: customerEmail,
    },
  ])

  if (insertError) {
    console.error("[v0] Error creating survey token:", insertError)
    return null
  }

  return token
}

export async function getSurveyTokensByOrder(orderId: string): Promise<SurveyToken[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("survey_tokens").select("*").eq("order_id", orderId)

  if (error) {
    console.error("[v0] Error fetching survey tokens:", error)
    return []
  }

  return data || []
}
