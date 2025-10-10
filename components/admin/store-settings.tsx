"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Store, Mail, Phone, MapPin, DollarSign, Bell, Save, AlertCircle } from "lucide-react"
import { getAdminSettings, saveAdminSettings, type AdminSettings } from "@/lib/admin-storage"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function StoreSettings() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings())
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    saveAdminSettings(settings)

    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 500)
  }

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas restablecer la configuración a los valores predeterminados?")) {
      const defaultSettings = getAdminSettings()
      setSettings(defaultSettings)
      saveAdminSettings(defaultSettings)
    }
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
                value={settings.storeName}
                onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
                placeholder="ALTERƎGO"
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Email de Contacto</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings((prev) => ({ ...prev, storeEmail: e.target.value }))}
                  className="pl-10"
                  placeholder="contacto@alterego.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storePhone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storePhone"
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, storePhone: e.target.value }))}
                  className="pl-10"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="storeAddress">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings((prev) => ({ ...prev, storeAddress: e.target.value }))}
                  className="pl-10"
                  placeholder="Bogotá, Colombia"
                />
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
          <CardDescription>Configura la moneda, impuestos y costos de envío</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                value={settings.taxRate}
                onChange={(e) => setSettings((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="19"
              />
            </div>
            <div>
              <Label htmlFor="shippingCost">Costo de Envío (COP)</Label>
              <Input
                id="shippingCost"
                type="number"
                min="0"
                step="1000"
                value={settings.shippingCost}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, shippingCost: Number.parseInt(e.target.value) || 0 }))
                }
                placeholder="15000"
              />
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Vista Previa de Precio</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>$100,000 COP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuesto ({settings.taxRate}%):</span>
                <span>${(100000 * (settings.taxRate / 100)).toLocaleString("es-CO")} COP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío:</span>
                <span>${settings.shippingCost.toLocaleString("es-CO")} COP</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-accent">
                <span>Total:</span>
                <span>
                  ${(100000 + 100000 * (settings.taxRate / 100) + settings.shippingCost).toLocaleString("es-CO")} COP
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
              <Label htmlFor="emailOnNewOrder">Notificar Nuevos Pedidos</Label>
              <p className="text-sm text-muted-foreground">Recibe un email cuando llegue un nuevo pedido</p>
            </div>
            <Switch
              id="emailOnNewOrder"
              checked={settings.notifications.emailOnNewOrder}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailOnNewOrder: checked },
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailOnLowStock">Alertas de Stock Bajo</Label>
              <p className="text-sm text-muted-foreground">Recibe un email cuando un producto tenga poco stock</p>
            </div>
            <Switch
              id="emailOnLowStock"
              checked={settings.notifications.emailOnLowStock}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailOnLowStock: checked },
                }))
              }
            />
          </div>

          {settings.notifications.emailOnLowStock && (
            <div className="ml-6">
              <Label htmlFor="lowStockThreshold">Umbral de Stock Bajo</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="1"
                max="100"
                value={settings.notifications.lowStockThreshold}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      lowStockThreshold: Number.parseInt(e.target.value) || 5,
                    },
                  }))
                }
                className="w-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Alertar cuando el stock sea menor o igual a este número
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Configuración"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="bg-transparent">
          Restablecer
        </Button>
      </div>
    </div>
  )
}
