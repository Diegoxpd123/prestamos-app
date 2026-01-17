import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { delay, tap, switchMap, map, catchError } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { GoogleSheetsService } from './google-sheets.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signals para reactive state
  private user = signal<User | null>(null);
  public isAuthenticated = computed(() => this.user() !== null);

  constructor(
    private router: Router,
    private googleSheetsService: GoogleSheetsService
  ) {
    // Cargar usuario desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      const user = JSON.parse(userStr);
      this.user.set(user);
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Validar credenciales contra Google Sheets
    return from(this.googleSheetsService.validateClientCredentials(credentials.email, credentials.password)).pipe(
      map((clientData) => {
        if (!clientData) {
          throw new Error('Credenciales inválidas');
        }
        
        // Si la contraseña se valida (por ahora solo validamos que el email exista)
        // En producción, deberías tener un campo de contraseña en la hoja
        const user: User = {
          id: clientData.id,
          email: clientData.email,
          nombre: clientData.nombre,
          apellido: clientData.apellido,
          dni: clientData.dni,
          telefono: clientData.telefono,
          fechaRegistro: clientData.fechaRegistro
        };

        const response: AuthResponse = {
          user,
          token: 'jwt-token-' + Date.now()
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.user.set(response.user);
        this.currentUserSubject.next(response.user);

        return response;
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    // Guardar contraseña en el registro para luego guardarla en Sheets
    return of({
      user: {
        id: Date.now().toString(),
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        telefono: data.telefono,
        fechaRegistro: new Date()
      },
      token: 'jwt-token-' + Date.now(),
      password: data.password // Guardar temporalmente para agregar a Sheets
    }).pipe(
      delay(1500),
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.user.set(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.user.set(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.user();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
