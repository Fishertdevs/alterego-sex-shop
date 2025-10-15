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

  const filterClass = theme === "dark" ? "invert brightness-200" : "brightness-0"

  return (
    null
  )
}
