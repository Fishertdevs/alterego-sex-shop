import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import { Suspense } from "react"
import ClientLayout from "./client-layout"
import { WhatsAppButton } from "@/components/social/whatsapp-button"
import { Footer } from "@/components/footer"
import { CookieBanner } from "@/components/cookie-banner"
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
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://alterego-store.com.co"),
  title: {
    default: "ALTEREGO - Tienda Íntima de Lujo | Sex Shop en Colombia",
    template: "%s | ALTEREGO",
  },
  description:
    "Descubre tu alter ego con nuestra exclusiva colección de productos íntimos de lujo. Lencería, juguetes, lubricantes y más. Envíos discretos a toda Colombia. ALTEREGO, donde la elegancia se encuentra con la sensualidad.",
  keywords: [
    "sex shop",
    "tienda íntima",
    "productos íntimos",
    "lencería",
    "juguetes íntimos",
    "lubricantes",
    "condones",
    "productos de lujo",
    "Colombia",
    "envíos discretos",
    "alterego",
  ],
  authors: [{ name: "ALTEREGO" }],
  creator: "ALTEREGO",
  publisher: "ALTEREGO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: process.env.NEXTAUTH_URL || "https://alterego-store.com.co",
    siteName: "ALTEREGO",
    title: "ALTEREGO - Tienda Íntima de Lujo | Sex Shop en Colombia",
    description:
      "Descubre tu alter ego con nuestra exclusiva colección de productos íntimos de lujo. Envíos discretos a toda Colombia.",
    images: [
      {
        url: "/alterego-logo-symbol.png",
        width: 1200,
        height: 630,
        alt: "ALTEREGO - Tienda Íntima de Lujo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALTEREGO - Tienda Íntima de Lujo",
    description: "Descubre tu alter ego con nuestra exclusiva colección de productos íntimos de lujo.",
    images: ["/alterego-logo-symbol.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google8d4dfb8159ece8ac",
  },
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
          <Footer />
          <CookieBanner />
        </ClientLayout>
      </body>
    </html>
  )
}
