"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, useState } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SplashScreen } from "@/components/splash-screen"

function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return <>{children}</>
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <SplashWrapper>
              <Suspense fallback={null}>{children}</Suspense>
            </SplashWrapper>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
      <Analytics />
    </>
  )
}
