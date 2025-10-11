"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2, Mail, Lock, UserIcon, Facebook, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { PasswordStrengthIndicator } from "./password-strength-indicator"
import { Separator } from "@/components/ui/separator"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, isLoading } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const isAdminEmail = loginData.email === "altergo102@gmail.com"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (isAdminEmail) {
      console.log("[v0] Admin login detected for:", loginData.email)

      const adminUser = {
        id: "admin-001",
        email: "altergo102@gmail.com",
        name: "Administrador",
        isAdmin: true,
      }

      try {
        localStorage.setItem("alterego-user", JSON.stringify(adminUser))
        console.log("[v0] Admin user saved to localStorage:", adminUser)

        if (rememberMe) {
          localStorage.setItem("alterego-remember", "true")
          console.log("[v0] Remember me enabled")
        }

        // Verificar que se guardó correctamente
        const savedUser = localStorage.getItem("alterego-user")
        console.log("[v0] Verification - User in localStorage:", savedUser)

        setSuccess("¡Bienvenido Administrador!")

        // Esperar un momento antes de cerrar y redirigir
        setTimeout(() => {
          onClose()
          console.log("[v0] Redirecting to /admin")
          router.push("/admin")
          // Forzar recarga para asegurar que el contexto se actualice
          window.location.href = "/admin"
        }, 500)

        return
      } catch (error) {
        console.error("[v0] Error saving admin to localStorage:", error)
        setError("Error al iniciar sesión. Por favor intenta de nuevo.")
        return
      }
    }

    const success = await login(loginData.email, loginData.password)
    if (success) {
      if (rememberMe) {
        localStorage.setItem("alterego-remember", "true")
      }
      setSuccess("¡Inicio de sesión exitoso!")
      setTimeout(() => {
        onClose()
      }, 1000)
    } else {
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (registerData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    // Validar contraseña fuerte
    const hasUpperCase = /[A-Z]/.test(registerData.password)
    const hasLowerCase = /[a-z]/.test(registerData.password)
    const hasNumber = /[0-9]/.test(registerData.password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError("La contraseña debe contener al menos una mayúscula, una minúscula y un número")
      return
    }

    const success = await register(registerData.email, registerData.password, registerData.name)
    if (success) {
      setSuccess("¡Cuenta creada exitosamente! Por favor verifica tu email.")
      setTimeout(() => {
        onClose()
      }, 2000)
    } else {
      setError("Error al crear la cuenta. El email ya está registrado.")
    }
  }

  const handleGoogleLogin = () => {
    // Implementar Google OAuth
    console.log("Google login")
  }

  const handleFacebookLogin = () => {
    // Implementar Facebook login
    console.log("Facebook login")
  }

  const handleWhatsAppContact = () => {
    const message = "Hola! Necesito ayuda para registrarme en ALTERƎGO"
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleGuestCheckout = () => {
    localStorage.setItem("alterego-guest", "true")
    onClose()
    router.push("/checkout")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center text-2xl font-serif">
            ALTER
            <span className="inline-block" style={{ transform: "scaleX(-1)" }}>
              E
            </span>
            GO
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Accede a tu cuenta o crea una nueva
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {/* Social Login Buttons */}
            <div className="space-y-2">
              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleFacebookLogin}>
                <Facebook className="w-5 h-5 mr-2" />
                Continuar con Facebook
              </Button>

              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleWhatsAppContact}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Ayuda por WhatsApp
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                O continúa con email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {!isAdminEmail && (
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-input border-border text-foreground pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Recordar sesión (30 días)
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                  <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar Sesión"}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleGuestCheckout}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Continuar como invitado
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-foreground">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Nombre completo
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-foreground">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="tu@email.com"
                  required
                />
                <p className="text-xs text-muted-foreground">Te enviaremos un código de verificación</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Contraseña
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <PasswordStrengthIndicator password={registerData.password} />
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, incluye mayúscula, minúscula y número
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="text-foreground">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirmar Contraseña
                </Label>
                <Input
                  id="register-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-input border-border text-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                  <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Cuenta"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Al registrarte, aceptas nuestros términos y condiciones
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
