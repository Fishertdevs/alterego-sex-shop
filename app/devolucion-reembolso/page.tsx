import { Navigation } from "@/components/navigation"

export default function DevolucionReembolsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-serif text-4xl font-bold mb-8">Política de Devolución y Reembolso</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">1. Derecho de Devolución</h2>
            <p>
              En ALTERƎGO, queremos que esté completamente satisfecho con su compra. Si por alguna razón no está
              satisfecho, puede devolver los productos dentro de los 30 días posteriores a la recepción del pedido.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">2. Condiciones para Devoluciones</h2>
            <p>Para que una devolución sea aceptada, los productos deben cumplir con las siguientes condiciones:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>El producto debe estar sin usar y en su embalaje original</li>
              <li>Debe incluir todas las etiquetas y accesorios originales</li>
              <li>El producto no debe mostrar signos de uso o daño</li>
              <li>
                Por razones de higiene, ciertos productos íntimos no pueden ser devueltos una vez abiertos o usados
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">3. Proceso de Devolución</h2>
            <p>Para iniciar una devolución:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contacte a nuestro servicio al cliente a través de WhatsApp o correo electrónico</li>
              <li>Proporcione su número de pedido y el motivo de la devolución</li>
              <li>Espere la confirmación y las instrucciones de envío</li>
              <li>Empaque el producto de forma segura y envíelo a la dirección indicada</li>
              <li>Una vez recibido y verificado, procesaremos su reembolso</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">4. Reembolsos</h2>
            <p>
              Una vez que recibamos y verifiquemos su devolución, procesaremos el reembolso dentro de 5-10 días hábiles.
              El reembolso se realizará al método de pago original utilizado en la compra.
            </p>
            <p className="mt-2">
              Los costos de envío originales no son reembolsables, excepto en casos de productos defectuosos o errores
              en el pedido por nuestra parte.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">5. Productos Defectuosos o Dañados</h2>
            <p>
              Si recibe un producto defectuoso o dañado, contáctenos inmediatamente. Proporcionaremos un reemplazo sin
              costo adicional o un reembolso completo, incluyendo los costos de envío.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">6. Cambios</h2>
            <p>
              Si desea cambiar un producto por otro tamaño, color o modelo, puede realizar una devolución y hacer un
              nuevo pedido. También puede contactarnos para facilitar el proceso de cambio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">7. Costos de Envío de Devolución</h2>
            <p>
              Los costos de envío de devolución son responsabilidad del cliente, excepto en casos de productos
              defectuosos, dañados o errores en el pedido por nuestra parte.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">8. Contacto</h2>
            <p>
              Para cualquier consulta sobre devoluciones o reembolsos, puede contactarnos a través de WhatsApp o
              enviando un correo electrónico a devoluciones@alterego.com
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">Última actualización: Octubre 2025</p>
        </div>
      </main>
    </div>
  )
}
