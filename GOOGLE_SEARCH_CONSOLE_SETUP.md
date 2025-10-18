# 🔍 Guía de Configuración de Google Search Console

Esta guía te ayudará a configurar Google Search Console para indexar tu tienda ALTEREGO en los resultados de búsqueda de Google.

## 📋 Requisitos Previos

- ✅ Tienda desplegada en Vercel
- ✅ Dominio personalizado configurado: `alterego-store.com.co`
- ✅ Cuenta de Google (Gmail)

## 🚀 Paso a Paso

### 1. Verificar que el Deploy esté Completo

Antes de comenzar, asegúrate de que:

1. **El deploy en Vercel esté completo**
   - Ir a [Vercel Dashboard](https://vercel.com/dashboard)
   - Verificar que el proyecto esté en estado "Ready"
   - Probar que el sitio cargue correctamente en `https://alterego-store.com.co`

2. **Los archivos de indexación estén presentes**
   - Verificar que `/sitemap.xml` esté accesible
   - Verificar que `/robots.txt` esté accesible
   - Verificar que `/google8d4dfb8159ece8ac.html` esté accesible

### 2. Acceder a Google Search Console

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Iniciar sesión con tu cuenta de Google
3. Hacer clic en **"Agregar propiedad"**

### 3. Agregar tu Sitio Web

1. Seleccionar **"Prefijo de URL"**
2. Ingresar: `https://alterego-store.com.co`
3. Hacer clic en **"Continuar"**

### 4. Verificar la Propiedad del Sitio

Google te mostrará varios métodos de verificación. Usa el método **"Archivo HTML"**:

1. Seleccionar **"Archivo HTML"**
2. Google te mostrará un archivo como: `google8d4dfb8159ece8ac.html`
3. **Este archivo ya está en tu proyecto** en `/public/google8d4dfb8159ece8ac.html`
4. Verificar que el archivo sea accesible en:
   \`\`\`
   https://alterego-store.com.co/google8d4dfb8159ece8ac.html
   \`\`\`
5. Hacer clic en **"Verificar"**

✅ **¡Listo!** Tu sitio ahora está verificado en Google Search Console.

### 5. Enviar el Sitemap

El sitemap ayuda a Google a descubrir todas las páginas de tu sitio:

1. En el menú lateral, ir a **"Sitemaps"**
2. En el campo "Agregar un nuevo sitemap", ingresar:
   \`\`\`
   sitemap.xml
   \`\`\`
3. Hacer clic en **"Enviar"**

✅ Google comenzará a rastrear tu sitio automáticamente.

### 6. Solicitar Indexación de Páginas Principales

Para acelerar la indexación, solicita manualmente la indexación de las páginas más importantes:

1. En el menú lateral, ir a **"Inspección de URLs"**
2. Ingresar cada una de estas URLs y hacer clic en "Solicitar indexación":

   **Páginas principales:**
   - `https://alterego-store.com.co`
   - `https://alterego-store.com.co/productos`
   - `https://alterego-store.com.co/quienes-somos`
   - `https://alterego-store.com.co/contacto`

   **Categorías de productos:**
   - `https://alterego-store.com.co/productos/lenceria-disfraces`
   - `https://alterego-store.com.co/productos/juguetes-intimos`
   - `https://alterego-store.com.co/productos/lubricantes-cosmetica`
   - `https://alterego-store.com.co/productos/condones-proteccion`
   - `https://alterego-store.com.co/productos/juegos-accesorios`
   - `https://alterego-store.com.co/productos/energizantes-estimulantes`

3. Para cada URL:
   - Esperar a que Google inspeccione la URL
   - Hacer clic en **"Solicitar indexación"**
   - Esperar confirmación (puede tardar 1-2 minutos por URL)

### 7. Monitorear el Progreso

Después de enviar el sitemap y solicitar indexación:

1. **Cobertura** (menú lateral)
   - Ver cuántas páginas están indexadas
   - Identificar errores de indexación
   - Tiempo estimado: 1-7 días para ver resultados

2. **Rendimiento** (menú lateral)
   - Ver clics, impresiones y posición promedio
   - Analizar qué búsquedas llevan tráfico a tu sitio
   - Tiempo estimado: 7-14 días para ver datos

3. **Mejoras** (menú lateral)
   - **Usabilidad móvil**: Verificar que el sitio sea mobile-friendly
   - **Core Web Vitals**: Verificar velocidad y experiencia de usuario

## 📊 Qué Esperar

### Primeras 24-48 horas
- Google comenzará a rastrear tu sitio
- Verás las primeras páginas indexadas en "Cobertura"

### Primera semana
- La mayoría de las páginas estarán indexadas
- Comenzarás a ver impresiones en "Rendimiento"

### Primer mes
- Todas las páginas deberían estar indexadas
- Verás clics y tráfico orgánico creciendo
- Podrás analizar qué palabras clave funcionan mejor

## 🎯 Optimización SEO Adicional

### 1. Palabras Clave Principales

Tu sitio ya está optimizado para estas palabras clave:
- "sex shop Colombia"
- "tienda íntima"
- "productos íntimos de lujo"
- "lencería Colombia"
- "juguetes íntimos"
- "lubricantes"
- "condones"

### 2. Contenido de Calidad

Para mejorar el posicionamiento:
- ✅ Descripciones detalladas de productos
- ✅ Imágenes de alta calidad con alt text
- ✅ Reseñas de clientes
- ✅ Contenido único en cada página

### 3. Velocidad del Sitio

Tu sitio ya está optimizado con:
- ✅ Next.js 15 con optimizaciones automáticas
- ✅ Imágenes optimizadas
- ✅ Código minificado
- ✅ Carga diferida (lazy loading)

## 🔧 Solución de Problemas

### Problema: "URL no encontrada"
**Solución**: Verificar que el dominio esté correctamente configurado en Vercel y que el sitio esté accesible.

### Problema: "Archivo de verificación no encontrado"
**Solución**: Verificar que el archivo `google8d4dfb8159ece8ac.html` esté en la carpeta `/public` y sea accesible en la URL.

### Problema: "Sitemap no se puede leer"
**Solución**: Verificar que `/sitemap.xml` esté accesible y tenga el formato correcto XML.

### Problema: "Páginas no indexadas"
**Solución**: 
1. Verificar que el archivo `robots.txt` permita el rastreo
2. Solicitar indexación manual desde "Inspección de URLs"
3. Esperar 7-14 días para que Google rastree el sitio

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisar la [documentación oficial de Google Search Console](https://support.google.com/webmasters)
2. Verificar que todos los archivos estén accesibles
3. Contactar al equipo de desarrollo

---

**¡Éxito con tu tienda ALTEREGO! 🌹**
