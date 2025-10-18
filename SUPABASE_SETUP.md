# Configuración de Supabase para ALTEREGO

## Scripts SQL a Ejecutar

Para que todas las funcionalidades de la tienda funcionen correctamente, debes ejecutar los siguientes scripts SQL en Supabase en orden:

### 1. Configuración Inicial
\`\`\`bash
scripts/01-create-products-table.sql
scripts/02-add-store-settings-and-notifications.sql
scripts/03-create-orders-table.sql
scripts/04-create-reviews-table.sql
scripts/05-create-admins-table.sql
scripts/06-create-service-surveys-table.sql
\`\`\`

### 2. Políticas de Seguridad (RLS)
\`\`\`bash
scripts/13-add-rls-service-surveys.sql  # ⚠️ IMPORTANTE: Ejecutar este script
\`\`\`

## Cómo Ejecutar los Scripts

1. **Accede a tu proyecto de Supabase:**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto ALTEREGO

2. **Abre el SQL Editor:**
   - En el menú lateral, haz clic en "SQL Editor"
   - Haz clic en "New query"

3. **Copia y pega el contenido del script:**
   - Abre el archivo del script en tu editor de código
   - Copia todo el contenido
   - Pégalo en el SQL Editor de Supabase

4. **Ejecuta el script:**
   - Haz clic en el botón "Run" o presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)
   - Verifica que no haya errores en la consola

5. **Repite para cada script** en el orden indicado

## Verificación

Para verificar que las políticas RLS están configuradas correctamente:

1. Ve a "Table Editor" en Supabase
2. Selecciona la tabla `service_surveys`
3. Haz clic en el ícono de escudo (🛡️) para ver las políticas RLS
4. Deberías ver las siguientes políticas:
   - ✅ "Permitir INSERT público en service_surveys"
   - ✅ "Permitir SELECT a usuarios autenticados en service_surveys"
   - ✅ "Permitir UPDATE a usuarios autenticados en service_surveys"
   - ✅ "Permitir DELETE a usuarios autenticados en service_surveys"

## Solución de Problemas

### Error: "Error al enviar la encuesta"

**Causa:** Las políticas RLS no están configuradas correctamente.

**Solución:**
1. Ejecuta el script `scripts/13-add-rls-service-surveys.sql`
2. Verifica que las políticas estén activas en Supabase
3. Intenta enviar la encuesta nuevamente

### Error: "new row violates row-level security policy"

**Causa:** RLS está habilitado pero no hay políticas que permitan INSERT público.

**Solución:**
1. Ejecuta el script `scripts/13-add-rls-service-surveys.sql`
2. Esto creará las políticas necesarias para permitir INSERT público

## Contacto

Si tienes problemas con la configuración de Supabase, contacta al desarrollador o revisa la documentación oficial de Supabase sobre Row Level Security (RLS).
