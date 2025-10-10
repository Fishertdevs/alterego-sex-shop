"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Building2, CheckCircle2 } from "lucide-react"
import { CardPayment, type CardPaymentData } from "@/components/checkout/card-payment"
import { PSEPayment, type PSEPaymentData } from "@/components/checkout/pse-payment"
import { savePaymentMethod } from "@/lib/payments"
import { useAuth } from "@/contexts/auth-context"

interface AddPaymentMethodDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPaymentMethodDialog({ isOpen, onClose, onSuccess }: AddPaymentMethodDialogProps) {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<"card" | "pse">("card")
  const [cardData, setCardData] = useState<CardPaymentData | null>(null)
  const [pseData, setPSEData] = useState<PSEPaymentData | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

  const getCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, "")
    if (/^4/.test(cleaned)) return "Visa"
    if (/^5[1-5]/.test(cleaned)) return "Mastercard"
    if (/^3[47]/.test(cleaned)) return "American Express"
    return "Tarjeta"
  }

  const handleSave = async () => {
    if (!user) return

    let isValid = false

    if (selectedMethod === "card") {
      isValid = validateCardPayment()
      if (isValid && cardData) {
        setIsProcessing(true)

        // Simular verificación de tarjeta
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const last4 = cardData.cardNumber.replace(/\s/g, "").slice(-4)
        const brand = getCardBrand(cardData.cardNumber)

        savePaymentMethod({
          userId: user.id,
          type: "card",
          last4,
          brand,
          isDefault: false,
        })

        setIsProcessing(false)
        setShowSuccess(true)

        setTimeout(() => {
          setShowSuccess(false)
          onSuccess()
          onClose()
          resetForm()
        }, 2000)
      }
    } else {
      isValid = validatePSEPayment()
      if (isValid && pseData) {
        setIsProcessing(true)

        // Simular verificación de cuenta PSE
        await new Promise((resolve) => setTimeout(resolve, 1500))

        savePaymentMethod({
          userId: user.id,
          type: "pse",
          bankName: pseData.bank,
          isDefault: false,
        })

        setIsProcessing(false)
        setShowSuccess(true)

        setTimeout(() => {
          setShowSuccess(false)
          onSuccess()
          onClose()
          resetForm()
        }, 2000)
      }
    }
  }

  const resetForm = () => {
    setCardData(null)
    setPSEData(null)
    setErrors([])
    setSelectedMethod("card")
  }

  const handleClose = () => {
    if (!isProcessing && !showSuccess) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">¡Método de Pago Agregado!</h3>
            <p className="text-muted-foreground text-center">
              Tu método de pago ha sido guardado exitosamente y está listo para usar.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Agregar Método de Pago</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as "card" | "pse")}>
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Tarjeta de Crédito
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    "Guardar Método de Pago"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
