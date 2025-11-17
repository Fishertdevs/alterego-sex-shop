"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { colombianBanks } from "@/lib/colombia-data"

interface PaymentMethodProps {
  onContinue: (paymentData: PaymentData) => void
  onBack: () => void
}

export interface PaymentData {
  method: "nequi" | "daviplata" | "bre-b" | "efectivo"
  phoneNumber?: string
  breBKey?: string
  breBBank?: string
}

export function PaymentMethod({ onContinue, onBack }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<"nequi" | "daviplata" | "bre-b" | "efectivo">("nequi")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [breBKey, setBreBKey] = useState("")
  const [breBBank, setBreBBank] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const validatePayment = (): boolean => {
    const newErrors: string[] = []

    if (selectedMethod === "nequi" || selectedMethod === "daviplata") {
      if (!phoneNumber || phoneNumber.length < 10) {
        newErrors.push("Número de teléfono inválido (mínimo 10 dígitos)")
      }
    } else if (selectedMethod === "bre-b") {
      if (!breBKey || breBKey.trim().length < 5) {
        newErrors.push("La llave de Bre-B es requerida")
      }
      if (!breBBank) {
        newErrors.push("Debes seleccionar un banco")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleContinue = () => {
    const isValid = validatePayment()
    if (!isValid) return

    const paymentData: PaymentData = {
      method: selectedMethod,
    }

    if (selectedMethod === "nequi" || selectedMethod === "daviplata") {
      paymentData.phoneNumber = phoneNumber
    } else if (selectedMethod === "bre-b") {
      paymentData.breBKey = breBKey
      paymentData.breBBank = breBBank
    }

    onContinue(paymentData)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Método de Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-foreground text-base">Selecciona tu método de pago</Label>
          <RadioGroup value={selectedMethod} onValueChange={(value: any) => setSelectedMethod(value)}>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="nequi" id="nequi" />
              <Label htmlFor="nequi" className="flex-1 cursor-pointer text-foreground">
                Nequi
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="daviplata" id="daviplata" />
              <Label htmlFor="daviplata" className="flex-1 cursor-pointer text-foreground">
                Daviplata
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="bre-b" id="bre-b" />
              <Label htmlFor="bre-b" className="flex-1 cursor-pointer text-foreground">
                Bre-B
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="efectivo" id="efectivo" />
              <Label htmlFor="efectivo" className="flex-1 cursor-pointer text-foreground">
                Pago en Efectivo
              </Label>
            </div>
          </RadioGroup>
        </div>

        {(selectedMethod === "nequi" || selectedMethod === "daviplata") && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Número de teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="3001234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className="bg-background border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Ingresa el número asociado a tu cuenta de {selectedMethod === "nequi" ? "Nequi" : "Daviplata"}
            </p>
          </div>
        )}

        {selectedMethod === "bre-b" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="breb-key" className="text-foreground">
                Llave Bre-B
              </Label>
              <Input
                id="breb-key"
                type="text"
                placeholder="Ingresa tu llave"
                value={breBKey}
                onChange={(e) => setBreBKey(e.target.value)}
                className="bg-background border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground">Ingresa tu número de cuenta o identificador de Bre-B</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breb-bank" className="text-foreground">
                Seleccionar banco
              </Label>
              <Select value={breBBank} onValueChange={setBreBBank}>
                <SelectTrigger id="breb-bank" className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecciona tu banco" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {colombianBanks.map((bank) => (
                    <SelectItem key={bank} value={bank} className="text-foreground">
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedMethod === "efectivo" && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-500">
              Con Pago en Efectivo, pagarás cuando recibas tu pedido. El repartidor recibirá el pago en efectivo.
            </p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <ul className="text-sm text-red-500 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Volver
          </Button>
          <Button onClick={handleContinue} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Procesar Pago
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
