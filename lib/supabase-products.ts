import { createBrowserClient } from "@supabase/ssr"

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
