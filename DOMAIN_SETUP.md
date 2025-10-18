# Configuración del Dominio Personalizado

## Problema Actual

Actualmente, cuando intentas acceder a `alterego-store.com.co`, el navegador muestra un error `ERR_CONNECTION_TIMED_OUT`. Esto se debe a que el dominio no está configurado correctamente para apuntar a tu deployment de Vercel.

## Solución: Configurar el Dominio en Vercel

### Paso 1: Agregar el Dominio en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto "ALTEREGO sex shop"
3. Ve a la pestaña **Settings** → **Domains**
4. Haz clic en **Add Domain**
5. Ingresa tu dominio: `alterego-store.com.co`
6. Haz clic en **Add**

### Paso 2: Configurar DNS en tu Proveedor

Vercel te mostrará los registros DNS que necesitas configurar. Hay dos opciones:

#### Opción A: Usar Nameservers de Vercel (Recomendado)

Si tu proveedor de dominio lo permite, cambia los nameservers a:
\`\`\`
ns1.vercel-dns.com
ns2.vercel-dns.com
\`\`\`

#### Opción B: Configurar Registros A y CNAME

Si no puedes cambiar los nameservers, agrega estos registros DNS:

**Para el dominio raíz (`alterego-store.com.co`):**
\`\`\`
Tipo: A
Nombre: @
Valor: 76.76.21.21
TTL: 3600
\`\`\`

**Para el subdominio www (`www.alterego-store.com.co`):**
\`\`\`
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 3600
\`\`\`

### Paso 3: Esperar la Propagación DNS

- La propagación DNS puede tomar entre **15 minutos y 48 horas**
- Puedes verificar el estado en Vercel (Settings → Domains)
- Cuando esté listo, verás un ✓ verde junto al dominio

### Paso 4: Configurar HTTPS

Vercel automáticamente configurará un certificado SSL gratuito de Let's Encrypt una vez que el dominio esté verificado.

## Verificar la Configuración

Una vez configurado el dominio, verifica que funcione:

1. **Página principal:** `https://alterego-store.com.co`
2. **Panel de admin:** `https://alterego-store.com.co/admin/login`
3. **Encuestas pos venta:** `https://alterego-store.com.co/encuesta-posventa/[token]`
4. **Verificación de Google:** `https://alterego-store.com.co/google8d4dfb8159ece8ac.html`

## Solución Temporal

Mientras configuras el dominio personalizado, puedes usar la URL de Vercel:

\`\`\`
https://[tu-proyecto].vercel.app
\`\`\`

Esta URL funciona inmediatamente y puedes usarla para:
- Probar la tienda
- Generar encuestas pos venta
- Acceder al panel de administración

## Recursos Adicionales

- [Documentación de Vercel sobre Dominios](https://vercel.com/docs/concepts/projects/domains)
- [Guía de Configuración DNS](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
- [Solución de Problemas de Dominios](https://vercel.com/docs/concepts/projects/domains/troubleshooting)

## Soporte

Si tienes problemas configurando el dominio:
1. Verifica que los registros DNS estén correctos en tu proveedor
2. Espera al menos 1 hora para la propagación DNS
3. Contacta al soporte de Vercel: https://vercel.com/help
