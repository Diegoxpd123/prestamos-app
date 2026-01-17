# Préstamos Rápido - Sistema de Préstamos

Sistema moderno de gestión de préstamos desarrollado con Angular 20, integrado con Google Sheets como backend.

## 🚀 Características

- ✅ **Landing Page** moderna y atractiva
- ✅ **Simulador de Préstamos** con gráficos interactivos
- ✅ **Sistema de Autenticación** (Login/Registro)
- ✅ **Dashboard de Cliente** con estadísticas y préstamos
- ✅ **Panel de Administración** para gestión de clientes
- ✅ **Integración con Google Sheets** como base de datos
- ✅ **Botón de WhatsApp** para contacto directo
- ✅ **Diseño Responsive** con Tailwind CSS
- ✅ **UI Moderna** con gradientes y animaciones

## 🛠️ Tecnologías

- **Angular** 20.1.0
- **TypeScript** 5.8.2
- **Tailwind CSS** 3.4.19
- **Angular Material** 20.2.14
- **Chart.js** & ng2-charts para gráficos
- **SweetAlert2** para alertas
- **Google Sheets API** para backend

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Google Cloud con Google Sheets API habilitada
- OAuth2 credentials para Google Sheets

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Diegoxpd123/prestamos-app.git
   cd prestamos-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Google Sheets**
   - Configura las credenciales OAuth2 en `src/app/core/services/google-sheets.service.ts`
   - Asegúrate de tener las hojas "Clientes" y "Administradores" configuradas

4. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```
   
   La aplicación estará disponible en `http://localhost:4200`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/prestamos-app/browser/`

## 📦 Estructura de Google Sheets

### Hoja "Clientes"
Las columnas deben ser:
- **A**: Fecha de Registro
- **B**: Email
- **C**: Nombre
- **D**: Apellido
- **E**: DNI
- **F**: Teléfono
- **G**: Estado
- **H**: Contraseña

### Hoja "Administradores"
Las columnas deben ser:
- **A**: Usuario
- **B**: Contraseña

Ver archivos `COLUMNAS_CLIENTES.md` y `COLUMNAS_ADMINISTRADORES.md` para más detalles.

## 🌐 Deploy en Vercel

1. **Instalar Vercel CLI** (opcional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   O conecta tu repositorio de GitHub directamente desde el dashboard de Vercel.

3. **Variables de Entorno** (si las necesitas)
   - Configúralas en el dashboard de Vercel
   - O usa `vercel env add` desde la CLI

## 📱 Rutas de la Aplicación

- `/` - Landing Page
- `/simulador` - Simulador de Préstamos
- `/login` - Login de Cliente
- `/register` - Registro de Cliente
- `/dashboard` - Dashboard de Cliente (protegido)
- `/admin/login` - Login de Administrador
- `/admin/dashboard` - Panel de Administración (protegido)

## 🔒 Seguridad

- Las contraseñas se almacenan en texto plano en Google Sheets (considerar encriptación en producción)
- Las rutas protegidas usan guards de Angular
- Las credenciales OAuth2 deben mantenerse seguras

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run watch` - Compila en modo watch
- `npm test` - Ejecuta los tests

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado.

## 👤 Autor

**Diego Pacheco Aliaga**
- Email: pachecoxpd@gmail.com
- GitHub: [@Diegoxpd123](https://github.com/Diegoxpd123)

## 🙏 Agradecimientos

- Angular Team
- Tailwind CSS
- Chart.js
- Google Sheets API
