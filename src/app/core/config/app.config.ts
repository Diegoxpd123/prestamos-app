/**
 * Configuración de la aplicación
 * IMPORTANTE: Para producción, configura estas variables de entorno en Vercel:
 * - GOOGLE_SHEETS_CLIENT_ID
 * - GOOGLE_SHEETS_CLIENT_SECRET
 * - GOOGLE_SHEETS_REFRESH_TOKEN
 * - GOOGLE_SHEETS_SHEET_ID
 * 
 * Para desarrollo local, crea un archivo .env con estas variables o usa los valores por defecto
 */
export const AppConfig = {
  googleSheets: {
    // Leer desde variables de entorno en tiempo de build (Vercel)
    clientId: process.env['GOOGLE_SHEETS_CLIENT_ID'] || 
              (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_ID) || 
              'YOUR_CLIENT_ID_HERE',
    clientSecret: process.env['GOOGLE_SHEETS_CLIENT_SECRET'] || 
                  (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_SECRET) || 
                  'YOUR_CLIENT_SECRET_HERE',
    refreshToken: process.env['GOOGLE_SHEETS_REFRESH_TOKEN'] || 
                  (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_REFRESH_TOKEN) || 
                  'YOUR_REFRESH_TOKEN_HERE',
    sheetId: process.env['GOOGLE_SHEETS_SHEET_ID'] || 
             (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_SHEET_ID) || 
             'YOUR_SHEET_ID_HERE'
  }
};
