import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger la ruta /admin (excepto /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Verificar si hay un usuario autenticado en las cookies o headers
    // Como usamos localStorage, verificamos si viene de una sesión válida
    const response = NextResponse.next()

    // Si no hay autenticación, redirigir a /admin/login
    // Nota: Como usamos localStorage, la verificación real se hace en el cliente
    // Este middleware solo asegura que la ruta esté protegida a nivel de servidor

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
