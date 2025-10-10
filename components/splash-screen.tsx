"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none">
        {/* Content hidden during fade out */}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto animate-float">
          <Image
            src={theme === "dark" ? "/alterego-logo-symbol.png" : "/alterego-logo-light.png"}
            alt="ALTEREGO"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Name */}
        <div className="space-y-4">
          <h1 className="text-6xl font-serif text-foreground tracking-wider animate-slide-up">
            ALTER
            <span className="inline-block" style={{ transform: "scaleX(-1)" }}>
              E
            </span>
            GO
          </h1>

          {/* Captivating Slogan */}
          <p className="text-xl text-muted-foreground font-light tracking-wide animate-slide-up-delay max-w-md mx-auto">
            Despierta tu lado más seductor
          </p>

          <p className="text-2xl text-accent font-semibold animate-slide-up-delay-2 drop-shadow-lg">
            Tu lado oculto, al descubierto.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-12">
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div className="w-full h-full bg-accent rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
