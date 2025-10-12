"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SplashScreen } from "@/components/splash-screen"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
      <Analytics />
    </>
  )
}
