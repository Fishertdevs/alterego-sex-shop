// Singleton pattern para Supabase client
import { createBrowserClient } from "./client"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient()
  }
  return supabaseInstance
}
