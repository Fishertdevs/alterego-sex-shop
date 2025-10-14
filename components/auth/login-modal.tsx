"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2, Mail, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()
  const { setUserDirectly } = useAuth()

  const [loginData, setLoginData] = useState({
    email: "",
  })

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    console.log("[v0] LoginModal - Attempting admin login for:", loginData.email)

    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("*")
        .eq("email", loginData.email)
        .single()

      if (adminError || !adminData) {
        console.log("[v0] LoginModal - Admin not found in database")
        setError("Este email no tiene permisos de administrador")
        setLoading(false)
        return
      }

      const adminUser = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        isAdmin: true,
      }

      console.log("[v0] LoginModal - Admin found, setting user:", adminUser)

      setUserDirectly(adminUser)

      setSuccess("¡Bienvenido Administrador!")

      setTimeout(() => {
        console.log("[v0] LoginModal - Redirecting to admin panel")
        onClose()
        router.push("/admin")
        // Force page reload to ensure context is updated
        window.location.href = "/admin"
      }, 500)
    } catch (error) {
      console.error("[v0] LoginModal - Error en login admin:", error)
      setError("Error al iniciar sesión. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center text-2xl font-serif flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Acceso Administrativo
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-serif">
            Solo para administradores de ALTEREGO
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-foreground font-serif">
              <Mail className="w-4 h-4 inline mr-2" />
              Email de Administrador
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ email: e.target.value })}
              className="bg-input border-border text-foreground font-serif"
              placeholder="admin@alterego.com"
              required
            />
            <p className="text-xs text-muted-foreground font-serif">
              Ingresa tu email de administrador para acceder al panel
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-sm font-serif">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
              <p className="text-green-600 dark:text-green-400 text-sm font-serif">{success}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acceder al Panel"}
          </Button>

          <p className="text-xs text-center text-muted-foreground font-serif">
            ¿No tienes acceso? Contacta al administrador principal
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
