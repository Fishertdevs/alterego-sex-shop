"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, ArrowLeft } from "lucide-react"

interface RecaptchaVerificationProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  onBack: () => void
}

export function RecaptchaVerification({ isOpen, onClose, onVerified, onBack }: RecaptchaVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleVerify = async () => {
    setIsVerifying(true)

    // Simulate reCAPTCHA verification
    // In production, this would call Google's reCAPTCHA API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful verification
    const mockToken = `recaptcha_token_${Date.now()}`
    setCaptchaToken(mockToken)

    // Call the onVerified callback
    onVerified()

    setIsVerifying(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/95 border-ruby-600">
        <DialogHeader>
          <DialogTitle className="text-white text-center flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-ruby-500" />
            Verificación de Seguridad
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Por favor, completa la verificación para continuar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mock reCAPTCHA box */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-ruby-500 rounded flex items-center justify-center">
                {captchaToken && <div className="w-3 h-3 bg-ruby-500 rounded-sm" />}
              </div>
              <span className="text-white">No soy un robot</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>reCAPTCHA</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !!captchaToken}
              className="w-full bg-ruby-600 hover:bg-ruby-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verificando...
                </>
              ) : captchaToken ? (
                "Verificado ✓"
              ) : (
                "Verificar"
              )}
            </Button>

            <Button onClick={onBack} variant="ghost" className="w-full text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Esta verificación nos ayuda a proteger tu cuenta contra accesos no autorizados
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
