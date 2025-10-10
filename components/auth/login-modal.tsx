"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { RecaptchaVerification } from "./recaptcha-verification"
import { PasswordRecovery } from "./password-recovery"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, isLoading } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false)
  const [pendingLoginData, setPendingLoginData] = useState<{ email: string; password: string } | null>(null)

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

    if (isAdminEmail) {
      const adminUser = {
        id: "admin-001",
        email: "altergo102@gmail.com",
        name: "Administrador",
        isAdmin: true,
      }

      localStorage.setItem("alterego-user", JSON.stringify(adminUser))
      onClose()
      router.push("/admin")
      return
    }

    setPendingLoginData({ email: loginData.email, password: loginData.password })
    setShowRecaptcha(true)
  }

  const completeLogin = async () => {
    if (!pendingLoginData) return

    const success = await login(pendingLoginData.email, pendingLoginData.password)
    if (success) {
      onClose()
      setShowRecaptcha(false)
      setPendingLoginData(null)
      // Check if admin and redirect
      const user = JSON.parse(localStorage.getItem("alterego-user") || "{}")
      if (user.isAdmin) {
        router.push("/admin")
      }
    } else {
      setError("Credenciales incorrectas")
      setShowRecaptcha(false)
      setPendingLoginData(null)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (registerData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    const success = await register(registerData.email, registerData.password, registerData.name)
    if (success) {
      onClose()
    } else {
      setError("Error al crear la cuenta")
    }
  }

  if (showPasswordRecovery) {
    return (
      <PasswordRecovery
        isOpen={isOpen}
        onClose={() => {
          setShowPasswordRecovery(false)
          onClose()
        }}
        onBack={() => setShowPasswordRecovery(false)}
      />
    )
  }

  if (showRecaptcha) {
    return (
      <RecaptchaVerification
        isOpen={isOpen}
        onClose={() => {
          setShowRecaptcha(false)
          setPendingLoginData(null)
          onClose()
        }}
        onVerified={completeLogin}
        onBack={() => {
          setShowRecaptcha(false)
          setPendingLoginData(null)
        }}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/95 border-ruby-600">
        <DialogHeader>
          <DialogTitle className="text-white text-center">ALTERƎGO</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-ruby-600">
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="text-white data-[state=active]:bg-ruby-600">
              Registrarse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              {!isAdminEmail && (
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-900 border-gray-700 text-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {error && <p className="text-ruby-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full bg-ruby-600 hover:bg-ruby-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar Sesión"}
              </Button>

              {!isAdminEmail && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPasswordRecovery(true)}
                    className="text-xs text-ruby-400 hover:text-ruby-300 underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-white">
                  Nombre
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-white">
                  Contraseña
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-400">Mínimo 8 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="text-white">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="register-confirm"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              {error && <p className="text-ruby-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full bg-ruby-600 hover:bg-ruby-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registrarse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
