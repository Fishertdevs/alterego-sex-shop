import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"

export function PaymentMethodsSection() {
  const paymentMethods = [
    {
      icon: Smartphone,
      name: "Nequi",
      description: "Pago instantáneo",
      color: "text-purple-500",
    },
    {
      icon: Smartphone,
      name: "Daviplata",
      description: "Transferencia rápida",
      color: "text-red-500",
    },
    {
      icon: CreditCard,
      name: "Tarjetas",
      description: "Débito y crédito",
      color: "text-blue-500",
    },
    {
      icon: Building2,
      name: "Transferencia",
      description: "Bancaria",
      color: "text-green-500",
    },
    {
      icon: Wallet,
      name: "Contraentrega",
      description: "Paga al recibir",
      color: "text-orange-500",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Múltiples Formas de Pago</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-serif">
            Aceptamos todo tipo de pagos para tu comodidad y seguridad
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.name}
              className="p-6 bg-background border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full bg-muted ${method.color}`}>
                  <method.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-serif">{method.name}</h3>
                  <p className="text-xs text-muted-foreground font-serif">{method.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-serif">
            🔒 Todos los pagos son procesados de forma segura y confidencial
          </p>
        </div>
      </div>
    </section>
  )
}
