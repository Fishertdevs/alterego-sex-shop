"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Building2 } from "lucide-react"
import { CardPayment, type CardPaymentData } from "./card-payment"
import { PSEPayment, type PSEPaymentData } from "./pse-payment"

interface PaymentMethodProps {
  onContinue: (paymentData: PaymentData) => void
  onBack: () => void
}

export interface PaymentData {
  method: "card" | "pse"
  cardData?: CardPaymentData
  pseData?: PSEPaymentData
}

export function PaymentMethod({ onContinue, onBack }: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "pse">("card")
  const [cardData, setCardData] = useState<CardPaymentData | null>(null)
  const [pseData, setPSEData] = useState<PSEPaymentData | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const validateCardPayment = (): boolean => {
    const newErrors: string[] = []

    if (!cardData?.cardNumber || cardData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.push("Número de tarjeta inválido")
    }

    if (!cardData?.cardName || cardData.cardName.trim().length < 3) {
      newErrors.push("Nombre en la tarjeta es requerido")
    }

    if (!cardData?.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.push("Fecha de vencimiento inválida")
    }

    if (!cardData?.cvv || cardData.cvv.length < 3) {
      newErrors.push("CVV inválido")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const validatePSEPayment = (): boolean => {
    const newErrors: string[] = []

    if (!pseData?.bank) {
      newErrors.push("Debes seleccionar un banco")
    }

    if (!pseData?.personType) {
      newErrors.push("Debes seleccionar el tipo de persona")
    }

    if (!pseData?.documentType) {
      newErrors.push("Debes seleccionar el tipo de documento")
    }

    if (!pseData?.documentNumber || pseData.documentNumber.length < 5) {
      newErrors.push("Número de documento inválido")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleContinue = () => {
    let isValid = false

    if (selectedMethod === "card") {
      isValid = validateCardPayment()
      if (isValid && cardData) {
        onContinue({ method: "card", cardData })
      }
    } else {
      isValid = validatePSEPayment()
      if (isValid && pseData) {
        onContinue({ method: "pse", pseData })
      }
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Método de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as "card" | "pse")}>
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tarjeta
            </TabsTrigger>
            <TabsTrigger value="pse" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              PSE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-6">
            <CardPayment onDataChange={setCardData} />
          </TabsContent>

          <TabsContent value="pse" className="mt-6">
            <PSEPayment onDataChange={setPSEData} />
          </TabsContent>
        </Tabs>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
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
