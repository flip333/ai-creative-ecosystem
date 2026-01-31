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

## 5. Seguridad
- La landing ya incluye metadatos básicos y estructura semántica.
- Vercel proporciona **HTTPS automático** con certificados SSL gratis.
## 6. Solución de Problemas (Troubleshooting)

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
