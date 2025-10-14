"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Store, Mail, Phone, MapPin, DollarSign, Bell, Save, AlertCircle, Instagram, Facebook } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  notify_low_stock: boolean
  low_stock_threshold: number
  notify_settings_change: boolean
  notify_new_sale: boolean
}

export function StoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "ALTEREGO",
    store_email: "contacto@alterego.com",
    store_phone: "+57 300 123 4567",
    store_address: "Bogotá, Colombia",
    instagram_url: "https://www.instagram.com/alterego",
    facebook_url: "https://www.facebook.com/alterego",
    currency: "COP",
    tax_rate: 19,
    notify_low_stock: true,
    low_stock_threshold: 5,
    notify_settings_change: true,
    notify_new_sale: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const normalizeSettings = (data: any): StoreSettings => {
    return {
      id: data.id,
      store_name: data.store_name ?? "ALTEREGO",
      store_email: data.store_email ?? "contacto@alterego.com",
      store_phone: data.store_phone ?? "+57 300 123 4567",
      store_address: data.store_address ?? "Bogotá, Colombia",
      instagram_url: data.instagram_url ?? "",
      facebook_url: data.facebook_url ?? "",
      currency: data.currency ?? "COP",
      tax_rate: data.tax_rate ?? 19,
      notify_low_stock: data.notify_low_stock ?? true,
      low_stock_threshold: data.low_stock_threshold ?? 5,
      notify_settings_change: data.notify_settings_change ?? true,
      notify_new_sale: data.notify_new_sale ?? true,
    }
  }

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

      if (error) throw error
      if (data) {
        setSettings(normalizeSettings(data))
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .upsert(
          {
            ...settings,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        )
        .select()
        .single()

      if (error) throw error

      console.log("[v0] Settings saved successfully:", data)
      console.log("[v0] Phone number saved:", data?.store_phone)

      window.dispatchEvent(
        new CustomEvent("store-settings-updated", {
          detail: { store_phone: settings.store_phone },
        }),
      )

      // Crear notificación de cambio de configuración
      if (settings.notify_settings_change) {
        await supabase.from("notifications").insert({
          type: "settings_change",
          title: "Configuración Actualizada",
          message: "Se han guardado los cambios en la configuración de la tienda.",
        })
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando configuración...</div>
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="bg-green-500/10 border-green-500/50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">Configuración guardada exitosamente</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Información de la Tienda
          </CardTitle>
          <CardDescription>Configura los datos básicos de tu tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Nombre de la Tienda</Label>
              <Input
                id="storeName"
                value={settings.store_name}
                onChange={(e) => setSettings((prev) => ({ ...prev, store_name: e.target.value }))}
                placeholder="ALTEREGO"
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Email de Contacto</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.store_email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, store_email: e.target.value }))}
                  className="pl-10"
                  placeholder="contacto@alterego.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storePhone">Teléfono / WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storePhone"
                  type="tel"
                  value={settings.store_phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, store_phone: e.target.value }))}
                  className="pl-10"
                  placeholder="+57 3168192054"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Este número se usará para WhatsApp y contacto general
              </p>
            </div>
            <div>
              <Label htmlFor="storeAddress">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storeAddress"
                  value={settings.store_address}
                  onChange={(e) => setSettings((prev) => ({ ...prev, store_address: e.target.value }))}
                  className="pl-10"
                  placeholder="Bogotá, Colombia"
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Redes Sociales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings((prev) => ({ ...prev, instagram_url: e.target.value }))}
                    className="pl-10"
                    placeholder="https://www.instagram.com/alterego"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings((prev) => ({ ...prev, facebook_url: e.target.value }))}
                    className="pl-10"
                    placeholder="https://www.facebook.com/alterego"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración de Precios
          </CardTitle>
          <CardDescription>Configura la moneda e impuestos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
                placeholder="COP"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.tax_rate}
                onChange={(e) => setSettings((prev) => ({ ...prev, tax_rate: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="19"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Vista Previa de Precio</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>$100,000 {settings.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuesto ({settings.tax_rate}%):</span>
                <span>
                  ${(100000 * (settings.tax_rate / 100)).toLocaleString("es-CO")} {settings.currency}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-accent">
                <span>Total:</span>
                <span>
                  ${(100000 + 100000 * (settings.tax_rate / 100)).toLocaleString("es-CO")} {settings.currency}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Configura las alertas y notificaciones de la tienda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyLowStock">Alertas de Stock Bajo</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones cuando un producto tenga poco stock</p>
            </div>
            <Switch
              id="notifyLowStock"
              checked={settings.notify_low_stock}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notify_low_stock: checked }))}
            />
          </div>

          {settings.notify_low_stock && (
            <div className="ml-6">
              <Label htmlFor="lowStockThreshold">Umbral de Stock Bajo</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="1"
                max="100"
                value={settings.low_stock_threshold}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, low_stock_threshold: Number.parseInt(e.target.value) || 5 }))
                }
                className="w-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Alertar cuando el stock sea menor o igual a este número
              </p>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifySettings">Notificar Cambios de Configuración</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones cuando cambies la configuración</p>
            </div>
            <Switch
              id="notifySettings"
              checked={settings.notify_settings_change}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notify_settings_change: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyNewSale">Notificar Nuevas Ventas</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones cuando se realice una venta</p>
            </div>
            <Switch
              id="notifyNewSale"
              checked={settings.notify_new_sale}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notify_new_sale: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}
