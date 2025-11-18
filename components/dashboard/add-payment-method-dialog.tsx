"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from 'lucide-react'
import { savePaymentMethod } from "@/lib/payments"
import { useAuth } from "@/contexts/auth-context"
import { colombianBanks } from "@/lib/colombia-data"

interface AddPaymentMethodDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPaymentMethodDialog({ isOpen, onClose, onSuccess }: AddPaymentMethodDialogProps) {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<"nequi" | "daviplata" | "bre-b" | "efectivo" | "addi">("nequi")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [breBKey, setBreBKey] = useState("")
  const [breBBank, setBreBBank] = useState("")
  const [addiCedula, setAddiCedula] = useState("")
  const [addiPhone, setAddiPhone] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    } else if (selectedMethod === "addi") {
      if (!addiCedula || addiCedula.length < 6) {
        newErrors.push("Cédula de ciudadanía inválida (mínimo 6 dígitos)")
      }
      if (!addiPhone || addiPhone.length < 10) {
        newErrors.push("Número de teléfono inválido (mínimo 10 dígitos)")
      }
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSave = async () => {
    if (!user) return

    const isValid = validatePayment()
    if (!isValid) return

    setIsProcessing(true)

    // Simular verificación
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let methodName = ""
    let methodDetails = ""

    if (selectedMethod === "nequi") {
      methodName = "Nequi"
      methodDetails = phoneNumber
    } else if (selectedMethod === "daviplata") {
      methodName = "Daviplata"
      methodDetails = phoneNumber
    } else if (selectedMethod === "bre-b") {
      methodName = "Bre-B"
      methodDetails = `${breBBank} - ${breBKey}`
    } else if (selectedMethod === "addi") {
      methodName = "Addi"
      methodDetails = `CC: ${addiCedula} - Tel: ${addiPhone}`
    } else {
      methodName = "Pago en Efectivo"
      methodDetails = "Efectivo"
    }

    savePaymentMethod({
      userId: user.id,
      type: selectedMethod as any,
      last4: methodDetails.slice(-4),
      brand: methodName,
      bankName: selectedMethod === "bre-b" ? breBBank : undefined,
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

  const resetForm = () => {
    setPhoneNumber("")
    setBreBKey("")
    setBreBBank("")
    setAddiCedula("")
    setAddiPhone("")
    setErrors([])
    setSelectedMethod("nequi")
  }

  const handleClose = () => {
    if (!isProcessing && !showSuccess) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
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

            <div className="mt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-method" className="text-foreground">
                  Selecciona el método de pago
                </Label>
                <Select value={selectedMethod} onValueChange={(value: any) => setSelectedMethod(value)}>
                  <SelectTrigger id="payment-method" className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="nequi" className="text-foreground">Nequi</SelectItem>
                    <SelectItem value="daviplata" className="text-foreground">Daviplata</SelectItem>
                    <SelectItem value="bre-b" className="text-foreground">Bre-B</SelectItem>
                    <SelectItem value="efectivo" className="text-foreground">Pago en Efectivo</SelectItem>
                    <SelectItem value="addi" className="text-foreground">Addi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedMethod === "nequi" || selectedMethod === "daviplata") && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Número de teléfono</Label>
                  <Input id="phone" type="tel" placeholder="3001234567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} maxLength={10} className="bg-background border-border text-foreground" />
                  <p className="text-xs text-muted-foreground">Ingresa el número asociado a tu cuenta de {selectedMethod === "nequi" ? "Nequi" : "Daviplata"}</p>
                </div>
              )}

              {selectedMethod === "bre-b" && (
                <div className="space-y-2">
                  <Label htmlFor="breb-key" className="text-foreground">Llave Bre-B</Label>
                  <Input id="breb-key" type="text" placeholder="Ingresa tu llave" value={breBKey} onChange={(e) => setBreBKey(e.target.value)} className="bg-background border-border text-foreground" />
                  <p className="text-xs text-muted-foreground">Ingresa tu número de cuenta o identificador de Bre-B</p>
                  <Label htmlFor="breb-bank" className="text-foreground mt-4">Seleccionar banco</Label>
                  <Select value={breBBank} onValueChange={setBreBBank}>
                    <SelectTrigger id="breb-bank" className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Selecciona tu banco" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {colombianBanks.map((bank) => (<SelectItem key={bank} value={bank} className="text-foreground">{bank}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedMethod === "addi" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addi-cedula" className="text-foreground">Cédula de Ciudadanía</Label>
                    <Input id="addi-cedula" type="text" placeholder="1234567890" value={addiCedula} onChange={(e) => setAddiCedula(e.target.value.replace(/\D/g, ""))} maxLength={12} className="bg-background border-border text-foreground" />
                    <p className="text-xs text-muted-foreground">Ingresa tu número de cédula</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addi-phone" className="text-foreground">Número de Teléfono</Label>
                    <Input id="addi-phone" type="tel" placeholder="3001234567" value={addiPhone} onChange={(e) => setAddiPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} className="bg-background border-border text-foreground" />
                    <p className="text-xs text-muted-foreground">Ingresa tu número de teléfono asociado a Addi</p>
                  </div>
                </div>
              )}

              {selectedMethod === "efectivo" && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-500">Con Pago en Efectivo, pagarás cuando recibas tu pedido. El repartidor recibirá el pago en efectivo.</p>
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
                <Button type="button" variant="outline" onClick={handleClose} disabled={isProcessing} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isProcessing} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
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
