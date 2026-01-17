/**
 * Configuración de la aplicación
 * Las credenciales pueden configurarse como variables de entorno en producción (Vercel),
 * pero también funcionan directamente aquí para desarrollo.
 */
export const AppConfig = {
  googleSheets: {
    clientId: process.env['GOOGLE_SHEETS_CLIENT_ID'] || 
              (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_ID) || 
              '282610843895-mb2kbsj7qogtpo9c0a3a8c2j8i5r2l7t.apps.googleusercontent.com',
    clientSecret: process.env['GOOGLE_SHEETS_CLIENT_SECRET'] || 
                  (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_SECRET) || 
                  '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',
    refreshToken: process.env['GOOGLE_SHEETS_REFRESH_TOKEN'] || 
                  (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_REFRESH_TOKEN) || 
                  '1//04AfeqHc5DcxCCgYIARAAGAQSNgF-L9Ir9sPACIqH34u-2YJAqYKsSnv2fxJFqkbwlPkvqDYOgN1v4CN0dNKuZjmr78lbz6Lqxw',
    sheetId: process.env['GOOGLE_SHEETS_SHEET_ID'] || 
             (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_SHEET_ID) || 
             '1G7UAwd7kwyZQWtHObVFMBNcjUIHl1bq5nh6WV0kIf2s'
  }
};
