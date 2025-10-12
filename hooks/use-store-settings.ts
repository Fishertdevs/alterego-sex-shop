"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface StoreSettings {
  id?: string
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  instagram_url: string
  whatsapp_number: string
  facebook_url: string
  currency: string
  tax_rate: number
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

      if (error) throw error
      setSettings(data)
    } catch (error) {
      console.error("Error loading store settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { settings, isLoading, reload: loadSettings }
}
