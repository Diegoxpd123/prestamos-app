import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly SHEET_ID = '1G7UAwd7kwyZQWtHObVFMBNcjUIHl1bq5nh6WV0kIf2s';
  
  // Credenciales OAuth2
  private readonly OAUTH_CONFIG = {
    client_id: '282610843895-mb2kbsj7qogtpo9c0a3a8c2j8i5r2l7t.apps.googleusercontent.com',
    client_secret: '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',
    refresh_token: '1//04AfeqHc5DcxCCgYIARAAGAQSNgF-L9Ir9sPACIqH34u-2YJAqYKsSnv2fxJFqkbwlPkvqDYOgN1v4CN0dNKuZjmr78lbz6Lqxw'
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
   * Obtiene todos los clientes de la hoja "Clientes"
   */
  async getAllClients(): Promise<any[]> {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de acceso');
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Clientes!A:G`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener clientes: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];

      // Convertir filas a objetos (ignorar header)
      const clients = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 7) {
          clients.push({
            fechaRegistro: row[0] || '',
            email: row[1] || '',
            nombre: row[2] || '',
            apellido: row[3] || '',
            dni: row[4] || '',
            telefono: row[5] || '',
            estado: row[6] || 'Activo'
          });
        }
      }

      return clients;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas generales
   */
  async getStatistics(): Promise<any> {
    try {
      const clients = await this.getAllClients();
      
      return {
        totalClientes: clients.length,
        clientesActivos: clients.filter(c => c.estado === 'Activo').length,
        clientesInactivos: clients.filter(c => c.estado === 'Inactivo').length,
        clientesNuevosHoy: clients.filter(c => {
          const fecha = new Date(c.fechaRegistro);
          const hoy = new Date();
          return fecha.toDateString() === hoy.toDateString();
        }).length
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalClientes: 0,
        clientesActivos: 0,
        clientesInactivos: 0,
        clientesNuevosHoy: 0
      };
    }
  }
}
