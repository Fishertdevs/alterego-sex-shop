import { Navigation } from "@/components/navigation"

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-serif text-4xl font-bold mb-8">Términos y Condiciones</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">1. Aceptación de Términos</h2>
            <p>
              Al acceder y utilizar el sitio web de ALTERƎGO, usted acepta estar sujeto a estos términos y condiciones.
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">2. Uso del Sitio Web</h2>
            <p>Usted se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar el sitio web solo para fines legales</li>
              <li>No intentar acceder a áreas restringidas del sitio</li>
              <li>No transmitir contenido malicioso o dañino</li>
              <li>Proporcionar información precisa y actualizada al realizar compras</li>
              <li>Mantener la confidencialidad de su cuenta y contraseña</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">3. Productos y Precios</h2>
            <p>
              Nos esforzamos por mostrar información precisa sobre nuestros productos, incluyendo descripciones,
              imágenes y precios. Sin embargo, no garantizamos que toda la información sea completamente precisa o libre
              de errores. Nos reservamos el derecho de corregir errores y actualizar información sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">4. Pedidos y Pagos</h2>
            <p>
              Al realizar un pedido, usted hace una oferta de compra. Nos reservamos el derecho de aceptar o rechazar
              cualquier pedido. El pago debe realizarse en el momento de la compra a través de los métodos de pago
              disponibles en nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">5. Envíos</h2>
            <p>
              Los tiempos de envío son estimados y pueden variar según la ubicación y disponibilidad. No nos hacemos
              responsables de retrasos causados por la empresa de mensajería o circunstancias fuera de nuestro control.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">6. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del sitio web, incluyendo textos, imágenes, logotipos y diseños, es propiedad de
              ALTERƎGO y está protegido por leyes de propiedad intelectual. No puede reproducir, distribuir o utilizar
              ningún contenido sin nuestro permiso expreso.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              ALTERƎGO no será responsable de daños indirectos, incidentales o consecuentes que resulten del uso o la
              imposibilidad de usar nuestro sitio web o productos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">8. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios
              entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">Última actualización: Octubre 2025</p>
        </div>
      </main>
    </div>
  )
}
