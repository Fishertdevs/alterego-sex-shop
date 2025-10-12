# Guía de Implementación - Sistema de Notificaciones y Ventas

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de gestión de tienda con las siguientes características:

### ✅ Características Implementadas

1. **Sistema de Notificaciones en Tiempo Real**
   - Alertas automáticas de bajo stock
   - Notificaciones de cambios en configuración
   - Notificaciones de nuevas ventas
   - Panel de notificaciones con actualización en tiempo real

2. **Configuración de Tienda Mejorada**
   - Gestión de redes sociales (Instagram, WhatsApp, Facebook)
   - Configuración de precios (sin costo de envío)
   - Configuración de notificaciones personalizables

3. **Flujo de Ventas por Redes Sociales**
   - Checkout por WhatsApp o Instagram
   - Creación automática de órdenes en base de datos
   - Vaciado automático del carrito después de checkout
   - Modal de confirmación de compra exitosa
   - Solicitud de reseña post-entrega

4. **Sistema de Reseñas y Encuestas**
   - Reseñas vinculadas a órdenes
   - Calificación de entrega
   - Aprobación de reseñas por admin
   - Mostrar reseñas en página de inicio

## 🗄️ Base de Datos

### Scripts SQL a Ejecutar

Debes ejecutar los siguientes scripts en orden:

1. **`scripts/01-create-tables.sql`** - Tablas básicas (productos, reseñas, admins)
2. **`scripts/02-add-store-settings-and-notifications.sql`** - Configuración y notificaciones

### Cómo Ejecutar los Scripts

#### Opción 1: Desde v0 (Recomendado)
1. Ve a la pestaña de scripts en v0
2. Haz clic en "Run" en cada script en orden

#### Opción 2: Desde Supabase Dashboard
1. Ve a tu proyecto en Supabase
2. Navega a SQL Editor
3. Copia y pega cada script
4. Ejecuta en orden

## 🔧 Configuración Requerida

### Variables de Entorno

Asegúrate de tener estas variables configuradas:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
\`\`\`

### Configuración Inicial de la Tienda

Después de ejecutar los scripts, la configuración por defecto será:

- **Nombre**: ALTEREGO
- **Email**: contacto@alterego.com
- **Teléfono**: +57 300 123 4567
- **WhatsApp**: 573001234567
- **Instagram**: https://www.instagram.com/alterego

**⚠️ IMPORTANTE**: Actualiza estos valores desde el panel de administración en la pestaña "Configuración".

## 📱 Flujo de Ventas

### Para Clientes:

1. Cliente navega la tienda
2. Agrega productos al carrito
3. Click en "Finalizar por WhatsApp" o "Finalizar por Instagram"
4. Se redirige a la red social con mensaje pre-llenado
5. Carrito se vacía automáticamente
6. Recibe modal de confirmación
7. Después de recibir el producto, se le solicita dejar reseña

### Para Admin:

1. Recibe notificación de nueva venta en el dashboard
2. Confirma la venta por la red social
3. Procesa el pedido
4. Entrega el producto
5. Cliente deja reseña
6. Admin aprueba reseña desde el dashboard

## 🔔 Sistema de Notificaciones

### Tipos de Notificaciones:

1. **Bajo Stock** (Automático)
   - Se activa cuando el stock de un producto es ≤ umbral configurado
   - Actualización en tiempo real

2. **Cambios de Configuración**
   - Se activa al guardar cambios en configuración de tienda
   - Incluye cambios en redes sociales, precios, etc.

3. **Nuevas Ventas**
   - Se activa cuando un cliente inicia checkout
   - Incluye detalles de la venta y canal (WhatsApp/Instagram)

### Panel de Notificaciones:

- Ubicado en el Dashboard del admin
- Actualización en tiempo real con Supabase Realtime
- Marcar como leídas individualmente o todas
- Eliminar notificaciones
- Contador de notificaciones no leídas

## 🎨 Componentes Nuevos

### Admin:
- `components/admin/notifications-panel.tsx` - Panel de notificaciones
- `components/admin/store-settings.tsx` - Configuración mejorada

### Cart:
- `components/cart/cart-drawer.tsx` - Carrito con flujo de ventas mejorado

## 🚀 Próximos Pasos

1. ✅ Ejecutar scripts SQL
2. ✅ Actualizar configuración de la tienda desde el admin
3. ✅ Configurar número de WhatsApp real
4. ✅ Configurar URLs de redes sociales
5. ✅ Probar flujo completo de venta
6. ✅ Verificar notificaciones en tiempo real

## 📝 Notas Importantes

- Las notificaciones se actualizan en tiempo real usando Supabase Realtime
- El carrito se vacía automáticamente después del checkout
- Las reseñas requieren aprobación del admin antes de mostrarse
- El sistema detecta automáticamente bajo stock y crea notificaciones
- Todas las ventas se registran en la base de datos para seguimiento

## 🐛 Troubleshooting

### Las notificaciones no aparecen:
- Verifica que los scripts SQL se ejecutaron correctamente
- Verifica la conexión a Supabase
- Revisa la consola del navegador para errores

### El carrito no se vacía:
- Verifica que la orden se creó en la base de datos
- Revisa los logs en la consola

### Las reseñas no se muestran:
- Verifica que estén aprobadas por el admin
- Revisa la tabla `reviews` en Supabase
