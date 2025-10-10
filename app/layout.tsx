import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import { Suspense } from "react"
import ClientLayout from "./client-layout"
import { WhatsAppButton } from "@/components/social/whatsapp-button"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ALTEREGO - Tienda Íntima de Lujo",
  description:
    "Descubre tu alter ego con nuestra exclusiva colección de productos íntimos de lujo. ALTEREGO, donde la elegancia se encuentra con la sensualidad.",
  generator: "v0.app",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/alterego-logo-symbol.png", sizes: "any", type: "image/png" }],
    apple: [{ url: "/alterego-logo-symbol.png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfairDisplay.variable} ${montserrat.variable} font-sans antialiased`}>
        <ClientLayout>
          <Suspense fallback={null}>{children}</Suspense>
          <WhatsAppButton />
        </ClientLayout>
      </body>
    </html>
  )
}
