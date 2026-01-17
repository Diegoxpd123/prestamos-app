/**
 * Configuración de la aplicación
 * Las credenciales deben configurarse como variables de entorno en producción
 */
export const AppConfig = {
  googleSheets: {
    clientId: (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_ID) || 
              '282610843895-mb2kbsj7qogtpo9c0a3a8c2j8i5r2l7t.apps.googleusercontent.com',
    clientSecret: (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_CLIENT_SECRET) || 
                  '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',
    refreshToken: (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_REFRESH_TOKEN) || 
                  '1//04AfeqHc5DcxCCgYIARAAGAQSNgF-L9Ir9sPACIqH34u-2YJAqYKsSnv2fxJFqkbwlPkvqDYOgN1v4CN0dNKuZjmr78lbz6Lqxw',
    sheetId: (typeof window !== 'undefined' && (window as any).__ENV__?.GOOGLE_SHEETS_SHEET_ID) || 
             '1G7UAwd7kwyZQWtHObVFMBNcjUIHl1bq5nh6WV0kIf2s'
  }
};
