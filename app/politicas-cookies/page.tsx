import { Navigation } from "@/components/navigation"

export default function PoliticasCookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="font-serif text-4xl font-bold mb-8 text-foreground">Políticas de Cookies</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio
              web. Nos ayudan a mejorar su experiencia de navegación y a entender cómo utiliza nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Tipos de Cookies que Utilizamos</h2>

            <h3 className="font-semibold text-xl mb-2">1. Cookies Esenciales</h3>
            <p>
              Estas cookies son necesarias para el funcionamiento básico del sitio web. Permiten funciones como el
              carrito de compras y el inicio de sesión.
            </p>

            <h3 className="font-semibold text-xl mb-2 mt-4">2. Cookies de Rendimiento</h3>
            <p>
              Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, recopilando información de
              forma anónima sobre las páginas visitadas y los errores encontrados.
            </p>

            <h3 className="font-semibold text-xl mb-2 mt-4">3. Cookies de Funcionalidad</h3>
            <p>
              Permiten que el sitio web recuerde sus preferencias (como idioma, región) para proporcionar una
              experiencia más personalizada.
            </p>

            <h3 className="font-semibold text-xl mb-2 mt-4">4. Cookies de Marketing</h3>
            <p>
              Se utilizan para mostrar anuncios relevantes y medir la efectividad de nuestras campañas publicitarias.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Gestión de Cookies</h2>
            <p>
              Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en su
              dispositivo y configurar la mayoría de los navegadores para evitar que se instalen. Sin embargo, si hace
              esto, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Consentimiento</h2>
            <p>
              Al utilizar nuestro sitio web, usted acepta el uso de cookies de acuerdo con esta política. Si no está de
              acuerdo con el uso de cookies, puede deshabilitarlas en la configuración de su navegador.
            </p>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">Última actualización: Octubre 2025</p>
        </div>
      </main>
    </div>
  )
}
