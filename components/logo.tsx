"use client"

import { useTheme } from "@/contexts/theme-context"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const { theme } = useTheme()

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        src={theme === "dark" ? "/alterego-logo-symbol.png" : "/alterego-logo-light.png"}
        alt="ALTEREGO"
        fill
        className="object-contain transition-opacity duration-300"
        priority
      />
    </div>
  )
}
