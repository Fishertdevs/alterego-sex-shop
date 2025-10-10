"use client"

import { Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SocialLinks() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/alter.egooo0?igsh=OG14eW1hcXZuaHZx",
      color: "hover:text-accent",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/alterego",
      color: "hover:text-accent",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Síguenos</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Mantente al día con nuestras últimas novedades, consejos y promociones exclusivas
          </p>

          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="ghost"
                size="icon"
                className={`h-12 w-12 rounded-full border border-border hover:border-accent transition-all duration-300 hover-scale ${social.color}`}
                onClick={() => window.open(social.url, "_blank")}
              >
                <social.icon className="h-6 w-6" />
                <span className="sr-only">{social.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
