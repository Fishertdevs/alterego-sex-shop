"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, ShoppingCart, Sun, Moon } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Logo } from "@/components/logo"
import { SecurityPaymentBar } from "@/components/security-payment-bar"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    console.log("[v0] Navigation - User state:", user)

    // Check if user is in localStorage but not in context
    const checkLocalStorage = () => {
      const storedUser = localStorage.getItem("alterego-user")
      if (storedUser && !user) {
        console.log("[v0] Navigation - User in localStorage but not in context, triggering reload")
        window.dispatchEvent(new Event("auth-reload"))
      }
    }

    checkLocalStorage()

    // Check every 2 seconds for the first 10 seconds after mount
    const interval = setInterval(checkLocalStorage, 2000)
    setTimeout(() => clearInterval(interval), 10000)

    return () => clearInterval(interval)
  }, [user])

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/quienes-somos", label: "Quiénes Somos" },
    { href: "/productos", label: "Productos" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 hover-scale">
              <Logo size="md" />
              <span className="text-2xl font-serif font-bold text-foreground tracking-wide">
                ALTER
                <span className="inline-block" style={{ transform: "scaleX(-1)" }}>
                  E
                </span>
                GO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium font-serif"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground hover:text-accent hover:bg-accent/10 relative z-10"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCartDrawer(true)}
                className="text-foreground hover:text-accent hover:bg-accent/10 relative z-10"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs z-20">
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {user?.isAdmin ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground hidden sm:block font-serif">Bienvenido, Administrador</span>
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent font-serif"
                    >
                      Admin
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={logout}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : null}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-foreground hover:text-accent hover:bg-accent/10 relative z-10"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden animate-fade-in-up">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-foreground hover:text-accent transition-colors duration-300 font-medium font-serif"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="fixed top-16 w-full z-40">
        <SecurityPaymentBar />
      </div>

      {/* Modals */}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
  )
}
