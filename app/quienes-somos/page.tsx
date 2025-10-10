import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Star, Users } from "lucide-react"
import { Logo } from "@/components/logo"

export default function QuienesSomosPage() {
  const values = [
    {
      icon: Heart,
      title: "Pasión",
      description: "Creemos en la importancia de la intimidad y el placer como parte fundamental del bienestar.",
    },
    {
      icon: Shield,
      title: "Discreción",
      description: "Tu privacidad es nuestra prioridad. Envíos discretos y atención confidencial siempre.",
    },
    {
      icon: Star,
      title: "Calidad",
      description: "Solo ofrecemos productos de las mejores marcas, con materiales seguros y certificados.",
    },
    {
      icon: Users,
      title: "Confianza",
      description: "Miles de clientes satisfechos respaldan nuestra experiencia y profesionalismo.",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <div className="flex justify-center mb-8">
              <Logo className="h-16 w-16 animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Quiénes <span className="text-accent">Somos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              ALTERƎGO nació de la visión de crear un espacio seguro y elegante donde las personas puedan explorar su
              intimidad sin prejuicios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="opacity-0 animate-[slideInLeft_1s_ease-out_0.2s_forwards]">
              <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {
                  "En ALTERƎGO trabajamos con el firme propósito de brindar a nuestros clientes una\nexperiencia integral en el mundo de la intimidad y el bienestar erótico. Nos\nespecializamos en la selección y comercialización de productos eróticos premium que\nse distinguen por su calidad, diseño y funcionalidad, ofreciendo soluciones que\ndespiertan los sentidos y enriquecen la vida íntima de quienes confían en nosotros.\nNuestra misión es acompañar a cada persona en el descubrimiento de su lado oculto,\nfomentando una vivencia del placer libre de prejuicios, basada en la confianza, la\ndiscreción y el respeto por la diversidad de deseos y formas de amar. Buscamos\nposicionarnos como una boutique que no solo ofrece productos, sino también estilo,\neducación y acompañamiento, para que la intimidad sea vivida de manera consciente,\nelegante y plena."
                }
              </p>
            </div>

            <div className="opacity-0 animate-[slideInRight_1s_ease-out_0.4s_forwards]">
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,0,0,0.3)] hover:scale-[1.02]">
                <Heart className="h-16 w-16 text-accent mx-auto mb-4 animate-[heartbeat_2s_ease-in-out_infinite]" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Misión</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {
                    "En ALTERƎGO aspiramos a ser reconocidos como la boutique erótica líder en\nLatinoamérica, destacándonos por nuestra excelencia en servicio, la innovación en\nnuestra oferta de productos y la capacidad de transformar la intimidad en una\nexperiencia única y sofisticada.\nNuestra visión es consolidarnos como una marca de referencia internacional que inspira\na las personas a explorar su alter ego con confianza y seguridad, promoviendo una\ncultura en la que el placer y la sensualidad sean entendidos como parte esencial del\nbienestar y la autenticidad personal.\nQueremos que cada cliente que nos elija experimente no solo la compra de un producto,\nsino la vivencia de un concepto: la unión entre elegancia, misterio y libertad,\nconvirtiendo a ALTERƎGO  en un símbolo de distinción y confianza dentro del\nmercado erótico."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <value.icon className="h-12 w-12 text-accent mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
