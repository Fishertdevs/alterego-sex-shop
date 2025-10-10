"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

interface PasswordRecoveryProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
}

export function PasswordRecovery({ isOpen, onClose, onBack }: PasswordRecoveryProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate sending recovery email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if email exists in localStorage
    const users = JSON.parse(localStorage.getItem("alterego-users") || "[]")
    const userExists = users.some((user: any) => user.email === email)

    if (!userExists && email !== "admin@alterego.com") {
      setError("No se encontró una cuenta con este correo electrónico")
      setIsLoading(false)
      return
    }

    // Mock successful email send
    setEmailSent(true)
    setIsLoading(false)

    // Store recovery token
    const recoveryToken = `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(
      `recovery_${email}`,
      JSON.stringify({
        token: recoveryToken,
        expires: Date.now() + 3600000, // 1 hour
      }),
    )
  }

  if (emailSent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-black/95 border-ruby-600">
          <DialogHeader>
            <DialogTitle className="text-white text-center flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Correo Enviado
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center space-y-3">
              <Mail className="h-12 w-12 text-ruby-500 mx-auto" />
              <p className="text-white">
                Hemos enviado un correo electrónico a <strong className="text-ruby-400">{email}</strong>
              </p>
              <p className="text-sm text-gray-400">
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={onClose} className="w-full bg-ruby-600 hover:bg-ruby-700">
                Entendido
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/95 border-ruby-600">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Recuperar Contraseña</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-email" className="text-white">
              Correo Electrónico
            </Label>
            <Input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button type="submit" disabled={isLoading} className="w-full bg-ruby-600 hover:bg-ruby-700">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Correo de Recuperación
                </>
              )}
            </Button>

            <Button onClick={onBack} type="button" variant="ghost" className="w-full text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
