import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly SHEET_ID = AppConfig.googleSheets.sheetId;
  private readonly SHEET_NAME = 'Clientes';
  
  // Credenciales OAuth2 desde configuración
  private readonly OAUTH_CONFIG = {
    client_id: AppConfig.googleSheets.clientId,
    client_secret: AppConfig.googleSheets.clientSecret,
    refresh_token: AppConfig.googleSheets.refreshToken
  };

  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un token de acceso usando el refresh token
   */
  private async getAccessToken(): Promise<string | null> {
    // Si tenemos un token válido, usarlo
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', this.OAUTH_CONFIG.client_id);
      formData.append('client_secret', this.OAUTH_CONFIG.client_secret);
      formData.append('refresh_token', this.OAUTH_CONFIG.refresh_token);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`Error al obtener token: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // El token expira en expires_in segundos (típicamente 3600)
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Restar 1 minuto de margen

      return this.accessToken;
    } catch (error) {
      console.error('Error al obtener token de acceso:', error);
      return null;
    }
  }

  /**
   * Agrega un nuevo cliente a la hoja de Google Sheets (sin contraseña)
   */
  async addClient(clientData: {
    email: string;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
  }): Promise<{ success: boolean; error?: string }> {
    return this.addClientWithPassword({
      ...clientData,
      password: ''
    });
  }

  /**
   * Agrega un nuevo cliente a la hoja de Google Sheets con contraseña
   */
  async addClientWithPassword(clientData: {
    email: string;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de acceso');
      }

      // Preparar los valores en el orden de las columnas
      // Orden: Fecha, Email, Nombre, Apellido, DNI, Teléfono, Estado, Contraseña
      const values = [
        new Date().toISOString(), // Fecha de Registro (A)
        clientData.email, // (B)
        clientData.nombre, // (C)
        clientData.apellido, // (D)
        clientData.dni, // (E)
        clientData.telefono, // (F)
        'Activo', // Estado por defecto (G)
        clientData.password || '' // Contraseña (H)
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${encodeURIComponent(this.SHEET_NAME)}!A:Z:append?valueInputOption=RAW`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [values]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al agregar cliente: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      return { success: true };
    } catch (error: any) {
      console.error('Error al agregar cliente a la hoja:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verifica si un email ya existe en la hoja
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return false;
      }

      // Obtener todos los datos de la hoja
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${encodeURIComponent(this.SHEET_NAME)}!B:B`; // Columna B = Email

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const emails = data.values?.flat() || [];
      
      // Verificar si el email existe (ignorar el header)
      return emails.slice(1).some((e: string) => e.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  }

  /**
   * Valida credenciales de login y obtiene los datos del cliente
   * Columnas esperadas: A=Fecha, B=Email, C=Nombre, D=Apellido, E=DNI, F=Teléfono, G=Estado, H=Contraseña
   */
  async validateClientCredentials(email: string, password: string): Promise<any | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        return null;
      }

      // Obtener todos los datos de la hoja Clientes
      // Si hay columna H (Contraseña), validarla; si no, solo validar email
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${encodeURIComponent(this.SHEET_NAME)}!A:H`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const rows = data.values || [];

      // Buscar el email en la columna B (índice 1)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 7) {
          const sheetEmail = row[1]?.trim().toLowerCase();
          if (sheetEmail === email.toLowerCase()) {
            // Si existe columna de contraseña (columna H, índice 7), validarla
            if (row.length >= 8 && row[7]) {
              const sheetPassword = row[7]?.trim();
              if (sheetPassword !== password) {
                // Contraseña incorrecta
                return null;
              }
            }
            // Si no hay columna de contraseña o la contraseña coincide, retornar datos
            return {
              id: i.toString(),
              email: row[1] || '',
              nombre: row[2] || '',
              apellido: row[3] || '',
              dni: row[4] || '',
              telefono: row[5] || '',
              estado: row[6] || 'Activo',
              fechaRegistro: row[0] ? new Date(row[0]) : new Date()
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      return null;
    }
  }
}
