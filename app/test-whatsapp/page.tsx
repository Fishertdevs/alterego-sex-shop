"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStoreSettings } from "@/hooks/use-store-settings"

export default function TestWhatsAppPage() {
  const { settings } = useStoreSettings()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("Hola, este es un mensaje de prueba")
  const [generatedUrl, setGeneratedUrl] = useState("")

  useEffect(() => {
    if (settings?.store_phone) {
      const cleaned = settings.store_phone.replace(/\D/g, "")
      setPhoneNumber(cleaned)
    }
  }, [settings])

  const generateUrl = () => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    setGeneratedUrl(url)
    console.log("[v0] Test WhatsApp - Generated URL:", url)
    return url
  }

  const testWhatsApp = (withMessage: boolean) => {
    const url = withMessage ? generateUrl() : `https://wa.me/${phoneNumber}`
    console.log("[v0] Test WhatsApp - Opening URL:", url)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const testApi = () => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    console.log("[v0] Test WhatsApp - Opening API URL:", url)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Herramienta de Diagnóstico WhatsApp</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Configura el número y mensaje para probar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Número de WhatsApp (formato: 573133462402)</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="573133462402"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Número actual de la tienda: {settings?.store_phone || "Cargando..."}
              </p>
            </div>

            <div>
              <Label htmlFor="message">Mensaje de prueba</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí"
                rows={4}
              />
            </div>

            <Button onClick={generateUrl} className="w-full">
              Generar URL
            </Button>

            {generatedUrl && (
              <div className="p-4 bg-muted rounded-lg">
                <Label>URL Generada:</Label>
                <p className="text-xs break-all mt-2 font-mono">{generatedUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pruebas</CardTitle>
            <CardDescription>Prueba diferentes métodos para abrir WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Button onClick={() => testWhatsApp(false)} variant="outline" className="w-full">
                1. Abrir WhatsApp SIN mensaje (verificar si el número existe)
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Si esto no funciona, el número NO está registrado en WhatsApp
              </p>
            </div>

            <div>
              <Button onClick={() => testWhatsApp(true)} variant="outline" className="w-full">
                2. Abrir WhatsApp CON mensaje (wa.me)
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Método estándar usado en la tienda</p>
            </div>

            <div>
              <Button onClick={testApi} variant="outline" className="w-full bg-transparent">
                3. Abrir WhatsApp CON mensaje (api.whatsapp.com)
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Método alternativo de la API de WhatsApp</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Si el mensaje NO aparece:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Verifica que el número esté registrado en WhatsApp (prueba 1)</li>
                <li>Verifica que el número pueda recibir mensajes de desconocidos</li>
                <li>Intenta con el método alternativo (prueba 3)</li>
                <li>El número puede estar limitado por WhatsApp si es nuevo</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Números de prueba:</h3>
              <div className="space-y-1">
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => {
                    setPhoneNumber("573168192054")
                    setMessage("Prueba con número anterior")
                  }}
                >
                  Probar con número anterior (3168192054)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
