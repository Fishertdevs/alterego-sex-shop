# 🌹 ALTEREGO - Tienda Íntima de Lujo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/harrylasso2005s-projects/v0-ruby-fantasy-sex-shop)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/dVK1YfzWJAx)

## 📋 Descripción

ALTEREGO es una tienda en línea de productos íntimos de lujo, diseñada para ofrecer una experiencia de compra elegante, discreta y segura. La plataforma combina un diseño sofisticado con funcionalidades avanzadas de e-commerce, gestión de inventario y análisis de ventas.

## ✨ Características Principales

### 🛍️ Para Clientes

- **Catálogo de Productos**: Navegación intuitiva por categorías con filtros avanzados
- **Carrito de Compras**: Sistema de carrito persistente con actualización en tiempo real
- **Checkout Seguro**: Múltiples métodos de pago (Nequi, Daviplata, Tarjeta, Transferencia)
- **Envíos Discretos**: Información de envío y seguimiento de pedidos
- **Reseñas y Calificaciones**: Sistema de reseñas verificadas con imágenes
- **Encuestas de Satisfacción**: Encuestas de servicio pre-venta
- **Contacto WhatsApp**: Botón flotante para atención al cliente

### 🎛️ Panel de Administración

**URL de Acceso**: `/admin/login`

El administrador accede a esta URL e ingresa su correo electrónico (`altergo102@gmail.com`) para autenticarse automáticamente.

**Funcionalidades del Admin:**

- **Dashboard**: Estadísticas de ventas, productos más vendidos, ingresos
- **Gestión de Productos**: CRUD completo con soporte para múltiples imágenes (máximo 5)
- **Gestión de Pedidos y Clientes**: 
  - Edición inline de información del cliente
  - Actualización de estado de pedido (Pendiente, Confirmado, Descartado)
  - Actualización de estado de envío (En Tránsito, Entregado, Devuelto, No)
  - Confirmación de entrega con actualización de gráficos en tiempo real
  - Exportar pedidos a Excel
- **Gestión de Reseñas**: 
  - Moderación de reseñas de productos
  - Aprobar/rechazar reseñas
  - Marcar reseñas como ofensivas
  - Filtros por estado
- **Encuestas de Servicio**: 
  - Visualizar resultados de encuestas pre-venta
  - Estadísticas de satisfacción
  - Dashboard público con resultados
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Configuración**: Ajustes de la tienda, horarios, redes sociales
- **Análisis**: 
  - Gráficos de ventas por mes
  - Gráficos de pedidos por estado
  - Gráficos de métodos de pago
  - Exportar gráficos a Excel

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
- **Vercel Blob**: Almacenamiento de imágenes

### Integraciones
- **WhatsApp Business**: Atención al cliente y confirmación de pedidos
- **Google Search Console**: SEO y indexación

## 📦 Estructura del Proyecto

\`\`\`
alterego-sex-shop/
├── app/                          # Páginas y rutas de Next.js
│   ├── admin/                    # Panel de administración
│   │   ├── login/                # Login del administrador
│   │   └── page.tsx              # Dashboard principal
│   ├── api/                      # API routes (checkout, pagos)
│   ├── checkout/                 # Proceso de compra
│   ├── dashboard/                # Dashboard público de encuestas
│   ├── productos/                # Catálogo de productos
│   └── ...                       # Otras páginas
├── components/                   # Componentes React
│   ├── admin/                    # Componentes del admin
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
│   ├── google8d4dfb8159ece8ac.html  # Verificación Google
│   └── robots.txt                # SEO
└── ...
\`\`\`

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

1. **products**: Catálogo de productos con imágenes y categorías
2. **orders**: Pedidos de clientes con información de envío
3. **reviews**: Reseñas de productos con calificaciones
4. **service_surveys**: Encuestas de servicio pre-venta
5. **admins**: Administradores del sistema
6. **notifications**: Notificaciones del sistema en tiempo real
7. **store_settings**: Configuración de la tienda

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

**`/admin/login`**

Ejemplo: `https://alterego-store.com.co/admin/login`

### Proceso de Autenticación

1. El administrador accede a `/admin/login`
2. Ingresa su correo electrónico: `altergo102@gmail.com`
3. Es autenticado automáticamente sin necesidad de contraseña
4. Es redirigido al dashboard administrativo en `/admin`

**Nota**: El correo del administrador debe estar registrado en la tabla `admins` de Supabase.

Para más detalles, consulta: **`ADMIN_ACCESS.md`**

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
- ✅ Métodos de pago (Nequi, Daviplata, Tarjeta, Transferencia)
- ✅ Sistema de reseñas con imágenes
- ✅ Encuestas de servicio pre-venta
- ✅ Panel de administración completo
- ✅ Notificaciones en tiempo real
- ✅ Exportación a Excel (pedidos y gráficos)
- ✅ Responsive design (móvil, tablet, desktop)

## 📱 Características Adicionales

### Seguridad
- Autenticación con Supabase
- Protección de rutas administrativas con middleware
- Validación de formularios
- Row Level Security (RLS) en Supabase

### Performance
- Optimización de imágenes con Next.js Image
- Lazy loading de componentes
- Caching de datos con SWR
- Code splitting automático
- Server-side rendering donde es apropiado

### UX/UI
- Diseño responsive
- Animaciones suaves
- Feedback visual en todas las acciones
- Modo oscuro/claro
- Accesibilidad (ARIA labels, navegación por teclado)

## 🔄 Flujo de Trabajo

### Desarrollo en v0.app

1. Continúa desarrollando en: [https://v0.app/chat/projects/dVK1YfzWJAx](https://v0.app/chat/projects/dVK1YfzWJAx)
2. Los cambios se sincronizan automáticamente con GitHub
3. Vercel despliega automáticamente los cambios desde GitHub

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

## 📚 Documentación Adicional

- **`ADMIN_ACCESS.md`**: Guía completa de acceso administrativo
- **`DOMAIN_SETUP.md`**: Configuración de dominio personalizado en Vercel
- **`GOOGLE_SEARCH_CONSOLE_SETUP.md`**: Configuración de Google Search Console
- **`TESTING_CHECKLIST.md`**: Lista de verificación de funcionalidades
- **`PROJECT_COMPLETION.md`**: Resumen del proyecto completado

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: altergo102@gmail.com
- **WhatsApp**: Botón flotante en la tienda

## 📄 Estado del Proyecto

**✅ PROYECTO COMPLETADO**

Fecha de finalización: 18 de Octubre, 2025

Todas las funcionalidades han sido implementadas y probadas. El proyecto está listo para producción.

---

**Desarrollado con ❤️ usando [v0.app](https://v0.app) by Vercel**
