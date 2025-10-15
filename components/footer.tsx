import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 mb-8">
          {/* Logo y branding - Izquierda */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <Image
              src="/images/design-mode/image.png"
              alt="ALTERƎGO Logo"
              width={150}
              height={100}
              className="object-contain transition-all duration-300 hover:scale-105 invert brightness-200"
            />
            <p className="text-sm text-white/70 italic font-serif max-w-xs text-center lg:text-left">
              Despierta tu lado más seductor
            </p>
          </div>

          {/* Links de políticas - Derecha */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
            <Link href="/politicas-privacidad" className="hover:text-primary transition-colors">
              Políticas de privacidad
            </Link>
            <Link href="/politicas-cookies" className="hover:text-primary transition-colors">
              Políticas de cookies
            </Link>
            <Link href="/terminos-condiciones" className="hover:text-primary transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/devolucion-reembolso" className="hover:text-primary transition-colors">
              Devolución y reembolso
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm border-t border-white/10 pt-6">
          <p>© 2025 - Todos los derechos reservados!</p>
        </div>
      </div>
    </footer>
  )
}
