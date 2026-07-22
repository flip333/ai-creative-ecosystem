# Guía de Despliegue en Vercel - AI Creative Ecosystem

Sigue estos pasos para desplegar tu landing page de forma profesional y optimizada.

## 1. Nueva Arquitectura "Zero Config"
He optimizado la estructura del proyecto moviendo las carpetas `app`, `components` y `lib` a la raíz. Esto asegura que Vercel detecte el proyecto automáticamente sin configuraciones manuales.

## 2. Preparación del Repositorio
Asegúrate de que tu código esté en un repositorio de **GitHub**.

```bash
git init
git add .
git commit -m "feat: initial landing page implementation"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

## 2. Despliegue en Vercel
1. Ve a [Vercel](https://vercel.com) e inicia sesión.
2. Haz clic en **"Add New"** > **"Project"**.
3. Importa tu repositorio desde GitHub/GitLab.
4. En **Framework Preset**, Vercel detectará automáticamente **Next.js**.
5. **Configuración de Instalación**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Haz clic en **"Deploy"**.

## 3. Configuración de Dominio (Opcional)
Si tienes un dominio propio (ej. `miegosistema-ia.com`):
1. En el panel del proyecto en Vercel, ve a **Settings** > **Domains**.
2. Añade tu dominio.
3. Configura los registros DNS (CNAME/A) en tu proveedor de dominio siguiendo las instrucciones de Vercel.

## 4. Mejores Prácticas Post-Despliegue
- **Analitycs**: Activa **Vercel Analytics** en el panel para ver el rendimiento real del tráfico.
- **Speed Insights**: Revisa la pestaña de **Speed Insights** para asegurar que el LCP (Largest Contentful Paint) sea óptimo.
- **Preview Deployments**: Cada vez que hagas un `git push` a una rama distinta de `main`, Vercel creará una URL de previsualización para que pruebes los cambios antes de publicarlos.

## 5. Variables de entorno (obligatorio para el portal)

El portal (`/portal`) y el CRM (`/admin`) no funcionan sin estas tres variables.
En Vercel: **Settings** > **Environment Variables**, marcando las tres casillas
(Production, Preview, Development):

| Variable | Origen en Supabase |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings > API > `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings > API > `service_role` |

`SUPABASE_SERVICE_ROLE_KEY` salta Row Level Security por completo. Sólo se lee
desde el servidor (`lib/supabase/admin.ts`), únicamente para invitar clientes
vía la Admin API de Auth. **Nunca** le pongas el prefijo `NEXT_PUBLIC_`: eso la
enviaría al navegador y expondría la base de datos entera.

Desde la CLI:

```bash
vercel link
printf '%s' "<valor>" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

Tras cambiar variables hay que **redesplegar** — Vercel las inyecta en build.

### Proyecto de Supabase pausado

En el plan free, un proyecto sin actividad se pausa. Si lleva **más de 90 días**
pausado ya no se puede restaurar y hay que crear uno nuevo, ejecutar
`lib/schema.sql` y actualizar las variables de entorno.

## 6. Seguridad
- La landing ya incluye metadatos básicos y estructura semántica.
- Vercel proporciona **HTTPS automático** con certificados SSL gratis.
- Las rutas privadas están protegidas en tres capas: middleware, verificación de
  rol en los Server Components y Row Level Security en Postgres.
## 7. Solución de Problemas (Troubleshooting)

### Error: "No se encontró ningún directorio 'pages' ni 'app'"
Este error ocurre cuando Vercel no encuentra la carpeta de tu proyecto en la raíz del repositorio. 

**Cómo corregirlo:**
1. En el panel de tu proyecto en Vercel, ve a **Settings** > **General**.
2. Busca la opción **"Root Directory"**.
3. Haz clic en **"Edit"** y selecciona la carpeta donde subiste el código (probablemente `ai-creative-ecosystem`).
4. Si subiste el contenido de la carpeta directamente a GitHub (sin la carpeta padre), asegúrate de que el Root Directory esté vacío o sea `./`.
5. Haz clic en **Save** y vuelve a desplegar (**Deployments** > **Redeploy**).

### Error de Compilación (Module not found)
Si el error persiste, asegúrate de que el nombre de las carpetas coincida exactamente (Next.js es sensible a mayúsculas/minúsculas en Linux, que es donde corre Vercel). En este proyecto usamos la carpeta `app` en la raíz.
