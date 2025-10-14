import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Links de políticas */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
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

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>© 2025 - Todos los derechos reservados!</p>
        </div>
      </div>
    </footer>
  )
}
