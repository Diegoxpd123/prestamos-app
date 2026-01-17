/**
 * Configuración de la aplicación
 * Las credenciales pueden configurarse como variables de entorno en producción (Vercel).
 * En Vercel, las variables se inyectan durante el build.
 * Para desarrollo local, usa los valores por defecto o crea un archivo .env
 */
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

// Función helper para obtener variables de entorno de forma segura
function getEnv(key: string, defaultValue: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  if (typeof window !== 'undefined' && (window as any).__ENV__?.[key]) {
    return (window as any).__ENV__[key];
  }
  return defaultValue;
}

export const AppConfig = {
  googleSheets: {
    clientId: getEnv('GOOGLE_SHEETS_CLIENT_ID', '282610843895-mb2kbsj7qogtpo9c0a3a8c2j8i5r2l7t.apps.googleusercontent.com'),
    clientSecret: getEnv('GOOGLE_SHEETS_CLIENT_SECRET', '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'),
    refreshToken: getEnv('GOOGLE_SHEETS_REFRESH_TOKEN', '1//04AfeqHc5DcxCCgYIARAAGAQSNgF-L9Ir9sPACIqH34u-2YJAqYKsSnv2fxJFqkbwlPkvqDYOgN1v4CN0dNKuZjmr78lbz6Lqxw'),
    sheetId: getEnv('GOOGLE_SHEETS_SHEET_ID', '1G7UAwd7kwyZQWtHObVFMBNcjUIHl1bq5nh6WV0kIf2s')
  }
};
