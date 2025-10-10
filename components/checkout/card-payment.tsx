"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"

interface CardPaymentProps {
  onDataChange: (data: CardPaymentData) => void
}

export interface CardPaymentData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

export function CardPayment({ onDataChange }: CardPaymentProps) {
  const [formData, setFormData] = useState<CardPaymentData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CardPaymentData, string>>>({})

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleChange = (field: keyof CardPaymentData, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value.replace(/\D/g, "").slice(0, 16))
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value.slice(0, 5))
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    const newData = { ...formData, [field]: formattedValue }
    setFormData(newData)
    onDataChange(newData)

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, "")
    if (/^4/.test(cleaned)) return "Visa"
    if (/^5[1-5]/.test(cleaned)) return "Mastercard"
    if (/^3[47]/.test(cleaned)) return "American Express"
    return null
  }

  const cardBrand = getCardBrand(formData.cardNumber)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Pago con Tarjeta</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-foreground">
          Número de Tarjeta *
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            value={formData.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            className={`bg-background border-border ${errors.cardNumber ? "border-red-500" : ""}`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {cardBrand && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-accent">
              {cardBrand}
            </span>
          )}
        </div>
        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName" className="text-foreground">
          Nombre en la Tarjeta *
        </Label>
        <Input
          id="cardName"
          value={formData.cardName}
          onChange={(e) => handleChange("cardName", e.target.value.toUpperCase())}
          className={`bg-background border-border ${errors.cardName ? "border-red-500" : ""}`}
          placeholder="JUAN PEREZ"
        />
        {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="text-foreground">
            Fecha de Vencimiento *
          </Label>
          <Input
            id="expiryDate"
            value={formData.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            className={`bg-background border-border ${errors.expiryDate ? "border-red-500" : ""}`}
            placeholder="MM/AA"
            maxLength={5}
          />
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-foreground">
            CVV *
          </Label>
          <Input
            id="cvv"
            type="password"
            value={formData.cvv}
            onChange={(e) => handleChange("cvv", e.target.value)}
            className={`bg-background border-border ${errors.cvv ? "border-red-500" : ""}`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Pago seguro:</span> Tu información está protegida con encriptación SSL de 256
          bits.
        </p>
      </div>
    </div>
  )
}
