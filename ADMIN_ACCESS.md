# Guía de Acceso Administrativo - ALTEREGO Sex Shop

## Acceso al Panel de Administración

### URL Privada de Acceso

Para acceder al panel de administración, siga estos pasos:

1. **Ingrese a la página de login:**
   \`\`\`
   https://alterego-store.com.co/admin/login
   \`\`\`

2. **Ingrese su email de administrador:**
   - Email: `altergo102@gmail.com`
   - No se requiere contraseña, el acceso es automático al ingresar el email correcto

3. **Acceso directo al panel:**
   \`\`\`
   https://alterego-store.com.co/admin
   \`\`\`
   (Si ya está autenticado, puede acceder directamente a esta URL)

**IMPORTANTE:** Estas URLs son privadas y no están visibles públicamente en el sitio web. Solo el administrador debe conocer estas rutas.

### Credenciales de Acceso

**Email de Administrador:** `altergo102@gmail.com`  
**Autenticación:** Automática al ingresar el email correcto

### Funcionalidades del Panel de Administración

#### 1. Dashboard Principal
- Estadísticas de ventas en tiempo real
- Gráficos de rendimiento
- Resumen de pedidos y productos

#### 2. Gestión de Productos
- Crear, editar y eliminar productos
- Gestionar imágenes (máximo 5 por producto)
- Control de inventario y precios
- Productos destacados
- Vista previa antes de publicar

#### 3. Gestión de Pedidos y Clientes
- Ver todos los pedidos
- Editar información del cliente
- Actualizar estado de pedidos (Pendiente, Confirmado, Descartado)
- Gestionar estado de envío (En Tránsito, Entregado, Devuelto)
- Exportar datos a Excel
- Confirmación de entrega actualiza gráficos en tiempo real

#### 4. Reseñas
- **Reseñas de Productos:** Gestionar reseñas pre-venta y pos-venta
- **Encuesta Pos Venta:** 
  - Generar URLs únicas para enviar a clientes
  - Ver respuestas de encuestas
  - Calificación de entrega y comentarios

#### 5. Notificaciones
- Ver todas las notificaciones del sistema
- Alertas de nuevas ventas
- Notificaciones de stock bajo
- Cambios en configuración

#### 6. Configuración de la Tienda
- Información de contacto
- Redes sociales
- Configuración de notificaciones
- Umbral de stock bajo

### Seguridad

1. **Autenticación:** El panel está protegido con autenticación de Supabase
2. **Acceso Privado:** No hay enlaces públicos al panel de administración
3. **Sesión Segura:** La sesión se mantiene de forma segura en el navegador

### Base de Datos (Supabase)

Todas las tablas están configuradas y funcionando:

- ✅ `admins` - Administradores del sistema
- ✅ `products` - Catálogo de productos
- ✅ `orders` - Pedidos de clientes
- ✅ `reviews` - Reseñas de productos
- ✅ `post_sale_surveys` - Encuestas pos venta
- ✅ `service_surveys` - Encuestas de servicio
- ✅ `notifications` - Notificaciones del sistema
- ✅ `store_settings` - Configuración de la tienda
- ✅ `survey_tokens` - Tokens para encuestas

### Integraciones Activas

- ✅ **Supabase:** Base de datos y autenticación
- ✅ **Vercel Blob:** Almacenamiento de imágenes
- ✅ **WhatsApp Business:** Integración para ventas (+57 3133462402)

### Soporte Técnico

Para cualquier problema técnico o consulta sobre el panel de administración, contactar al equipo de desarrollo.

---

**Última actualización:** Enero 2025  
**Versión:** 1.0 - Producción
