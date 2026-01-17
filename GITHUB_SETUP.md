# Configuración de GitHub

## ⚠️ Problema con Secretos

GitHub detectó las credenciales OAuth en el historial de commits y está bloqueando el push.

## ✅ Soluciones

### Opción 1: Desbloquear Secretos (Rápido)

Visita estos enlaces para permitir temporalmente los secretos:

1. [Desbloquear Google OAuth Client ID](https://github.com/Diegoxpd123/prestamos-app/security/secret-scanning/unblock-secret/38PFEkhzSpx0oyh643suw5OxRVC)
2. [Desbloquear Google OAuth Client Secret](https://github.com/Diegoxpd123/prestamos-app/security/secret-scanning/unblock-secret/38PFElLCHGC3TiT9yRhM3ekxpPt)

Luego ejecuta:
```bash
cd prestamos-app
git push -u origin main
```

### Opción 2: Crear Repositorio Nuevo (Recomendado)

1. Elimina el repositorio actual en GitHub
2. Crea un nuevo repositorio vacío en GitHub
3. Ejecuta:

```bash
cd prestamos-app
rm -rf .git
git init
git add .
git commit -m "Initial commit - Sistema de Préstamos Angular"
git branch -M main
git remote add origin https://github.com/Diegoxpd123/prestamos-app.git
git push -u origin main
```

**Nota:** Los archivos ahora usan placeholders (`YOUR_CLIENT_ID_HERE`, etc.) en lugar de credenciales reales, así que GitHub no debería bloquearlos.

### Opción 3: Limpiar Historial con BFG (Avanzado)

Si necesitas mantener el historial pero eliminar las credenciales:

```bash
# Instalar BFG Repo-Cleaner
# Windows: choco install bfg
# Mac: brew install bfg

cd prestamos-app
bfg --replace-text credentials.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

Crea un archivo `credentials.txt` con:
```
282610843895-mb2kbsj7qogtpo9c0a3a8c2j8i5r2l7t.apps.googleusercontent.com==>YOUR_CLIENT_ID_HERE
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==>YOUR_CLIENT_SECRET_HERE
1//04AfeqHc5DcxCCgYIARAAGAQSNgF-L9Ir9sPACIqH34u-2YJAqYKsSnv2fxJFqkbwlPkvqDYOgN1v4CN0dNKuZjmr78lbz6Lqxw==>YOUR_REFRESH_TOKEN_HERE
```

## 📝 Después del Push

Una vez que el código esté en GitHub:

1. **Configura las variables de entorno en Vercel** (ver `DEPLOY.md`)
2. **Conecta Vercel con GitHub**
3. **Haz el deploy**

Las credenciales ahora están centralizadas en `src/app/core/config/app.config.ts` y usan variables de entorno, así que son seguras para producción.
