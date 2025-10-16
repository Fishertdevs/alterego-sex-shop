import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, MessageCircle } from "lucide-react"

export function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/alter.egooo0?igsh=OG14eW1hcXZuaHZx",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/alterego",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/573001234567",
    },
  ]

  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Logo */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wYVRkKtwn97uTDeW7IUUlnxwjyANRa.png"
            alt="ALTERƎGO Logo"
            width={120}
            height={120}
            quality={100}
            priority
            className="object-contain transition-all duration-300 hover:scale-105 invert brightness-200"
            style={{ imageRendering: "crisp-edges" }}
          />

          {/* Frase */}
          <p className="text-sm text-white/70 italic font-serif text-center max-w-md">Despierta tu lado más seductor</p>

          {/* Iconos de redes sociales */}
          <div className="flex gap-4 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-12 rounded-full border border-white/20 hover:border-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                aria-label={social.name}
              >
                <social.icon className="h-6 w-6" />
              </a>
            ))}
          </div>

          {/* Enlaces de políticas */}
          <nav className="flex flex-wrap gap-4 justify-center text-sm mt-2">
            <Link href="/politicas-privacidad" className="hover:text-[#D4AF37] transition-colors text-center">
              Políticas de privacidad
            </Link>
            <Link href="/politicas-cookies" className="hover:text-[#D4AF37] transition-colors text-center">
              Políticas de cookies
            </Link>
            <Link href="/terminos-condiciones" className="hover:text-[#D4AF37] transition-colors text-center">
              Términos y condiciones
            </Link>
            <Link href="/devolucion-reembolso" className="hover:text-[#D4AF37] transition-colors text-center">
              Devolución y reembolso
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm border-t border-white/10 pt-4">
          <p>© 2025 - Todos los derechos reservados!</p>
        </div>
      </div>
    </footer>
  )
}
