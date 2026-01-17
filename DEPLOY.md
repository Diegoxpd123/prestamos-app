# Guía de Deploy en Vercel

## Configuración de Variables de Entorno

Para que la aplicación funcione correctamente en producción, debes configurar las siguientes variables de entorno en Vercel:

### Variables Requeridas

1. **GOOGLE_SHEETS_CLIENT_ID**
   - Tu Google OAuth Client ID
   - Ejemplo: `282610843895-xxxxxxxxx.apps.googleusercontent.com`

2. **GOOGLE_SHEETS_CLIENT_SECRET**
   - Tu Google OAuth Client Secret
   - Ejemplo: `GOCSPX-xxxxxxxxxxxxxx`

3. **GOOGLE_SHEETS_REFRESH_TOKEN**
   - Tu Google OAuth Refresh Token
   - Ejemplo: `1//0xxxxxxxxxxxxx`

4. **GOOGLE_SHEETS_SHEET_ID**
   - ID de tu Google Sheet
   - Ejemplo: `1G7UAwd7kwyZQWtHObVFMBNcjUIHl1bq5nh6WV0kIf2s`

### Cómo Configurar en Vercel

1. **Desde el Dashboard de Vercel:**
   - Ve a tu proyecto en Vercel
   - Click en **Settings**
   - Click en **Environment Variables**
   - Agrega cada variable una por una

2. **Desde la CLI de Vercel:**
   ```bash
   vercel env add GOOGLE_SHEETS_CLIENT_ID
   vercel env add GOOGLE_SHEETS_CLIENT_SECRET
   vercel env add GOOGLE_SHEETS_REFRESH_TOKEN
   vercel env add GOOGLE_SHEETS_SHEET_ID
   ```

### Para Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto con:

```
GOOGLE_SHEETS_CLIENT_ID=tu-client-id-aqui
GOOGLE_SHEETS_CLIENT_SECRET=tu-client-secret-aqui
GOOGLE_SHEETS_REFRESH_TOKEN=tu-refresh-token-aqui
GOOGLE_SHEETS_SHEET_ID=tu-sheet-id-aqui
```

**Nota:** El archivo `.env` ya está en `.gitignore` y no se subirá al repositorio.

## Configuración del Build

El proyecto ya está configurado para Vercel con:

- **Framework:** Angular
- **Build Command:** `npm run build`
- **Output Directory:** `dist/prestamos-app/browser`
- **Node Version:** 18.x o superior

## Deploy

### Primera vez

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno
3. Vercel detectará automáticamente la configuración de Angular

### Deploys posteriores

Cada push a `main` desplegará automáticamente la nueva versión.

## Verificación

Después del deploy, verifica que:

1. La aplicación carga correctamente
2. El login funciona
3. Los datos se guardan en Google Sheets
4. El panel de administración funciona

Si hay errores, revisa los logs en el dashboard de Vercel.
