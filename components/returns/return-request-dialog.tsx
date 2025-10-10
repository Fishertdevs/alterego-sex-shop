"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { Order } from "@/lib/orders"
import { createReturnRequest } from "@/lib/returns"
import { AlertCircle } from "lucide-react"

interface ReturnRequestDialogProps {
  order: Order
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const RETURN_REASONS = [
  { value: "defective", label: "Producto defectuoso o dañado" },
  { value: "wrong-item", label: "Recibí el producto equivocado" },
  { value: "not-as-described", label: "No coincide con la descripción" },
  { value: "changed-mind", label: "Cambié de opinión" },
  { value: "other", label: "Otro motivo" },
]

export function ReturnRequestDialog({ order, userId, open, onOpenChange, onSuccess }: ReturnRequestDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [description, setDescription] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError("Por favor selecciona un motivo")
      return
    }

    if (selectedItems.size === 0) {
      setError("Por favor selecciona al menos un producto")
      return
    }

    if (!description.trim()) {
      setError("Por favor describe el motivo de la devolución")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const itemsToReturn = order.items
        .filter((_, index) => selectedItems.has(index))
        .map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        }))

      createReturnRequest(order.id, userId, itemsToReturn, selectedReason, description)

      // Reset form
      setSelectedReason("")
      setDescription("")
      setSelectedItems(new Set())

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedItems(newSelected)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Devolución</DialogTitle>
          <DialogDescription>Pedido #{order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Items */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Productos a devolver</Label>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Checkbox checked={selectedItems.has(index)} onCheckedChange={() => toggleItem(index)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity} • ${item.price.toLocaleString("es-CO")} COP
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ${(item.price * item.quantity).toLocaleString("es-CO")} COP
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Motivo de la devolución</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {RETURN_REASONS.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="font-normal cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold mb-3 block">
              Descripción detallada
            </Label>
            <Textarea
              id="description"
              placeholder="Por favor describe el motivo de tu devolución con el mayor detalle posible..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Summary */}
          {selectedItems.size > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Monto a reembolsar</p>
              <p className="text-2xl font-bold text-foreground">
                $
                {order.items
                  .filter((_, index) => selectedItems.has(index))
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString("es-CO")}{" "}
                COP
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
