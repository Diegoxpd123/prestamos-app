import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly SHEET_ID = AppConfig.googleSheets.sheetId;
  private readonly SHEET_NAME = 'Administradores';
  
  // Credenciales OAuth2 desde configuración
  private readonly OAUTH_CONFIG = {
    client_id: AppConfig.googleSheets.clientId,
    client_secret: AppConfig.googleSheets.clientSecret,
    refresh_token: AppConfig.googleSheets.refreshToken
  };

  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  /**
   * Obtiene un token de acceso usando el refresh token
   */
  private async getAccessToken(): Promise<string | null> {
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
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;

      return this.accessToken;
    } catch (error) {
      console.error('Error al obtener token de acceso:', error);
      return null;
    }
  }

  /**
   * Verifica las credenciales del administrador
   */
  async validateAdminCredentials(username: string, password: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de acceso');
      }

      // Obtener datos de la hoja Administradores
      // Columnas: A = Usuario, B = Contraseña
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${encodeURIComponent(this.SHEET_NAME)}!A:B`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];

      // Buscar las credenciales (ignorar el header si existe)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 2) {
          const sheetUsername = row[0]?.trim().toLowerCase();
          const sheetPassword = row[1]?.trim();
          
          if (sheetUsername === username.toLowerCase() && sheetPassword === password) {
            // Guardar sesión de admin
            localStorage.setItem('adminUser', JSON.stringify({
              username: row[0],
              loginTime: new Date().toISOString()
            }));
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      return false;
    }
  }

  /**
   * Verifica si hay una sesión de admin activa
   */
  isAdminLoggedIn(): boolean {
    return localStorage.getItem('adminUser') !== null;
  }

  /**
   * Cierra sesión de admin
   */
  logout(): void {
    localStorage.removeItem('adminUser');
  }

  /**
   * Obtiene el usuario admin actual
   */
  getCurrentAdmin(): any {
    const adminStr = localStorage.getItem('adminUser');
    return adminStr ? JSON.parse(adminStr) : null;
  }
}
