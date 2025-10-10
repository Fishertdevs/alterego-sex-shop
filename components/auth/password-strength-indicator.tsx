"use client"

import { useMemo } from "react"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0

    // Length check
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 10

    // Character variety checks
    if (/[a-z]/.test(password)) score += 15
    if (/[A-Z]/.test(password)) score += 15
    if (/[0-9]/.test(password)) score += 15
    if (/[^a-zA-Z0-9]/.test(password)) score += 20

    let label = ""
    let color = ""

    if (score < 40) {
      label = "Débil"
      color = "bg-red-500"
    } else if (score < 60) {
      label = "Media"
      color = "bg-yellow-500"
    } else if (score < 80) {
      label = "Buena"
      color = "bg-blue-500"
    } else {
      label = "Fuerte"
      color = "bg-green-500"
    }

    return { score, label, color }
  }, [password])

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Fortaleza:</span>
        <span
          className={`text-xs font-medium ${
            strength.score < 40
              ? "text-red-500"
              : strength.score < 60
                ? "text-yellow-500"
                : strength.score < 80
                  ? "text-blue-500"
                  : "text-green-500"
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
    </div>
  )
}
