import { Navigation } from "@/components/navigation"

export default function PoliticasPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-serif text-4xl font-bold mb-8 text-foreground">Políticas de Privacidad</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
            <p>
              En ALTERƎGO, recopilamos información personal que usted nos proporciona voluntariamente al realizar una
              compra, crear una cuenta o contactarnos. Esta información puede incluir:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de envío</li>
              <li>Información de pago (procesada de forma segura)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">2. Uso de la Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y completar sus pedidos</li>
              <li>Enviar confirmaciones de pedidos y actualizaciones de envío</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Comunicarnos con usted sobre promociones y ofertas (con su consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">3. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra
              acceso no autorizado, pérdida o alteración. Utilizamos encriptación SSL para todas las transacciones y
              almacenamos datos en servidores seguros.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">4. Compartir Información</h2>
            <p>
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto cuando sea necesario
              para procesar su pedido (empresas de envío, procesadores de pago) o cuando la ley lo requiera.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">5. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a su información personal</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">6. Contacto</h2>
            <p>
              Si tiene preguntas sobre nuestras políticas de privacidad, puede contactarnos a través de nuestro
              formulario de contacto o enviando un correo electrónico a privacidad@alterego.com
            </p>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">Última actualización: Octubre 2025</p>
        </div>
      </main>
    </div>
  )
}
