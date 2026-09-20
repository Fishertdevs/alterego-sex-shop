"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Clock, Instagram, Facebook } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { useStoreSettings } from "@/hooks/use-store-settings"

export default function ContactoPage() {
  const { settings } = useStoreSettings()

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      details: [settings?.store_phone || "+57 3133462402", "WhatsApp disponible"],
    },
    {
      icon: Mail,
      title: "Email",
      details: [settings?.store_email || "altergo102@gmail.com", "Respuesta en 24 horas"],
    },
    {
      icon: Clock,
      title: "Horarios de Atención",
      details: ["Lunes a sábado: 9:00 a.m. – 10:00 p.m.", "Domingos: 10:00 a.m. – 8:00 p.m."],
    },
  ]

  const rawWhatsappNumber = settings?.store_phone || "+57 3133462402"
  const whatsappNumber = rawWhatsappNumber.replace(/[\s\-()+ ]/g, "")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola Alterego, quiero más información de los productos de la tienda")}`

  console.log("[v0] Contacto Page - Raw WhatsApp number:", rawWhatsappNumber)
  console.log("[v0] Contacto Page - Cleaned WhatsApp number:", whatsappNumber)
  console.log("[v0] Contacto Page - WhatsApp URL:", whatsappUrl)

  const socialContacts = [
    {
      icon: Instagram,
      title: "Instagram",
      details: [
        settings?.instagram_url || "https://www.instagram.com/alterego.shop1?igsh=MTdrcnY5bjI0czFobg==",
        "Síguenos en Instagram",
      ],
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      details: [whatsappUrl, "Chatea con nosotros"],
    },
    {
      icon: Facebook,
      title: "Facebook",
      details: [settings?.facebook_url || "https://facebook.com/alterego", "Visítanos en Facebook"],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              <span className="text-accent text-6xl py-9">Contacto</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Estamos aquí para ayudarte. Contáctanos a través de nuestras redes sociales para cualquier consulta,
              asesoramiento personalizado o soporte que necesites.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="animate-fade-in-up border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Conéctate con Nosotros</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Elige tu red social favorita para contactarnos directamente
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialContacts.map((social) => (
                    <Button
                      key={social.title}
                      onClick={() => {
                        console.log("[v0] Contacto Page - Opening social link:", social.details[0])
                        window.open(social.details[0], "_blank")
                      }}
                      className={`w-full h-auto py-6 bg-accent hover:bg-accent/90 text-accent-foreground hover-scale transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4">
                          <social.icon className="h-6 w-6" />
                          <div className="text-left">
                            <div className="font-semibold text-lg">{social.title}</div>
                            <div className="text-sm opacity-90">{social.details[1]}</div>
                          </div>
                        </div>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    💬 Respuesta rápida garantizada en todos nuestros canales
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6 animate-fade-in-up">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="bg-accent/10 p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">¿Por qué Elegirnos?</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Atención personalizada y discreta
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Envíos rápidos y confidenciales
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Productos de calidad garantizada
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
