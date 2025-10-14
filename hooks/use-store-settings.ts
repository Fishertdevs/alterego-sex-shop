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

    const channel = supabase
      .channel("store_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "store_settings",
        },
        (payload) => {
          console.log("[v0] Store settings changed in Realtime:", payload)
          if (payload.new) {
            const newSettings = payload.new as StoreSettings
            console.log("[v0] New phone number from Realtime:", newSettings.store_phone)
            setSettings(newSettings)
          }
        },
      )
      .subscribe()

    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log("[v0] Custom event received - reloading settings:", event.detail)
      loadSettings()
    }

    window.addEventListener("store-settings-updated" as any, handleSettingsUpdate)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener("store-settings-updated" as any, handleSettingsUpdate)
    }
  }, [])

  const loadSettings = async () => {
    try {
      console.log("[v0] Loading store settings from Supabase...")
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

      if (error) {
        console.error("[v0] Error loading store settings:", error)
        throw error
      }

      console.log("[v0] Store settings loaded:", data)
      console.log("[v0] Phone number from DB:", data?.store_phone)
      setSettings(data)
    } catch (error) {
      console.error("[v0] Error loading store settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return { settings, isLoading, reload: loadSettings }
}
