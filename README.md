# 🌹 ALTEREGO - Tienda Íntima de Lujo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/harrylasso2005s-projects/v0-ruby-fantasy-sex-shop)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/dVK1YfzWJAx)

## 📋 Descripción

ALTEREGO es una tienda en línea de productos íntimos de lujo, diseñada para ofrecer una experiencia de compra elegante, discreta y segura. La plataforma combina un diseño sofisticado con funcionalidades avanzadas de e-commerce, gestión de inventario y análisis de ventas.

## ✨ Características Principales

### 🛍️ Para Clientes

- **Catálogo de Productos**: Navegación intuitiva por categorías con filtros avanzados
- **Carrito de Compras**: Sistema de carrito persistente con actualización en tiempo real
- **Checkout Seguro**: Múltiples métodos de pago (PSE, tarjetas, Nequi, Daviplata)
- **Envíos Discretos**: Información de envío y seguimiento de pedidos
- **Reseñas y Calificaciones**: Sistema de reseñas verificadas con imágenes
- **Encuestas de Satisfacción**: Encuestas de servicio y pos venta
- **Wishlist**: Guardar productos favoritos para compras futuras
- **Contacto WhatsApp**: Botón flotante para atención al cliente

### 🎛️ Panel de Administración

**URL de Acceso**: `/admin`

El administrador accede directamente a esta URL y se autentica con su correo registrado en Supabase.

**Funcionalidades del Admin:**

- **Dashboard**: Estadísticas de ventas, productos más vendidos, ingresos
- **Gestión de Productos**: CRUD completo con soporte para imágenes y videos
- **Gestión de Pedidos**: Seguimiento de pedidos, actualización de estados
- **Gestión de Clientes**: Base de datos de clientes y historial de compras
- **Reseñas**: Moderación de reseñas y encuestas
- **Encuestas Pos Venta**: Generación de URLs únicas para encuestas de clientes
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Configuración**: Ajustes de la tienda, métodos de pago, envíos
- **Análisis**: Gráficos de ventas, productos más vendidos, tendencias

## 🛠️ Tecnologías

### Frontend
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS v4**: Estilos modernos y responsivos
- **shadcn/ui**: Componentes UI de alta calidad
- **Framer Motion**: Animaciones fluidas

### Backend
- **Supabase**: Base de datos PostgreSQL y autenticación
- **Next.js API Routes**: Endpoints para checkout y pagos
- **Vercel Blob**: Almacenamiento de imágenes y videos

### Integraciones
- **Pasarelas de Pago**: PSE, tarjetas de crédito/débito
- **WhatsApp Business**: Atención al cliente
- **Google Search Console**: SEO y indexación

## 📦 Estructura del Proyecto

\`\`\`
alterego-sex-shop/
├── app/                          # Páginas y rutas de Next.js
│   ├── admin/                    # Panel de administración
│   ├── api/                      # API routes (checkout, pagos)
│   ├── checkout/                 # Proceso de compra
│   ├── producto/[id]/            # Páginas de productos
│   ├── productos/                # Catálogo de productos
│   └── ...                       # Otras páginas
├── components/                   # Componentes React
│   ├── admin/                    # Componentes del admin
│   ├── auth/                     # Autenticación
│   ├── cart/                     # Carrito de compras
│   ├── checkout/                 # Proceso de checkout
│   ├── products/                 # Productos
│   ├── reviews/                  # Reseñas y encuestas
│   └── ui/                       # Componentes UI (shadcn)
├── lib/                          # Utilidades y helpers
│   ├── supabase/                 # Cliente de Supabase
│   ├── admin-storage.ts          # Funciones admin
│   ├── supabase-storage.ts       # Funciones de storage
│   └── ...                       # Otras utilidades
├── scripts/                      # Scripts SQL para Supabase
├── public/                       # Archivos estáticos
│   ├── images/                   # Imágenes de productos
│   ├── google8d4dfb8159ece8ac.html  # Verificación Google
│   └── robots.txt                # SEO
└── ...
\`\`\`

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

1. **products**: Catálogo de productos
2. **orders**: Pedidos de clientes
3. **reviews**: Reseñas de productos
4. **service_surveys**: Encuestas de servicio
5. **post_sale_surveys**: Encuestas pos venta
6. **admins**: Administradores del sistema
7. **notifications**: Notificaciones del sistema
8. **store_settings**: Configuración de la tienda
9. **survey_tokens**: Tokens para encuestas

## 🚀 Deployment

### Vercel

El proyecto está desplegado automáticamente en Vercel:

**URL de Producción**: `https://alterego-store.com.co`

**Panel de Vercel**: [https://vercel.com/harrylasso2005s-projects/v0-ruby-fantasy-sex-shop](https://vercel.com/harrylasso2005s-projects/v0-ruby-fantasy-sex-shop)

### Variables de Entorno

Las siguientes variables de entorno están configuradas en Vercel:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Base de datos
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Autenticación
NEXTAUTH_URL=https://alterego-store.com.co
NEXT_PUBLIC_NEXTAUTH_URL=https://alterego-store.com.co

# Storage
BLOB_READ_WRITE_TOKEN=
\`\`\`

## 🔐 Acceso Administrativo

### URL del Panel de Administración

**`/admin`**

Ejemplo: `https://alterego-store.com.co/admin`

### Proceso de Autenticación

1. El administrador accede directamente a `/admin`
2. Ingresa su correo electrónico registrado en Supabase
3. Supabase envía un enlace de autenticación al correo
4. El administrador hace clic en el enlace y es redirigido al dashboard

**Nota**: El correo del administrador debe estar registrado en la tabla `admins` de Supabase.

## 📊 Google Search Console

### Archivos de Indexación

El proyecto incluye los siguientes archivos para SEO:

1. **`/public/google8d4dfb8159ece8ac.html`**: Archivo de verificación de Google
2. **`/app/sitemap.ts`**: Sitemap dinámico con todas las páginas y productos
3. **`/public/robots.txt`**: Configuración de rastreo para motores de búsqueda

### Configuración

Sigue la guía completa en: **`GOOGLE_SEARCH_CONSOLE_SETUP.md`**

## 🧪 Testing

Consulta la lista completa de verificación en: **`TESTING_CHECKLIST.md`**

### Funcionalidades Verificadas

- ✅ Navegación y catálogo de productos
- ✅ Carrito de compras y checkout
- ✅ Métodos de pago (PSE, tarjetas)
- ✅ Sistema de reseñas
- ✅ Encuestas de servicio y pos venta
- ✅ Panel de administración completo
- ✅ Notificaciones en tiempo real
- ✅ Responsive design (móvil, tablet, desktop)

## 📱 Características Adicionales

### Seguridad
- Autenticación con Supabase
- Protección de rutas administrativas
- Validación de formularios
- Sanitización de inputs

### Performance
- Optimización de imágenes con Next.js Image
- Lazy loading de componentes
- Caching de datos con SWR
- Code splitting automático

### UX/UI
- Diseño responsive
- Animaciones suaves
- Feedback visual en todas las acciones
- Modo oscuro/claro
- Accesibilidad (ARIA labels, navegación por teclado)

## 🔄 Flujo de Trabajo

### Desarrollo en v0.app

1. Continúa desarrollando en: [https://v0.app/chat/projects/dVK1YfzWJAx](https://v0.app/chat/projects/dVK1YfzWJAx)
2. Los cambios se sincronizan automáticamente con este repositorio
3. Vercel despliega automáticamente los cambios

### Deploy Manual

Si necesitas hacer deploy manual:

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
\`\`\`

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: [Tu email de contacto]
- **WhatsApp**: [Tu número de WhatsApp]
- **GitHub Issues**: [Link al repositorio]

## 📄 Licencia

Este proyecto es propiedad de ALTEREGO. Todos los derechos reservados.

---

**Desarrollado con ❤️ usando [v0.app](https://v0.app)**
