"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Building2 } from "lucide-react"

interface PSEPaymentProps {
  onDataChange: (data: PSEPaymentData) => void
}

export interface PSEPaymentData {
  bank: string
  personType: string
  documentType: string
  documentNumber: string
}

const colombianBanks = [
  "Bancolombia",
  "Banco de Bogotá",
  "Davivienda",
  "BBVA Colombia",
  "Banco de Occidente",
  "Banco Popular",
  "Banco Caja Social",
  "Banco AV Villas",
  "Banco Agrario",
  "Banco Falabella",
  "Banco Pichincha",
  "Banco Cooperativo Coopcentral",
  "Banco Santander",
  "Banco GNB Sudameris",
  "Banco Finandina",
  "Bancoomeva",
  "Banco Serfinanza",
  "Banco W",
  "Banco Mundo Mujer",
  "Nequi",
  "Daviplata",
]

export function PSEPayment({ onDataChange }: PSEPaymentProps) {
  const [formData, setFormData] = useState<PSEPaymentData>({
    bank: "",
    personType: "",
    documentType: "",
    documentNumber: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PSEPaymentData, string>>>({})

  const handleChange = (field: keyof PSEPaymentData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Pago con PSE</h3>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
        <p className="text-sm text-foreground">
          PSE (Pagos Seguros en Línea) te permite pagar directamente desde tu cuenta bancaria de forma segura.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bank" className="text-foreground">
          Selecciona tu Banco *
        </Label>
        <Select value={formData.bank} onValueChange={(value) => handleChange("bank", value)}>
          <SelectTrigger className={`bg-background border-border ${errors.bank ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Seleccionar banco" />
          </SelectTrigger>
          <SelectContent>
            {colombianBanks.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bank && <p className="text-sm text-red-500">{errors.bank}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="personType" className="text-foreground">
          Tipo de Persona *
        </Label>
        <Select value={formData.personType} onValueChange={(value) => handleChange("personType", value)}>
          <SelectTrigger className={`bg-background border-border ${errors.personType ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="natural">Persona Natural</SelectItem>
            <SelectItem value="juridica">Persona Jurídica</SelectItem>
          </SelectContent>
        </Select>
        {errors.personType && <p className="text-sm text-red-500">{errors.personType}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType" className="text-foreground">
            Tipo de Documento *
          </Label>
          <Select value={formData.documentType} onValueChange={(value) => handleChange("documentType", value)}>
            <SelectTrigger className={`bg-background border-border ${errors.documentType ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
              <SelectItem value="CE">Cédula de Extranjería</SelectItem>
              <SelectItem value="NIT">NIT</SelectItem>
              <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              <SelectItem value="PP">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
          {errors.documentType && <p className="text-sm text-red-500">{errors.documentType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentNumber" className="text-foreground">
            Número de Documento *
          </Label>
          <Input
            id="documentNumber"
            value={formData.documentNumber}
            onChange={(e) => handleChange("documentNumber", e.target.value.replace(/\D/g, ""))}
            className={`bg-background border-border ${errors.documentNumber ? "border-red-500" : ""}`}
            placeholder="1234567890"
          />
          {errors.documentNumber && <p className="text-sm text-red-500">{errors.documentNumber}</p>}
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
        <h4 className="font-semibold text-foreground mb-2">¿Cómo funciona PSE?</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Selecciona tu banco y completa la información</li>
          <li>Serás redirigido al portal de tu banco</li>
          <li>Ingresa con tus credenciales bancarias</li>
          <li>Confirma el pago y regresa a nuestra tienda</li>
        </ol>
      </div>
    </div>
  )
}
