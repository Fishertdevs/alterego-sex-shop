import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import ClientLayout from "./client-layout"
import { WhatsAppButton } from "@/components/social/whatsapp-button"
import "./globals.css"

const didotFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-didot",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ALTERƎGO - Tienda Íntima de Lujo",
  description:
    "Descubre tu alter ego con nuestra exclusiva colección de productos íntimos de lujo. ALTERƎGO, donde la elegancia se encuentra con la sensualidad.",
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
      <body className={`font-serif ${didotFont.variable} ${GeistMono.variable} antialiased`}>
        <ClientLayout>
          <Suspense fallback={null}>{children}</Suspense>
          <WhatsAppButton />
        </ClientLayout>
      </body>
    </html>
  )
}
