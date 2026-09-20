import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook } from "lucide-react"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  )
}

export function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/alterego.shop1?igsh=MTdrcnY5bjI0czFobg==",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/alterego",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: "https://wa.me/573133462402?text=Hola%20Alterego%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20de%20los%20productos%20de%20la%20tienda",
    },
  ]

  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Logo */}
          <Image
            src="/images/design-mode/image(1).png"
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
